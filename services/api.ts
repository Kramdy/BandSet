export type ApiUser = { id:number; name:string; email:string; instrument:string; role:'Leader'|'Musician' };
export type AuthResponse = { accessToken:string; user:ApiUser };
export type ApiConcert = { id:number; title:string; date:string; votingDeadline:string|null; venue:string; description:string; status:'Draft'|'Voting'|'Approved'|'Archived'; isFinalized:boolean };
export type ApiPlaylist = { id:number; concertId:number; name:string; createdAt:string };
export type CreateConcertInput = { title:string; date:string; votingDeadline:string|null; venue:string; description:string; skipDefaultPlaylist?:boolean };
export type ApiTrack = { id:number; title:string; artist:string; position:number; setNumber:number; status:'Voting'|'Approved'|'Rejected'|'Pending'; duration:string; key:string; dropboxFileId:string|null; myVote:'yes'|'no'|'abstain'|null; votes:{yes:number;no:number;abstain:number} };
export type ApiComment = { id:number; author:string; text:string; createdAt:string };
export type CreateTrackInput = { title:string; artist:string; duration:string; key:string; setNumber:number; playlistId:number; dropboxFileId?:string };
export type DropboxStatus = { configured:boolean; appKey:string; redirectUri:string };
export type ApiBandMember = { id:number; name:string; instrument:string; role:'Leader'|'Musician' };
export type ApiNotification = { id:number; title:string; text:string; isRead:boolean; createdAt:string; trackId:number|null; concertId:number|null };
export type ApiActivity = { id:number; actor:string; text:string; createdAt:string };
const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:5094';
let accessToken: string | null = null;

export function setAccessToken(token:string | null) { accessToken = token; }
async function request<T>(path:string, init:RequestInit = {}):Promise<T> {
  // После Fast Refresh токен в модуле может сброситься, хотя сессия всё ещё сохранена.
  const token = accessToken ?? await SecureStore.getItemAsync('bandset.token');
  if (token) accessToken = token;
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers:{ 'Content-Type':'application/json', ...(token ? {Authorization:`Bearer ${token}`} : {}), ...init.headers } });
  if (!response.ok) { let message = response.status === 401 ? (path === '/api/auth/login' ? 'Неверный e-mail или пароль' : 'Сессия истекла. Войдите в аккаунт снова.') : `Ошибка сервера (${response.status})`; try { const body=await response.json() as {message?:string;title?:string}; message=body.message??body.title??message; } catch { /* Сервер мог вернуть ответ без JSON. */ } throw new Error(message); }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
export const api = {
  login: (email:string,password:string) => request<AuthResponse>('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})}),
  register: (nickname:string,email:string,password:string,instrument:string,role:'Leader'|'Musician') => request<ApiUser>('/api/auth/register',{method:'POST',body:JSON.stringify({nickname,email,password,instrument,role})}),
  concerts: () => request<ApiConcert[]>('/api/concerts'),
  createConcert: (input:CreateConcertInput) => request<ApiConcert>('/api/concerts',{method:'POST',body:JSON.stringify(input)}),
  setConcertStatus: (concertId:number,status:'Draft'|'Voting'|'Archived') => request<void>(`/api/concerts/${concertId}/status`,{method:'PATCH',body:JSON.stringify({status})}),
  playlists: (concertId:number) => request<ApiPlaylist[]>(`/api/concerts/${concertId}/playlists`),
  createPlaylist: (concertId:number,name:string) => request<ApiPlaylist>(`/api/concerts/${concertId}/playlists`,{method:'POST',body:JSON.stringify({name})}),
  tracks: (concertId:number,playlistId?:number) => request<ApiTrack[]>(`/api/concerts/${concertId}/tracks${playlistId?`?playlistId=${playlistId}`:''}`),
  vote: (trackId:string,value:'yes'|'no'|'abstain') => request<void>(`/api/tracks/${trackId}/vote`,{method:'POST',body:JSON.stringify({value})}),
  comment: (trackId:string,text:string) => request<ApiComment>(`/api/tracks/${trackId}/comments`,{method:'POST',body:JSON.stringify({text})})
  ,updateComment: (commentId:string,text:string) => request<void>(`/api/comments/${commentId}`,{method:'PATCH',body:JSON.stringify({text})})
  ,deleteComment: (commentId:string) => request<void>(`/api/comments/${commentId}`,{method:'DELETE'})
  ,setTrackStatus: (trackId:string,status:string) => request<void>(`/api/tracks/${trackId}/status`,{method:'PATCH',body:JSON.stringify({status})})
  ,setTrackOrder: (concertId:number,trackIds:number[]) => request<void>(`/api/concerts/${concertId}/track-order`,{method:'PUT',body:JSON.stringify({trackIds})})
  ,finalizeConcert: (concertId:number) => request<void>(`/api/concerts/${concertId}/finalize`,{method:'PATCH'})
  ,comments: (trackId:string) => request<ApiComment[]>(`/api/tracks/${trackId}/comments`)
  ,createTrack: (concertId:number,input:CreateTrackInput) => request<ApiTrack>(`/api/concerts/${concertId}/tracks`,{method:'POST',body:JSON.stringify(input)})
  ,deleteTrack: (trackId:string) => request<void>(`/api/tracks/${trackId}`,{method:'DELETE'})
  ,dropboxStatus: async () => { try { return await request<DropboxStatus>('/api/dropbox/status'); } catch { const appKey=process.env.EXPO_PUBLIC_DROPBOX_APP_KEY ?? ''; return {configured:!!appKey,appKey,redirectUri:'bandset://dropbox-auth'}; } }
  ,bandMembers: () => request<ApiBandMember[]>('/api/band/members')
  ,notifications: () => request<ApiNotification[]>('/api/notifications')
  ,markNotificationRead: (id:number) => request<void>(`/api/notifications/${id}/read`,{method:'PATCH'})
  ,markAllNotificationsRead: () => request<void>('/api/notifications/read-all',{method:'PATCH'})
  ,registerPushToken: (token:string) => request<void>('/api/notifications/push-token',{method:'POST',body:JSON.stringify({token})})
  ,activity: () => request<ApiActivity[]>('/api/activity')
};
import * as SecureStore from 'expo-secure-store';
