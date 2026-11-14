import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Teacher, TeacherFilterQuery } from '../../domain/entities/teacher.entity';
import { TeachersRepository } from '../../domain/repositories/teachers.repository';

const MOCK_TEACHERS: readonly Teacher[] = [
  {
    id: 'ananya-verma',
    name: 'Ananya Verma',
    category: 'Music',
    categoryId: 'music',
    specialty: 'Hindustani Classical Vocals',
    bio: 'Gold medalist from Gandharva Mahavidyalaya. Teaching classical khayal, thumri, and voice culture for 9+ years.',
    skills: ['Classical Vocals', 'Harmonium', 'Ragas', 'Voice Culture'],
    location: 'Dehradun, Uttarakhand',
    city: 'Dehradun',
    state: 'Uttarakhand',
    experienceYears: 9,
    hourlyRate: 700,
    teachingMode: 'both',
    verified: true,
    rating: { value: 4.8, count: 64 },
    avatar: {
      skin: '#C68B63',
      hair: '#1F2937',
      hairStyle: 'long',
      outfit: '#174E38',
      background: '#DCE9E1',
    },
  },
  {
    id: 'rohan-mehta',
    name: 'Rohan Mehta',
    category: 'Music',
    categoryId: 'music',
    specialty: 'Guitar & Music Production',
    bio: 'Independent session guitarist and certified sound engineer. Helping learners play songs from day one.',
    skills: ['Acoustic Guitar', 'Electric Guitar', 'Music Production', 'Fingerstyle'],
    location: 'Delhi',
    city: 'Delhi',
    state: 'NCT of Delhi',
    experienceYears: 7,
    hourlyRate: 850,
    teachingMode: 'both',
    verified: true,
    rating: { value: 4.9, count: 52 },
    avatar: {
      skin: '#A8714B',
      hair: '#2B1D16',
      hairStyle: 'short',
      outfit: '#5B8F76',
      background: '#EEF4F0',
    },
  },
  {
    id: 'kavya-nair',
    name: 'Kavya Nair',
    category: 'Dance',
    categoryId: 'dance',
    specialty: 'Kathak & Contemporary Dance',
    bio: 'Disciple of Pandit Birju Maharaj tradition. Specializes in graceful footwork, abhinaya, and stage presence.',
    skills: ['Kathak', 'Classical Indian', 'Contemporary', 'Semi-Classical'],
    location: 'Noida, Uttar Pradesh',
    city: 'Noida',
    state: 'Uttar Pradesh',
    experienceYears: 11,
    hourlyRate: 600,
    teachingMode: 'both',
    verified: true,
    rating: { value: 4.9, count: 41 },
    avatar: {
      skin: '#D9A07A',
      hair: '#2B1D16',
      hairStyle: 'bun',
      outfit: '#1F6048',
      background: '#E7EFE9',
    },
  },
  {
    id: 'imran-qureshi',
    name: 'Imran Qureshi',
    category: 'Photography',
    categoryId: 'photography',
    specialty: 'Portrait & Street Photography',
    bio: 'Published travel photographer and Lightroom educator. Learn manual exposure, composition, and visual storytelling.',
    skills: ['DSLR Basics', 'Portrait Photography', 'Lightroom Editing', 'Street Photography'],
    location: 'Lucknow, Uttar Pradesh',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    experienceYears: 6,
    hourlyRate: 500,
    teachingMode: 'offline',
    verified: true,
    avatar: {
      skin: '#B97F59',
      hair: '#1F2937',
      hairStyle: 'curly',
      outfit: '#2E4A3F',
      background: '#EFEFE5',
    },
  },
  {
    id: 'simran-kaur',
    name: 'Simran Kaur',
    category: 'Fitness & Yoga',
    categoryId: 'fitness-yoga',
    specialty: 'Hatha & Vinyasa Yoga',
    bio: '500-hour certified Yoga Alliance instructor from Rishikesh. Gentle guidance for flexibility, posture, and inner calm.',
    skills: ['Hatha Yoga', 'Pranayama', 'Vinyasa Flow', 'Meditation'],
    location: 'Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    experienceYears: 8,
    hourlyRate: 450,
    teachingMode: 'both',
    verified: true,
    rating: { value: 4.7, count: 28 },
    avatar: {
      skin: '#E0AC85',
      hair: '#3A2A20',
      hairStyle: 'long',
      outfit: '#7FA894',
      background: '#DCE9E1',
    },
  },
  {
    id: 'arjun-rao',
    name: 'Arjun Rao',
    category: 'Technology',
    categoryId: 'technology',
    specialty: 'Python & Web Development',
    bio: 'Senior Software Engineer with passion for teaching. Practical, project-based learning for beginners to advanced.',
    skills: ['Python', 'Web Development', 'Django', 'FastAPI', 'JavaScript'],
    location: 'Saharanpur, Uttar Pradesh',
    city: 'Saharanpur',
    state: 'Uttar Pradesh',
    experienceYears: 5,
    hourlyRate: 650,
    teachingMode: 'online',
    verified: true,
    avatar: {
      skin: '#9C6642',
      hair: '#1F2937',
      hairStyle: 'short',
      outfit: '#174E38',
      background: '#EEF4F0',
    },
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    category: 'Cooking',
    categoryId: 'cooking',
    specialty: 'Artisanal Baking & Pastry Arts',
    bio: 'Le Cordon Bleu alumnus teaching artisan sourdough, French pastries, eggless desserts, and fondant decorating.',
    skills: ['Baking', 'Sourdough', 'Cake Decoration', 'French Pastry'],
    location: 'Dehradun, Uttarakhand',
    city: 'Dehradun',
    state: 'Uttarakhand',
    experienceYears: 6,
    hourlyRate: 800,
    teachingMode: 'offline',
    verified: true,
    rating: { value: 4.9, count: 35 },
    avatar: {
      skin: '#C68B63',
      hair: '#1F2937',
      hairStyle: 'bun',
      outfit: '#5B8F76',
      background: '#E7EFE9',
    },
  },
  {
    id: 'david-wilson',
    name: 'David Wilson',
    category: 'Languages',
    categoryId: 'languages',
    specialty: 'Spoken English & IELTS Prep',
    bio: 'CELTA-certified British Council trainer. Over 10 years helping professionals achieve Band 8+ in IELTS.',
    skills: ['Spoken English', 'IELTS Preparation', 'Business Communication', 'Accent Training'],
    location: 'Delhi',
    city: 'Delhi',
    state: 'NCT of Delhi',
    experienceYears: 10,
    hourlyRate: 900,
    teachingMode: 'both',
    verified: true,
    rating: { value: 4.8, count: 59 },
    avatar: {
      skin: '#D9A07A',
      hair: '#2B1D16',
      hairStyle: 'short',
      outfit: '#174E38',
      background: '#DCE9E1',
    },
  },
  {
    id: 'meera-joshi',
    name: 'Meera Joshi',
    category: 'Art & Craft',
    categoryId: 'art-craft',
    specialty: 'Watercolor & Botanical Illustration',
    bio: 'Fine Arts graduate specializing in loose watercolor florals, botanical paintings, and mindful sketchbook habits.',
    skills: ['Watercolor', 'Botanical Art', 'Sketching', 'Acrylics'],
    location: 'Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    experienceYears: 7,
    hourlyRate: 500,
    teachingMode: 'both',
    verified: true,
    rating: { value: 4.9, count: 47 },
    avatar: {
      skin: '#E0AC85',
      hair: '#3A2A20',
      hairStyle: 'long',
      outfit: '#7FA894',
      background: '#EEF4F0',
    },
  },
  {
    id: 'vikram-aditya',
    name: 'Vikram Aditya',
    category: 'Music',
    categoryId: 'music',
    specialty: 'Tabla & Indian Rhythm Systems',
    bio: 'Delhi & Farrukhabad Gharana exponent. Structured rhythm lessons covering TeenTaal, Kaidas, and stage accompaniment.',
    skills: ['Tabla', 'Rhythm & Beats', 'Percussion', 'Accompaniment'],
    location: 'Lucknow, Uttar Pradesh',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    experienceYears: 12,
    hourlyRate: 600,
    teachingMode: 'offline',
    verified: true,
    rating: { value: 4.8, count: 39 },
    avatar: {
      skin: '#9C6642',
      hair: '#1F2937',
      hairStyle: 'short',
      outfit: '#2E4A3F',
      background: '#EFEFE5',
    },
  },
  {
    id: 'neha-gupta',
    name: 'Neha Gupta',
    category: 'Dance',
    categoryId: 'dance',
    specialty: 'Bollywood & Freestyle Choreography',
    bio: 'Former reality show choreographer. High-energy Bollywood dance, wedding choreography, and fitness routines.',
    skills: ['Bollywood Dance', 'Freestyle', 'Wedding Choreography', 'Zumba'],
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    experienceYears: 8,
    hourlyRate: 750,
    teachingMode: 'both',
    verified: true,
    rating: { value: 4.7, count: 44 },
    avatar: {
      skin: '#C68B63',
      hair: '#1F2937',
      hairStyle: 'long',
      outfit: '#1F6048',
      background: '#DCE9E1',
    },
  },
  {
    id: 'siddharth-sen',
    name: 'Siddharth Sen',
    category: 'Technology',
    categoryId: 'technology',
    specialty: 'Full-Stack JavaScript & Angular',
    bio: 'Tech lead with 8+ years building enterprise web apps. Interactive code walkthroughs and real portfolio project mentorship.',
    skills: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'UI/UX'],
    location: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    state: 'Karnataka',
    experienceYears: 8,
    hourlyRate: 950,
    teachingMode: 'online',
    verified: true,
    rating: { value: 5.0, count: 31 },
    avatar: {
      skin: '#A8714B',
      hair: '#2B1D16',
      hairStyle: 'short',
      outfit: '#174E38',
      background: '#EEF4F0',
    },
  },
];

