import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = 'bandset.dropbox.token';
const AUTH_URL = 'https://www.dropbox.com/oauth2/authorize';
const TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';
const API_URL = 'https://api.dropboxapi.com/2/files';
const AUDIO_EXTENSIONS = new Set(['mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg', 'opus']);

type StoredToken = { accessToken:string; refreshToken?:string; expiresAt?:number };
export type DropboxEntry = { id:string; name:string; path:string; isFolder:boolean; size?:number };

function extension(name:string) { return name.split('.').pop()?.toLowerCase() ?? ''; }
function isExpired(token:StoredToken) { return !!token.expiresAt && token.expiresAt <= Date.now() + 60_000; }

async function readToken():Promise<StoredToken|null> {
  const raw=await SecureStore.getItemAsync(TOKEN_KEY);
  return raw ? JSON.parse(raw) as StoredToken : null;
}
async function saveToken(token:StoredToken) { await SecureStore.setItemAsync(TOKEN_KEY,JSON.stringify(token)); }

async function refreshToken(token:StoredToken, appKey:string) {
  if (!token.refreshToken) throw new Error('Підключення Dropbox завершилося. Підключіть акаунт ще раз.');
  const body=new URLSearchParams({grant_type:'refresh_token',refresh_token:token.refreshToken,client_id:appKey});
  const response=await fetch(TOKEN_URL,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body.toString()});
  if(!response.ok) throw new Error('Не вдалося оновити доступ до Dropbox.');
  const data=await response.json() as {access_token:string;expires_in?:number};
  const updated={...token,accessToken:data.access_token,expiresAt:data.expires_in?Date.now()+data.expires_in*1000:undefined};
  await saveToken(updated); return updated;
}

async function accessToken(appKey:string) {
  let token=await readToken();
  if(!token) throw new Error('Спершу підключіть Dropbox.');
  if(isExpired(token)) token=await refreshToken(token,appKey);
  return token.accessToken;
}

async function dropboxFetch<T>(appKey:string, endpoint:string, body:unknown):Promise<T> {
  const token=await accessToken(appKey);
  const response=await fetch(`${API_URL}/${endpoint}`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!response.ok) { const detail=await response.text(); throw new Error(detail.includes('path/not_found')?'Папку не знайдено.': 'Dropbox не зміг виконати запит.'); }
  return response.json() as Promise<T>;
}

export async function isDropboxConnected() { return (await readToken()) !== null; }
export async function disconnectDropbox() { await SecureStore.deleteItemAsync(TOKEN_KEY); }

export async function connectDropbox(appKey:string, redirectUri:string) {
  const request=new AuthSession.AuthRequest({clientId:appKey,redirectUri,responseType:AuthSession.ResponseType.Code,usePKCE:true,scopes:['files.content.read'],extraParams:{token_access_type:'offline'}});
  await request.makeAuthUrlAsync({authorizationEndpoint:AUTH_URL});
  const result=await request.promptAsync({authorizationEndpoint:AUTH_URL});
  if(result.type==='cancel' || result.type==='dismiss') return false;
  if(result.type!=='success') throw new Error('Dropbox не підтвердив авторизацію.');
  const code=result.params.code;
  if(!code) throw new Error(result.params.error_description ?? 'Dropbox не повернув код авторизації.');
  const body=new URLSearchParams({grant_type:'authorization_code',code,redirect_uri:redirectUri,client_id:appKey,code_verifier:request.codeVerifier ?? ''});
  const response=await fetch(TOKEN_URL,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:body.toString()});
  if(!response.ok) throw new Error('Не вдалося завершити підключення Dropbox.');
  const data=await response.json() as {access_token:string;refresh_token?:string;expires_in?:number};
  await saveToken({accessToken:data.access_token,refreshToken:data.refresh_token,expiresAt:data.expires_in?Date.now()+data.expires_in*1000:undefined});
  return true;
}

export async function listDropboxFiles(appKey:string,path=''):Promise<DropboxEntry[]> {
  const data=await dropboxFetch<{entries:Array<{'.tag':'file'|'folder';id:string;name:string;path_lower:string;size?:number}>}>(appKey,'list_folder',{path,recursive:false,include_deleted:false});
  return data.entries.filter(item=>item['.tag']==='folder'||AUDIO_EXTENSIONS.has(extension(item.name))).map(item=>({id:item.id,name:item.name,path:item.path_lower,isFolder:item['.tag']==='folder',size:item.size})).sort((a,b)=>Number(b.isFolder)-Number(a.isFolder)||a.name.localeCompare(b.name));
}
