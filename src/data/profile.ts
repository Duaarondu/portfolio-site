/**
 * profile.ts — ALL the words on the site live here.
 *
 * LEARNING NOTE: Keeping content in one typed data file (instead of
 * scattering text through components) is called "separating content from
 * presentation". To update your site later, you only edit this file —
 * the components read from it automatically.
 *
 * The `type` definitions below are TypeScript. They describe the *shape*
 * of the data, so if you mistype a field name (e.g. `titel`), your editor
 * underlines it in red before you ever run the site.
 */

export type Link = { label: string; href: string };

/** One line in the hero's agent trace. */
export type TraceStep = {
  agent: "planner" | "analyst" | "critic";
  text: string;
  /** "flag" = the Critic caught something, "pass" = every number traced */
  tone?: "flag" | "pass";
};

/** A number shown under the trace, linked to where it can be checked. */
export type Stat = { value: string; label: string; source: string };

export type Project = {
  slug: string;
  name: string;
  context: string; // e.g. "Open Agent Hackathon 2026"
  role: string;
  date: string;
  stack: string[];
  summary: string;
  bullets: string[];
  repo: string;
  /** Optional YouTube link for a demo video */
  demoUrl?: string;
};

export type Job = {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
};

export type Photo = {
  /** Path to a photo in /public, e.g. "/about/photo-01.jpg". Leave empty to show a placeholder. */
  src: string;
  /** Describes the photo for screen readers. Write one once you add src. */
  alt: string;
};

/** One line of the title card. `indent` = how far in from the left, in % of the width. */
export type TitleLine = { text: string; indent: number };

/** "Studying" + "Comp Sci @ NYIT": a dim verb and a bright object. */
export type DoingLine = { verb: string; what: string };

/** A row in the Experience card. */
export type ExperienceItem = {
  name: string;
  role: string;
  /** Top date on the right (the most recent, e.g. "Present") */
  end: string;
  /** Bottom date on the right (when it started). Leave empty if there's only one date. */
  start: string;
  /** Initials shown on the tile until you add a logo */
  initials: string;
  /** Optional logo image in /public, e.g. "/logos/nyit.png" */
  logo?: string;
  /** Optional short bullets shown under the row */
  details?: string[];
};

export type ToolGroup = {
  name: string;
  tools: { name: string; usedIn: string[] }[];
};

const NFL_REPO = "https://github.com/Duaarondu/nfl-agent";

