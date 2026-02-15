export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  category: 'Word' | 'Teaching' | 'Prayer';
  description: string;
  videoUrl?: string;
  audioUrl?: string;
  notes?: string;
  thumbnail?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  ticketTypes: string[];
  attendanceTypes: string[];
  image?: string;
}

export interface ChatMessage {
  id: string;
  channel: string;
  nickname: string;
  text: string;
  timestamp: number;
  isPinned?: boolean;
}

export interface ScheduleItem {
  day: string;
  items: { time: string; title: string }[];
}

export const SCHEDULE: ScheduleItem[] = [
  {
    day: 'Sunday',
    items: [
      { time: '04:00 - 05:00', title: 'Daily Online Devotion' },
      { time: '08:00 - 09:00', title: 'Leader Training' },
      { time: '09:00 - 10:00', title: 'Intercession' },
      { time: '09:00 - 10:00', title: 'Power Hour: Prayer & Prophetic Ministry' },
      { time: '10:00 - 12:30', title: 'Main Service' },
    ],
  },
  {
    day: 'Wednesday',
    items: [
      { time: 'All Day', title: 'Fasting and Prayer' },
      { time: '18:30 - 19:30', title: 'Bible Study' },
    ],
  },
  {
    day: 'Friday',
    items: [
      { time: '18:30 - 19:30', title: 'Youth Service' },
    ],
  },
  {
    day: 'Saturday',
    items: [
      { time: '18:00 - 19:00', title: 'Intercession' },
    ],
  },
];

export const SERMONS: Sermon[] = [
  {
    id: '1',
    title: 'Walking in Faith',
    speaker: 'Pastor Thabo Boshomane',
    date: '2026-02-08',
    category: 'Word',
    description: 'A powerful message about trusting God in every season of life. Learn how to walk boldly in faith even when the path ahead seems uncertain.',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    notes: 'Key Scripture: Hebrews 11:1 - Now faith is confidence in what we hope for and assurance about what we do not see.\n\nMain Points:\n1. Faith is not the absence of doubt\n2. Walking in faith requires daily surrender\n3. God\'s promises are our foundation',
  },
  {
    id: '2',
    title: 'The Power of Prayer',
    speaker: 'Pastor Thabo Boshomane',
    date: '2026-02-01',
    category: 'Prayer',
    description: 'Understanding the transformative power of prayer in the life of a believer. Discover how persistent prayer can move mountains.',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    notes: 'Key Scripture: Philippians 4:6-7\n\nMain Points:\n1. Prayer changes things\n2. Consistent prayer builds relationship with God\n3. Corporate prayer amplifies power',
  },
  {
    id: '3',
    title: 'Discipleship in the Modern Age',
    speaker: 'Pastor Thabo Boshomane',
    date: '2026-01-25',
    category: 'Teaching',
    description: 'How to live as a true disciple of Christ in today\'s world. Practical steps for growing in your walk with God.',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    notes: 'Key Scripture: Matthew 28:19-20\n\nMain Points:\n1. Discipleship is a lifelong journey\n2. We are called to make disciples\n3. Community is essential for growth',
  },
  {
    id: '4',
    title: 'Hope for All Nations',
    speaker: 'Pastor Thabo Boshomane',
    date: '2026-01-18',
    category: 'Word',
    description: 'God\'s heart for every nation and every people. Exploring the Great Commission and our role in sharing the Gospel worldwide.',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    notes: 'Key Scripture: Acts 1:8\n\nMain Points:\n1. God\'s love knows no borders\n2. Every believer is a missionary\n3. The harvest is plentiful',
  },
  {
    id: '5',
    title: 'Breaking Through',
    speaker: 'Pastor Thabo Boshomane',
    date: '2026-01-11',
    category: 'Prayer',
    description: 'When life presents barriers, God is ready to break through. Learn how to position yourself for a spiritual breakthrough.',
    notes: 'Key Scripture: Isaiah 43:19\n\nMain Points:\n1. God is doing a new thing\n2. Breakthrough begins in the spirit\n3. Praise opens doors',
  },
  {
    id: '6',
    title: 'Foundations of Faith',
    speaker: 'Pastor Thabo Boshomane',
    date: '2026-01-04',
    category: 'Teaching',
    description: 'Building your life on the solid rock of God\'s Word. Understanding the foundational truths that anchor our faith.',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
    notes: 'Key Scripture: Matthew 7:24-27\n\nMain Points:\n1. Build on the rock, not on sand\n2. The Word of God is our foundation\n3. Storms reveal our foundation',
  },
];

