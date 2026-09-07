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
  resumePath: '/resume.pdf',
  blurb:
    'I build the unglamorous machinery behind AI products — the pipelines, the vector indexes, the GPU serving layer, the bill at the end of the month.',
};

export const socials = [
  { label: 'GitHub', handle: 'sd2001', url: 'https://github.com/sd2001', icon: 'github' },
  { label: 'LinkedIn', handle: 'swarnabhadas', url: 'https://linkedin.com/in/swarnabhadas', icon: 'linkedin' },
  { label: 'Email', handle: 'im.swarnabha2001@gmail.com', url: 'mailto:im.swarnabha2001@gmail.com', icon: 'mail' },
  { label: 'Medium', handle: '@im.swarnabha2001', url: 'https://medium.com/@im.swarnabha2001', icon: 'medium' },
  { label: 'X', handle: 'im_sd2001', url: 'https://twitter.com/im_sd2001', icon: 'x' },
  { label: 'Instagram', handle: '__swarnabha.d__', url: 'https://www.instagram.com/__swarnabha.d__/', icon: 'instagram' },
];

/** Headline numbers used on the About screen. */
export const stats = [
  { value: '8.4M', label: 'products searchable', sub: 'one Qdrant collection, hundreds of distributors' },
  { value: '3M', label: 'datasheets / cycle', sub: 'crawled every 2–3 weeks, inside a 14-day window' },
  { value: '95%', label: 'p95 latency cut', sub: 'text extraction, 18.5s → 0.95s' },
  { value: '~$2.6K', label: 'monthly cloud spend removed', sub: 'NAT, cross-AZ and endpoint work' },
];

