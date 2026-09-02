export type TemplateTrack={title:string;setNumber:number;artist:string};
export type PlaylistTemplate={name:string;tracks:TemplateTrack[]};
export type ConcertFormat={id:string;title:string;category:string;description:string;playlists:PlaylistTemplate[]};

const cover='RadioStars cover';
const tracks=(sets:string[][]):TemplateTrack[]=>sets.flatMap((songs,setIndex)=>songs.map(title=>({title,setNumber:setIndex+1,artist:cover})));
const queen=tracks([
  ['One Vision','Radio Ga Ga','A Kind of Magic','I Was Born to Love You','I Want to Break Free','Under Pressure','Friends Will Be Friends','Who Wants to Live Forever','Living on My Own','Don’t Stop Me Now','Crazy Little Thing Called Love'],
  ['Love of My Life','The World That We Created'],
  ['We Will Rock You','Hammer to Fall','Another One Bites the Dust','You Don’t Fool Me','Scandal','Somebody to Love','I Want It All','Mother Love','Bohemian Rhapsody','We Are the Champions','The Show Must Go On']
]);
const nineties=tracks([
  ['Let’s Get It Started','Ocean Drive','Lama — Моє серце','I’ve Been Thinking About You','Smooth Criminal','Bad Girls','Пінаколада','Sweet Dreams','Rhythm of the Night','Don’t Phunk with My Heart','Pump Up the Jam','Daddy Cool','Друг'],
  ['Simply the Best','La Vida Loca','Can’t Touch This','Barbie Girl','Bara Bara','Toxic','Toca Toca','Rhythm Is a Dancer','Bailando','Mandala','Till I Come','Hit My Heart','How Much Is the Fish'],
  ['Song 2','Старі фотографії','Все буде добре']
]);
const modern=tracks([
  ['Вдома','А що','Смарагдове небо','Кохаю, але не зовсім','Таку як є','Мужчина','Японія','No Roots','Happy','Cake by the Ocean','Дежавю','Тумани','Хто як не ти'],
  ['Те від чого без тями','Врубай','Uptown Funk','Don’t Phunk with My Heart','Порічка','Хай пишуть','I Love It','La Vida Loca','Toca Toca','Mandala','Musica','Love Tonight','Рандеву','Подруга ніч'],
  ['Не п’яна','Місця щасливих людей'],
  ['Ластівки','Повільно']
]);
const skryabin=tracks([
  ['Люди як кораблі','Говорили і курили','Шампанські очі','Спи собі сама','Птахи','Мумітроль','Мам','Танець пінгвіна','Кольорова','Дельфіни','Про любов','Кинули','Старі фотографії','Сука війна'],
  ['Сам собі країна','Мовчати','Брудна як ангел','Гламур','То моє море','Порш пана мера','Маршрутка','Хлопці-олігархи','Шмата','Ти мені не даєш','Бультер’єр','Коломийки','Кінець фільму','Місця щасливих людей']
]);
const rock=tracks([
  ['Can’t Stop','Radio Ga Ga','The Emptiness Machine (на тон нижче)','Personal Jesus','Californication','Power of the Blues','I Was Made for Lovin’ You','Кобра','In the End','Listen to Your Heart','Nothing Else Matters'],
  ['Simply the Best','Song 2','Immigrant Song','Power (на півтону вище)','Shut Your Mouth','Коханці','Файне місто Тернопіль','The Pretender','Smoke on the Water','Kickstart My Heart','Du Hast','Smells Like Teen Spirit','Highway to Hell'],
  ['Breathe','How Much Is the Fish']
]);
const ukrainianParty=tracks([
  ['Лови момент','А що','Врубай','Два вікна','Те від чого без тями','Там у тополі','Порічка','Пливи як вода'],
  ['Кохаю, але не зовсім','Дежавю','Daddy Cool','Moves Like Jagger','Покохай','Тумани','Буревіями'],
  ['Simply the Best','Abracadabra','Little Party','Gimme Gimme','Pump Up the Jam','Coco Jambo','I Like to Move It','Старі фотографії'],
  ['Гоп-гоп, чи не гоп','Червона рута','Шльопки','How Much Is the Fish','Lose Yourself','Highway to Hell','Du Hast','Все буде добре']
]);
const freeUkraine=tracks([
  ['А що','Енкарапіста','Врубай','Turn the Lights Off','Кружит','Тумани','I Love It','Musica','In Your Eyes','Таку як є'],
  ['Смарагдове небо','Пінаколада','Ой, я не п’яна','Хай пишуть','Рандеву','Поліна','Тепер давай танцюй','Цей мужчина','Дежавю','Місця щасливих людей'],
  ['Little Party','Toca Toca','Mandala','La Vida Loca','Coco Jambo','I Like to Move It','Macarena','Гоп-гоп-гоп','Червона рута','It’s My Life']
]);

