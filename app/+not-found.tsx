import { Redirect } from 'expo-router';

/** Expo Go иногда открывает служебный путь /--/ после обновления bundle. */
export default function NotFound(){
  return <Redirect href="/"/>;
}
