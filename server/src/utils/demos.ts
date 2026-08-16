export const DEMO_PROJECTS = [
  {
    id: 'demo-romantic-glow',
    slug: 'demo-romantic-glow',
    userId: 'system-demo',
    title: 'Eternity of Us',
    subtitle: 'A walk through our golden days',
    theme: 'ROMANTIC_GLOW',
    status: 'PUBLISHED',
    personOneName: 'Julian',
    personTwoName: 'Sophia',
    occasion: 'Anniversary',
    startDate: new Date('2024-05-20T00:00:00.000Z'),
    coverImageUrl: '/images/demo/demo_romantic_glow.png',
    backgroundMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    heroConfig: {
      message: 'Happy Anniversary to the one who makes my heart skip a beat. Here is to our beautiful journey and a lifetime of shared laughter and love.',
      celebrateText: 'Celebrating 1 Year of Love',
      welcomePopupText: 'For My Beautiful Sophia... 🌹'
    },
    endingConfig: {
      title: 'Forever Yours',
      message: 'No matter where life takes us, my hand belongs in yours. Happy Anniversary!'
    },
    viewCount: 1240,
    publishedAt: new Date('2024-05-20T00:00:00.000Z'),
    createdAt: new Date('2024-05-20T00:00:00.000Z'),
    updatedAt: new Date('2024-05-20T00:00:00.000Z'),
    user: {
      id: 'system-demo',
      displayName: 'Mémoire Showcase',
      isSuspended: false,
      themeExpirations: {}
    },
    memories: [
      {
        id: 'demo-m1-romantic',
        projectId: 'demo-romantic-glow',
        title: 'Where We First Met',
        description: 'Under the warm cafe lights on a rainy Tuesday evening, a simple coffee turned into hours of endless conversation and the start of everything.',
        date: new Date('2024-05-20T00:00:00.000Z'),
        imageUrl: '/images/demo/demo_romantic_glow.png',
        emoji: '☕',
        sortOrder: 0
      },
      {
        id: 'demo-m2-romantic',
        projectId: 'demo-romantic-glow',
        title: 'The Promise',
        description: 'Surrounded by twinkling golden lights and the crisp winter air, we promised each other a lifetime of love, trust, and beautiful adventures.',
        date: new Date('2024-12-25T00:00:00.000Z'),
        imageUrl: '/images/demo/demo_romantic_glow.png',
        emoji: '💍',
        sortOrder: 1
      }
    ],
    galleryItems: [
      {
        id: 'demo-g1-romantic',
        projectId: 'demo-romantic-glow',
        mediaUrl: '/images/demo/demo_romantic_glow.png',
        mediaType: 'IMAGE',
        caption: 'Under the golden hour glow',
        sortOrder: 0
      }
    ],
    _count: { memories: 2, galleryItems: 1 }
  },
  {
    id: 'demo-cinematic-memories',
    slug: 'demo-cinematic-memories',
    userId: 'system-demo',
    title: 'La Vie En Rose',
    subtitle: 'Our story through a vintage lens',
    theme: 'CINEMATIC_MEMORIES',
    status: 'PUBLISHED',
    personOneName: 'Liam',
    personTwoName: 'Emma',
    occasion: 'Wedding',
    startDate: new Date('2023-08-15T00:00:00.000Z'),
    coverImageUrl: '/images/demo/demo_cinematic_memories.png',
    backgroundMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    heroConfig: {
      message: 'Our wedding was just the opening scene of a timeless cinematic classic. Thank you for being the perfect leading star of my life.',
      celebrateText: 'Our Dream Wedding',
      welcomePopupText: 'Our Cinematic Love Story 🎬'
    },
    endingConfig: {
      title: 'To the Next Chapter',
      message: 'May our days ahead be filled with dramatic joy, sweet moments, and timeless romance.'
    },
    viewCount: 852,
    publishedAt: new Date('2023-08-15T00:00:00.000Z'),
    createdAt: new Date('2023-08-15T00:00:00.000Z'),
    updatedAt: new Date('2023-08-15T00:00:00.000Z'),
    user: {
      id: 'system-demo',
      displayName: 'Mémoire Showcase',
      isSuspended: false,
      themeExpirations: {}
    },
    memories: [
      {
        id: 'demo-m1-cinematic',
        projectId: 'demo-cinematic-memories',
        title: 'The Dream Begins',
        description: 'A cinematic capture of our special day, where time stood completely still and we danced under a canopy of warm fairy lights.',
        date: new Date('2023-08-15T00:00:00.000Z'),
        imageUrl: '/images/demo/demo_cinematic_memories.png',
        emoji: '🎞',
        sortOrder: 0
      },
      {
        id: 'demo-m2-cinematic',
        projectId: 'demo-cinematic-memories',
        title: 'Chasing Sunsets',
        description: 'Driving along the coast with the warm summer wind in our hair, mapping our future dreams against the golden horizon.',
        date: new Date('2024-01-01T00:00:00.000Z'),
        imageUrl: '/images/demo/demo_cinematic_memories.png',
        emoji: '🌅',
        sortOrder: 1
      }
    ],
    galleryItems: [
      {
        id: 'demo-g1-cinematic',
        projectId: 'demo-cinematic-memories',
        mediaUrl: '/images/demo/demo_cinematic_memories.png',
        mediaType: 'IMAGE',
        caption: 'A timeless frame',
        sortOrder: 0
      }
    ],
    _count: { memories: 2, galleryItems: 1 }
  },
  {
    id: 'demo-aurora-dreams',
    slug: 'demo-aurora-dreams',
    userId: 'system-demo',
    title: 'Dancing in the Sky',
    subtitle: 'Under the mystical northern lights',
    theme: 'AURORA_DREAMS',
    status: 'PUBLISHED',
    personOneName: 'Oliver',
    personTwoName: 'Isabella',
    occasion: 'Proposal',
    startDate: new Date('2025-02-14T00:00:00.000Z'),
    coverImageUrl: '/images/demo/demo_aurora_dreams.png',
    backgroundMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    heroConfig: {
      message: 'Underneath the vibrant dancing hues of the aurora borealis, saying YES was the most magical highlight of my entire life.',
      celebrateText: 'She Said Yes!',
      welcomePopupText: 'Under the Northern Lights... 🌌'
    },
    endingConfig: {
      title: 'Written in the Aurora',
      message: 'Like the ethereal lights, our love is a glowing mystery that lights up even the darkest skies.'
    },
    viewCount: 620,
    publishedAt: new Date('2025-02-14T00:00:00.000Z'),
    createdAt: new Date('2025-02-14T00:00:00.000Z'),
    updatedAt: new Date('2025-02-14T00:00:00.000Z'),
    user: {
      id: 'system-demo',
      displayName: 'Mémoire Showcase',
      isSuspended: false,
      themeExpirations: {}
    },
    memories: [
      {
        id: 'demo-m1-aurora',
        projectId: 'demo-aurora-dreams',
        title: 'Under Ethereal Lights',
        description: 'As the purple and green lights danced gracefully across the arctic sky, we took our first step towards forever.',
        date: new Date('2025-02-14T00:00:00.000Z'),
        imageUrl: '/images/demo/demo_aurora_dreams.png',
        emoji: '✨',
        sortOrder: 0
      }
    ],
    galleryItems: [
      {
        id: 'demo-g1-aurora',
        projectId: 'demo-aurora-dreams',
        mediaUrl: '/images/demo/demo_aurora_dreams.png',
        mediaType: 'IMAGE',
        caption: 'Magic in the air',
        sortOrder: 0
      }
    ],
    _count: { memories: 1, galleryItems: 1 }
  },
  {
    id: 'demo-celestial-birthday',
    slug: 'demo-celestial-birthday',
    userId: 'system-demo',
    title: 'Wishes on a Star',
    subtitle: 'Happy Birthday to my universe',
    theme: 'CELESTIAL_BIRTHDAY',
    status: 'PUBLISHED',
    personOneName: 'Aria',
    personTwoName: 'Leo',
    occasion: 'Birthday',
    startDate: new Date('2026-05-24T00:00:00.000Z'),
    coverImageUrl: '/images/demo/demo_celestial_birthday.png',
    backgroundMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    heroConfig: {
      message: 'Wishing the happiest of birthdays to my favorite star. You illuminate my entire universe with your bright laugh and warm soul.',
      celebrateText: 'Happy Birthday to My Universe 🎂',
      welcomePopupText: 'A Special Birthday Wish for You 🌟',
      letterMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      useDifferentLetterText: true,
      letterMessage: 'My dearest Leo, on this beautiful day, I want to remind you of how much you are loved. May the stars align to grant all your deepest dreams and hopes today!'
    },
    endingConfig: {
      title: 'Forever & Always',
      message: 'Blow out the candles, make your wish, and know that you are my absolute favorite blessing.'
    },
    viewCount: 2043,
    publishedAt: new Date('2026-05-24T00:00:00.000Z'),
    createdAt: new Date('2026-05-24T00:00:00.000Z'),
    updatedAt: new Date('2026-05-24T00:00:00.000Z'),
    user: {
      id: 'system-demo',
      displayName: 'Mémoire Showcase',
      isSuspended: false,
      themeExpirations: {}
    },
    memories: [
      {
        id: 'demo-m1-celestial',
        projectId: 'demo-celestial-birthday',
        title: 'The Magic Candle',
        description: 'Blow out the candle, make a wish, and let the magical celestial stardust spark joy and warm dreams in your heart.',
        date: new Date('2026-05-24T00:00:00.000Z'),
        imageUrl: '/images/demo/demo_celestial_birthday.png',
        emoji: '🎂',
        sortOrder: 0
      }
    ],
    galleryItems: [
      {
        id: 'demo-g1-celestial',
        projectId: 'demo-celestial-birthday',
        mediaUrl: '/images/demo/demo_celestial_birthday.png',
        mediaType: 'IMAGE',
        caption: 'Wishes written in the stars',
        sortOrder: 0
      }
    ],
    _count: { memories: 1, galleryItems: 1 }
  },
  {
    id: 'demo-sweet-diary',
    slug: 'demo-sweet-diary',
    userId: 'system-demo',
    title: 'My Sweet Diary',
    subtitle: 'A little gift, wrapped with love 🎁',
    theme: 'SWEET_DIARY',
    status: 'PUBLISHED',
    personOneName: 'Sofia',
    personTwoName: 'Mia',
    occasion: 'Birthday',
    startDate: new Date('2026-08-16T00:00:00.000Z'),
    coverImageUrl: '/images/demo/demo_sweet_diary.png',
    backgroundMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    heroConfig: {
      passcode: '1234',
      message: 'Happy Birthday, Mia! This little diary holds all the reasons why you are my favourite person in the entire universe. Open each section and feel all the love! 💕',
      celebrateText: 'Happy Birthday Mia! 🎂',
      welcomePopupText: 'A Sweet Gift Just For You 🎀',
      awardTitle: 'Lifetime Bestie Award',
      awardDescription: 'Presented to Mia for being the most beautiful, kind-hearted and funniest human being I have ever had the privilege of calling my best friend.',
      jarReasons: [
        'Your contagious laughter',
        'How you always know what to say',
        'Our late night conversations',
        'Your kind and warm heart',
        'The way you light up every room',
        'Our adventures together',
        'How you make everything fun',
        'Your genuine smile'
      ],
      loveLetterText: 'My dearest Mia, on your special day, I want you to know that knowing you has been one of the greatest gifts of my life. You are sunshine on a cloudy day, laughter in a quiet room, and warmth in the coldest winter. Happy Birthday to the most wonderful person I know. With all my love forever.',
      vinylSong: 'Happy Birthday',
      vinylArtist: 'With Love, Sofia'
    },
    endingConfig: {
      title: 'Happy Birthday! 🎉',
      message: 'May your day be as magical and beautiful as you are. Love you always!'
    },
    viewCount: 512,
    publishedAt: new Date('2026-08-16T00:00:00.000Z'),
    createdAt: new Date('2026-08-16T00:00:00.000Z'),
    updatedAt: new Date('2026-08-16T00:00:00.000Z'),
    user: {
      id: 'system-demo',
      displayName: 'Mémoire Showcase',
      isSuspended: false,
      themeExpirations: {}
    },
    memories: [
      {
        id: 'demo-m1-sweet-diary',
        projectId: 'demo-sweet-diary',
        title: 'The Day We Met',
        description: 'A friendship that changed everything. From that first day, I knew you were going to be someone very special in my life.',
        date: new Date('2022-06-01T00:00:00.000Z'),
        imageUrl: '/images/demo/demo_sweet_diary.png',
        emoji: '🌸',
        sortOrder: 0
      },
      {
        id: 'demo-m2-sweet-diary',
        projectId: 'demo-sweet-diary',
        title: 'Our Best Adventure',
        description: 'That road trip we planned last minute turned into the most beautiful memory I have ever made.',
        date: new Date('2023-12-20T00:00:00.000Z'),
        imageUrl: '/images/demo/demo_sweet_diary.png',
        emoji: '🗺️',
        sortOrder: 1
      },
      {
        id: 'demo-m3-sweet-diary',
        projectId: 'demo-sweet-diary',
        title: 'Laughing Until We Cried',
        description: 'There are moments in life you wish could last forever. This was definitely one of them.',
        date: new Date('2024-03-15T00:00:00.000Z'),
        imageUrl: '/images/demo/demo_sweet_diary.png',
        emoji: '😂',
        sortOrder: 2
      }
    ],
    galleryItems: [
      {
        id: 'demo-g1-sweet-diary',
        projectId: 'demo-sweet-diary',
        mediaUrl: '/images/demo/demo_sweet_diary.png',
        mediaType: 'IMAGE',
        caption: 'Us, always 💕',
        sortOrder: 0
      }
    ],
    _count: { memories: 3, galleryItems: 1 }
  }
];

export function findDemoProject(slug: string) {
  return DEMO_PROJECTS.find(p => p.slug === slug);
}
