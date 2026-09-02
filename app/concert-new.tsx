import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '../services/api';
import { C, IconButton, Screen } from '../components/ui';
import { useLanguage } from '../services/language';
import { findConcertFormat } from '../services/concert-formats';

export default function ConcertNew(){
  const r=useRouter(),{t}=useLanguage();
  const {formatId}=useLocalSearchParams<{formatId?:string}>();
  const format=findConcertFormat(formatId);
  const [title,setTitle]=useState(format?.title??'');
  const [date,setDate]=useState('2026-09-12T19:00:00Z');
  const [deadline,setDeadline]=useState('');
  const [venue,setVenue]=useState('Freedom Pocket Park');
  const [description,setDescription]=useState(format?.description??'');
  const [error,setError]=useState(''),[saving,setSaving]=useState(false);
  const save=async()=>{
    if(!title.trim()||!date.trim()||!venue.trim())return setError(t('fillConcertFields'));
    if(Number.isNaN(new Date(date).getTime())||(deadline&&Number.isNaN(new Date(deadline).getTime())))return setError(t('invalidDateFormat'));
    try{
      setSaving(true);setError('');
      const concert=await api.createConcert({title:title.trim(),date,votingDeadline:deadline||null,venue:venue.trim(),description:description.trim(),skipDefaultPlaylist:Boolean(format)});
      if(format) for(const playlistTemplate of format.playlists){
        const playlist=await api.createPlaylist(concert.id,playlistTemplate.name);
        for(const track of playlistTemplate.tracks) await api.createTrack(concert.id,{...track,duration:'—',key:'—',playlistId:playlist.id});
      }
      r.replace('/concerts');
    }catch(e){setError(e instanceof Error?e.message:t('concertCreateFailed'))}finally{setSaving(false)}
  };
  return <Screen><View style={x.head}><IconButton name="close" onPress={()=>r.back()}/><Text style={x.title}>{t('newConcert')}</Text><View style={x.blank}/></View><View style={x.body}>
    {format?<View style={x.format}><Text style={x.formatName}>{format.title}</Text><Text style={x.formatText}>Буде додано {format.playlists.reduce((count,item)=>count+item.tracks.length,0)} пісень у трек-листи та сети.</Text></View>:null}
    <Label text={t('nameLabel')}/><TextInput value={title} onChangeText={setTitle} style={x.input} placeholder={t('concertNamePlaceholder')} placeholderTextColor={C.muted}/>
    <Label text={t('dateTime')}/><TextInput value={date} onChangeText={setDate} style={x.input} placeholder="2026-09-12T19:00:00Z" placeholderTextColor={C.muted} autoCapitalize="none"/>
    <Label text={t('votingDeadline')}/><TextInput value={deadline} onChangeText={setDeadline} style={x.input} placeholder="2026-09-10T18:00:00Z" placeholderTextColor={C.muted} autoCapitalize="none"/><Text style={x.hint}>{t('dateFormatHint')}</Text>
    <Label text={t('place')}/><TextInput value={venue} onChangeText={setVenue} style={x.input} placeholder={`Art Hall, ${t('venue')}`} placeholderTextColor={C.muted}/>
    <Label text={t('eventDescription')}/><TextInput value={description} onChangeText={setDescription} style={[x.input,x.area]} placeholder={t('eventDescriptionPlaceholder')} placeholderTextColor={C.muted} multiline/>
    {error?<Text style={x.error}>{error}</Text>:null}<Pressable disabled={saving} onPress={save} style={[x.save,saving&&x.disabled]}>{saving?<ActivityIndicator color={C.bg}/>:<Text style={x.saveText}>{t('createConcert')}</Text>}</Pressable>
  </View></Screen>
}
function Label({text}:{text:string}){return <Text style={x.label}>{text}</Text>}
const x=StyleSheet.create({head:{paddingTop:58,paddingHorizontal:18,paddingBottom:22,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},title:{color:C.text,fontSize:19,fontWeight:'800'},blank:{width:38},body:{padding:21,gap:9},format:{backgroundColor:'#73A7FF16',borderWidth:1,borderColor:'#73A7FF40',borderRadius:12,padding:12,marginBottom:4},formatName:{color:C.text,fontWeight:'800'},formatText:{color:C.muted,fontSize:12,lineHeight:17,marginTop:4},label:{color:C.muted,fontSize:11,fontWeight:'800',letterSpacing:.8,marginTop:9},input:{height:52,borderRadius:12,borderWidth:1,borderColor:C.line,color:C.text,paddingHorizontal:14,backgroundColor:C.card},area:{height:100,textAlignVertical:'top',paddingTop:14},hint:{color:C.muted,fontSize:11},error:{color:C.red,fontSize:13,marginTop:6},save:{backgroundColor:C.accent,borderRadius:12,height:53,alignItems:'center',justifyContent:'center',marginTop:22},disabled:{opacity:.65},saveText:{color:C.bg,fontWeight:'800',fontSize:16}});
