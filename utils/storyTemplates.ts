// Local Premium Storytelling Engine (V3 Phase 4) - 100% Client-Side

export type RelationshipType =
  | 'girlfriend'
  | 'boyfriend'
  | 'bestfriend'
  | 'husband'
  | 'wife'
  | 'mother'
  | 'father'
  | 'brother'
  | 'sister'
  | 'son'
  | 'daughter'
  | 'other';

export interface StoryInput {
  toName: string;
  fromName: string;
  relationship: RelationshipType;
  personalMessage: string;
}

// 1. 100+ Premium Emotional Quotes
export const PREMIUM_QUOTES = [
  "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
  "You don't love someone for their looks, or their clothes, or for their fancy car, but because they sing a song only you can hear.",
  "I would rather share one lifetime with you than face all the ages of this world alone.",
  "We are all travelers in the wilderness of this world, and the best we can find in our travels is an honest friend.",
  "The best and most beautiful things in this world cannot be seen or even heard, but must be felt with the heart.",
  "To the world you may be one person, but to one person you are the world.",
  "A parent's love is whole no matter how many times divided.",
  "There is no love like the love for a child. It is a promise that stays forever.",
  "A sibling is a lens through which you see your childhood, and a mirror that reflects your growth.",
  "Friendship is the golden thread that ties the heart of all the world.",
  "Where there is great love, there are always miracles.",
  "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.",
  "Life is a flower of which love is the honey.",
  "You are my sun, my moon, and all my stars.",
  "The heart has its reasons which reason knows nothing of.",
  "If I had a flower for every time I thought of you... I could walk through my garden forever.",
  "To be loved deeply by someone gives you strength, while loving someone deeply gives you courage.",
  "True friendship comes when the silence between two people is comfortable.",
  "The love we give away is the only love we keep.",
  "A happy marriage is a long conversation which always seems too short.",
  "You are the poem I never knew how to write, and this life is the story I always wanted to tell.",
  "In the book of life, the best chapters are the ones we wrote together.",
  "Some people make the world special just by being in it.",
  "A mother is she who can take the place of all others but whose place no one else can take.",
  "A father is neither an anchor to hold us back, nor a sail to take us there, but a guiding light whose love shows us the way.",
  "Siblings: children of the same family, the same blood, with the same first associations and habits.",
  "What is a friend? A single soul dwelling in two bodies.",
  "The only path to a friend is to be one.",
  "Time scales back, miles fade, but the heart remembers the exact frequency of your smile.",
  "Every once in a while, in the middle of an ordinary life, love gives us a fairy tale.",
  "The greatest happiness of life is the conviction that we are loved.",
  "A daughter is a bundle of firsts that excite and delight, giggles from deep within, and a constant ray of sunshine.",
  "A son is a promise that a family will always have a protector, a dreamer, and a source of quiet pride.",
  "You are the finest, loveliest, tenderest, and most beautiful person I have ever known.",
  "May you live all the days of your life.",
  "We love because it's the only true adventure.",
  "Grow old along with me! The best is yet to be.",
  "I look at you and see the rest of my life in your eyes.",
  "For it was not into my ear you whispered, but into my heart.",
  "The real act of marriage takes place in the heart, not in the ballroom.",
  "There is no security in this life, only opportunity for love.",
  "Home is wherever you are.",
  "A child's hand in yours is a reminder of what truly matters in this vast universe.",
  "To walk with you in the rain is to walk in a field of stardust.",
  "Let us always meet each other with a smile, for the smile is the beginning of love.",
  "The stars are not afraid of the night; they are there to guide us home.",
  "The best portion of a good man's life is his little, nameless, unremembered acts of kindness and love.",
  "Two souls with but a single thought, two hearts that beat as one.",
  "A friend is someone who knows all about you and still loves you.",
  "Love is the master key that opens the gates of happiness.",
  "There are far, far better things ahead than any we leave behind.",
  "You are my heart, my life, my one and only thought.",
  "Blessed is the influence of one true, loving human soul on another.",
  "A brother is a friend given by nature.",
  "A sister is a gift to the heart, a friend to the spirit, a golden thread to the meaning of life.",
  "No love is greater than that of a father for his children.",
  "The memories we make are our only true inheritance.",
  "It is the quiet moments, not the loud ones, that define our devotion.",
  "We did not realize we were making memories, we just knew we were having fun.",
  "You make me want to be a better person.",
  "The heart of a mother is a deep abyss at the bottom of which you will always find forgiveness.",
  "A child enters your home and makes so much noise for twenty years... then leaves it so quiet you think you will go mad.",
  "Children are the anchors that hold a mother to life.",
  "Let us cherish the dreamers, for they see the world with love.",
  "A single rose can be my garden... a single friend, my world.",
  "Count your age by friends, not years. Count your life by smiles, not tears.",
  "Age is merely the number of years the world has been enjoying you.",
  "The older I get, the more I realize that love is the only thing that lasts.",
  "Your light is a guide in my darkest nights.",
  "If you live to be a hundred, I want to live to be a hundred minus one day so I never have to live without you.",
  "True love is quiet, true love is steady, true love is forever.",
  "Every day spent with you is my favorite day.",
  "You are my favorite place to go when my mind searches for peace.",
  "Our paths crossed for a reason, and every day since has been a gift.",
  "A parent's pride is silent but runs deeper than the oceans.",
  "The bond that links your true family is not one of blood, but of respect and joy in each other's life.",
  "We don't remember days, we remember moments.",
  "The light of your smile is the soundtrack to my happiest memories.",
  "I wish I could turn back the clock... I'd find you sooner and love you longer.",
  "No matter where I go, my heart always finds its way back to you.",
  "You are the horizon that inspires me to keep walking.",
  "To love is to find your own wealth in the happiness of another.",
  "A faithful friend is a strong defense.",
  "The best mirror is an old friend.",
  "Nothing makes the earth seem so spacious as to have friends at a distance; they make the latitudes and longitudes.",
  "May the wind always be at your back and the sun upon your face.",
  "You carry my heart in yours, today and all the days hereafter.",
  "A sister shares childhood memories and grown-up dreams.",
  "A brother is a shield against the winds of the world.",
  "Happiness is only real when shared.",
  "Your kindness is a quiet force that makes the world a softer place.",
  "Your laughter is my favorite song in the key of joy.",
  "May your heart be light and your days be bright.",
  "You have a place in my heart no one else could ever fill.",
  "Life's greatest luxury is the presence of those who truly understand us.",
  "Your presence is a reminder that there is beauty in this world.",
  "To have known you is to have known grace.",
  "May your path be paved with stardust and golden sunbeams.",
  "No horizon is too far when we walk together.",
  "I am so grateful to share this orbit around the sun with you.",
  "Wishing you a lifetime of quiet magic, deep laughter, and absolute love."
];

