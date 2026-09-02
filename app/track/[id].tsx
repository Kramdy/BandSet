import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { C, IconButton, Pill, Screen, s } from '../../components/ui';
import { useApp } from '../../store/app-store';
import { useLanguage } from '../../services/language';


export default function TrackPage() {
  const r = useRouter();
  const { t } = useLanguage();
  const p = useLocalSearchParams<{ id: string; concertId?: string }>();
  const { tracks, isLeader, finalized, vote, comment, updateComment, deleteComment, setStatus, removeTrack, loadComments, loadTracks, concertId, user } = useApp();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const track = useMemo(() => tracks.find(item => item.id === p.id), [tracks, p.id]);
  useEffect(() => { if (p.concertId) void loadTracks(Number(p.concertId)); void loadComments(p.id); }, [p.id, p.concertId]);
  if (!track) return <Screen><View style={x.head}><IconButton name="arrow-back" onPress={() => r.back()} /><Text style={x.pageTitle}>{t('trackNotFound')}</Text></View></Screen>;
  const total = track.votes.yes + track.votes.no + track.votes.abstain || 1;
  const canEdit = isLeader && !finalized;
  const send = async () => {
    const message = text.trim();
    if (!message || sending) return;
    setSending(true);
    try { if (editingId) { await updateComment(editingId, message); setEditingId(null); } else await comment(track.id, message); setText(''); }
    finally { setSending(false); }
  };
  const statusText: Record<string, string> = { Voting: t('votes'), Approved: t('approved'), Rejected: t('rejected'), Pending: t('pending') };
  const voteOptions = [['yes', t('like'), 'thumbs-up', C.green], ['abstain', t('abstain'), 'remove', C.accent], ['no', t('dislike'), 'thumbs-down', C.red]] as const;
  const del = () => Alert.alert(t('deleteTrackTitle'), t('deleteTrackMessage').replace('{{title}}', track.title), [{ text: t('cancel'), style: 'cancel' }, { text: t('delete'), style: 'destructive', onPress: () => { void removeTrack(track.id); r.replace({ pathname: '/playlist', params: { concertId: String(p.concertId ?? concertId) } }); } }]);
  return <Screen><ScrollView contentContainerStyle={x.body}>
    <View style={x.head}><IconButton name="arrow-back" onPress={() => r.back()} /><Text style={x.pageTitle}>{t('track')}</Text>{canEdit ? <Pressable onPress={del}><Ionicons name="trash-outline" size={21} color={C.red} /></Pressable> : <View style={x.blank} />}</View>
    <View style={[s.card, x.cover]}><Ionicons name="musical-notes" size={64} color={C.accent} /><View style={x.play}><Ionicons name="play" size={21} color={C.bg} /></View></View>
    <View style={x.songRow}><Text style={x.song} numberOfLines={1}>{track.title}</Text><Text style={x.artist} numberOfLines={1}>{track.artist}</Text></View><View style={x.tags}><Pill text={`${t('set')} ${track.setNumber}`} color={C.blue} /><Pill text={statusText[track.status]} color={track.status === 'Approved' ? C.green : C.accent} /></View>
    <View style={[s.card, x.info]}><Text style={x.infoText}>{t('length')}: {track.duration}</Text><Text style={x.infoText}>{t('key')}: {track.key}</Text></View>
    <Text style={x.section}>{t('voting')}</Text><View style={x.voteRow}>{voteOptions.map(([value, label, icon, color]) => <Pressable disabled={finalized || track.status !== 'Voting'} onPress={() => void vote(track.id, value)} key={value} style={[x.vote, track.myVote === value && { borderColor: color, backgroundColor: `${color}14` }]}><Ionicons name={icon} size={22} color={color} /><Text style={[x.voteNum, { color }]}>{track.votes[value]}</Text><Text style={x.voteLabel}>{label}</Text></Pressable>)}</View>
    <View style={[s.card, x.chart]}>{(['yes', 'abstain', 'no'] as const).map(value => <View key={value} style={x.barRow}><Text style={x.barLabel}>{value === 'yes' ? t('like') : value === 'no' ? t('dislike') : t('abstain')}</Text><View style={x.barBg}><View style={[x.bar, { width: `${(track.votes[value] / total) * 100}%`, backgroundColor: value === 'yes' ? C.green : value === 'no' ? C.red : C.accent }]} /></View><Text style={x.barValue}>{track.votes[value]}</Text></View>)}</View>
    {canEdit ? <View style={x.statuses}><Text style={x.statusTitle}>{t('status')}</Text>{(['Voting', 'Approved', 'Rejected'] as const).map(value => <Pressable key={value} onPress={() => void setStatus(track.id, value)} style={[x.status, track.status === value && x.statusOn]}><Text style={x.statusText}>{statusText[value]}</Text></Pressable>)}</View> : null}
    <Text style={x.section}>{t('comments')}</Text>
    <View style={x.write}><TextInput value={text} onChangeText={setText} placeholder={t('writeComment')} placeholderTextColor={C.muted} style={x.input} multiline maxLength={1000} textAlignVertical="top" keyboardType="default" autoCapitalize="sentences" autoCorrect /><Pressable disabled={!text.trim() || sending} onPress={() => void send()} style={[x.send, (!text.trim() || sending) && x.sendDisabled]}><Ionicons name={editingId ? 'checkmark' : 'send'} color={C.bg} size={18} /></Pressable></View>
    {track.comments.length ? track.comments.map((item,index) => <View key={item.id || `${item.author}-${item.text}-${index}`} style={[s.card, x.comment]}><View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={x.author}>{item.author}</Text>{item.author===user?.name?<View style={{flexDirection:'row',gap:14}}><Pressable onPress={()=>{setEditingId(item.id);setText(item.text)}}><Ionicons name="pencil-outline" size={17} color={C.muted}/></Pressable><Pressable onPress={()=>Alert.alert(t('deleteCommentTitle'),t('deleteCommentMessage'),[{text:t('cancel'),style:'cancel'},{text:t('delete'),style:'destructive',onPress:()=>void deleteComment(item.id)}])}><Ionicons name="trash-outline" size={17} color={C.red}/></Pressable></View>:null}</View><Text style={x.commentText}>{item.text}</Text></View>) : <Text style={x.emptyComments}>{t('noComments')}</Text>}
  </ScrollView></Screen>;
}

