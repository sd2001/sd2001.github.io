/**
 * Single source of truth for every word of portfolio content.
 * Compiled from three resumes: the 3+YOE AI Backend resume (Sept 2026, canonical),
 * the 1.5+ YOE SDE resume, and the MS 2025 CV.
 */

export const profile = {
  name: 'Swarnabha Das',
  handle: 'sd2001',
  role: 'Software Engineer 2',
  tagline: 'Backend & AI Infrastructure',
  company: 'Parspec',
  location: 'Bangalore, India',
  email: 'im.swarnabha2001@gmail.com',
  blurb:
    'Backend engineer by trade. Six days a week in the gym, a guitar in the corner, and a camera roll that is mostly sunsets.',
};

export const socials = [
  { label: 'GitHub', handle: 'sd2001', url: 'https://github.com/sd2001', icon: 'github' },
  { label: 'LinkedIn', handle: 'swarnabhadas', url: 'https://linkedin.com/in/swarnabhadas', icon: 'linkedin' },
  { label: 'Email', handle: 'im.swarnabha2001@gmail.com', url: 'mailto:im.swarnabha2001@gmail.com', icon: 'mail' },
  { label: 'Medium', handle: '@im.swarnabha2001', url: 'https://medium.com/@im.swarnabha2001', icon: 'medium' },
  { label: 'X', handle: 'im_sd2001', url: 'https://twitter.com/im_sd2001', icon: 'x' },
  { label: 'Instagram', handle: '__swarnabha.d__', url: 'https://www.instagram.com/__swarnabha.d__/', icon: 'instagram' },
];

export type Bullet = { text: string; tags?: string[] };
export type Project = {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  bullets: Bullet[];
  stack: string[];
  /** Public GitHub repo, where one exists. Verified against the account, not guessed. */
  repo?: string;
  /** Shown instead of a link when there is no public repo. */
  repoNote?: string;
};

/** Why none of this is running live. */
export const projectsNote =
  'None of these are live anywhere, and that is a financial decision rather than a technical one. ' +
  'Keeping a pile of student hackathon projects awake on EC2 costs more every month than any of them ' +
  'ever won in prize money, so my wallet and I came to an arrangement. The code is on GitHub though, ' +
  'and it all still runs if you clone it.';

export type Role = {
  id: string;
  company: string;
  companyNote: string;
  title: string;
  period: string;
  location: string;
  current?: boolean;
  summary: string;
  groups: { heading: string; bullets: Bullet[] }[];
  stack: string[];
};

