/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MovieMemory, PhotoMemory, WishlistItem, RoomSettings, PartnerProfile } from '../types';

export const currentUser: PartnerProfile = {
  id: 'aryan',
  name: 'آرین',
  role: 'میزبان سالن',
  status: 'آنلاین',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  latencyMs: 12,
  emailMasked: 'aryan.***@gmail.com',
  heartRate: 74,
};

export const partnerUser: PartnerProfile = {
  id: 'parnia',
  name: 'پرنیا',
  role: 'هم‌سینما',
  status: 'آنلاین در تهران',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  latencyMs: 12,
  emailMasked: 'parnia.***@gmail.com',
  heartRate: 76,
};

export const initialMovieMemories: MovieMemory[] = [
  {
    id: 'la-la-land',
    titleEn: 'La La Land',
    titleFa: 'لا لا لند',
    date: '۲۲ بهمن',
    duration: '2h 08m',
    quality: 'Full HD • صدای دالبی',
    sessionNumber: 'شب دوازدهم',
    rating: 5,
    pinnedNote: {
      author: 'پرنیا',
      text: '«اون سکانس پیانو که دو نفری زدیم زیر گریه هیچ‌وقت یادم نمیره... وقتی آهنگ تموم شد و توی وب‌کم نگاه کردیم، بهترین شبمون بود ❤️ همیشه با تو این فیلم قشنگه.»',
    },
    reactions: {
      hearts: 24,
      tears: 12,
      popcorn: 6,
    },
    taggedMoments: [
      { label: 'سکانس رقص در افق لس‌آنجلس', timecode: '00:32:15' },
      { label: 'دونوازی پیانو در کلوپ جاز', timecode: '01:14:28' },
      { label: 'آهنگ City of Stars', timecode: '01:38:40' },
      { label: 'نگاه پایانی میا و سباستین', timecode: '02:04:10' },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    tags: ['موزیکال', 'رمانتیک', 'اشک‌آور'],
  },
  {
    id: 'interstellar',
    titleEn: 'Interstellar',
    titleFa: 'در میان ستارگان',
    date: '۱۱ بهمن',
    duration: '2h 49m',
    quality: '4K HDR',
    sessionNumber: 'شب یازدهم',
    rating: 5,
    pinnedNote: {
      author: 'پرنیا',
      text: '«موسیقی هانس زیمر با دست‌های تو قشنگتره 🚀 حتی وقتی زمان توی سیاره میلر کند میگذشت، با تو ثانیه‌ها برام پرواز می‌کردن.»',
    },
    reactions: {
      hearts: 38,
      tears: 19,
      popcorn: 14,
    },
    taggedMoments: [
      { label: 'موج‌های عظیم سیاره میلر (استرس شدید)', timecode: '00:41:20' },
      { label: 'پیام تصویری کوپر به مورف (اشک‌آور)', timecode: '01:34:10' },
      { label: 'اتصال اضطراری به ایستگاه فضایی (۸۴ تپ قلب همزمان)', timecode: '02:08:15' },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    tags: ['علمی‌تخیلی', 'فلسفی', 'حماسی'],
  },
  {
    id: 'about-elly',
    titleEn: 'About Elly',
    titleFa: 'درباره الی',
    date: '۱۰ بهمن',
    duration: '1h 59m',
    quality: 'Full HD',
    sessionNumber: 'شب دهم',
    rating: 4.5,
    pinnedNote: {
      author: 'خاطره شب دهم',
      text: '«بحث طولانی ۲ ساعته در تماس صوتی بعد از تیتراژ راجع به پایان باز فیلم و تصمیم سپیده. هر دو چای داغ ریختیم و تا ساعت ۳ صبح با هم نظریه‌پردازی کردیم.»',
    },
    reactions: {
      hearts: 18,
      tears: 8,
      popcorn: 12,
    },
    audioPodcastDuration: '۲۴ دقیقه',
    taggedMoments: [
      { label: 'بادبادک‌بازی در ساحل شمال', timecode: '00:25:40' },
      { label: 'حادثه دریا و جستجو در امواج', timecode: '01:05:10' },
    ],
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    tags: ['درام', 'معمایی', 'اصغر فرهادی'],
  },
];

export const initialPhotoMemories: PhotoMemory[] = [
  {
    id: 'photo-1',
    title: 'لبخند پرنیا در سکانس رقص',
    caption: 'دقیقه 01:12:04 • تپ همزمان قلب و اشک شوق',
    timestamp: '۲۵ اردیبهشت - ساعت ۲۳:۴۵',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    hearts: 48,
  },
  {
    id: 'photo-2',
    title: 'لحظه ترسیدن دونفره',
    caption: 'پرنیا هدفونش رو انداخت زمین! 😂 شب احضار ۲',
    timestamp: '۱۲ دی - ساعت ۰۱:۱۵ بامداد',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
    hearts: 62,
  },
  {
    id: 'photo-3',
    title: 'خواب‌آلودگی شیرین بعد از فیلم',
    caption: 'هنوز تماس تصویری تا صبح باز بود و صدای بارون می‌اومد',
    timestamp: '۴ آذر - ساعت ۰۴:۳۰ بامداد',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    hearts: 77,
  },
];

export const initialWishlist: WishlistItem[] = [
  {
    id: 'dune-2',
    titleEn: 'Dune: Part Two',
    titleFa: 'تلماسه ۲',
    duration: '2h 46m',
    picker: 'parnia',
    pickerNote: '«قول دادی با کیفیت IMAX با ساندبار ببینیم!»',
    statusText: 'آماده برای امشب',
    actionText: 'شروع امشب با پرنیا',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    votes: 2,
  },
  {
    id: 'past-lives',
    titleEn: 'Past Lives',
    titleFa: 'زندگی‌های گذشته',
    duration: '1h 45m',
    picker: 'aryan',
    pickerNote: 'رمانتیک و عمیق درباره سرنوشت و عشق‌های در فاصله دور',
    statusText: 'رزرو آخر هفته',
    actionText: 'تنظیم یادآور',
    posterUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
    votes: 1,
  },
  {
    id: 'spirited-away',
    titleEn: 'Spirited Away',
    titleFa: 'شهر اشباح',
    duration: '2h 05m',
    picker: 'shared',
    pickerNote: '«برای شب‌های بارونی با شکلات داغ فوق‌العادست»',
    statusText: 'در صف پخش',
    actionText: 'رأی‌گیری',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    votes: 3,
  },
];

export const defaultRoomSettings: RoomSettings = {
  syncToleranceMs: 30,
  smartAutoPause: true,
  dualPlayPauseAccess: true,
  networkArchitecture: 'mesh',
  audioDucking: true,
  duckingPercentage: 35,
  aiEchoCancellation: true,
  heartbeatHaptics: true,
  floatingEmojis: true,
  webcamFilter: 'warm',
  permanentRoomPass: 'P&A-Forever-2024',
  roomName: 'خلوت ما و پرنیا',
  ambientGlowColor: '#ff3366',
  subtitleSize: 'medium',
  subtitleOffsetSec: 0,
};
