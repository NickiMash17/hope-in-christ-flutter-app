export const MINISTRY_INFO = {
  name: "Hope In Christ for All Nations Ministries",
  fullName: "Hope In Christ for All Nations Ministries",
  shortName: "Hope In Christ",
  slogan1: "Inspiring Hope... Encouraging Life",
  slogan2: "Winning, Discipling, Imparting and Sending",
  address: "824 Simunye Street, Mountainview Zone 02, KwaMhlanga, Mpumalanga 1022",
  officeHours: "07:30-17:00",
  serviceStyle: "Services characterized by Word-Worship Prayer-Praise",
  established: "2015",
  pastorBio: "Pastor Thabo Boshomane was ordained and released from Hope Restoration Ministry in Kempton Park. He established Hope In Christ on October 18, 2015, after accepting God's call in 2009 to preach the gospel to all nations. He is a life coach and NLP practitioner who believes everyone must be saved and discipled to become the best of who God intended for them.",
  adminHR: "Pastor Thoko Mahlangu",
  socialMedia: {
    facebook: "https://www.facebook.com/hopeinchristforallnations",
    twitter: "https://x.com/HicfanMin",
    tiktok: "https://www.tiktok.com/@hopeinchrist",
    whatsapp: "https://wa.me/27XXXXXXXXXX",
    youtube: "https://www.youtube.com/@hopeinchrist",
  },
  streaming: {
    platform: "Facebook & Twitter/X",
    url: "https://www.facebook.com/hopeinchristforallnations",
    twitterUrl: "https://x.com/HicfanMin",
  },
  leadership: {
    seniorPastors: "Pastor Thabo & Mrs Ntombi Boshomane",
    pastorThabo: {
      title: "Senior Pastor",
      ordination: "Ordained and Released from Hope Restoration Ministry based in Kempton Park, under the leadership of Pastor SC and Pastor PA Mathebula",
      founded: "Established the ministry on 18th October 2015, after accepting the call of God in 2009 to preach the gospel to all nations and across the world",
      belief: "Believes everyone must be saved and discipled to become the best of who God has intended for them",
      additional: "Life coach and NLP practitioner"
    },
    admin: "Pastor Thoko Mahlangu - Admin and HR responsibilities"
  },
  departments: [
    "Worship Team",
    "Ushering Ministry",
    "Youth Ministry", 
    "Women's Fellowship",
    "Men's Fellowship",
    "Children's Ministry",
    "Catering Team",
    "Media Team",
    "Evangelism",
    "Pastors' Fellowship",
    "Community Affairs",
    "Social Services"
  ],
  values: {
    dressing: "Presentable",
    services: "Spirit-filled and God-powered service, vibrant and exciting"
  }
};

export const SCHEDULE = [
  {
    day: "Sunday",
    items: [
      { time: "08:00-09:00", title: "Leader Training" },
      { time: "09:00-10:00", title: "Intercession" },
      { time: "10:00-12:30", title: "Power Hour: Prayer & Prophetic Ministry" },
      { time: "10:00-12:30", title: "Main Service" },
    ]
  },
  {
    day: "Daily",
    items: [
      { time: "04:00-05:00", title: "Online Devotion" },
    ]
  },
  {
    day: "Wednesday",
    items: [
      { time: "All Day", title: "Fasting and Prayer" },
      { time: "18:30-19:30", title: "Bible Study" },
    ]
  },
  {
    day: "Friday",
    items: [
      { time: "18:30-19:30", title: "Youth Service" },
    ]
  },
  {
    day: "Saturday",
    items: [
      { time: "18:00-19:00", title: "Intercession" },
    ]
  }
];