export const experience: Role[] = [
  {
    id: 'parspec',
    company: 'Parspec',
    companyNote: 'AI platform digitizing building-product data for electrical distributors and manufacturers',
    title: 'Software Engineer 2',
    period: 'Jan 2025 to now',
    location: 'Bangalore',
    current: true,
    summary: 'Promoted SE-1 to SE-2 in Feb 2026. I own search and the pipelines that feed it.',
    groups: [
      {
        heading: 'Crawler pipeline rebuild',
        bullets: [
          {
            text: 'Rebuilt the crawler that pulls 3M manufacturer datasheets every two to three weeks. Moved pipeline state out of Jira ticket statuses into Postgres and made it event-driven per PDF, so one bad file no longer forces a 10,000-product rerun.',
            tags: ['PostgreSQL', 'event-driven'],
          },
          {
            text: 'Re-platformed from fixed EC2 nodes onto EKS so stages scale on their own. Graviton sizing modelled about 35% lower cost.',
            tags: ['EKS', 'Graviton', '−35% cost'],
          },
        ],
      },
      {
        heading: 'Datasheet search and ingestion, ~1.4M product families',
        bullets: [
          {
            text: 'Turned manufacturer PDFs into a searchable catalogue across three Qdrant collections. Every page routes to the cheapest reader that can handle it, so a paid vision model only ever sees the hard ones.',
            tags: ['Qdrant', 'Docling', 'Qwen3-VL', 'Gemini'],
          },
          {
            text: 'Extraction runs at 0.906 macro-F1, with every PDF keyed by content hash so reruns repair rather than duplicate.',
            tags: ['0.906 macro-F1'],
          },
          {
            text: 'Made part-number search typo tolerant by indexing each code as overlapping three-character chunks, so a search for LC1D18B7 still finds LC1D18-B7.',
            tags: ['trigram'],
          },
        ],
      },
      {
        heading: 'Inventory search, 8.4M products',
        bullets: [
          {
            text: 'Built the search behind Crossing on a single Qdrant collection. Every query runs a 768-dim semantic vector and two BM25 keyword vectors at once, merged with Reciprocal Rank Fusion.',
            tags: ['hybrid search', 'RRF', 'BM25'],
          },
          {
            text: 'Every distributor gets its own HNSW graph inside that one index, and int8 compression with rescoring cut vector memory to about 25% at the same quality.',
            tags: ['HNSW', 'int8', '−75% memory'],
          },
          {
            text: 'Re-ranked the top 50 hits on GPU with a cross-encoder, with an LLM category classifier running alongside the search so it costs no extra wall-clock time.',
            tags: ['cross-encoder'],
          },
          {
            text: 'Translated the shorthand electricians actually type into the wording distributors store, so "16A 1 pole" matches products described a dozen different ways.',
            tags: ['query rewriting'],
          },
          {
            text: 'Migrated 7.1M live records from DynamoDB into Qdrant and keep the two in sync within seconds through change-data-capture.',
            tags: ['CDC', '7.1M records'],
          },
        ],
      },
      {
        heading: 'GPU serving, performance and cloud cost',
        bullets: [
          {
            text: 'Moved GPU inference from T4 onto L4 and converted the models to TensorRT/ONNX. Throughput rose enough to keep full FP32 instead of dropping to FP16 for latency.',
            tags: ['TensorRT', 'NVIDIA L4'],
          },
          {
            text: 'Cut p95 text extraction from 18.5s to 0.95s. The tail turned out to be memory fragmentation and OOM kills, not parsing.',
            tags: ['p95 18.5s → 0.95s'],
          },
          {
            text: 'Took about $2.6K a month off the cloud bill. It started as a $5,000 NAT charge with no attribution, so we tagged every service and read VPC flow logs until every dollar had an owner.',
            tags: ['−$2.6K/mo'],
          },
        ],
      },
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'DynamoDB', 'Qdrant', 'OpenSearch', 'Valkey', 'SQS/SNS', 'Lambda', 'EKS', 'PyTorch', 'TensorRT', 'Gemini', 'Qwen-VL'],
  },
  {
    id: 'pibit',
    company: 'Pibit.ai',
    companyNote: 'YC W21, unlocking insight from unstructured insurance and underwriting data',
    title: 'SDE-1, Backend and DevOps',
    period: 'Jan 2023 to Dec 2024',
    location: 'Bangalore',
    summary: 'Owned Lossrun, one of the insurance lines of business, end to end.',
    groups: [
      {
        heading: 'What I shipped',
        bullets: [
          {
            text: 'Integrated Lossrun and then owned it: the logic, the production server it ran on, and the AWS infra and CI/CD underneath.',
            tags: ['ownership'],
          },
          {
            text: 'Optimised the insurance data extraction pipeline by 18% and set up logging and error tracebacks so failures stopped being invisible.',
            tags: ['+18%'],
          },
          {
            text: 'Introduced multi-stage Docker builds for smaller images and graceful shutdown so deploys stopped dropping requests.',
            tags: ['Docker', 'Kubernetes'],
          },
          {
            text: 'Built PiEval from scratch, an analytics-driven testing framework that reported coverage for templates and APIs after every deploy. It replaced manual testing and saved up to three days per release.',
            tags: ['PiEval', '−3 days/release'],
          },
        ],
      },
    ],
    stack: ['Python', 'FastAPI', 'DynamoDB', 'PostgreSQL', 'AWS SQS', 'S3', 'Lambda', 'Kubernetes', 'CloudFormation'],
  },
  {
    id: 'mitacs',
    company: 'Mitacs GRI 2022',
    companyNote: 'University of Manitoba, under Prof. Shaowei Wang',
    title: 'Research Intern',
    period: 'Jun 2022 to Sep 2022',
    location: 'Winnipeg, Canada',
    summary: 'Adversarial robustness of deep-learning vulnerability detectors.',
    groups: [
      {
        heading: 'Research',
        bullets: [
          {
            text: 'Measured how easily deep-learning vulnerability detectors break when you feed them semantically equivalent code, tracking the flip ratio across program transformations.',
            tags: ['flip ratio'],
          },
        ],
      },
    ],
    stack: ['Python', 'PyTorch', 'static analysis'],
  },
  {
    id: 'reverselabz',
    company: 'ReverseLabz',
    companyNote: 'PlateUp Health, live on the Play Store and App Store',
    title: 'Backend Engineering Member',
    period: 'Dec 2021 to Dec 2022',
    location: 'Remote, Goa',
    summary: 'Backend for a consumer health app on its way to first revenue.',
    groups: [
      {
        heading: 'What I shipped',
        bullets: [
          { text: 'Scaled the backend past 10k users and cut API response time by 40%.', tags: ['−40% latency'] },
          { text: 'Designed and built the live doctor booking system, which is what started the company earning.' },
          { text: 'Added a follow graph and gamified content, which lifted retention.' },
        ],
      },
    ],
    stack: ['Python', 'Flask', 'PostgreSQL', 'Redis', 'AWS', 'Apache Kafka'],
  },
  {
    id: 'interviewvector',
    company: 'InterviewVector',
    companyNote: 'Helping companies scale hiring',
    title: 'Backend / DevOps Intern',
    period: 'Jun 2021 to Aug 2021',
    location: 'Remote, Gurgaon',
    summary: 'First taste of production infrastructure.',
    groups: [
      {
        heading: 'What I shipped',
        bullets: [
          {
            text: 'Set up CI/CD from GitHub to AWS with CodeDeploy, CodeBuild and CodePipeline, automating deploys on PR merge and halving release time.',
            tags: ['CodePipeline'],
          },
          { text: 'Wrote the backup schedules and documented the whole source-to-deploy path for the dev and test servers.' },
        ],
      },
    ],
    stack: ['AWS CodeDeploy', 'CodeBuild', 'CodePipeline', 'Bash'],
  },
];

