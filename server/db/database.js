import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = path.resolve(__dirname, '..', '..');
export const dataDir = path.resolve(__dirname, '..', 'data');
export const contentFile = path.resolve(dataDir, 'content.json');
export const publicDir = path.resolve(rootDir, 'public');
export const publicImagesDir = path.resolve(publicDir, 'images');

export function sanitizeFileName(filename) {
  const safeName = path.basename(String(filename || ''))
    .replace(/[^a-zA-Z0-9._-]/g, '');

  return safeName || 'upload.jpg';
}

export const defaultContent = {
  hero: {
    eyebrow: 'Zoology · Primatology · Conservation',
    tagline: 'Studying the primates others overlook — in the forests, markets, and communities of Bangladesh.',
    stats: [
      { id: 's1', num: '3+', label: 'Research Outputs' },
      { id: 's2', num: '4+', label: 'Years Fieldwork' },
      { id: 's3', num: '1k+', label: 'Students Reached' }
    ]
  },
  about: {
    bio_paragraphs: [
      'I am Mst. Sadia Afrin Shimu, a zoology researcher based in Bangladesh, focused on primate conservation, biodiversity documentation, environmental education, and field-based ecological research.',
      'My work bridges academic inquiry with on-the-ground conservation practice — studying Bengal slow lorises, documenting trafficking threats, raising awareness in school communities, and contributing to national biodiversity knowledge. I believe conservation starts with education, and education must be rooted in field reality.',
      "I am affiliated with Jagannath University, Dhaka, where I completed my BSc in Zoology and am continuing postgraduate research. My fieldwork has taken me across Bangladesh's forests, wetlands, and mangrove systems."
    ],
    details: [
      { id: 'd1', label: 'Institution', value: 'Jagannath University, Dhaka' },
      { id: 'd2', label: 'Discipline', value: 'Zoology / Wildlife Biology' },
      { id: 'd3', label: 'Specialization', value: 'Primatology, Conservation Ecology' },
      { id: 'd4', label: 'Region', value: 'Bangladesh' },
      { id: 'd5', label: 'Email', value: 'saditto.adiya@gmail.com' }
    ]
  },
  education: [
    {
      id: 'edu1',
      badge: 'MSc · In Progress',
      degree: 'Master of Science in Zoology',
      institution: 'Jagannath University, Dhaka',
      year: '[Expected Year]',
      details: [
        { label: 'Thesis', value: '[Add thesis title]' },
        { label: 'Focus', value: '[Add research focus]' },
        { label: 'Supervisor', value: '[Add supervisor name]' }
      ]
    },
    {
      id: 'edu2',
      badge: 'BSc · Completed',
      degree: 'Bachelor of Science in Zoology',
      institution: 'Jagannath University, Dhaka',
      year: '[Year] – [Year]',
      details: [
        { label: 'Project', value: '[Add project title]' },
        { label: 'Supervisor', value: '[Add name]' },
        { label: 'CGPA', value: '[Score] / 4.00' },
        { label: 'Responsibilities', value: 'Field work, data collection, analysis, report writing' }
      ]
    },
    {
      id: 'edu3',
      badge: 'Higher Secondary',
      degree: 'HSC — [College Name]',
      institution: '',
      year: '[Group] · [Year] · GPA [Score]',
      details: []
    },
    {
      id: 'edu4',
      badge: 'Secondary',
      degree: 'SSC — [School Name]',
      institution: '',
      year: '[Group] · [Year] · GPA [Score]',
      details: []
    }
  ],
  research: [
    {
      id: 'res1',
      tag: 'Current',
      title: '[Current Research Project Title]',
      description: '[Add project objective, target species or ecosystem, study location, methodology, and current status. What question are you trying to answer, and why does it matter for conservation in Bangladesh?]',
      location: '[Location]',
      year_start: '[Year]',
      year_end: 'Present',
      featured: true
    },
    {
      id: 'res2',
      tag: 'Past',
      title: 'Bengal Slow Loris Conservation & Awareness',
      description: 'Conservation-from-the-root awareness program targeting school communities to protect the Endangered Bengal slow loris in Bangladesh. Combined field observation with structured education outreach reaching over 1,000 students.',
      location: 'Bangladesh',
      year_start: '2023',
      year_end: '2024',
      featured: false
    },
    {
      id: 'res3',
      tag: 'Past',
      title: 'Non-Human Primate Trafficking Documentation',
      description: 'Field and market-based documentation of live primate trafficking patterns in Bangladesh, contributing to the first systematic overview of trafficking routes, species affected, and scale of threat to remaining wild populations.',
      location: 'Bangladesh',
      year_start: '2023',
      year_end: '2024',
      featured: false
    },
    {
      id: 'res4',
      tag: 'Past',
      title: 'Activity Budget & Home Range — Bengal Slow Loris',
      description: 'Behavioral ecology study tracking daily activity budgets and home range use of two confiscated Bengal slow lorises rehabilitated in a forest patch. Documented feeding, resting, travel, and social behaviors over multiple observation cycles.',
      location: 'Forest patch, Bangladesh',
      year_start: '2023',
      year_end: '2023',
      featured: false
    }
  ],
  publications: [
    {
      id: 'pub1',
      number: '01',
      title: 'Live non-human primate trafficking in Bangladesh: A growing threat to the remaining populations',
      journal: 'International Journal of Primatology',
      year: '2024',
      type: 'Journal Article',
      url: 'https://www.researchgate.net/publication/380436974_Live_non-human_primate_trafficking_in_Bangladesh_A_growing_threat_to_the_remaining_populations'
    },
    {
      id: 'pub2',
      number: '02',
      title: 'Conservation from the root: awareness-raising activities to conserve the Endangered Bengal slow loris in Bangladesh',
      journal: 'Conservation Outreach Record',
      year: '2024',
      type: 'Research Communication',
      url: 'https://www.researchgate.net/profile/Mst-Sadia-Afrin-Shimu'
    },
    {
      id: 'pub3',
      number: '03',
      title: 'Daily activity budget and home range of two confiscated Bengal Slow Loris in a forest patch of Bangladesh',
      journal: 'Wildlife & Biodiversity Study',
      year: '2023',
      type: 'Research Report',
      url: 'https://www.researchgate.net/profile/Mst-Sadia-Afrin-Shimu'
    }
  ],
  conference: [
    {
      id: 'conf1',
      title: '[Conference Title]',
      organizer: '[Organizer]',
      location: '[Location]',
      year: '[Year]',
      role: '[Presenter / Poster / Attendee]',
      topic: '[Topic title]'
    }
  ],
  field_cards: [
    {
      id: 'fc1',
      icon: 'fa-bug',
      title: 'Invertebrates',
      description: 'Field identification, collection methods, habitat notes, and ecological role documentation across diverse habitats.'
    },
    {
      id: 'fc2',
      icon: 'fa-paw',
      title: 'Vertebrates',
      description: 'Observation of amphibians, reptiles, birds, and mammals — behavioral notes and conservation status assessment.'
    },
    {
      id: 'fc3',
      icon: 'fa-fish',
      title: 'Aquatic Biodiversity',
      description: 'Fish diversity surveys, aquatic habitat assessment, ecosystem relationships, and freshwater documentation.'
    },
    {
      id: 'fc4',
      icon: 'fa-tree',
      title: 'Mangrove Ecosystems',
      description: 'Sundarbans and mangrove biodiversity study — species diversity, ecological adaptation, conservation challenges.'
    },
    {
      id: 'fc5',
      icon: 'fa-binoculars',
      title: 'Primate Surveys',
      description: 'Focal animal sampling, scan sampling, home range tracking, and behavioral observation of non-human primates.'
    },
    {
      id: 'fc6',
      icon: 'fa-camera',
      title: 'Field Documentation',
      description: 'Species photography, GPS-referenced observations, field notes, and data entry for biodiversity records.'
    }
  ],
  map_markers: [
    {
      id: 'm1',
      lat: 23.7337,
      lng: 90.3925,
      title: 'Jagannath University, Dhaka',
      desc: 'Home institution — BSc & MSc in Zoology'
    },
    {
      id: 'm2',
      lat: 21.9497,
      lng: 89.1833,
      title: 'Sundarbans',
      desc: 'Mangrove biodiversity & field ecology research'
    },
    {
      id: 'm3',
      lat: 22.8456,
      lng: 89.5403,
      title: 'Jessore / Southwest Bangladesh',
      desc: 'Primate survey and conservation outreach area'
    },
    {
      id: 'm4',
      lat: 24.3745,
      lng: 88.6042,
      title: 'Rajshahi Division',
      desc: 'Biodiversity field documentation site'
    },
    {
      id: 'm5',
      lat: 22.3569,
      lng: 91.7832,
      title: 'Chittagong Hill Tracts',
      desc: 'Forest primate habitat survey area'
    }
  ],
  skills: {
    groups: [
      {
        id: 'sg1',
        heading: 'Technical & Field',
        icon: 'fa-compass-drafting',
        items: [
          'Field survey design & execution',
          'Species identification & behavioral observation',
          'GPS & location documentation',
          'Data collection & spreadsheet management',
          'Basic GIS / map interpretation',
          'Camera trap setup & review',
          'Scientific report & poster preparation'
        ]
      },
      {
        id: 'sg2',
        heading: 'Laboratory & Dry-Lab',
        icon: 'fa-flask',
        items: [
          'Specimen observation & microscopy',
          'Biodiversity identification keys',
          'Literature review & synthesis',
          'Reference management',
          'Scientific writing & editing',
          'Basic statistical analysis'
        ]
      },
      {
        id: 'sg3',
        heading: 'Professional & Transferable',
        icon: 'fa-users',
        items: [
          'Team leadership & coordination',
          'Public speaking & outreach',
          'Conservation campaign planning',
          'Community engagement',
          'Environmental education design',
          'Bilingual communication (Bengali & English)'
        ]
      }
    ]
  },
  certificates: [
    {
      id: 'cert1',
      title: '[Certificate Title]',
      issuer: '[Issuer]',
      year: '[Year]',
      url: '#',
      icon: 'fa-certificate'
    },
    {
      id: 'cert2',
      title: 'ORCID',
      issuer: '',
      year: '',
      url: 'https://orcid.org/0009-0002-6192-1703',
      icon: 'fa-brands fa-orcid'
    },
    {
      id: 'cert3',
      title: 'ResearchGate',
      issuer: '',
      year: '',
      url: 'https://www.researchgate.net/profile/Mst-Sadia-Afrin-Shimu',
      icon: 'fa-brands fa-researchgate'
    }
  ],
  leadership: [
    {
      id: 'lead1',
      icon: 'fa-sitemap',
      title: 'Field & Project Coordination',
      description: '[Add role title, organization, dates, and specific responsibilities — coordination of field teams, logistics, data flow, and reporting.]'
    },
    {
      id: 'lead2',
      icon: 'fa-bullhorn',
      title: 'Conservation Outreach Leadership',
      description: 'Designed and led awareness programs in schools and communities, managing volunteers, scheduling sessions, and communicating conservation science to non-specialist audiences.'
    },
    {
      id: 'lead3',
      icon: 'fa-seedling',
      title: 'Nature Study & Club Activities',
      description: '[Add club name, university or organization, role, key activities, and notable outcomes — biodiversity campaigns, nature walks, student engagement events.]'
    },
    {
      id: 'lead4',
      icon: 'fa-hands-helping',
      title: 'Volunteer Work',
      description: 'Field assistance, event logistics support, awareness workshop facilitation, and team collaboration in conservation and research events across Bangladesh.'
    }
  ],
  gallery: [
    { id: 'gal1', filename: 'gallery-1.jpg', caption: '[Caption]' },
    { id: 'gal2', filename: 'gallery-2.jpg', caption: '[Caption]' },
    { id: 'gal3', filename: 'gallery-3.jpg', caption: '[Caption]' },
    { id: 'gal4', filename: 'gallery-4.jpg', caption: '[Caption]' },
    { id: 'gal5', filename: 'gallery-5.jpg', caption: '[Caption]' },
    { id: 'gal6', filename: 'gallery-6.jpg', caption: '[Caption]' }
  ],
  contact: {
    title: 'Academic Inquiries & Collaboration',
    subtitle: 'For research collaboration, conservation education, publication records, or academic correspondence — reach out directly.',
    items: [
      {
        id: 'ci1',
        icon: 'fa-envelope',
        label: 'Email',
        value: 'saditto.adiya@gmail.com',
        url: 'mailto:saditto.adiya@gmail.com'
      },
      {
        id: 'ci2',
        icon: 'fa-brands fa-orcid',
        label: 'ORCID',
        value: '0009-0002-6192-1703',
        url: 'https://orcid.org/0009-0002-6192-1703'
      },
      {
        id: 'ci3',
        icon: 'fa-brands fa-researchgate',
        label: 'ResearchGate',
        value: 'View Research Profile',
        url: 'https://www.researchgate.net/profile/Mst-Sadia-Afrin-Shimu'
      }
    ]
  }
};

const adapter = new JSONFile(contentFile);
export const db = new Low(adapter, defaultContent);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function withDefaults(current, defaults) {
  if (Array.isArray(defaults)) {
    return Array.isArray(current) ? current : clone(defaults);
  }

  if (defaults && typeof defaults === 'object') {
    const result = current && typeof current === 'object' && !Array.isArray(current)
      ? current
      : {};

    for (const [key, value] of Object.entries(defaults)) {
      result[key] = withDefaults(result[key], value);
    }

    return result;
  }

  return current === undefined ? defaults : current;
}

export async function initDb() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(publicImagesDir, { recursive: true });
  await db.read();
  db.data = withDefaults(db.data, defaultContent);
  await db.write();
}

export async function saveDb() {
  await db.write();
}