@Injectable()
export class TeachersRepositoryImpl extends TeachersRepository {
  override getTeachers(filter?: TeacherFilterQuery): Observable<readonly Teacher[]> {
    let result = [...MOCK_TEACHERS];

    if (!filter) {
      return of(result);
    }

    const { query, location, category, mode, minExperience, sortBy } = filter;

    // Filter by text query (matches skill, specialty, category, or teacher name)
    if (query && query.trim().length > 0) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.specialty.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }

    // Filter by location
    if (location && location.trim().length > 0) {
      const loc = location.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.location.toLowerCase().includes(loc) ||
          t.city.toLowerCase().includes(loc) ||
          t.state.toLowerCase().includes(loc),
      );
    }

    // Filter by category
    if (category && category !== 'all' && category.trim().length > 0) {
      const cat = category.trim().toLowerCase();
      result = result.filter(
        (t) => t.categoryId.toLowerCase() === cat || t.category.toLowerCase() === cat,
      );
    }

    // Filter by mode
    if (mode && mode !== 'all') {
      result = result.filter((t) => t.teachingMode === mode || t.teachingMode === 'both');
    }

    // Filter by experience
    if (minExperience && minExperience > 0) {
      result = result.filter((t) => t.experienceYears >= minExperience);
    }

    // Sort
    if (sortBy) {
      switch (sortBy) {
        case 'rating':
          result.sort((a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0));
          break;
        case 'experience':
          result.sort((a, b) => b.experienceYears - a.experienceYears);
          break;
        case 'price-asc':
          result.sort((a, b) => (a.hourlyRate ?? 0) - (b.hourlyRate ?? 0));
          break;
        case 'price-desc':
          result.sort((a, b) => (b.hourlyRate ?? 0) - (a.hourlyRate ?? 0));
          break;
        case 'recommended':
        default:
          // Keep default curated ranking
          break;
      }
    }

    return of(result);
  }

  override getTeacherById(id: string): Observable<Teacher | null> {
    const teacher = MOCK_TEACHERS.find((t) => t.id === id) ?? null;
    return of(teacher);
  }
}