export const profile = {
  name: "Aaron Du",
  tagline: "Aaron Du, AI and software engineering",
  headline: "Agents that show their work.",
  intro:
    "I'm a Computer Science student at NYIT, concentrating in Artificial Intelligence and graduating in December 2027, who builds LLM systems you can audit: every step logged, every number traced to the query that produced it. Looking for Summer 2027 software and AI engineering internships in New York City.",
  workAuth: "U.S. citizen",
  location: "Mineola, NY",
  links: {
    email: "duaarondu@gmail.com",
    github: "https://github.com/Duaarondu",
    linkedin: "https://www.linkedin.com/in/duaarondu",
    // Add your handles to show them in the footer marquee, e.g.
    // x: "https://x.com/yourname", discord: "https://discord.com/users/your-id"
    x: "",
    discord: "",
    // Put your resume PDF in public/ and set this to its path, e.g.
    // "/Aaron_Du_Resume.pdf". The header's Resume button appears once it's set.
    resume: "/Aaron_Du_Resume.pdf",
  },

  /** First item in the footer marquee. */
  footerLine: "Built in New York",
  copyrightYear: 2026,

  /**
   * Scene 1, the title card. Lines are staggered like the reference:
   * change `indent` (0–40) to move a line left or right.
   */
  titleLines: [
    { text: "Aaron", indent: 12 },
    { text: "Du", indent: 38 },
    { text: "Software", indent: 0 },
    { text: "Engineer", indent: 26 },
    { text: "Student", indent: 8 },
  ] satisfies TitleLine[],

  /**
   * Scene 2, the photo strip. It stays pinned while the photos slide past
   * and the sentence fills in letter by letter.
   * Photos live in public/about/. Reorder the list to change their order.
   */
  about: {
    doing: [
      { verb: "Studying", what: "Comp Sci @ NYIT" },
      { verb: "Creating", what: "Projects" },
    ] satisfies DoingLine[],
    sentence:
      "You'll find me shipping code, snowboarding, working out, and playing video games.",
    photos: [
      { src: "/about/photo-01.jpg", alt: "Rows of red lanterns leading to a shrine gate at night" },
      { src: "/about/photo-02.jpg", alt: "People walking along the Kamo River in Kyoto on a sunny evening" },
      { src: "/about/photo-03.jpg", alt: "Crowds on the steps below the Ruins of St. Paul's in Macau at dusk" },
      { src: "/about/photo-04.jpg", alt: "Willow trees hanging over a canal in Kyoto" },
      { src: "/about/photo-05.jpg", alt: "Walking through a tunnel of red torii gates at night" },
      { src: "/about/photo-06.jpg", alt: "A treehouse built into a giant tree above a river, with a tour boat passing" },
      { src: "/about/photo-07.jpg", alt: "A small waterfall in a green forest garden" },
      { src: "/about/photo-08.jpg", alt: "Offerings of fruit and food on an altar in front of three statues at a small temple" },
      { src: "/about/photo-09.jpg", alt: "A covered shopping arcade in Kyoto with hanging shop signs" },
      { src: "/about/photo-10.jpg", alt: "Farm fields under big white clouds with green mountains behind" },
      { src: "/about/photo-14.jpg", alt: "Looking down at my snowboard at the top of a ski slope at dusk" },
      { src: "/about/photo-12.jpg", alt: "A heron standing at the edge of a garden pond" },
      { src: "/about/photo-13.jpg", alt: "A cyclist on the riverside path beside the Kamo River on a cloudy day" },
    ] satisfies Photo[],
  },

  /**
   * The "Now building" scene.
   *
   * Two ways to use it:
   * 1. BY HAND: fill in `current` with what you're working on. If the project
   *    has a public repo, put it in `current.repo` ("owner/name") and the
   *    scene adds its latest commits and last-push time from GitHub.
   * 2. AUTOMATIC: leave `current.name` empty. The scene shows whichever public
   *    repo you pushed to most recently (minus `skipRepos`), refreshed hourly.
   */
  nowBuilding: {
    githubUser: "Duaarondu",
    current: {
      name: "Wedding Project",
      description: "",
      repo: "", // e.g. "Duaarondu/wedding-project" once it's a public repo
    },
    // Repos the automatic mode should never pick
    skipRepos: ["portfolio-site", "neetcode-submissions", "Duaarondu"],
    commitCount: 5,
    // Optional line in your own words about what you're working on
    note: "",
    // Automatic mode only: shown if GitHub can't be reached
    fallback: {
      name: "NFL Fantasy Agent",
      description:
        "A multi-agent assistant whose Critic blocks any number it can't trace back to a SQL row.",
      url: "https://github.com/Duaarondu/nfl-agent",
    },
  },

  /** The Experience card */
  experience: [
    {
      name: "Ultimate Sound DJs",
      role: "Event Technology Specialist",
      end: "Present",
      start: "Aug 2024",
      initials: "US",
      details: [
        "Ran sound, lighting, mics and photo booths at about 200 weddings, sweet 16s and bar/bat mitzvahs.",
        "Combined a year of about 2,000 venue-referred leads into one workbook and cleaned the data by hand.",
        "Found the top referring venues, which led to a showcase for venue partners with about 100 attendees.",
      ],
    },
    {
      name: "Open Agent Hackathon",
      role: "Team Lead, NFL Fantasy Agent",
      end: "Oct 2026",
      start: "",
      initials: "OA",
      details: [
        "Led a two-person team and designed the Critic agent that blocks unsourced numbers.",
      ],
    },
    {
      name: "NYIT",
      role: "B.S. Computer Science, AI Concentration",
      end: "Dec 2027",
      start: "Expected",
      initials: "NY",
      details: [
        "Coursework: Programming for Artificial Intelligence and Artificial Intelligence I (in progress), Data Structures, Discrete Structures, Database Management, Computer Organization and Architecture, Theory of Computation.",
      ],
    },
    // `as` (not `satisfies`) so the optional `logo` field is allowed on every row
  ] as ExperienceItem[],

  /** The last scene before the footer: a photo with the AD logo faded over it. */
  endPhoto: {
    src: "/about/photo-11.jpg",
    alt: "Storm clouds over a wide river in Kyoto",
  },
  /** The wide banner card. Add a photo at public/about/banner.jpg and set src. */
  banner: {
    src: "/about/photo-13.jpg", // swap in any photo from public/about/
    alt: "",
    title: "Summer 2027",
    line: "Open to software and AI internships in New York City",
  },


  /**
   * The agent trace in the Projects section: how one answer moves through the NFL Fantasy
   * Agent. It's an illustration of the flow, so no made-up numbers in it.
   */
  trace: [
    { agent: "planner", text: "chooses the SQL query plans to run" },
    { agent: "analyst", text: "runs the queries, drafts a verdict" },
    { agent: "critic", text: "finds a number with no source row", tone: "flag" },
    { agent: "critic", text: "sends it back: revise (round 1 of 3)", tone: "flag" },
    { agent: "analyst", text: "revises the draft" },
    { agent: "critic", text: "every number traced, answer sent", tone: "pass" },
  ] satisfies TraceStep[],

  /** Real numbers from the NFL Fantasy Agent, shown under the trace. */
  stats: [
    { value: "612", label: "pytest tests", source: NFL_REPO },
    { value: "278 / 0", label: "live queries / SQL errors", source: NFL_REPO },
    { value: "13/13", label: "memory conformance", source: NFL_REPO },
  ] satisfies Stat[],

  featured: {
    slug: "nfl-agent",
    name: "NFL Fantasy Agent",
    context: "Open Agent Hackathon 2026, hosted by GenAI Works",
    role: "Team lead, two-person team",
    date: "October 2026",
    stack: [
      "Python",
      "NVIDIA Nemotron",
      "Zetaris (Spark SQL)",
      "DuckDB",
      "Docker",
      "GitHub Actions",
      "pytest",
      "Claude Code",
    ],
    summary:
      "A multi-agent assistant that answers fantasy football lineup and waiver questions. Every verdict is grounded in SQL results, and a Critic agent blocks any number it can't trace back to a query row.",
    bullets: [
      "Designed the Critic agent: it checks every number in a draft answer against the source query rows and sends unsupported claims back for revision, up to 3 rounds.",
      "Grounded answers in 7 nflverse tables through 16 SQL query plans on a Zetaris Spark cluster, with a DuckDB offline mode.",
      "Cut full-run latency from 129–350s to 18–135s after finding the model runtime ignored the reasoning-off flag and moving to a version that honored it.",
      "Co-built a per-user league memory engine from Meterless's published H-MEM spec.",
      "Shipped with Docker, GitHub Actions CI, timeouts, rule-based fallbacks and JSONL tracing of every step.",
    ],
    repo: NFL_REPO,
    /**
     * Paste your YouTube link here (any form works: youtube.com/watch?v=…,
     * youtu.be/…, or a Shorts link). Leave it empty to show a placeholder.
     */
    demoUrl: "https://youtu.be/K_tY7Z2Y3GQ",
  } satisfies Project,

  /** The agent loop drawn in the featured project. Order matters. */
  agentLoop: [
    { name: "Planner", does: "Picks which SQL query plans the question needs" },
    { name: "Analyst", does: "Runs the queries and drafts a verdict from the rows" },
    { name: "Critic", does: "Matches every number in the draft to a source row" },
  ],

  projects: [
    {
      slug: "lirr",
      name: "LIRR Live Train Visualizer",
      context: "Personal project",
      role: "Solo",
      date: "February 2026",
      stack: ["Java", "Spring Boot", "GTFS-Realtime", "React", "React Leaflet", "Railway", "Vercel"],
      summary: "Live Long Island Rail Road trains and delays on a map.",
      bullets: [
        "Spring Boot APIs parse the MTA's GTFS-Realtime (protobuf) feed and join it with static schedule data.",
        "React Leaflet map of all 10 branches in their official colors, refreshing every 10 seconds.",
        "Backend on Railway, frontend on Vercel, with CORS handled between them and rate limiting via Bucket4j.",
      ],
      repo: "https://github.com/Duaarondu/lirr-app",
    },
    {
      slug: "rsvp",
      name: "AWS RSVP Website",
      context: "Personal project",
      role: "Solo",
      date: "December 2025",
      stack: ["AWS Lambda (Node.js)", "API Gateway", "S3", "CloudFront", "RDS (MySQL)", "DynamoDB", "CloudWatch"],
      summary: "A serverless event RSVP app.",
      bullets: [
        "Five REST routes on API Gateway and a Node.js Lambda, with a static frontend on S3 and CloudFront.",
        "Events in MySQL (RDS); RSVPs in one DynamoDB table keyed by event and guest email.",
        "A DynamoDB transaction records each RSVP and updates its count together, rejecting duplicates with a 409.",
      ],
      repo: "https://github.com/Duaarondu/AWS-RSVP-WEBSITE",
    },
    {
      slug: "onlinestore",
      name: "OnlineStore",
      context: "CSCI 300 Database Management final project",
      role: "Three-person team",
      date: "November–December 2025",
      stack: ["Java", "Java Swing", "MySQL", "JDBC"],
      summary: "A desktop store app backed by MySQL.",
      bullets: [
        "Built the admin side: account management, employee, item and coupon creation, and order editing, using JDBC with parameterized queries.",
      ],
      repo: "https://github.com/Duaarondu/CSCI-300-Final-Project",
    },
  ] satisfies Project[],

  jobs: [
    {
      title: "Event Technology Specialist",
      company: "Ultimate Sound DJs",
      location: "Mineola, NY",
      dates: "August 2024 – present",
      bullets: [
        "Set up and ran event technology at about 200 weddings, sweet 16s and bar/bat mitzvahs: speakers, lighting, wireless mics, projectors and photo booths.",
        "Consolidated a year of about 2,000 venue-referred leads into one workbook, then checked and cleaned the data by hand.",
        "Found the venues sending the most leads, which led the business to host a showcase for venue partners with about 100 attendees.",
      ],
    },
  ] satisfies Job[],

  education: {
    school: "New York Institute of Technology",
    degree: "B.S. in Computer Science, Concentration in Artificial Intelligence",
    location: "Old Westbury, NY",
    graduation: "Expected December 2027",
    coursework: [
      "Programming for Artificial Intelligence (in progress)",
      "Artificial Intelligence I (in progress)",
      "Data Structures",
      "Discrete Structures",
      "Database Management",
      "Computer Organization and Architecture",
      "Theory of Computation",
    ],
  },

  /** Each tool says which project used it — skills with evidence. */
  toolkit: [
    {
      name: "LLMs and agents",
      tools: [
        { name: "Multi-agent orchestration", usedIn: ["nfl-agent"] },
        { name: "Hallucination detection", usedIn: ["nfl-agent"] },
        { name: "Grounded generation", usedIn: ["nfl-agent"] },
        { name: "Agent memory", usedIn: ["nfl-agent"] },
        { name: "NVIDIA Nemotron", usedIn: ["nfl-agent"] },
        { name: "Claude Code", usedIn: ["nfl-agent"] },
      ],
    },
    {
      name: "Languages",
      tools: [
        { name: "Python", usedIn: ["nfl-agent"] },
        { name: "Java", usedIn: ["lirr", "onlinestore"] },
        { name: "SQL", usedIn: ["nfl-agent", "rsvp", "onlinestore"] },
        { name: "JavaScript", usedIn: ["lirr", "rsvp"] },
      ],
    },
    {
      name: "Backend and cloud",
      tools: [
        { name: "AWS Lambda + API Gateway", usedIn: ["rsvp"] },
        { name: "S3 + CloudFront", usedIn: ["rsvp"] },
        { name: "Spring Boot", usedIn: ["lirr"] },
        { name: "Docker", usedIn: ["nfl-agent"] },
        { name: "GitHub Actions", usedIn: ["nfl-agent"] },
        { name: "Railway + Vercel", usedIn: ["lirr"] },
      ],
    },
    {
      name: "Data",
      tools: [
        { name: "Spark SQL (Zetaris)", usedIn: ["nfl-agent"] },
        { name: "DuckDB", usedIn: ["nfl-agent"] },
        { name: "DynamoDB", usedIn: ["rsvp"] },
        { name: "MySQL", usedIn: ["rsvp", "onlinestore"] },
      ],
    },
    {
      name: "Frontend and testing",
      tools: [
        { name: "React + React Leaflet", usedIn: ["lirr"] },
        { name: "pytest", usedIn: ["nfl-agent"] },
        { name: "Java Swing", usedIn: ["onlinestore"] },
      ],
    },
  ] satisfies ToolGroup[],
};

/** Short display names for the "used in" tags in the toolkit. */
export const projectShortNames: Record<string, string> = {
  "nfl-agent": "NFL Agent",
  lirr: "LIRR",
  rsvp: "RSVP",
  onlinestore: "OnlineStore",
};