export const projects: Project[] = [
  {
    id: 'highwayhelp',
    title: 'HighwayHelp',
    subtitle: 'Razorpay FTX 2021 Global Hackathon, winners out of 500+ teams',
    period: '2021',
    repo: 'https://github.com/sd2001/FTX-Hackathon-Submission---FTX-Hackathon-Submission---2ybuar944uop',
    bullets: [
      { text: 'Live-location help for drivers stranded somewhere with no data connection, so they can still reach a mechanic.' },
      { text: 'Pulled coordinates off the local SIM network and fell back to plain SMS wherever signal was thin.' },
      { text: 'Elasticsearch held the locations, RabbitMQ absorbed the streaming load, and Haversine plus Dijkstra picked the nearest mechanic.' },
      { text: 'Razorpay APIs handled payment in-flow, so the whole thing finished without a phone call.' },
    ],
    stack: ['Python', 'Elasticsearch', 'RabbitMQ', 'React Native', 'Azure', 'Razorpay API'],
  },
  {
    id: 'pariksha',
    title: 'Pariksha',
    subtitle: 'AthenaHack, winners out of 90+ teams',
    period: '2021',
    repoNote: 'Private repo. Happy to walk through it.',
    bullets: [
      { text: 'Examination as a service: runs an online exam start to finish and cuts the time to set one up by about 35%.' },
      { text: 'Transformers generated the questions and auto-evaluated the answers, with a key-point summarizer for last-minute revision.' },
    ],
    stack: ['FastAPI', 'MongoDB', 'spaCy', 'PyTorch'],
  },
  {
    id: 'nodemart',
    title: 'NodeMart',
    subtitle: 'ShadowFax LEAP Hackathon',
    period: '2021',
    repoNote: 'Private repo. Happy to walk through it.',
    bullets: [
      { text: 'An attempt at 15-minute e-commerce delivery, back before that was a normal thing to say.' },
      { text: 'Recommendations from content and collaborative filtering with K-Means, and Apriori rules to spot recurring weekly and monthly orders.' },
    ],
    stack: ['FastAPI', 'scikit-learn', 'pandas', 'MySQL', 'AWS'],
  },
  {
    id: 'rockodrum',
    title: 'ROCK-o-DRUM',
    subtitle: 'Air drums in OpenCV, 24 stars',
    period: '2020',
    repo: 'https://github.com/sd2001/ROCK-o-DRUM',
    bullets: [
      { text: 'Play a drum kit in mid-air: colour-tracked sticks over a webcam trigger samples when they cross virtual pads.' },
      { text: 'The project where the guitar habit and the code habit finally ran into each other.' },
    ],
    stack: ['Python', 'OpenCV', 'NumPy', 'pygame'],
  },
  {
    id: 'image2caption',
    title: 'Image2Caption',
    subtitle: 'CNN-LSTM captioning, 13 stars',
    period: '2020',
    repo: 'https://github.com/sd2001/Image2Caption',
    bullets: [
      { text: 'VGG16 for image features, LSTMs for the sequence, trained on Flickr8k.' },
      { text: 'Trained with progressive loading through Python generators so unused sequences never sat in RAM.' },
    ],
    stack: ['TensorFlow', 'Keras', 'Streamlit'],
  },
  {
    id: 'efficientnet',
    title: 'EfficientNet, from the paper',
    subtitle: 'Rethinking Model Scaling for CNNs, 6 stars',
    period: '2021',
    repo: 'https://github.com/sd2001/EfficientNet',
    bullets: [
      { text: 'Reimplemented EfficientNet in TensorFlow 2 to get at the intuition behind compound scaling.' },
      { text: 'Found that scaling 500x500 images creates memory bottlenecks in the bottom layers that dominate everything else.' },
    ],
    stack: ['TensorFlow 2', 'Keras'],
  },
  {
    id: 'deeppixel',
    title: 'DeepPixel',
    subtitle: 'Open source contribution, PSoC 2020',
    period: '2020',
    repo: 'https://github.com/sd2001/DeepPixel',
    bullets: [
      { text: 'Wrote Canny and Holistically-Nested edge detection from scratch with SciPy and NumPy, merged upstream into smaranjitghose/DeepPixel.' },
      { text: 'Added image quality scoring with BRISQUE and a blur-detection score.' },
    ],
    stack: ['SciPy', 'NumPy', 'Matplotlib'],
  },
  {
    id: 'fuzzyurls',
    title: 'FuzzyUrls',
    subtitle: 'Crio.do published tutorial, 9 stars',
    period: '2021',
    repo: 'https://github.com/sd2001/FuzzyUrls',
    bullets: [
      { text: 'A URL shortener written up as a project tutorial for other people to build along with.' },
    ],
    stack: ['Python', 'Django', 'MongoDB'],
  },
];

