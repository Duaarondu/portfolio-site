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

export type Claim = {
  /** The number being checked, shown highlighted, e.g. "612" */
  value: string;
  /** The sentence around it. Use {value} where the number goes. */
  text: string;
  /** Where the number can be verified */
  source: Link;
};

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
};

export type Job = {
  title: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
};

export type ToolGroup = {
  name: string;
  tools: { name: string; usedIn: string[] }[];
};

const NFL_REPO = "https://github.com/Duaarondu/nfl-agent";

export const profile = {
  name: "Aaron Du",
  headline: "I build LLM agents that check their own work.",
  intro:
    "Computer Science student at NYIT (graduating December 2027) building LLM applications and the backend systems around them. Based on Long Island, looking for Summer 2027 software and AI engineering internships in New York City.",
  workAuth: "U.S. citizen",
  location: "Mineola, NY",
  links: {
    email: "duaarondu@gmail.com",
    github: "https://github.com/Duaarondu",
    linkedin: "https://www.linkedin.com/in/duaarondu",
  },

  /** The hero "claim check" panel. Every claim links to evidence. */
  claims: [
    {
      value: "612",
      text: "{value} tests in the pytest suite",
      source: { label: "nfl-agent / tests", href: NFL_REPO },
    },
    {
      value: "278",
      text: "{value} distinct live queries, 0 SQL errors",
      source: { label: "nfl-agent / query sweep", href: NFL_REPO },
    },
    {
      value: "13/13",
      text: "{value} on the H-MEM memory conformance suite",
      source: { label: "nfl-agent / memory", href: NFL_REPO },
    },
    {
      value: "82%",
      text: "{value} of commits on a two-person team",
      source: { label: "nfl-agent / contributors", href: NFL_REPO },
    },
  ] satisfies Claim[],

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
    degree: "B.S. in Computer Science",
    location: "Old Westbury, NY",
    graduation: "Expected December 2027",
    coursework: [
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