export type Bullet = { text: string; tags?: string[] };
export type Project = {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  bullets: Bullet[];
  stack: string[];
};

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
    companyNote: 'AI platform digitizing building-product data for electrical distributors, manufacturers & contractors',
    title: 'Software Engineer 2',
    period: 'Jan 2025 — Present',
    location: 'Bangalore',
    current: true,
    summary:
      'Promoted SE-1 → SE-2 in Feb 2026. I own search and the data pipelines feeding it: crawling the manufacturer web, turning PDFs into structured product data, and serving vector search over millions of SKUs without the GPU bill getting away from us.',
    groups: [
      {
        heading: 'Crawler Pipeline Rebuild',
        bullets: [
          {
            text: 'Rebuilt the crawler that pulls 3M manufacturer datasheets off the web every 2–3 weeks — a cycle that has to finish inside 14 days before the next one starts. Moved pipeline state out of Jira ticket statuses across 5,000 manufacturers into Postgres and made it event-driven, tracking each PDF rather than whole manufacturers, so one bad file no longer forces a 10,000-product rerun.',
            tags: ['PostgreSQL', 'event-driven'],
          },
          {
            text: 'Re-platformed from fixed EC2 nodes — where each stage sat on its own instances and a slow stage meant manually adding machines — onto EKS, so stages scale on their own and we spend only where a stage needs it. Sizing on AWS Graviton modelled ~35% lower cost ($2,657 → $1,718/mo).',
            tags: ['EKS', 'Graviton', '−35% cost'],
          },
        ],
      },
      {
        heading: 'Datasheet Search & Ingestion — ~1.4M product families',
        bullets: [
          {
            text: 'Built the pipeline turning manufacturer PDFs into a searchable catalogue across 3 Qdrant collections. Each page routes to the cheapest reader that handles it: plain text first, Docling/TableFormer on GPU for tables, and only genuinely hard pages reach a paid vision model (Qwen3-VL-32B, then Gemini 2.5 Flash) — so spend tracks difficulty, not page count.',
            tags: ['Qdrant', 'Docling', 'Qwen3-VL', 'Gemini'],
          },
          {
            text: 'Extraction runs at 0.906 macro-F1, with every PDF keyed by content hash so reruns repair rather than duplicate.',
            tags: ['0.906 macro-F1'],
          },
          {
            text: 'Made part-number search typo-tolerant by indexing each code as overlapping 3-character chunks, so a search for LC1D18B7 still finds LC1D18-B7 where ordinary keyword search returns nothing — with a similarity floor that abstains instead of guessing.',
            tags: ['trigram', 'abstention'],
          },
          {
            text: 'Closed a silent-failure hole where a datasheet that failed extraction vanished with no retry and no record it had ever been attempted.',
          },
        ],
      },
      {
        heading: 'Inventory Search — 8.4M products, 100s of distributors',
        bullets: [
          {
            text: 'Built the search behind Parspec’s Crossing product on a single Qdrant collection. Every query runs three searches at once — a 768-dim all-mpnet-base-v2 semantic vector plus two BM25 keyword vectors — merged with Reciprocal Rank Fusion.',
            tags: ['hybrid search', 'RRF', 'BM25'],
          },
          {
            text: 'Every distributor gets its own HNSW search graph inside that one index, so catalogues stay isolated without post-filtering, and int8 compression with rescoring cut vector memory to ~25% at the same quality.',
            tags: ['HNSW', 'int8', '−75% memory'],
          },
          {
            text: 'Re-ranked the top 50 hits on GPU with an ms-marco-MiniLM-L6-v2 cross-encoder, and added an LLM category classifier (Gemini, GPT-5-nano) that runs alongside the search so it costs no extra wall-clock time.',
            tags: ['cross-encoder', 'reranking'],
          },
          {
            text: 'Translated the shorthand electricians actually search with into the wording distributors store, so "16A 1 pole" matches products described a dozen different ways and every spelling of a part number lands on one product. Grouping by product then shows a customer their true stock across every warehouse instead of one row per warehouse.',
            tags: ['query rewriting'],
          },
          {
            text: 'Migrated 7.1M live inventory records from DynamoDB into Qdrant with AI enrichment on each record, and keep the two in sync within seconds through change-data-capture: DynamoDB Streams → Lambda → SQS, drained by EKS workers that enrich, embed and write into Qdrant. A ~73% prompt cache hit rate made incident replays near-free.',
            tags: ['CDC', 'DynamoDB Streams', '7.1M records'],
          },
        ],
      },
      {
        heading: 'GPU Serving, Performance & Cloud Cost',
        bullets: [
          {
            text: 'Moved all GPU inference from Tesla T4 onto NVIDIA L4 (g6) instances and converted the models to TensorRT/ONNX, which raised throughput enough to keep full FP32 precision instead of dropping to FP16 for latency. The BERT category model now serves 40 req/s per pod where it saturated past 15, and text embedding holds sub-100ms p95 at 30 req/s against 350ms at 15.',
            tags: ['TensorRT', 'ONNX', 'NVIDIA L4'],
          },
          {
            text: 'Cut p95 text extraction from 18.5s to 0.95s — 95% faster. The tail turned out to be memory fragmentation and OOM kills, not parsing: I added locking around the shared PyMuPDF (fitz) handles to stop the multithreaded path segfaulting and getting killed (exit 137), and moved the service onto c8i instances.',
            tags: ['PyMuPDF', 'p95 18.5s → 0.95s'],
          },
          {
            text: 'Took ~$2.6K/month out of the cloud bill. It started as a ~$5,000/mo NAT charge with no attribution, so we tagged every service at module level and read VPC flow logs against those tags until every dollar had an owner. Then: S3, DynamoDB, CloudWatch and SNS onto private endpoints to keep traffic inside AWS (30–40%), chatty services re-homed into the account calling them ($560/mo), and cross-AZ gateway hops killed (~$2,100/mo).',
            tags: ['VPC flow logs', 'PrivateLink', '−$2.6K/mo'],
          },
        ],
      },
    ],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'DynamoDB', 'Qdrant', 'OpenSearch', 'Valkey', 'SQS/SNS', 'Lambda', 'EKS', 'PyTorch', 'TensorRT', 'Gemini', 'Qwen-VL'],
  },
  {
    id: 'pibit',
    company: 'Pibit.ai',
    companyNote: 'YC W21 — unlocking insight from vastly unstructured insurance / underwriting data',
    title: 'SDE-1, Backend & DevOps',
    period: 'Jan 2023 — Dec 2024',
    location: 'Bangalore',
    summary:
      'Owned Lossrun, one of the insurance lines of business, end to end — the logic, the production server it ran on, and the AWS infra and CI/CD underneath it.',
    groups: [
      {
        heading: 'What I shipped',
        bullets: [
          {
            text: 'Integrated Lossrun (Insurance LOB), optimised its core logical components on our production server and owned it thereafter, running the infra and CI/CD on AWS.',
            tags: ['ownership'],
          },
          {
            text: 'Maintained and optimised the insurance data extraction pipeline by 18%, and set up analytics for logging and error tracebacks so failures stopped being invisible.',
            tags: ['+18% throughput'],
          },
          {
            text: 'Introduced multi-stage Docker builds for faster, smaller images, and improved K8s pod behaviour under deploy using graceful shutdown.',
            tags: ['Docker', 'Kubernetes'],
          },
          {
            text: 'Built PiEval, an end-to-end analytics-driven testing framework, from scratch — automating test and logic coverage reports for templates and APIs after every deployment. It replaced manual operations-driven testing and saved up to 3 days ahead of production and client releases.',
            tags: ['PiEval', '−3 days per release'],
          },
        ],
      },
    ],
    stack: ['Python', 'FastAPI', 'DynamoDB', 'PostgreSQL', 'AWS SQS', 'S3', 'Lambda', 'Kubernetes', 'CloudFormation'],
  },
  {
    id: 'mitacs',
    company: 'Mitacs GRI 2022',
    companyNote: 'University of Manitoba, Winnipeg — under Prof. Shaowei Wang',
    title: 'Research Intern',
    period: 'Jun 2022 — Sep 2022',
    location: 'Canada',
    summary: 'Adversarial robustness of deep-learning vulnerability detectors.',
    groups: [
      {
        heading: 'Research',
        bullets: [
          { text: 'Assessed the robustness of deep-learning vulnerability detection via code augmentation, measuring the flip ratio when semantically-equivalent transformations are applied to source.' },
          { text: 'Analysed performance metrics across program transformation techniques, building on prior work in the area.' },
        ],
      },
    ],
    stack: ['Python', 'PyTorch', 'static analysis'],
  },
  {
    id: 'reverselabz',
    company: 'ReverseLabz',
    companyNote: 'PlateUp Health — live on the Play Store and App Store, globally',
    title: 'Backend Engineering Member',
    period: 'Dec 2021 — Dec 2022',
    location: 'Remote — Goa',
    summary: 'Backend for a consumer health app on its way to its first revenue.',
    groups: [
      {
        heading: 'What I shipped',
        bullets: [
          { text: 'Scaled the backend past 10k users, refactoring and cutting API response time by 40% while improving personalization.', tags: ['−40% latency'] },
          { text: 'Designed and implemented the live booking system connecting doctors and users — the feature that started the company’s first revenue.' },
          { text: 'Built a follow graph and gamified content to accelerate the social side of the platform, lifting user retention.' },
        ],
      },
    ],
    stack: ['Python', 'Flask', 'Flask-RESTPlus', 'PostgreSQL', 'Redis', 'AWS', 'Apache Kafka'],
  },
  {
    id: 'interviewvector',
    company: 'InterviewVector',
    companyNote: 'Helping companies scale their hiring process 5x',
    title: 'Backend / DevOps Intern',
    period: 'Jun 2021 — Aug 2021',
    location: 'Remote — Gurgaon',
    summary: 'First taste of production infrastructure: CI/CD from GitHub into AWS.',
    groups: [
      {
        heading: 'What I shipped',
        bullets: [
          { text: 'Set up CI/CD pipelines and test workflows for auto-deployment of repositories from GitHub to AWS at scale.' },
          { text: 'Automated deployment on PR merge using CodeDeploy, CodeBuild and CodePipeline — cutting manual work and speeding up releases by 50%.', tags: ['CodePipeline'] },
          { text: 'Devised backup schedules — weekly, monthly and yearly — tied to every release, and documented the whole source-to-deployment strategy for the development and test servers.' },
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
    subtitle: 'Razorpay FTX 2021 Global Hackathon — Winners, out of 500+ teams',
    period: '2021',
    bullets: [
      { text: 'An internet-independent, live-location tracking tool for stranded drivers in remote areas, letting them reach nearby mechanics with no data connection.' },
      { text: 'Pulled latitude and longitude off the local SIM network and fell back to plain text messaging wherever connectivity was thin.' },
      { text: 'Stored user locations in Elasticsearch for consistent streaming through Google’s location-tracking APIs, with RabbitMQ queuing requests under high streaming volume.' },
      { text: 'Used Haversine distance plus Dijkstra’s algorithm to route to the nearest available mechanic, and integrated Razorpay APIs so the payment happened in-flow.' },
    ],
    stack: ['Python', 'Elasticsearch', 'RabbitMQ', 'React Native', 'Azure', 'Razorpay API'],
  },
  {
    id: 'pariksha',
    title: 'Pariksha',
    subtitle: 'AthenaHack — Winners, out of 90+ teams',
    period: '2021',
    bullets: [
      { text: 'Examination-as-a-Service: automates an online exam start to finish, cutting the time to run one by up to 35%.' },
      { text: 'Transformer-generated questions and answers with auto-evaluation, plus a key-point summarizer that doubles the value of last-minute preparation.' },
      { text: 'Comparative test-score feedback for every participant rather than a bare grade.' },
    ],
    stack: ['FastAPI', 'MongoDB', 'spaCy', 'PyTorch', 'Transformers'],
  },
  {
    id: 'nodemart',
    title: 'NodeMart',
    subtitle: 'ShadowFax LEAP Hackathon',
    period: '2021',
    bullets: [
      { text: 'A one-stop attempt at 15-minute e-commerce delivery.' },
      { text: 'Product recommendations from content filtering, collaborative filtering and past order history via K-Means clustering.' },
      { text: 'Apriori association rules to surface order patterns and detect weekly and monthly recurring orders, exposed as APIs around the models.' },
    ],
    stack: ['FastAPI', 'scikit-learn', 'pandas', 'MySQL', 'AWS'],
  },
  {
    id: 'rockodrum',
    title: 'ROCK-o-DRUM',
    subtitle: 'Aero-virtual drums in OpenCV — 24★ on GitHub',
    period: '2020',
    bullets: [
      { text: 'Play a drum kit in mid-air: colour-tracked drumsticks over a webcam feed trigger samples when they cross virtual pad regions.' },
      { text: 'The project where the guitar habit and the code habit finally collided.' },
    ],
    stack: ['Python', 'OpenCV', 'NumPy', 'pygame'],
  },
  {
    id: 'image2caption',
    title: 'Image2Caption',
    subtitle: 'CNN-LSTM captioning — 13★ on GitHub',
    period: '2020',
    bullets: [
      { text: 'CNN-LSTM architecture: VGG16 transfer learning for image features, LSTMs for sequence prediction, trained on Flickr8k.' },
      { text: 'Trained with progressive loading through Python generators so unused sequences never sat in RAM.' },
    ],
    stack: ['TensorFlow', 'Keras', 'Streamlit'],
  },
  {
    id: 'efficientnet',
    title: 'EfficientNet, from the paper',
    subtitle: 'Rethinking Model Scaling for CNNs — 6★ on GitHub',
    period: '2021',
    bullets: [
      { text: 'Reimplemented EfficientNet in TensorFlow 2 to get at the intuition behind compound scaling.' },
      { text: 'Hunted for the right combination of FLOPs, accuracy, parameter count and inference time, and found that scaling large (500×500) images creates memory bottlenecks in the bottom layers that dominate performance.' },
    ],
    stack: ['TensorFlow 2', 'Keras'],
  },
  {
    id: 'deeppixel',
    title: 'DeepPixel',
    subtitle: 'Open source — PSoC 2020',
    period: '2020',
    bullets: [
      { text: 'Implemented Canny and Holistically-Nested edge detection from scratch with SciPy, NumPy and Matplotlib.' },
      { text: 'Added image quality enhancement via BRISQUE and a blur-detection score.' },
    ],
    stack: ['SciPy', 'NumPy', 'Matplotlib'],
  },
  {
    id: 'fuzzyurls',
    title: 'FuzzyUrls',
    subtitle: 'Crio.do tutorial contribution — 9★ on GitHub',
    period: '2021',
    bullets: [
      { text: 'A URL shortener contributed as a published project tutorial, engineered in Python/Django with MongoDB and hosted live.' },
    ],
    stack: ['Python', 'Django', 'MongoDB'],
  },
];

export const publication = {
  title: 'Optimizing Apache Kafka Deployments — configuration customization is all you need',
  venue: 'IEEE',
  period: 'Jan 2023 — Jun 2023',
  blurb:
    'Tuning Kafka around its four competing pillars — latency, throughput, durability and availability — and showing that most real deployments are mis-tuned by default rather than under-provisioned.',
};

export const education = {
  degree: 'B.Tech, Computer Science',
  school: 'SRM Institute of Science and Technology',
  period: '2019 — 2023',
  gpa: '9.47 / 10',
};

export const awards = [
  { year: '12/2021', text: 'Winners — AthenaHack (90+ teams) and Razorpay FTX 2021 Global Hackathon (500+ teams)' },
  { year: '10/2020', text: 'Runners-up — Friendship Goals Deep Learning Challenge on HackerEarth (500+ participants)' },
];

export const leadership = [
  {
    org: 'Syndicate, Next Tech Lab',
    period: 'Feb 2020 — May 2023',
    text: 'Tesla Lab: moderated lab proceedings, coordinated intra-lab hackathons and supervised tech sessions.',
  },
  {
    org: 'Project Tutorial Contributor, Crio.do',
    period: 'Mar 2021 — Apr 2021',
    text: 'Contributed a URL-shortening project (FuzzyUrls) built with Python, Django and MongoDB, hosted live on a server.',
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'C++', 'Go', 'SQL', 'TypeScript'] },
  { group: 'Frameworks', items: ['FastAPI', 'Flask', 'Django', 'PyTorch', 'TensorRT / ONNX', 'sentence-transformers', 'PyMuPDF', 'asyncio', 'SQLAlchemy'] },
  { group: 'Data & Search', items: ['PostgreSQL', 'DynamoDB', 'MySQL', 'MongoDB', 'Redis / Valkey', 'Qdrant', 'OpenSearch', 'Elasticsearch'] },
  { group: 'AI / ML', items: ['RAG', 'Vector search', 'Embeddings', 'Cross-encoder reranking', 'HNSW', 'BM25 + RRF', 'LLMs — Gemini, Qwen-VL', 'BERT'] },
  { group: 'Cloud & DevOps', items: ['AWS EKS', 'Lambda', 'SQS / SNS', 'S3', 'VPC / PrivateLink', 'CloudFormation', 'Kubernetes', 'Docker', 'CI/CD', 'GPU — L4 / T4'] },
];

/** Non-work content — the reason the scene is a gym and not an office. */
export const life = {
  gym: {
    title: 'Six days a week',
    body:
      'Push, pull, legs, twice over. The gym is the one system I get to debug with a completely honest feedback loop — the weight either moves or it does not, and no amount of clever reasoning changes the number on the bar.',
    split: [
      { day: 'Mon', focus: 'Push', detail: 'Chest, shoulders, triceps' },
      { day: 'Tue', focus: 'Pull', detail: 'Back, biceps, rear delts' },
      { day: 'Wed', focus: 'Legs', detail: 'Quads, hams, calves' },
      { day: 'Thu', focus: 'Push', detail: 'Volume day' },
      { day: 'Fri', focus: 'Pull', detail: 'Heavy rows, deadlift' },
      { day: 'Sat', focus: 'Legs', detail: 'Squat focus' },
      { day: 'Sun', focus: 'Rest', detail: 'Guitar, football, the dog' },
    ],
  },
  guitar: {
    title: 'Guitar',
    body:
      'Rock, mostly. Linkin Park, Nickelback, Bad Omens — the kind of music that is objectively best played too loud. Learning an unfamiliar riff is the same loop as learning an unfamiliar codebase: slow it down, isolate the part that keeps breaking, repeat it until it stops being conscious.',
  },
  dogs: {
    title: 'Dogs',
    body: 'Unreservedly. If there is a dog in the room, that is where I will be. This is not negotiable and I will not be taking questions.',
  },
  arsenal: {
    title: 'Arsenal',
    body:
      'North London, red half. Years of patience, and the wallpaper on this laptop finally reflects it. Up the Arsenal.',
  },
};

export const nowPlaying = ['Linkin Park', 'Nickelback', 'Bad Omens', 'Bring Me The Horizon', 'Foo Fighters'];