export const publication = {
  title: 'Optimizing Apache Kafka Deployments: configuration customization is all you need',
  venue: 'IEEE',
  period: 'Jan 2023 to Jun 2023',
  blurb:
    'Tuning Kafka around its four competing pillars of latency, throughput, durability and availability, and showing that most real deployments are mis-tuned by default rather than under-provisioned.',
};

export const education = {
  heading: 'Education',
  line: "Let's not go there. But I can talk to you about computers all day."
};

export const awards = [
  { year: '12/2021', text: 'Winners at AthenaHack (90+ teams) and the Razorpay FTX 2021 Global Hackathon (500+ teams)' },
  { year: '10/2020', text: 'Runners-up at the Friendship Goals Deep Learning Challenge on HackerEarth (500+ participants)' },
];

export const leadership = [
  {
    org: 'Syndicate, Next Tech Lab',
    period: 'Feb 2020 to May 2023',
    text: 'Tesla Lab: moderated lab proceedings, coordinated intra-lab hackathons and supervised tech sessions.',
  },
  {
    org: 'Project Tutorial Contributor, Crio.do',
    period: 'Mar 2021 to Apr 2021',
    text: 'Contributed a URL-shortening project (FuzzyUrls) built with Python, Django and MongoDB, hosted live on a server.',
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'C++', 'Go', 'SQL', 'TypeScript'] },
  { group: 'Frameworks', items: ['FastAPI', 'Flask', 'Django', 'PyTorch', 'TensorRT / ONNX', 'sentence-transformers', 'PyMuPDF', 'asyncio', 'SQLAlchemy'] },
  { group: 'Data & Search', items: ['PostgreSQL', 'DynamoDB', 'MySQL', 'MongoDB', 'Redis / Valkey', 'Qdrant', 'OpenSearch', 'Elasticsearch'] },
  { group: 'AI / ML', items: ['RAG', 'Vector search', 'Embeddings', 'Cross-encoder reranking', 'HNSW', 'BM25 + RRF', 'LLMs: Gemini, Qwen-VL', 'BERT'] },
  { group: 'Cloud & DevOps', items: ['AWS EKS', 'Lambda', 'SQS / SNS', 'S3', 'VPC / PrivateLink', 'CloudFormation', 'Kubernetes', 'Docker', 'CI/CD', 'GPU: L4 / T4'] },
];

