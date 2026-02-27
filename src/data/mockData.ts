export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor';
  avatar: string;
  bio: string;
  skills: string[];
  interests: string[];
  branch: string;
  year: number;
  compatibility?: number;
  badges: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  members: string[];
  status: 'ongoing' | 'completed' | 'idea';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: 'hackathon' | 'workshop' | 'seminar';
}

export interface MicroTask {
  id: string;
  title: string;
  description: string;
  author: string;
  skillsRequired: string[];
  reward: string;
  createdAt: string;
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/alex/200',
    bio: 'Full-stack developer passionate about AI and sustainability.',
    skills: ['React', 'Node.js', 'Python', 'TensorFlow'],
    interests: ['Green Tech', 'Machine Learning', 'Open Source'],
    branch: 'Computer Science',
    year: 3,
    compatibility: 95,
    badges: ['Hackathon Pro', 'Top Contributor']
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/sarah/200',
    bio: 'UI/UX Designer with a love for clean aesthetics and user-centric design.',
    skills: ['Figma', 'Adobe XD', 'CSS', 'Tailwind'],
    interests: ['Design Systems', 'Accessibility', 'Web3'],
    branch: 'Information Technology',
    year: 2,
    compatibility: 88,
    badges: ['Design Guru']
  },
  {
    id: '3',
    name: 'Dr. Robert Miller',
    email: 'robert@example.edu',
    role: 'mentor',
    avatar: 'https://picsum.photos/seed/robert/200',
    bio: 'Professor of Data Science with 15 years of industry experience.',
    skills: ['Data Analysis', 'R', 'Statistics', 'Leadership'],
    interests: ['Big Data', 'Ethics in AI'],
    branch: 'Data Science',
    year: 0,
    badges: ['Expert Mentor']
  },
  {
    id: '4',
    name: 'Priya Sharma',
    email: 'priya@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/priya/200',
    bio: 'Backend enthusiast and competitive programmer.',
    skills: ['C++', 'Java', 'SQL', 'Docker'],
    interests: ['Distributed Systems', 'Cloud Computing'],
    branch: 'Computer Science',
    year: 4,
    compatibility: 82,
    badges: ['Code Master']
  },
  {
    id: '5',
    name: 'Michael Rodriguez',
    email: 'michael@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/michael/200',
    bio: 'Mobile app developer specializing in iOS and React Native.',
    skills: ['Swift', 'React Native', 'Firebase', 'GraphQL'],
    interests: ['Mobile Development', 'UI/UX', 'Startups'],
    branch: 'Computer Science',
    year: 3,
    compatibility: 91,
    badges: ['Mobile Expert', 'Innovation Award']
  },
  {
    id: '6',
    name: 'Emma Thompson',
    email: 'emma@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/emma/200',
    bio: 'Data science enthusiast with a passion for visualization and storytelling.',
    skills: ['Python', 'R', 'Tableau', 'Machine Learning'],
    interests: ['Data Visualization', 'Climate Science', 'Education'],
    branch: 'Data Science',
    year: 2,
    compatibility: 87,
    badges: ['Data Wizard', 'Research Star']
  },
  {
    id: '7',
    name: 'James Wilson',
    email: 'james@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/james/200',
    bio: 'DevOps engineer focused on automation and cloud infrastructure.',
    skills: ['AWS', 'Kubernetes', 'Jenkins', 'Terraform'],
    interests: ['Cloud Architecture', 'Automation', 'Security'],
    branch: 'Information Technology',
    year: 4,
    compatibility: 79,
    badges: ['Cloud Master', 'DevOps Pro']
  },
  {
    id: '8',
    name: 'Lisa Park',
    email: 'lisa@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/lisa/200',
    bio: 'Game developer and creative coder who loves bringing ideas to life.',
    skills: ['Unity', 'C#', 'Blender', 'WebGL'],
    interests: ['Game Development', '3D Art', 'VR/AR'],
    branch: 'Computer Science',
    year: 3,
    compatibility: 85,
    badges: ['Game Dev Champion', 'Creative Genius']
  },
  {
    id: '9',
    name: 'Dr. Amanda Foster',
    email: 'amanda@example.edu',
    role: 'mentor',
    avatar: 'https://picsum.photos/seed/amanda/200',
    bio: 'AI researcher specializing in natural language processing and ethics.',
    skills: ['NLP', 'Python', 'Research Methods', 'Academic Writing'],
    interests: ['AI Ethics', 'Linguistics', 'Research'],
    branch: 'Artificial Intelligence',
    year: 0,
    badges: ['AI Pioneer', 'Research Leader']
  },
  {
    id: '10',
    name: 'David Kim',
    email: 'david@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/david/200',
    bio: 'Blockchain developer interested in decentralized applications and smart contracts.',
    skills: ['Solidity', 'Web3.js', 'Ethereum', 'Rust'],
    interests: ['Blockchain', 'DeFi', 'Smart Contracts'],
    branch: 'Computer Science',
    year: 4,
    compatibility: 83,
    badges: ['Blockchain Expert', 'Crypto Pioneer']
  },
  {
    id: '11',
    name: 'Sophia Martinez',
    email: 'sophia@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/sophia/200',
    bio: 'Frontend developer with an eye for detail and user experience.',
    skills: ['Vue.js', 'TypeScript', 'SASS', 'Webpack'],
    interests: ['Frontend Architecture', 'Performance', 'Design'],
    branch: 'Information Technology',
    year: 2,
    compatibility: 90,
    badges: ['Frontend Master', 'UX Enthusiast']
  },
  {
    id: '12',
    name: 'Ryan Cooper',
    email: 'ryan@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/ryan/200',
    bio: 'Cybersecurity specialist focused on ethical hacking and system security.',
    skills: ['Penetration Testing', 'Network Security', 'Python', 'Metasploit'],
    interests: ['Cybersecurity', 'Ethical Hacking', 'Digital Forensics'],
    branch: 'Cybersecurity',
    year: 3,
    compatibility: 77,
    badges: ['Security Expert', 'Ethical Hacker']
  },
  {
    id: '13',
    name: 'Dr. Jennifer Lee',
    email: 'jennifer@example.edu',
    role: 'mentor',
    avatar: 'https://picsum.photos/seed/jennifer/200',
    bio: 'Software engineering professor with expertise in scalable systems.',
    skills: ['Software Architecture', 'System Design', 'Java', 'Microservices'],
    interests: ['Scalable Systems', 'Software Engineering', 'Mentoring'],
    branch: 'Software Engineering',
    year: 0,
    badges: ['Architecture Guru', 'Mentor of the Year']
  },
  {
    id: '14',
    name: 'Oliver Brown',
    email: 'oliver@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/oliver/200',
    bio: 'IoT developer building smart home and industrial automation solutions.',
    skills: ['Arduino', 'Raspberry Pi', 'Embedded C', 'MQTT'],
    interests: ['IoT', 'Hardware', 'Automation', 'Smart Cities'],
    branch: 'Electronics Engineering',
    year: 3,
    compatibility: 81,
    badges: ['IoT Innovator', 'Hardware Hacker']
  },
  {
    id: '15',
    name: 'Nina Patel',
    email: 'nina@example.edu',
    role: 'student',
    avatar: 'https://picsum.photos/seed/nina/200',
    bio: 'Product management student with a background in business analytics.',
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'SQL'],
    interests: ['Product Management', 'Business Strategy', 'Analytics'],
    branch: 'Business Administration',
    year: 2,
    compatibility: 86,
    badges: ['Product Star', 'Analytics Pro']
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'EcoTrack App',
    description: 'A mobile app to track personal carbon footprint using real-time data.',
    tags: ['Mobile', 'Sustainability', 'React Native'],
    members: ['1', '2'],
    status: 'ongoing'
  },
  {
    id: 'p2',
    title: 'Campus Marketplace',
    description: 'A peer-to-peer marketplace for students to buy and sell textbooks.',
    tags: ['Web', 'E-commerce', 'Firebase'],
    members: ['4'],
    status: 'idea'
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Spring Hackathon 2026',
    date: '2026-03-15',
    location: 'Main Hall',
    type: 'hackathon'
  },
  {
    id: 'e2',
    title: 'AI Ethics Workshop',
    date: '2026-03-20',
    location: 'Online',
    type: 'workshop'
  }
];

export const MOCK_TASKS: MicroTask[] = [
  {
    id: 't1',
    title: 'Need help with CSS Grid',
    description: 'I am struggling with a complex layout for my portfolio.',
    author: 'Sarah Chen',
    skillsRequired: ['CSS', 'HTML'],
    reward: 'Coffee / Shoutout',
    createdAt: '2026-02-25'
  },
  {
    id: 't2',
    title: 'Python Script Debugging',
    description: 'My data processing script is throwing a memory error.',
    author: 'Alex Johnson',
    skillsRequired: ['Python', 'Debugging'],
    reward: 'Peer Review',
    createdAt: '2026-02-26'
  }
];
