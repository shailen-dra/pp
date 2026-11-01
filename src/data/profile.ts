export const profile: {
  name: string;
  headline: string;
  roles: [string, string, string];
  bio: string;
  offTheClock: string;
  photo: string;
  cvUrl: string;
} = {
  name: 'Shailendra TBC_SURNAME',
  headline:
    'Front-end developer with 10+ years of experience, now shipping full-stack apps faster with AI-assisted development.',
  roles: [
    'Front-end developer, 10+ years',
    'Shopify & WordPress e-commerce and CRO',
    'Full-stack development with AI',
  ],
  bio: 'I have spent more than a decade turning designs into fast, accessible websites, starting with hand-coded front-ends and growing into Shopify and WordPress e-commerce. Today I build store integrations that lift conversion rates, and I use AI-assisted development to ship full-stack applications in less time without cutting corners on quality.',
  offTheClock: 'Off the clock, you will find me listening to music or following sports.',
  photo: '/photo.jpg',
  cvUrl: '/cv.pdf',
};

export const contact = {
  phone: '+977 9843679155',
  email: 'shailendra.matat@gmail.com',
  linkedin: 'TBC_LINKEDIN_URL',
  github: 'TBC_GITHUB_URL',
} as const satisfies {
  phone: '+977 9843679155';
  email: 'shailendra.matat@gmail.com';
  linkedin: string;
  github: string;
};

export const skillGroups: { title: string; items: string[] }[] = [
  { title: 'Hand-coded', items: ['HTML', 'CSS', 'JavaScript', 'Responsive builds'] },
  { title: 'Platforms', items: ['Shopify themes', 'Shopify apps & integrations', 'WordPress'] },
  { title: 'Conversion / CRO', items: ['Shopify CRO integrations', 'Checkout & funnel improvements'] },
  { title: 'Full-stack + AI', items: ['AI-assisted full-stack development', 'TBC_AI_TOOLS', 'TBC_FULLSTACK_TECH'] },
  { title: 'Design to code', items: ['Pixel-accurate builds from design files'] },
  { title: 'Tooling', items: ['Git', 'TBC_TOOLING'] },
];

export const experienceLabel = '10+ years';

export const journey: {
  period: string;
  tag: 'Work' | 'Education';
  title: string;
  org: string;
  description: string;
}[] = [
  {
    period: 'TBC_START – Present',
    tag: 'Work',
    title: 'TBC_MATAT_TITLE',
    org: 'Matat Nepal Web Applications Pvt. Ltd.',
    description:
      'Building e-commerce sites on WordPress and Shopify, plus web app integrations for conversion rate optimisation on Shopify.',
  },
  {
    period: '2014 – 2024',
    tag: 'Work',
    title: 'TBC_RAPID_TITLE',
    org: 'Rapid Web Solutions Pvt. Ltd., Kathmandu',
    description: 'Front-end development: designing sites and converting designs into working websites.',
  },
  {
    period: 'TBC_EDUCATION_PERIOD',
    tag: 'Education',
    title: 'TBC_EDUCATION_TITLE',
    org: 'TBC_EDUCATION_ORG',
    description: 'TBC_EDUCATION_DESCRIPTION',
  },
];