/** The reason the scene is a gym and not an office. Kept short on purpose. */
export const life = {
  intro:
    'Ask me about myself and you will get: Gym, guitar, doggos and at least one Breaking Bad reference nobody asked for.',
  intro2:
    'I also answer serious questions with Better Call Saul quotes. My friends stopped finding it funny. I did not. There are a few non-negotiables in life, and gym daily for 2 hours is one of them.',
  intro3: 'Ask about loyalty, huh??? I have been an Arsenal fan since 2013.',
  gym: {
    icon: '🏋️',
    title: 'Gym, six days a week',
    body:
      'Two hours a day, six days a week, non-negotiable. Push, pull, legs, twice over. The weight either moves or it does not, which makes it the most honest feedback I get all day.',
  },
  cooking: {
    icon: '🍗',
    title: 'Cooking',
    body:
      'Chicken, in an unreasonable number of flavours. Grilled, curried, tandoori, shredded into whatever needs protein. Eating clean is much easier when the clean thing actually tastes good, so that is where the effort goes.',
  },
  guitar: {
    icon: '🎸',
    title: 'Guitar',
    body:
      'Rock, loud, and badly at first. Learning a riff turns out to be the same loop as learning a codebase: slow it down, find the bar that keeps breaking, repeat until your hands stop thinking. There is one in this room, by the way.',
  },
  swimming: {
    icon: '🏊',
    title: 'Swimming',
    body:
      'Strictly a hot-day activity. Bangalore summers make a very strong case for water, and I have never once regretted going.',
  },
  arsenal: {
    icon: '🔴',
    title: 'Arsenal',
    body:
      'Thirteen years in, red half of North London. Özil was my guy and I will happily defend that. The photo on the wall behind this laptop is not coming down for a while.',
  },
  dogs: {
    icon: '🐕',
    title: 'Dogs',
    body:
      'All of them, no exceptions. If there is a dog in the room then that is where I will be, and I will not be taking questions about it.',
  },
};

export const lifeOrder = ['gym', 'cooking', 'guitar', 'swimming', 'arsenal', 'dogs'] as const;

export const nowPlaying = ['Linkin Park', 'Nickelback', 'Bad Omens', 'Bring Me The Horizon', 'Foo Fighters'];

/**
 * Tracks the guitar in the room cycles through when you click it.
 * More to come. Swarnabha is sending the full list.
 */