export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Annual Faith Conference 2026',
    date: '2026-03-20',
    time: '09:00 - 17:00',
    location: '824 Simunye Street, Mountainview Zone 02, KwaMhlanga',
    description: 'Join us for our annual faith conference! A powerful time of worship, prayer, and teaching. Multiple speakers, worship sessions, and fellowship opportunities.',
    category: 'Conference',
    ticketTypes: ['General', 'VIP'],
    attendanceTypes: ['In-Person', 'Online'],
  },
  {
    id: '2',
    title: 'Youth Revival Weekend',
    date: '2026-04-10',
    time: '18:00 - 21:00',
    location: '824 Simunye Street, Mountainview Zone 02, KwaMhlanga',
    description: 'A weekend dedicated to the youth! Dynamic worship, relevant teaching, and life-changing encounters with God.',
    category: 'Youth',
    ticketTypes: ['General'],
    attendanceTypes: ['In-Person', 'Online'],
  },
  {
    id: '3',
    title: 'Women\'s Fellowship Retreat',
    date: '2026-05-15',
    time: '08:00 - 16:00',
    location: 'TBA',
    description: 'A special day of fellowship, empowerment, and spiritual renewal for women of all ages.',
    category: 'Fellowship',
    ticketTypes: ['General', 'VIP'],
    attendanceTypes: ['In-Person'],
  },
  {
    id: '4',
    title: 'Easter Celebration Service',
    date: '2026-04-05',
    time: '10:00 - 13:00',
    location: '824 Simunye Street, Mountainview Zone 02, KwaMhlanga',
    description: 'Celebrate the resurrection of our Lord Jesus Christ with a special Easter service filled with worship, praise, and the Word.',
    category: 'Service',
    ticketTypes: ['General'],
    attendanceTypes: ['In-Person', 'Online'],
  },
];

export const DEPARTMENTS = [
  'Worship',
  'Ushering',
  'Youth Ministry',
  'Women Fellowship',
  'Men\'s Fellowship',
  'Children Ministry',
  'Catering Team',
  'Media Team',
  'Evangelism',
  'Pastors Fellowship',
  'Community Affairs',
  'Social Service',
];

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/hopeinchristforallnations',
  twitter: 'https://twitter.com/hopeinchrist',
  tiktok: 'https://www.tiktok.com/@hopeinchrist',
  whatsapp: 'https://wa.me/27000000000',
  youtube: 'https://www.youtube.com/@hopeinchrist',
};

export const MINISTRY_INFO = {
  name: 'Hope in Christ for All Nations Ministries',
  shortName: 'Hope in Christ',
  slogan1: 'Inspiring Hope... Encouraging Life',
  slogan2: 'Winning, Discipling, Imparting and Sending',
  address: '824 Simunye Street, Mountainview Zone 02, KwaMhlanga, Mpumalanga 1022',
  officeHours: '07:30 - 17:00',
  serviceStyle: 'Word - Worship - Prayer - Praise',
  established: '18 October 2015',
  pastorBio: 'Pastor Thabo Boshomane received his calling in 2009 and has since dedicated his life to preaching the Gospel to all nations. Together with his wife, Mrs Ntombi Boshomane, they founded Hope in Christ for All Nations Ministries on 18 October 2015. Their mission is to win souls, disciple believers, impart spiritual gifts, and send laborers into the harvest field. Through faithful service and unwavering dedication, the ministry continues to grow and impact communities across the region.',
  adminHR: 'Pastor Thoko Mahlangu',
};

export const DONATION_CONFIG = {
  onlineUrl: 'https://example.com/donate',
  eftDetails: {
    bankName: '[Bank Name]',
    accountHolder: 'Hope in Christ for All Nations Ministries',
    accountNumber: '[Account Number]',
    branchCode: '[Branch Code]',
    accountType: 'Cheque/Current',
    reference: 'Donation - [Your Name]',
  },
  contactPhone: '+27 00 000 0000',
  contactEmail: 'give@hopeinchrist.org',
};