// 2. Randomized Photo Captions
export const PHOTO_CAPTIONS = [
  "A memory I'll always treasure.",
  "Our happiest moment.",
  "Smiles that never fade.",
  "Forever unforgettable.",
  "A glance that speaks volumes.",
  "Moments frozen in love.",
  "In this quiet moment, everything was perfect.",
  "Laughter that echoed in our hearts.",
  "A beautiful page in our story.",
  "With you, every place feels like home.",
  "Simple days, infinite smiles.",
  "The stardust in our ordinary days.",
  "Captured heartbeats.",
  "A day of absolute serenity.",
  "Our favorite chapter."
];

// 3. Premium Section Titles
export const SECTION_TITLES = {
  taglines: ["Visual Archives", "Moments that Matter", "Chronicles of Us", "Quiet Wonders", "Silent Heartbeats"],
  headings: ["Our Journey", "Beautiful Moments", "Memories Forever", "A Story Worth Remembering", "Moments That Matter", "Chapters of Affection"]
};

// 4. Randomized Ending Messages
export const ENDING_MESSAGES = [
  "Happy Birthday ❤️",
  "Forever Yours",
  "With Love",
  "Always Together",
  "Never Stop Smiling",
  "To Infinite Chapters Ahead",
  "Blessed to Have You",
  "In Love and Gratitude"
];