export type Song = {
  title: string;
  artist: string;
  album?: string;
  year?: string;
  /**
   * A Google Drive link to a video of Swarnabha playing it. Paste the normal share link,
   * the file id is pulled out automatically. The file has to be shared as
   * "Anyone with the link" or the embed will just show a permission error.
   */
  drive?: string;
  /** Any other link worth having, e.g. the official track. */
  url?: string;
};

/** Pull the file id out of whatever shape of Drive link got pasted in. */
export function driveFileId(link?: string): string | null {
  if (!link) return null;
  const patterns = [
    /\/file\/d\/([A-Za-z0-9_-]{10,})/,   // .../file/d/<id>/view
    /[?&]id=([A-Za-z0-9_-]{10,})/,       // ...open?id=<id>
    /\/d\/([A-Za-z0-9_-]{10,})/,         // .../d/<id>
  ];
  for (const re of patterns) {
    const m = link.match(re);
    if (m) return m[1];
  }
  // already a bare id
  return /^[A-Za-z0-9_-]{10,}$/.test(link.trim()) ? link.trim() : null;
}

/** Drive's own player, which is the only reliable way to embed a Drive video. */
export function drivePreviewUrl(link?: string): string | null {
  const id = driveFileId(link);
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

/**
 * Drive renders a poster frame for every video. Using it means the tiles show Swarnabha
 * actually playing, and avoids putting somebody else's album art on the site.
 */
export function driveThumbUrl(link?: string, width = 640): string | null {
  const id = driveFileId(link);
  // drive.google.com/thumbnail just 302s here, so go straight to the CDN.
  return id ? `https://lh3.googleusercontent.com/d/${id}=w${width}` : null;
}

/** Where to hear the original recording. We cannot host it, so we point at it. */
export function listenUrl(song: Song) {
  if (song.url) return song.url;
  return `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;
}

/**
 * The guitar covers, from Swarnabha's Drive folder. `drive` is the file id; titles and
 * artists were checked against the iTunes catalogue rather than guessed from filenames.
 */
export const songs: Song[] = [
  { title: 'New Divide', artist: 'Linkin Park', album: 'Transformers: Revenge of the Fallen', year: '2009', drive: '1IpUJe_Ydcu7gkK8-98fLiG8wlYdOrAsu' },
  { title: 'Carnival of Rust', artist: 'Poets of the Fall', album: 'Carnival of Rust', year: '2006', drive: '1FJ1jOX7TiCSnq9SFAqNzrVvFGXFBf1-t' },
  { title: 'Dance with the Devil', artist: 'Breaking Benjamin', album: 'Phobia', year: '2006', drive: '1Z5K5YOIYEfztrhC-q4i-6XcWRSWC7f-4' },
  { title: 'Sweater Weather', artist: 'The Neighbourhood', album: 'I Love You.', year: '2012', drive: '1hTwYaV6DCX4QKaO8BSErU-jZeciDo_jR' },
  { title: 'Wonderwall', artist: 'Oasis', album: "(What's the Story) Morning Glory?", year: '1995', drive: '1sl22kTBIbSDYzE3MlrmxrXbx2gKCCK6O' },
  { title: 'Viva La Vida', artist: 'Coldplay', album: 'Viva La Vida or Death and All His Friends', year: '2008', drive: '1aLHmGCEdlFTEOnW8xxJeRLxzjAhleCCR' },
  { title: 'End of Beginning', artist: 'Djo', album: 'DECIDE', year: '2024', drive: '1-vmH7xB4l2upcwNlZdE-WWuYmVGD01c1' },
  { title: 'About You', artist: 'The 1975', album: 'Being Funny In A Foreign Language', year: '2022', drive: '1Cmkt5bJAfrKnbQSigXwVS8vivbj8C4v0' },
  { title: 'Hasi', artist: 'Ami Mishra', album: 'Hamari Adhuri Kahani', year: '2015', drive: '1Hy68FToYTu18_KKPbOo1UxC7edjZhAEg' },
  { title: 'Dhundala', artist: 'Talwiinder', year: '2020', drive: '1SVDqeteBQ8B6vwj51m7RKZd-y-44TFCf' },
];
