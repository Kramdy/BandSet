import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BackHandler } from 'react-native';
import { AppProvider, useApp } from '../store/app-store';
import { LanguageProvider } from '../services/language';
import { registerPushToken } from '../services/push';

function Navigator(){
  const {user,isSessionReady}=useApp(); const router=useRouter(); const segments=useSegments();
  useEffect(()=>{if(!isSessionReady)return;const inAuth=segments[0]==='auth';if(!user&&!inAuth)router.replace('/auth');if(user&&inAuth)router.replace('/')},[isSessionReady,user,segments]);
  useEffect(()=>{if(user)void registerPushToken().catch(()=>undefined)},[user]);
  useEffect(()=>{const subscription=BackHandler.addEventListener('hardwareBackPress',()=>{if(router.canGoBack())return false;router.replace('/');return true});return()=>subscription.remove()},[router]);
  return <><StatusBar style="light"/><Stack screenOptions={{headerShown:false}}><Stack.Screen name="chat/[id]" options={{presentation:'modal',animation:'slide_from_bottom'}}/></Stack></>;
}
export default function Layout(){return <LanguageProvider><AppProvider><Navigator/></AppProvider></LanguageProvider>}