export const SERMONS = [
  {
    id: "1",
    title: "Sunday Service - February 23, 2026",
    speaker: "Pastor Thabo Boshomane",
    date: "2026-02-23",
    duration: "1:15:00",
    category: "Word",
    thumbnail: require('@/assets/images/sermon-word.png'),
    videoUrl: "https://x.com/HicfanMin",
    audioUrl: "https://x.com/HicfanMin",
    notes: "Watch the full service recording on our Twitter/X account",
    description: "Sunday morning service with powerful worship, prayer, and the Word of God."
  },
  {
    id: "2", 
    title: "Sunday Service - February 16, 2026",
    speaker: "Pastor Thabo Boshomane",
    date: "2026-02-16",
    duration: "1:12:00",
    category: "Word",
    thumbnail: require('@/assets/images/sermon-teaching.png'),
    videoUrl: "https://x.com/HicfanMin",
    audioUrl: "https://x.com/HicfanMin",
    notes: "Watch the full service recording on our Twitter/X account",
    description: "Sunday morning service with inspiring worship and biblical teaching."
  },
  {
    id: "3",
    title: "Sunday Service - February 9, 2026",
    speaker: "Pastor Thabo Boshomane", 
    date: "2026-02-09",
    duration: "1:18:00",
    category: "Word",
    thumbnail: require('@/assets/images/sermon-prayer.png'),
    videoUrl: "https://x.com/HicfanMin",
    audioUrl: "https://x.com/HicfanMin",
    notes: "Watch the full service recording on our Twitter/X account",
    description: "Sunday morning service featuring prayer, praise, and powerful preaching."
  },
  {
    id: "4",
    title: "Sunday Service - February 2, 2026",
    speaker: "Pastor Thabo Boshomane",
    date: "2026-02-02",
    duration: "1:20:00",
    category: "Word",
    thumbnail: require('@/assets/images/sermon-word.png'),
    videoUrl: "https://x.com/HicfanMin",
    audioUrl: "https://x.com/HicfanMin",
    notes: "Watch the full service recording on our Twitter/X account",
    description: "Sunday morning service with anointed worship and the Word."
  },
  {
    id: "5",
    title: "Sunday Service - January 26, 2026",
    speaker: "Pastor Thabo Boshomane",
    date: "2026-01-26",
    duration: "1:10:00",
    category: "Word",
    thumbnail: require('@/assets/images/sermon-teaching.png'),
    videoUrl: "https://x.com/HicfanMin",
    audioUrl: "https://x.com/HicfanMin",
    notes: "Watch the full service recording on our Twitter/X account",
    description: "Sunday morning service with transformative teaching from the Word."
  },
  {
    id: "6",
    title: "Friday Youth Service - February 21, 2026",
    speaker: "Youth Leaders",
    date: "2026-02-21",
    duration: "55:00",
    category: "Teaching",
    thumbnail: require('@/assets/images/sermon-prayer.png'),
    videoUrl: "https://x.com/HicfanMin",
    audioUrl: "https://x.com/HicfanMin",
    notes: "Watch the youth service recording on our Twitter/X account",
    description: "Friday evening youth service with dynamic worship and relevant teaching."
  }
];