const variant=(name:string,items:TemplateTrack[]):PlaylistTemplate=>({name,tracks:items});
export const concertFormats:ConcertFormat[]=[
  {id:'modern-hits',title:'Вечірка сучасних хітів',category:'Танцювальна програма',description:'Сучасні хіти, два основні сети, біс і резерв.',playlists:[variant('Сучасне — основний',modern)]},
  {id:'90-2000',title:'Супер-вечірка 90–2000х',category:'Тематична вечірка',description:'Перевірена програма 90-х і 2000-х.',playlists:[variant('90–2000 — 25.10 / 28.11',nineties)]},
  {id:'queen',title:'Queen Forever',category:'Триб’ют-концерт',description:'Повна програма Queen.',playlists:[variant('Queen Forever — повна програма',queen)]},
  {id:'blue-yellow',title:'Жовто-блакитне серце',category:'Святковий концерт',description:'Концертна програма українських та міжнародних хітів.',playlists:[variant('Жовто-блакитне серце — базовий',freeUkraine)]},
  {id:'graduates',title:'Вечір зустрічі випускників',category:'Спеціальна подія',description:'Ностальгійна і танцювальна програма.',playlists:[variant('Випускники — базовий',nineties)]},
  {id:'love',title:'Love is…',category:'Романтична вечірка',description:'Романтично-танцювальний формат.',playlists:[variant('Love is — сучасний',modern)]},
  {id:'womens',title:"Women's концерт",category:'Святковий концерт',description:'Святкова програма до 8 березня.',playlists:[variant('Women’s — основний',modern)]},
  {id:'queen-day',title:'Моя королева',category:'Святкова програма',description:'Програма до 8 березня.',playlists:[variant('Моя королева — основний',modern)]},
  {id:'karaoke',title:'Live Karaoke',category:'Інтерактив',description:'Інтерактивна програма з відомими хітами.',playlists:[variant('Live Karaoke — базовий',ukrainianParty)]},
  {id:'easter',title:'Pre-великодня вечірка',category:'Святкова програма',description:'Весняна передсвяткова вечірка.',playlists:[variant('Pre-великодня — основний',ukrainianParty)]},
  {id:'golden',title:'Golden Hits',category:'Золоті хіти',description:'Вечір танцювальних золотих хітів.',playlists:[variant('Golden Hits — основний',nineties)]},
  {id:'skryabin',title:'Концерт пам’яті Скрябіна',category:'Триб’ют-концерт',description:'Повна програма пам’яті Кузьми Скрябіна.',playlists:[variant('Скрябін — повна програма',skryabin)]},
  {id:'super-rock',title:'Super Rock',category:'Рок-концерт',description:'Рокова програма з бісом.',playlists:[variant('Super Rock — 11.07',rock)]},
  {id:'free-ukraine',title:'Вільні нескорені',category:'Святковий концерт',description:'Три блоки для святкової події.',playlists:[variant('Вільні нескорені — основний',freeUkraine)]},
];
export const findConcertFormat=(id?:string)=>concertFormats.find(item=>item.id===id);
