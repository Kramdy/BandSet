import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { api } from './api';

export async function registerPushToken(){
  // Expo Go (SDK 53+) не содержит нативный модуль удалённых push-уведомлений.
  // В development/production build модуль загрузится и push включится автоматически.
  if(Constants.executionEnvironment==='storeClient'||!Device.isDevice)return;
  const Notifications=await import('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification:async()=>({shouldShowAlert:true,shouldShowBanner:true,shouldShowList:true,shouldPlaySound:true,shouldSetBadge:false})
  });
  const current=await Notifications.getPermissionsAsync();
  const permission=current.granted?current:await Notifications.requestPermissionsAsync();
  if(!permission.granted)return;
  const token=(await Notifications.getExpoPushTokenAsync()).data;
  await api.registerPushToken(token);
}