export const EVENTS = [
  {
    id: "1",
    title: "Annual Victory Conference 2026",
    category: "Conference",
    date: "2026-03-15",
    time: "09:00 - 17:00",
    location: "824 Simunye Street, KwaMhlanga",
    price: "Free",
    ticketTypes: ["Free Entry", "VIP Pass"],
    attendanceTypes: ["In-Person", "Online"],
    image: require('@/assets/images/event-conference.png'),
    description: "Join us for our annual victory conference featuring powerful preaching, worship, and ministry sessions. Experience transformative teachings, prophetic ministry, and powerful worship.",
    registrationRequired: true,
    maxAttendees: 500,
    currentAttendees: 234
  },
  {
    id: "2",
    title: "Youth Empowerment Summit",
    category: "Youth",
    date: "2026-03-22",
    time: "18:00 - 21:00",
    location: "824 Simunye Street, KwaMhlanga",
    price: "R50",
    ticketTypes: ["General Entry", "Early Bird"],
    attendanceTypes: ["In-Person"],
    image: require('@/assets/images/event-youth.png'),
    description: "A special gathering for young people focused on empowerment, leadership, and spiritual growth. Join us for dynamic worship, relevant teaching, and powerful connections.",
    registrationRequired: true,
    maxAttendees: 200,
    currentAttendees: 156
  },
  {
    id: "3",
    title: "Marriage Enrichment Seminar",
    category: "Fellowship",
    date: "2026-04-06",
    time: "14:00 - 17:00",
    location: "824 Simunye Street, KwaMhlanga",
    price: "R100 per couple",
    ticketTypes: ["Couple Pass"],
    attendanceTypes: ["In-Person", "Online"],
    image: require('@/assets/images/event-fellowship.png'),
    description: "Strengthen your marriage through biblical principles and practical guidance. This intimate seminar covers communication, conflict resolution, and building a Christ-centered marriage.",
    registrationRequired: true,
    maxAttendees: 50,
    currentAttendees: 42
  },
  {
    id: "4",
    title: "Easter Sunday Celebration",
    category: "Service",
    date: "2026-04-20",
    time: "10:00 - 13:00",
    location: "824 Simunye Street, KwaMhlanga",
    price: "Free",
    ticketTypes: ["Free Entry"],
    attendanceTypes: ["In-Person", "Online"],
    image: require('@/assets/images/event-easter.png'),
    description: "Celebrate the resurrection of our Lord Jesus Christ with powerful worship, inspiring preaching, and joyful fellowship. All are welcome!",
    registrationRequired: false,
    maxAttendees: 1000,
    currentAttendees: 0
  }
];

export const DONATION_INFO = {
  bankDetails: {
    bank: "First National Bank",
    accountName: "Hope In Christ for All Nations Ministries",
    accountNumber: "62859217458",
    branchCode: "250655",
    accountType: "Cheque Account"
  },
  onlineGiving: {
    url: "https://www.hopeinchrist.org/give",
    platforms: ["PayPal", "PayFast", "SnapScan"]
  },
  givingOptions: [
    {
      title: "Tithe",
      description: "Giving 10% of your income as commanded in Malachi 3:10"
    },
    {
      title: "Offering", 
      description: "Freewill offering above and beyond your tithe"
    },
    {
      title: "Building Fund",
      description: "Contributing towards our church building project"
    },
    {
      title: "Missions",
      description: "Supporting our local and international mission work"
    }
  ]
};

export const DEPARTMENTS = [
  "Worship",
  "Ushering",
  "Youth Ministry",
  "Women Fellowship",
  "Men's Fellowship",
  "Children Ministry",
  "Catering Team",
  "Media Team",
  "Evangelism",
  "Pastors Fellowship",
  "Community Affairs",
  "Social Service"
];

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/hopeinchristforallnations",
  youtube: "https://www.youtube.com/@hopeinchrist",
  twitter: "https://x.com/HicfanMin",
  tiktok: "https://www.tiktok.com/@hopeinchrist",
  whatsapp: "https://wa.me/27XXXXXXXXXX"
};

export const CHAT_CHANNELS = [
  {
    id: "general",
    name: "General Fellowship",
    description: "Open discussions and community fellowship",
    icon: "chatbubbles",
    color: "#5B2C8E"
  },
  {
    id: "prayer",
    name: "Prayer Requests",
    description: "Share and receive prayer support",
    icon: "heart",
    color: "#C0392B"
  },
  {
    id: "testimonies",
    name: "Testimonies",
    description: "Share what God has done in your life",
    icon: "star",
    color: "#D4A017"
  },
  {
    id: "youth",
    name: "Youth Corner",
    description: "Discussions for our young people",
    icon: "people",
    color: "#2471A3"
  },
  {
    id: "bible-study",
    name: "Bible Study",
    description: "Discuss scripture and biblical topics",
    icon: "book",
    color: "#5B2C8E"
  }
];

