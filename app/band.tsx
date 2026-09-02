import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { C, IconButton, Pill, Screen, s } from '../components/ui';
import { useApp } from '../store/app-store';

export default function Band(){
  const r=useRouter(),{members,loadMembers,user}=useApp();
  useEffect(()=>{if(user)void loadMembers()},[user]);
  return <Screen><View style={x.head}><IconButton name="arrow-back" onPress={()=>r.back()}/><Text style={x.title}>Гурт</Text><View style={x.blank}/></View><View style={x.info}><View style={x.mark}><Ionicons name="musical-notes" color={C.bg} size={27}/></View><View><Text style={x.band}>Blue Echo</Text><Text style={x.sub}>{members.length} учасників · Київ</Text></View></View><FlatList data={members} contentContainerStyle={x.list} ListHeaderComponent={<Text style={x.label}>ЗАРЕЄСТРОВАНІ УЧАСНИКИ</Text>} renderItem={({item})=><View style={[s.card,x.member]}><View style={x.avatar}><Text style={x.initial}>{item.initials}</Text></View><View style={x.memberText}><Text style={x.name}>{item.name}</Text><Text style={x.instrument}>{item.instrument}</Text></View>{item.role==='Leader'?<Pill text="КЕРІВНИК" color={C.accent}/>:null}</View>}/></Screen>
}

const x=StyleSheet.create({head:{paddingTop:58,paddingHorizontal:18,paddingBottom:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},title:{color:C.text,fontSize:19,fontWeight:'800'},blank:{width:38},info:{paddingHorizontal:22,paddingBottom:19,flexDirection:'row',alignItems:'center',gap:13},mark:{height:58,width:58,borderRadius:16,backgroundColor:C.accent,alignItems:'center',justifyContent:'center'},band:{color:C.text,fontSize:20,fontWeight:'800'},sub:{color:C.muted,fontSize:13,marginTop:4},list:{padding:20,paddingTop:2,gap:9},label:{color:C.muted,fontWeight:'800',fontSize:11,letterSpacing:1,marginVertical:8},member:{padding:13,flexDirection:'row',alignItems:'center',gap:11},avatar:{height:42,width:42,borderRadius:21,backgroundColor:'#293343',alignItems:'center',justifyContent:'center'},initial:{color:C.accent,fontWeight:'800',fontSize:17},memberText:{flex:1},name:{color:C.text,fontWeight:'800'},instrument:{color:C.muted,fontSize:12,marginTop:3}});