// 5. 20 Premium Templates per Relationship Option (Local Story Engine)
const TEMPLATE_COMPONENTS: Record<RelationshipType, {
  openings: string[];
  memories: string[];
  emotions: string[];
  wishes: string[];
}> = {
  girlfriend: {
    openings: [
      "To the one who turned my ordinary world into a beautiful love story.",
      "To my favorite person, my partner, and the stardust in my days.",
      "To the beautiful girl who holds my heart in her hands.",
      "To the most radiant soul I have ever crossed paths with.",
      "To the girl whose smile rewrite my entire day.",
      "To my love, my sanctuary, and my anchor.",
      "To the one whose laugh makes my universe feel smaller and warmer.",
      "To the most graceful girl in this entire world.",
      "To my dream come true, my best chapter, and my love.",
      "To the one who makes every sunrise feel like a personalized gift.",
      "To my heart's one and only muse.",
      "To the beautiful person who makes my life feel like cinema.",
      "To the girl whose presence is my favorite place on earth.",
      "To the starlight that guides me through the darkest nights.",
      "To my partner in laughter, love, and endless adventures.",
      "To the girl who taught me what true devotion looks like.",
      "To the owner of the most beautiful eyes and the kindest heart.",
      "To my home, my favorite song, and my tomorrow.",
      "To the girl who completes every single thought of mine.",
      "To the one who makes loving feel as effortless as breathing."
    ],
    memories: [
      "I still trace back to the first conversation we shared, knowing immediately that my life had changed forever.",
      "From the quiet car rides under city lights to the simple joy of sharing coffee, every moment with you is precious.",
      "I love looking back at the gallery of our shared days, marveling at how naturally you fit into my life.",
      "Every small adventure we embarked on, every inside joke we whispered, remains etched in my memory.",
      "Whether we are exploring new horizons or just sitting in comfortable silence, I am happiest beside you."
    ],
    emotions: [
      "Your compassion, grace, and laughter are the things that make my world a softer, brighter place.",
      "You inspire me to be kinder, dream bigger, and love with everything I have.",
      "The way you care for the people around you is nothing short of magic.",
      "I find myself constantly in awe of your strength, your gentle spirit, and your absolute brilliance.",
      "My devotion to you is steady, deep, and grows stronger with every orbit around the sun."
    ],
    wishes: [
      "May this birthday bring you the absolute happiness, quiet peace, and stardust you deserve.",
      "I wish you a year filled with grand adventures, silent serenity, and dreams coming to fruition.",
      "May your path ahead be paved with golden sunbeams and laughter that never ends.",
      "Wishing you the happiest birthday of all, and promising to stand by you for all the chapters to come.",
      "May your heart be light, your days be bright, and your dreams be realized."
    ]
  },
  boyfriend: {
    openings: [
      "To the man who makes my universe feel safe, warm, and complete.",
      "To my favorite partner, my anchor, and the stardust in my days.",
      "To my protector, my best friend, and my love.",
      "To the one whose presence makes every challenge feel small.",
      "To the guy who makes my heart skip a beat with just a look.",
      "To my constant support, my home, and my favorite tomorrow.",
      "To the one who brings absolute joy and structure into my life.",
      "To my rock, my greatest adventure, and my love.",
      "To the man whose laughter is the soundtrack to my happiest moments.",
      "To my favorite chapter, my compass, and my best decision.",
      "To my champion, my confidant, and my partner in crime.",
      "To the one who holds my hand and makes me feel like we can conquer the world.",
      "To the most handsome, kind, and brilliant soul.",
      "To my favorite place to run to when my mind seeks peace.",
      "To the guy who makes everyday life feel like a romantic movie.",
      "To the starlight in my sky and the warmth in my winter.",
      "To the one who makes my life feel infinitely richer.",
      "To the keeper of my secrets and my heart.",
      "To the man who makes me smile even on the rainiest days.",
      "To the one who completes every dream of mine."
    ],
    memories: [
      "I look back at the day we met, and I'm filled with gratitude for the beautiful path we've walked since.",
      "From the late-night drives filled with music to the quiet, simple mornings, you make every second count.",
      "I cherish the memory of our first adventure together, and how easy it felt to just be ourselves.",
      "Every laugh we shared, every hurdle we crossed together, has only made our bond unbreakable.",
      "Sitting beside you on quiet days is my absolute favorite memory in the making."
    ],
    emotions: [
      "Your strength, your humor, and your unwavering support mean the world to me.",
      "You make me want to be better, stand taller, and love deeper.",
      "I am constantly inspired by your dedication, your kind heart, and your quiet wisdom.",
      "You have this effortless way of making everything better just by being there.",
      "Loving you is my favorite story, and I can't wait to write the rest of the book with you."
    ],
    wishes: [
      "Wishing you a birthday that is as grand, happy, and unforgettable as you are.",
      "May this year bring you closer to all your ambitions, goals, and quiet dreams.",
      "I wish you endless reasons to smile, sound sleep, and success in everything you do.",
      "May your birthday start a chapter of absolute joy, health, and fulfillment.",
      "Wishing you the happiest birthday, and promising to celebrate you today and always."
    ]
  },
  bestfriend: {
    openings: [
      "To my absolute favorite human, my partner in crime, and my sister/brother from another mother.",
      "To my best friend, my therapist, and my favorite distraction.",
      "To the one who knows all my secrets and still chooses to hang out with me.",
      "To the keeper of my funniest memories and deepest late-night talks.",
      "To the one who makes every single gathering ten times better.",
      "To the sibling I got to choose for myself.",
      "To the one who has seen me at my best and survived me at my worst.",
      "To my favorite human to text at 2 AM.",
      "To the one who makes absolute nonsense feel completely logical.",
      "To my anchor in this chaotic world, my best friend.",
      "To my ride or die, my accomplice, and my favorite soul.",
      "To the one who can make me laugh with a single look.",
      "To the most loyal, hilarious, and brilliant person I know.",
      "To my favorite co-pilot on this wild journey of life.",
      "To the one who always has my back, no matter what.",
      "To the person who makes me feel completely understood.",
      "To the star of my funniest snapchats and happiest days.",
      "To my sounding board, my supporter, and my best friend.",
      "To the one whose presence is like a warm blanket on a cold day.",
      "To the one who brings out the absolute best in me."
    ],
    memories: [
      "From the countless times we ended up laughing until our stomachs hurt to the quiet moments we just listened.",
      "I'll always remember that time we did that completely crazy thing and survived to tell the story.",
      "Looking back at the years of our friendship, I am so grateful for all the chapters we've written.",
      "Every road trip, every inside joke, and every silent look we shared is a treasure in my life.",
      "We've made so many memories that it's hard to pick a favorite, but today is definitely up there."
    ],
    emotions: [
      "Your loyalty, your insane sense of humor, and your warm heart make you the best friend anyone could ask for.",
      "Life is just better, funnier, and more colorful with you around.",
      "I know I can always count on you, and that is the greatest comfort in the world.",
      "You inspire me with your resilience, your kindness, and your absolute authenticity.",
      "I hope you know how much I value your presence in my life — you're genuinely family."
    ],
    wishes: [
      "May your birthday be filled with endless cake, grand laughs, and memories to share.",
      "I wish you a year of absolute success, sound sleep, and zero drama.",
      "May all your wildest dreams, goals, and secret wishes come true this year.",
      "Wishing you the happiest birthday of all, and another year of making absolute memories together.",
      "May your day be as spectacular, funny, and beautiful as you are."
    ]
  },
  husband: {
    openings: [
      "To my partner in life, my favorite hello, and my hardest goodbye.",
      "To my husband, my rock, and my home.",
      "To the one who makes marriage feel like the best decision ever.",
      "To the guy who makes my heart skip a beat even after all this time.",
      "To my best friend, my protector, and my love.",
      "To the one who makes our home a sanctuary of love and laughter.",
      "To the man who completes every single thought of mine.",
      "To my rock, my greatest adventure, and my handsome husband.",
      "To my anchor in this wild storm of life.",
      "To the one who makes every single day worth living.",
      "To my teammate, my counselor, and my favorite human.",
      "To the most loyal, loving, and brilliant husband.",
      "To the one who holds our family together with quiet strength.",
      "To the starlight in my sky and the keeper of my heart.",
      "To the one whose hug makes all my worries dissolve.",
      "To the guy who keeps our love fresh, happy, and forever steady.",
      "To the partner of my dreams and the keeper of my promises.",
      "To the man who makes every sunrise feel like a fresh start.",
      "To my favorite co-pilot, my lover, and my friend.",
      "To the one who holds my hand and walks with me through everything."
    ],
    memories: [
      "I look back at the vows we shared, and I'm filled with pride at how beautifully we've kept them.",
      "From the quiet evenings cooking together to our grand adventures, you make every memory cinematic.",
      "I cherish the memory of building our home, our dreams, and our life together step by step.",
      "Every laugh we shared, every hurdle we crossed, has only made our bond stronger and deeper.",
      "Sitting beside you on a quiet evening is my favorite place in the entire world."
    ],
    emotions: [
      "Your strength, your quiet dedication, and your warm heart make me fall in love with you more every day.",
      "I am so proud of the man you are, and the husband you choose to be.",
      "You make me feel safe, cherished, and completely understood.",
      "Your love is the anchor that keeps our family steady through every wave.",
      "Devoted to you yesterday, loving you today, and excited for all our tomorrows."
    ],
    wishes: [
      "Wishing my wonderful husband the happiest, healthiest, and most fulfilling birthday.",
      "May this year bring you closer to all your ambitions, goals, and quiet dreams.",
      "I wish you endless reasons to smile, sound sleep, and success in all your endeavors.",
      "May your day be filled with the same warmth and love you bring to our home.",
      "Wishing you the happiest birthday, and promising to love you more in the chapters ahead."
    ]
  },
  wife: {
    openings: [
      "To the queen of my heart, my partner in life, and my best decision.",
      "To my wife, my sanctuary, and my anchor.",
      "To the one who makes our house a home and my life a love story.",
      "To the beautiful woman who holds my heart in her hands.",
      "To my best friend, my guide, and my favorite love.",
      "To the one whose smile can rewrite my entire day.",
      "To the girl of my dreams who became the wife of my life.",
      "To my anchor, my favorite chapter, and my beautiful wife.",
      "To the one whose laugh makes our home feel warm and full of light.",
      "To my partner in laughter, love, and endless adventures.",
      "To the most loyal, loving, and brilliant wife in this world.",
      "To the one who completes every single thought of mine.",
      "To my rock, my greatest adventure, and my love.",
      "To the starlight that guides me through the darkest nights.",
      "To the mother of our joy and the queen of our home.",
      "To the one who makes loving feel as natural as breathing.",
      "To the most graceful woman in this entire world.",
      "To my home, my favorite song, and my tomorrow.",
      "To the keeper of my secrets and my heart.",
      "To the one who holds my hand and walks with me through everything."
    ],
    memories: [
      "I trace back to the day we stood together and promised our lives, and my heart is filled with gratitude.",
      "From the quiet cups of tea we share to our grand adventures, you make every second count.",
      "I cherish the memory of building our life, our dreams, and our family together step by step.",
      "Every laugh we shared, every hurdle we crossed together, has only made our bond unbreakable.",
      "Sitting beside you on quiet days is my absolute favorite place on earth."
    ],
    emotions: [
      "Your grace, your boundless compassion, and your warm heart make you the best wife anyone could ask for.",
      "You make me want to be better, stand taller, and love with everything I have.",
      "I am constantly in awe of your strength, your gentle spirit, and your absolute brilliance.",
      "Your love is the anchor that keeps our home steady through every wave.",
      "My devotion to you is steady, deep, and grows stronger with every orbit around the sun."
    ],
    wishes: [
      "Wishing my beautiful wife a birthday filled with absolute happiness, peace, and stardust.",
      "May this year bring you closer to all your ambitions, goals, and quiet dreams.",
      "I wish you endless reasons to smile, sound sleep, and success in everything you do.",
      "May your day be as spectacular, warm, and beautiful as you are.",
      "Wishing you the happiest birthday, and promising to stand by you for all the chapters to come."
    ]
  },
  mother: {
    openings: [
      "To the woman who gave me everything, my mother, my first guide.",
      "To my mother, my constant support, and my anchor.",
      "To the one whose love has been a steady shield my entire life.",
      "To the keeper of my childhood memories and keeper of my heart.",
      "To the woman whose grace, patience, and warmth shaped who I am.",
      "To my mother, my teacher, and my favorite blessing.",
      "To the heart of our family, our source of warmth and light.",
      "To the one who knows me best and loves me unconditionally.",
      "To my first home, my guide, and my dearest mother.",
      "To the most resilient, loving, and beautiful mother.",
      "To the one who always put my happiness before her own.",
      "To the keeper of our family traditions and our quiet peace.",
      "To the one whose hugs can dissolve any worry or stress.",
      "To my mother, my champion, and my inspiration.",
      "To the one who taught me how to walk, dream, and love.",
      "To the beautiful soul who made my childhood a garden of joy.",
      "To the woman whose silent sacrifices created my future.",
      "To my mother, my confidant, and my favorite voice.",
      "To the one who always has a warm word and a prayer for me.",
      "To the most loyal, loving, and graceful mother in this world."
    ],
    memories: [
      "I look back at the years of my childhood, realizing now the depth of the love you poured into every day.",
      "From the quiet bedtime stories to the warm meals and comforting words, you made my world safe.",
      "I cherish the memory of your encouragement when I wanted to give up, and your pride when I succeeded.",
      "Every advice you gave, every silent sacrifice you made, has become a pillar in my life.",
      "Whether we are talking for hours or just sitting in comfortable silence, I am grateful for you."
    ],
    emotions: [
      "Your grace, your boundless compassion, and your warm heart are the greatest gifts I have received.",
      "You make me want to be better, live kinder, and stand taller in this world.",
      "I am constantly in awe of your strength, your gentle spirit, and your absolute dedication.",
      "Your love is the anchor that has kept our family steady through every season.",
      "I hope you know how deeply you are loved, respected, and cherished today and always."
    ],
    wishes: [
      "Wishing you a birthday that is as peaceful, happy, and beautiful as your heart.",
      "May this year bring you excellent health, quiet peace, and joy in abundance.",
      "I wish you endless reasons to smile, sound sleep, and absolute comfort every day.",
      "May your day be filled with the same warmth and love you have always given to me.",
      "Wishing you the happiest birthday, and promising to make you proud in all the chapters to come."
    ]
  },
  father: {
    openings: [
      "To the man who showed me how to stand tall, my father, my guide.",
      "To my father, my counselor, and my constant anchor.",
      "To the one whose quiet strength has been my guidepost in life.",
      "To my father, my rock, and my protector.",
      "To the man who taught me the value of hard work, honesty, and kindness.",
      "To my father, my first hero, and my source of quiet pride.",
      "To the anchor of our family, whose wisdom directs our path.",
      "To the one who believed in me even when I struggled.",
      "To my father, my teacher, and my biggest supporter.",
      "To the most resilient, wise, and loving father.",
      "To the one whose silent sacrifices paved my way to success.",
      "To the keeper of our family strength and quiet peace.",
      "To the man whose advice is my compass when I'm lost.",
      "To my father, my role model, and my inspiration.",
      "To the one who taught me how to dream, build, and walk with integrity.",
      "To the strong, kind, and brilliant father.",
      "To the one whose hugs are rare but make all worries dissolve.",
      "To my father, my confidant, and my favorite voice of reason.",
      "To the one who always stands behind me, a steady shield.",
      "To the most loyal, loving, and wise father in this world."
    ],
    memories: [
      "I look back at the quiet lessons you taught me, realizing now how much they shaped my future.",
      "From the simple projects we built to our long drives and quiet talks, every second count.",
      "I cherish the memory of your steady hand on my shoulder when I had to face my fears.",
      "Every correction you gave, every vote of confidence you cast, has built the foundation of my life.",
      "Sitting beside you and learning from your experiences is my favorite privilege."
    ],
    emotions: [
      "Your strength, your quiet dedication, and your integrity are the qualities I admire most in this world.",
      "You make me want to be better, work harder, and stand taller in all I do.",
      "I am constantly inspired by your resilience, your kind heart, and your quiet wisdom.",
      "Your love is the anchor that has kept our family steady through every storm.",
      "I hope you know how deeply you are respected, loved, and cherished today and always."
    ],
    wishes: [
      "Wishing my wonderful father a birthday filled with absolute happiness, peace, and health.",
      "May this year bring you closer to all your quiet goals, hobbies, and dreams.",
      "I wish you endless reasons to smile, sound sleep, and absolute comfort every day.",
      "May your day be filled with the same warmth and respect you have always earned.",
      "Wishing you the happiest birthday, and promising to keep your lessons close in all chapters ahead."
    ]
  },
  brother: {
    openings: [
      "To my brother, my first partner in crime, and my constant friend.",
      "To my brother, my shield, and my favorite rival.",
      "To the one who has known me since childhood and still talks to me.",
      "To my accomplice in all the trouble we caused growing up.",
      "To the guy who is part bodyguard, part advisor, and all friend.",
      "To my sibling, my teammate, and my rock.",
      "To the one who has seen my best, tolerated my worst, and had my back.",
      "To my brother, my favorite sounding board, and my family.",
      "To the guy who makes childhood memories feel like a treasure chest.",
      "To my brother, my rival, and my protector.",
      "To my sibling who is genuinely my friend.",
      "To the one whose laugh can make any family gathering ten times better.",
      "To the most loyal, funny, and reliable brother.",
      "To the guy who holds the records of all our childhood secrets.",
      "To my brother, my co-pilot in this wild journey of life.",
      "To the one who knows exactly how to make me laugh or annoy me.",
      "To my brother, my champion, and my support.",
      "To the guy who stands beside me, a steady shield.",
      "To my brother, my counselor, and my favorite voice.",
      "To the most loyal and kind-hearted brother in this world."
    ],
    memories: [
      "From the days of playing games and sharing rooms to our grown-up talks, you make every memory count.",
      "I'll always remember our childhood adventures, and how we always had each other's backs.",
      "I cherish the memory of how we fought for the remote, yet stood together against the world.",
      "Every laugh we shared, every secret we kept from parents, has created an unbreakable bond.",
      "Looking back at our path, I am so glad I got to grow up beside you."
    ],
    emotions: [
      "Your loyalty, your strength, and your humor are the qualities I value most in you.",
      "Life is just better, funnier, and more secure with you around.",
      "I know I can always count on you, and that is a massive comfort in this world.",
      "I am constantly inspired by your progress, your dedication, and your kind heart.",
      "I hope you know how much I value your presence — you're genuinely my brother and friend."
    ],
    wishes: [
      "Wishing my brother a birthday filled with grand laughs, success, and endless joy.",
      "May this year bring you closer to all your ambitions, goals, and dreams.",
      "I wish you sound sleep, zero stress, and happiness in abundance.",
      "May your day be as spectacular, funny, and beautiful as you are.",
      "Wishing you the happiest birthday, and promising to always have your back, today and forever."
    ]
  },
  sister: {
    openings: [
      "To my sister, my first best friend, and my constant anchor.",
      "To my sister, my keeper of secrets, and my favorite critic.",
      "To the one who has known me since childhood and still loves me.",
      "To my accomplice in all the childhood drama and secret talks.",
      "To the girl who is part counselor, part guide, and all friend.",
      "To my sibling, my teammate, and my rock.",
      "To the one who has seen my best, survived my worst, and held my hand.",
      "To my sister, my favorite sounding board, and my family.",
      "To the girl who makes childhood memories feel like a garden of joy.",
      "To my sister, my rival, and my protector.",
      "To my sibling who is genuinely my friend.",
      "To the one whose laugh can make any family gathering ten times brighter.",
      "To the most loyal, funny, and graceful sister.",
      "To the girl who holds the records of all our childhood secrets.",
      "To my sister, my co-pilot in this wild journey of life.",
      "To the one who knows exactly how to make me laugh or comfort me.",
      "To my sister, my champion, and my support.",
      "To the girl who stands beside me, a steady shield.",
      "To my sister, my confidant, and my favorite voice.",
      "To the most loyal and kind-hearted sister in this world."
    ],
    memories: [
      "From the days of playing games and sharing rooms to our late-night chats, you make every second count.",
      "I'll always remember our childhood adventures, and how we always had each other's backs.",
      "I cherish the memory of how we fought over clothes, yet stood together against the world.",
      "Every laugh we shared, every secret we kept from parents, has created an unbreakable bond.",
      "Looking back at our path, I am so glad I got to grow up beside you."
    ],
    emotions: [
      "Your grace, your boundless compassion, and your humor are the qualities I value most in you.",
      "Life is just warmer, brighter, and more beautiful with you around.",
      "I know I can always count on you, and that is a massive comfort in this world.",
      "I am constantly inspired by your progress, your dedication, and your kind heart.",
      "I hope you know how much I value your presence — you're genuinely my sister and friend."
    ],
    wishes: [
      "Wishing my sister a birthday filled with stardust, grand laughs, and endless joy.",
      "May this year bring you closer to all your ambitions, goals, and dreams.",
      "I wish you sound sleep, zero stress, and happiness in abundance.",
      "May your day be as spectacular, warm, and beautiful as you are.",
      "Wishing you the happiest birthday, and promising to stand by you for all the chapters to come."
    ]
  },
  son: {
    openings: [
      "To my beloved son, my source of constant pride, and my greatest blessing.",
      "To my son, my dreamer, and my favorite tomorrow.",
      "To the boy who made me a parent and taught me how to love deeply.",
      "To the one who brings absolute light and energy into our home.",
      "To my son, my rock, and my source of quiet pride.",
      "To the guy who makes me smile even on the busiest days.",
      "To the most handsome, kind, and brilliant son.",
      "To my favorite partner in laughter and the stardust in my days.",
      "To my son, my teacher in patience, and my greatest joy.",
      "To my rock, my greatest adventure, and my handsome son.",
      "To my champion, my confidant, and my partner in crime.",
      "To the one who holds my hand and makes me feel like we can conquer everything.",
      "To the keeper of our family strength and quiet peace.",
      "To the guy who makes everyday life feel like a movie.",
      "To the starlight in my sky and the warmth in my winter.",
      "To the one who makes my life feel infinitely richer.",
      "To the keeper of my secrets and my heart.",
      "To the man who makes me smile even on the rainiest days.",
      "To the one who completes every dream of mine.",
      "To the son who grew into the most wonderful man."
    ],
    memories: [
      "I look back at the day you entered this world, and I'm filled with gratitude for the path we've walked since.",
      "From your first steps and giggles to your grown-up decisions, you make every second count.",
      "I cherish the memory of our first adventure together, and how easy it felt to just see you grow.",
      "Every laugh we shared, every hurdle we crossed together, has only made our bond unbreakable.",
      "Sitting beside you and watching you dream is my absolute favorite memory in the making."
    ],
    emotions: [
      "Your strength, your humor, and your unwavering support mean the world to me.",
      "You make me want to be better, stand taller, and love deeper.",
      "I am constantly inspired by your dedication, your kind heart, and your quiet wisdom.",
      "You have this effortless way of making everything better just by being there.",
      "Watching you grow is my favorite story, and I can't wait to see the rest of your path."
    ],
    wishes: [
      "Wishing my wonderful son a birthday that is as grand, happy, and unforgettable as you are.",
      "May this year bring you closer to all your ambitions, goals, and quiet dreams.",
      "I wish you endless reasons to smile, sound sleep, and success in everything you do.",
      "May your birthday start a chapter of absolute joy, health, and fulfillment.",
      "Wishing you the happiest birthday, and promising to celebrate you today and always."
    ]
  },
  daughter: {
    openings: [
      "To my beloved daughter, my source of constant pride, and my greatest blessing.",
      "To my daughter, my dreamer, and my favorite tomorrow.",
      "To the girl who made me a parent and taught me how to love deeply.",
      "To the one who brings absolute light and grace into our home.",
      "To my daughter, my rock, and my source of quiet pride.",
      "To the girl who makes me smile even on the busiest days.",
      "To the most beautiful, kind, and brilliant daughter.",
      "To my favorite partner in laughter and the stardust in my days.",
      "To my daughter, my teacher in patience, and my greatest joy.",
      "To my rock, my greatest adventure, and my beautiful daughter.",
      "To my champion, my confidant, and my partner in crime.",
      "To the one who holds my hand and makes me feel like we can conquer everything.",
      "To the keeper of our family strength and quiet peace.",
      "To the girl who makes everyday life feel like a movie.",
      "To the starlight in my sky and the warmth in my winter.",
      "To the one who makes my life feel infinitely richer.",
      "To the keeper of my secrets and my heart.",
      "To the girl who makes me smile even on the rainiest days.",
      "To the one who completes every dream of mine.",
      "To the daughter who grew into the most wonderful woman."
    ],
    memories: [
      "I look back at the day you entered this world, and I'm filled with gratitude for the path we've walked since.",
      "From your first steps and giggles to your grown-up decisions, you make every second count.",
      "I cherish the memory of our first adventure together, and how easy it felt to just see you grow.",
      "Every laugh we shared, every hurdle we crossed together, has only made our bond unbreakable.",
      "Sitting beside you and watching you dream is my absolute favorite memory in the making."
    ],
    emotions: [
      "Your grace, your humor, and your unwavering support mean the world to me.",
      "You make me want to be better, stand taller, and love deeper.",
      "I am constantly inspired by your dedication, your kind heart, and your quiet wisdom.",
      "You have this effortless way of making everything better just by being there.",
      "Watching you grow is my favorite story, and I can't wait to see the rest of your path."
    ],
    wishes: [
      "Wishing my wonderful daughter a birthday that is as grand, happy, and unforgettable as you are.",
      "May this year bring you closer to all your ambitions, goals, and quiet dreams.",
      "I wish you endless reasons to smile, sound sleep, and success in everything you do.",
      "May your birthday start a chapter of absolute joy, health, and fulfillment.",
      "Wishing you the happiest birthday, and promising to celebrate you today and always."
    ]
  },
  other: {
    openings: [
      "To an extraordinary person who brings light and warmth into my world.",
      "To my favorite guide, my anchor, and the stardust in my days.",
      "To a wonderful soul, my best friend, and my family.",
      "To the one whose presence makes every challenge feel small.",
      "To the one who makes my heart skip a beat with just a smile.",
      "To my constant support, my home, and my favorite tomorrow.",
      "To the one who brings absolute joy and structure into my life.",
      "To my rock, my greatest adventure, and my love.",
      "To the one whose laughter is the soundtrack to my happiest moments.",
      "To my favorite chapter, my compass, and my best decision.",
      "To my champion, my confidant, and my partner in crime.",
      "To the one who holds my hand and makes me feel like we can conquer the world.",
      "To the most kind, graceful, and brilliant soul.",
      "To my favorite place to run to when my mind searches for peace.",
      "To the one who makes everyday life feel like a movie.",
      "To the starlight in my sky and the warmth in my winter.",
      "To the one who makes my life feel infinitely richer.",
      "To the keeper of my secrets and my heart.",
      "To the one who makes me smile even on the rainiest days.",
      "To the one who completes every dream of mine."
    ],
    memories: [
      "I look back at the day we met, and I'm filled with gratitude for the path we've walked since.",
      "From the late-night talks filled with music to the quiet, simple moments, you make every second count.",
      "I cherish the memory of our first conversation, and how easy it felt to just be ourselves.",
      "Every laugh we shared, every hurdle we crossed together, has only made our bond unbreakable.",
      "Sitting beside you on quiet days is my absolute favorite memory in the making."
    ],
    emotions: [
      "Your strength, your humor, and your unwavering support mean the world to me.",
      "You make me want to be better, stand taller, and love deeper.",
      "I am constantly inspired by your dedication, your kind heart, and your quiet wisdom.",
      "You have this effortless way of making everything better just by being there.",
      "Loving you is my favorite story, and I can't wait to write the rest of the chapters with you."
    ],
    wishes: [
      "Wishing you a birthday that is as grand, happy, and unforgettable as you are.",
      "May this year bring you closer to all your ambitions, goals, and quiet dreams.",
      "I wish you endless reasons to smile, sound sleep, and success in everything you do.",
      "May your birthday start a chapter of absolute joy, health, and fulfillment.",
      "Wishing you the happiest birthday, and promising to stand by you in all chapters ahead."
    ]
  }
};

// 6. Intelligent Randomized Message Builder (No AI needed)
export function generateEmotionalStory(input: StoryInput): string {
  const cat = TEMPLATE_COMPONENTS[input.relationship] || TEMPLATE_COMPONENTS.other;

  // Stable random selection based on seed or simple array randomizer
  const selectRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const opening = selectRandom(cat.openings);
  const memory = selectRandom(cat.memories);
  const emotion = selectRandom(cat.emotions);
  const wish = selectRandom(cat.wishes);

  // Combine into a master multi-paragraph cinematic letter
  return `${opening}\n\n${memory}\n\n${emotion}\n\n${input.personalMessage}\n\n${wish}`;
}
