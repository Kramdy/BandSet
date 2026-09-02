import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useState } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage, Key } from '../services/language';

export const C = { bg:'#101419', card:'#1A2027', line:'#2A333E', text:'#F4F7FA', muted:'#98A4B3', accent:'#F6B73C', green:'#4DD39B', red:'#FA7272', blue:'#73A7FF' };

const navigation:[keyof typeof Ionicons.glyphMap,Key,string][] = [
  ['home-outline','home','/'], ['calendar-outline','concerts','/concerts'], ['musical-notes-outline','playlist','/playlist'],
  ['people-outline','band','/band'], ['notifications-outline','notifications','/notifications'], ['person-outline','profile','/profile'],
];

export function Screen({ children, withSidebar = false }:{children:ReactNode;withSidebar?:boolean}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const go = (path:string) => { setOpen(false); router.replace(path as any); };
  return <View style={s.screen}>{children}{pathname==='/'?<Pressable accessibilityLabel={t('language')} onPress={() => setLocale(locale === 'uk' ? 'en' : 'uk')} style={s.languageButton}><Text style={s.languageText}>{locale.toUpperCase()}</Text></Pressable>:null}{withSidebar ? <>
    <Pressable accessibilityLabel="Відкрити меню" onPress={() => setOpen(true)} style={s.menuButton}><Ionicons name="menu" size={24} color={C.text}/></Pressable>
    <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}><View style={s.menuOverlay}>
      <View style={s.sidebar}><View style={s.sidebarBrand}><View style={s.brandMark}><Ionicons name="musical-notes" size={20} color={C.bg}/></View><Text style={s.brandText}>BandSet</Text><Pressable onPress={() => setOpen(false)} hitSlop={10}><Ionicons name="close" size={22} color={C.muted}/></Pressable></View>
      <View style={s.nav}>{navigation.map(([icon,label,path]) => { const active = pathname === path; return <Pressable key={path} accessibilityLabel={t(label)} onPress={() => go(path)} style={[s.navItem,active && s.navItemActive]}><Ionicons name={icon} size={24} color={active ? C.bg : C.muted}/><Text style={[s.navLabel,active && s.navLabelActive]}>{t(label)}</Text></Pressable>; })}</View></View>
      <Pressable style={s.menuShade} onPress={() => setOpen(false)}/>
    </View></Modal>
  </> : null}</View>;
}

export function Pill({text,color=C.accent}:{text:string;color?:string}) { return <View style={[s.pill,{backgroundColor:color+'22'}]}><Text style={[s.pillText,{color}]}>{text}</Text></View>; }
export function IconButton({name,onPress,color=C.text}:{name:keyof typeof Ionicons.glyphMap;onPress?:()=>void;color?:string}) { return <Pressable onPress={onPress} style={s.icon}><Ionicons name={name} size={21} color={color}/></Pressable>; }

export const s = StyleSheet.create({
  screen:{flex:1,backgroundColor:C.bg}, card:{backgroundColor:C.card,borderRadius:16,borderWidth:1,borderColor:C.line}, pill:{borderRadius:20,paddingHorizontal:9,paddingVertical:4,alignSelf:'flex-start'}, pillText:{fontSize:11,fontWeight:'700'},
  icon:{width:38,height:38,borderRadius:19,backgroundColor:C.card,alignItems:'center',justifyContent:'center'},
  menuButton:{position:'absolute',left:16,bottom:22,width:48,height:48,borderRadius:24,backgroundColor:C.card,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',elevation:8,shadowColor:'#000',shadowOpacity:.32,shadowRadius:8,shadowOffset:{width:0,height:4}},
  languageButton:{position:'absolute',right:16,bottom:22,width:48,height:48,borderRadius:24,backgroundColor:C.card,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',elevation:8,shadowColor:'#000',shadowOpacity:.32,shadowRadius:8,shadowOffset:{width:0,height:4}}, languageText:{color:C.text,fontSize:11,fontWeight:'900'},
  menuOverlay:{flex:1,flexDirection:'row',backgroundColor:'#00000088'}, menuShade:{flex:1}, sidebar:{width:268,backgroundColor:'#151B22',paddingTop:54,paddingHorizontal:14,shadowColor:'#000',shadowOpacity:.4,shadowRadius:14,elevation:12},
  sidebarBrand:{height:54,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:8,borderBottomWidth:1,borderColor:C.line}, brandMark:{width:34,height:34,borderRadius:10,backgroundColor:C.accent,alignItems:'center',justifyContent:'center'}, brandText:{color:C.text,fontWeight:'800',fontSize:19,flex:1},
  nav:{paddingTop:20,gap:7}, navItem:{height:50,flexDirection:'row',alignItems:'center',gap:15,paddingHorizontal:13,borderRadius:13}, navItemActive:{backgroundColor:C.accent}, navLabel:{color:C.muted,fontSize:15,fontWeight:'700'}, navLabelActive:{color:C.bg},
});
