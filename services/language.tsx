import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export type Locale = 'uk' | 'en';

const copy = {
  uk: {
    home: 'Головна', concerts: 'Концерти', playlist: 'Трек-лист', band: 'Гурт', notifications: 'Сповіщення', profile: 'Профіль',
    greeting: 'Добрий вечір', leader: 'КЕРІВНИК', musician: 'МУЗИКАНТ', nextConcert: 'Найближчий концерт', attention: 'Потребують уваги',
    tracks: 'треків', votingOpen: 'ГОЛОСУВАННЯ ВІДКРИТО', playlistApproved: 'ТРЕК-ЛИСТ ЗАТВЕРДЖЕНО', votingPlaylist: 'Голосування за трек-лист',
    remainingVotes: 'Ще мають проголосувати: 2 учасники', menu: 'Меню', votes: 'Голосування', language: 'Мова', ukrainian: 'Українська', english: 'English', concertTitle: 'Осінній квартирник', venue: 'Київ', september: 'ВЕР',
    demoMode: 'ДЕМО-РЕЖИМ', settings: 'НАЛАШТУВАННЯ', bandLeader: 'Керівник гурту', musicianRole: 'Музикант', changeRole: 'Змінити роль', currentRole: 'Поточна', connectDropbox: 'Підключити Dropbox', changeHistory: 'Історія змін', signOut: 'Вийти', signOutTitle: 'Вийти з облікового запису?', signOutText: 'Збережений токен буде видалено з пристрою.', cancel: 'Скасувати',
    upcomingEvents: 'НАЙБЛИЖЧІ ПОДІЇ', draft: 'ЧЕРНЕТКА', approved: 'ЗАТВЕРДЖЕНО', archived: 'АРХІВ',
    authCreateAccount: 'Створіть обліковий запис учасника', authTagline: 'Концертний сет-лист вашого гурту', nicknamePlaceholder: 'Нікнейм (2–30 символів)', groupStatus: 'СТАТУС У ГУРТІ', member: 'Учасник', instrument: 'ІНСТРУМЕНТ', vocalist: 'Вокаліст', guitar: 'Гітара', bassGuitar: 'Бас-гітара', keyboards: 'Клавішні', drums: 'Ударні', leaderHint: 'Керівник зможе створювати плейлисти, відкривати голосування й остаточно затверджувати треки.', password: 'Пароль', createAccount: 'Створити обліковий запис', signIn: 'Увійти', forgotPassword: 'Забули пароль?', alreadyHaveAccount: 'Вже є обліковий запис? Увійти', selectMemberInstrument: 'Виберіть інструмент учасника.', accountCreated: 'Обліковий запис створено та додано до гурту. Тепер увійдіть.', actionFailed: 'Не вдалося виконати дію',
    newConcert: 'Новий концерт', nameLabel: 'НАЗВА', concertNamePlaceholder: 'Наприклад, осінній концерт', dateTime: 'ДАТА ТА ЧАС', votingDeadline: 'ДЕДЛАЙН ГОЛОСУВАННЯ (НЕОБОВ’ЯЗКОВО)', dateFormatHint: 'Формат дати: рік-місяць-деньTгодини:хвилини:секундиZ', place: 'МІСЦЕ', eventDescription: 'ОПИС', eventDescriptionPlaceholder: 'Коротко про подію', createConcert: 'Створити концерт', fillConcertFields: 'Заповніть назву, дату та місце.', invalidDateFormat: 'Дата має бути у форматі 2026-09-12T19:00:00Z.', concertCreateFailed: 'Не вдалося створити концерт',
    playlistVariants: 'ВАРІАНТІВ', compositions: 'КОМПОЗИЦІЙ', playlistTitleFallback: 'Трек-лист концерту', playlistNamePlaceholder: 'Наприклад, основний варіант', create: 'Створити', enterVariantName: 'Введіть назву варіанта.', playlistCreateFailed: 'Не вдалося створити варіант', noPlaylistVariants: 'Поки немає варіантів плейлиста.', createFirstVariant: 'Натисніть «+», щоб створити перший варіант.', addTrackToVariant: '+ Додати композицію до варіанта', set: 'СЕТ', trackCount: 'ТРЕКІВ', noTracksInSet: 'У цьому сеті поки немає композицій', rejected: 'ВІДХИЛЕНО', pending: 'ЧЕРНЕТКА',
    addTrack: 'Додати композицію', artist: 'ВИКОНАВЕЦЬ', duration: 'ТРИВАЛІСТЬ', key: 'ТОНАЛЬНІСТЬ', trackPendingHint: 'Трек буде додано до вибраного сету зі статусом «Чернетка».', selectPlaylistFirst: 'Спочатку виберіть варіант плейлиста.', fillTrackFields: 'Заповніть назву та виконавця.', trackAddFailed: 'Не вдалося додати композицію',
    connectDropboxTitle: 'Підключіть Dropbox', dropboxDescription: 'Вибирайте аудіофайли з папок Dropbox і додавайте їх до концертного плейлиста.', checkingServerConfiguration: 'Перевіряємо конфігурацію сервера…', oauthReady: 'OAuth-конфігурація готова на сервері.', oauthNotConfigured: 'OAuth ще не налаштовано: на сервері не задано App Key.', connectDropboxButton: 'Підключити Dropbox', oauthReadyTitle: 'OAuth готовий', oauthReadyMessage: 'Наступний крок — відкрити авторизацію Dropbox з PKCE.', setupRequired: 'Потрібне налаштування', setupRequiredMessage: 'Додайте Dropbox App Key до серверної конфігурації або змінних середовища.',
    trackNotFound: 'Композицію не знайдено', track: 'Композиція', deleteTrackTitle: 'Видалити композицію?', deleteTrackMessage: '«{{title}}» буде видалено із сету.', delete: 'Видалити', length: 'Тривалість', voting: 'Голосування', like: 'Подобається', abstain: 'Утримаюсь', dislike: 'Не подобається', status: 'Статус', comments: 'Коментарі', writeComment: 'Напишіть коментар…', deleteCommentTitle: 'Видалити коментар?', deleteCommentMessage: 'Цю дію не можна скасувати.', noComments: 'Коментарів поки немає. Залиште перший.',
  },
  en: {
    home: 'Home', concerts: 'Concerts', playlist: 'Set list', band: 'Band', notifications: 'Notifications', profile: 'Profile',
    greeting: 'Good evening', leader: 'LEADER', musician: 'MUSICIAN', nextConcert: 'Upcoming concert', attention: 'Needs attention',
    tracks: 'tracks', votingOpen: 'VOTING OPEN', playlistApproved: 'SET LIST APPROVED', votingPlaylist: 'Set list voting',
    remainingVotes: 'Still to vote: 2 members', menu: 'Menu', votes: 'Voting', language: 'Language', ukrainian: 'Українська', english: 'English', concertTitle: 'Autumn house concert', venue: 'Kyiv', september: 'SEP',
    demoMode: 'DEMO MODE', settings: 'SETTINGS', bandLeader: 'Band leader', musicianRole: 'Musician', changeRole: 'Change role', currentRole: 'Current', connectDropbox: 'Connect Dropbox', changeHistory: 'Change history', signOut: 'Sign out', signOutTitle: 'Sign out?', signOutText: 'The saved token will be removed from this device.', cancel: 'Cancel',
    upcomingEvents: 'UPCOMING EVENTS', draft: 'DRAFT', approved: 'APPROVED', archived: 'ARCHIVED',
    authCreateAccount: 'Create a member account', authTagline: 'Your band’s concert set list', nicknamePlaceholder: 'Nickname (2–30 characters)', groupStatus: 'BAND STATUS', member: 'Member', instrument: 'INSTRUMENT', vocalist: 'Vocalist', guitar: 'Guitar', bassGuitar: 'Bass guitar', keyboards: 'Keyboards', drums: 'Drums', leaderHint: 'The leader can create playlists, open voting, and make the final track decisions.', password: 'Password', createAccount: 'Create account', signIn: 'Sign in', forgotPassword: 'Forgot password?', alreadyHaveAccount: 'Already have an account? Sign in', selectMemberInstrument: 'Select the member’s instrument.', accountCreated: 'The account was created and added to the band. You can now sign in.', actionFailed: 'Could not complete the action',
    newConcert: 'New concert', nameLabel: 'NAME', concertNamePlaceholder: 'For example, autumn concert', dateTime: 'DATE AND TIME', votingDeadline: 'VOTING DEADLINE (OPTIONAL)', dateFormatHint: 'Date format: year-month-dayThours:minutes:secondsZ', place: 'VENUE', eventDescription: 'DESCRIPTION', eventDescriptionPlaceholder: 'Briefly describe the event', createConcert: 'Create concert', fillConcertFields: 'Enter a name, date, and venue.', invalidDateFormat: 'The date must use the format 2026-09-12T19:00:00Z.', concertCreateFailed: 'Could not create concert',
    playlistVariants: 'VARIANTS', compositions: 'TRACKS', playlistTitleFallback: 'Concert set list', playlistNamePlaceholder: 'For example, main variant', create: 'Create', enterVariantName: 'Enter a variant name.', playlistCreateFailed: 'Could not create variant', noPlaylistVariants: 'No playlist variants yet.', createFirstVariant: 'Tap “+” to create the first variant.', addTrackToVariant: '+ Add a track to this variant', set: 'SET', trackCount: 'TRACKS', noTracksInSet: 'There are no tracks in this set yet', rejected: 'REJECTED', pending: 'DRAFT',
    addTrack: 'Add track', artist: 'ARTIST', duration: 'DURATION', key: 'KEY', trackPendingHint: 'The track will be added to the selected set with Draft status.', selectPlaylistFirst: 'Select a playlist variant first.', fillTrackFields: 'Enter a title and artist.', trackAddFailed: 'Could not add track',
    connectDropboxTitle: 'Connect Dropbox', dropboxDescription: 'Choose audio files from Dropbox folders and add them to a concert set list.', checkingServerConfiguration: 'Checking server configuration…', oauthReady: 'OAuth configuration is ready on the server.', oauthNotConfigured: 'OAuth is not configured yet: App Key is missing on the server.', connectDropboxButton: 'Connect Dropbox', oauthReadyTitle: 'OAuth ready', oauthReadyMessage: 'The next step is to open Dropbox authorization with PKCE.', setupRequired: 'Setup required', setupRequiredMessage: 'Add the Dropbox App Key to the server configuration or environment variables.',
    trackNotFound: 'Track not found', track: 'Track', deleteTrackTitle: 'Delete track?', deleteTrackMessage: '“{{title}}” will be removed from the set.', delete: 'Delete', length: 'Duration', voting: 'Voting', like: 'Like', abstain: 'Abstain', dislike: 'Dislike', status: 'Status', comments: 'Comments', writeComment: 'Write a comment…', deleteCommentTitle: 'Delete comment?', deleteCommentMessage: 'This action cannot be undone.', noComments: 'No comments yet. Be the first to leave one.',
  },
} as const;

export type Key = keyof typeof copy.uk;
type LanguageContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: Key) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('uk');
  useEffect(() => { void SecureStore.getItemAsync('bandset.locale').then(value => { if (value === 'uk' || value === 'en') setLocaleState(value); }); }, []);
  const setLocale = (value: Locale) => { setLocaleState(value); void SecureStore.setItemAsync('bandset.locale', value); };
  const value = useMemo(() => ({ locale, setLocale, t: (key: Key) => copy[locale][key] }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('Missing LanguageProvider');
  return value;
}