const x = StyleSheet.create({
  body: { paddingBottom: 36 }, head: { paddingTop: 58, paddingHorizontal: 18, paddingBottom: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, pageTitle: { color: C.text, fontSize: 18, fontWeight: '800' }, blank: { width: 21 }, cover: { marginHorizontal: 20, height: 190, alignItems: 'center', justifyContent: 'center', backgroundColor: '#243142', overflow: 'hidden' }, play: { position: 'absolute', bottom: 16, right: 16, width: 45, height: 45, borderRadius: 23, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }, songRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 20, marginHorizontal: 20 }, song: { color: C.text, fontSize: 25, fontWeight: '900', flexShrink: 1 }, artist: { color: C.muted, fontSize: 15, flexShrink: 1 }, tags: { flexDirection: 'row', gap: 7, margin: 20 }, info: { marginHorizontal: 20, padding: 14, flexDirection: 'row', justifyContent: 'space-between' }, infoText: { color: C.muted, fontSize: 13 }, section: { color: C.text, fontSize: 17, fontWeight: '800', marginHorizontal: 20, marginTop: 22, marginBottom: 11 }, voteRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20 }, vote: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingVertical: 12, alignItems: 'center', backgroundColor: C.card }, voteNum: { fontWeight: '900', fontSize: 19, marginTop: 3 }, voteLabel: { color: C.muted, fontSize: 10, marginTop: 2, textAlign: 'center' }, chart: { marginHorizontal: 20, marginTop: 8, padding: 14, gap: 10 }, barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, barLabel: { color: C.muted, fontSize: 11, width: 86 }, barBg: { flex: 1, height: 8, borderRadius: 4, backgroundColor: C.line, overflow: 'hidden' }, bar: { height: 8, borderRadius: 4 }, barValue: { color: C.text, fontWeight: '800', width: 15, textAlign: 'right' }, statuses: { flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', gap: 6, paddingHorizontal: 20, marginTop: 22 }, statusTitle: { color: C.text, fontSize: 17, fontWeight: '800', marginRight: 8 }, status: { borderWidth: 1, borderColor: C.line, borderRadius: 16, paddingHorizontal: 8, paddingVertical: 7 }, statusOn: { borderColor: C.accent, backgroundColor: '#F6B73C1A' }, statusText: { color: C.text, fontSize: 9, fontWeight: '800' }, comment: { marginHorizontal: 20, marginTop: 10, marginBottom: 0, padding: 13 }, author: { color: C.accent, fontSize: 12, fontWeight: '800' }, commentText: { color: C.text, marginTop: 5, lineHeight: 19 }, write: { marginHorizontal: 20, flexDirection: 'row', gap: 8, alignItems: 'stretch' }, input: { flex: 1, backgroundColor: C.card, borderColor: C.line, borderWidth: 1, borderRadius: 12, color: C.text, paddingHorizontal: 13, paddingVertical: 12, minHeight: 58, maxHeight: 110 }, send: { width: 52, borderRadius: 12, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }, sendDisabled: { opacity: .4 }, emptyComments: { color: C.muted, fontSize: 13, marginHorizontal: 20, marginTop: 14 },
});
