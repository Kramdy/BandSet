import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { C, Pill, Screen, s } from '../components/ui';
import { useLanguage } from '../services/language';
import { useApp } from '../store/app-store';

const menu = [['calendar-outline', 'concerts', '/concerts'], ['thumbs-up-outline', 'votes', '/playlist'], ['people-outline', 'band', '/band'], ['person-outline', 'profile', '/profile']] as const;

export default function Home() {
  const r = useRouter();
  const { tracks, finalized, user, isLeader } = useApp();
  const { t } = useLanguage();
  const voting = tracks.filter(track => track.status === 'Voting').length;
  const name = user?.name?.split(' ')[0] ?? 'Марія';
  return <Screen withSidebar><ScrollView contentContainerStyle={x.pad}>
    <View style={x.top}><View><Text style={x.hello}>{t('greeting')}, {name}</Text><Text style={x.caption}>BLUE ECHO · {isLeader ? t('leader') : t('musician')}</Text></View><View style={x.avatar}><Text style={x.avatarText}>{name[0]?.toUpperCase()}</Text></View></View>
    <Text style={x.section}>{t('nextConcert')}</Text>
    <Pressable style={[s.card, x.hero]} onPress={() => r.push('/playlist')}><View style={x.date}><Text style={x.day}>12</Text><Text style={x.mon}>{t('september')}</Text></View><View style={x.flex}><Text style={x.concert}>{t('concertTitle')}</Text><Text style={x.place}>19:00 · Art Hall, {t('venue')}</Text><View style={x.pill}><Pill text={finalized ? t('playlistApproved') : t('votingOpen')} color={finalized ? C.green : C.accent} /></View></View><Ionicons name="chevron-forward" size={20} color={C.muted}/></Pressable>
    <View style={x.menuHead}><Text style={x.section}>{t('attention')}</Text><Text style={x.link}>{voting} {t('tracks')}</Text></View>
    <Pressable onPress={() => r.push('/playlist')} style={[s.card, x.attention]}><Ionicons name="musical-notes" size={24} color={C.accent}/><View style={x.flex}><Text style={x.rowtitle}>{t('votingPlaylist')}</Text><Text style={x.small}>{t('remainingVotes')}</Text></View><Ionicons name="arrow-forward" size={20} color={C.muted}/></Pressable>
    <Text style={x.section}>{t('menu')}</Text>
    <View style={x.grid}>{menu.map(([icon, title, path]) => <Pressable key={title} onPress={() => r.push(path as any)} style={[s.card, x.tile]}><Ionicons name={icon as any} size={22} color={C.blue}/><Text style={x.tileText}>{t(title)}</Text></Pressable>)}</View>
  </ScrollView></Screen>;
}

const x = StyleSheet.create({
  pad:{padding:22,paddingTop:62,paddingBottom:92,gap:16}, top:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:9}, hello:{color:C.text,fontSize:25,fontWeight:'800'}, caption:{color:C.muted,fontSize:11,marginTop:5,letterSpacing:1}, avatar:{width:42,height:42,borderRadius:21,backgroundColor:C.accent,alignItems:'center',justifyContent:'center'}, avatarText:{color:C.bg,fontWeight:'800'}, section:{color:C.text,fontSize:17,fontWeight:'800',marginTop:9}, hero:{padding:16,flexDirection:'row',alignItems:'center',gap:14}, date:{width:48,height:58,backgroundColor:'#283342',borderRadius:12,alignItems:'center',justifyContent:'center'}, day:{color:C.text,fontSize:24,fontWeight:'800'}, mon:{color:C.accent,fontWeight:'800',fontSize:10}, flex:{flex:1}, concert:{color:C.text,fontSize:17,fontWeight:'800'}, place:{color:C.muted,fontSize:13,marginTop:4}, pill:{marginTop:12}, menuHead:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'}, link:{color:C.accent,fontSize:13,fontWeight:'700'}, attention:{padding:15,flexDirection:'row',alignItems:'center',gap:12}, rowtitle:{color:C.text,fontWeight:'700',fontSize:15}, small:{color:C.muted,fontSize:12,marginTop:4}, grid:{flexDirection:'row',flexWrap:'wrap',gap:10}, tile:{width:'48%',height:100,padding:14,justifyContent:'space-between'}, tileText:{color:C.text,fontWeight:'700'}
});
