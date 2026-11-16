import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import {
  Teacher,
  TeacherEnquiryPayload,
  TeacherEnquiryResult,
  TeacherFilterQuery,
} from '../../domain/entities/teacher.entity';
import { TeachersRepository } from '../../domain/repositories/teachers.repository';
import {
  toTeacherCardEntity,
  toTeacherDetailEntity,
  toTeacherEnquiryResult,
} from '../models/teacher.dto';
import { TeachersApiService } from '../services/teachers-api.service';

const MOCK_TEACHERS: readonly Teacher[] = [
  {
    id: 'ananya-verma',
    name: 'Ananya Verma',
    category: 'Music',
    categoryId: 'music',
    specialty: 'Hindustani Classical Vocals',
    bio: 'Trained in the Kirana gharana. Gentle, structured guidance for classical and light vocals.',
    skills: ['Classical Vocals', 'Harmonium', 'Ragas'],
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
    id: 'simran-kaur',
    name: 'Simran Kaur',
    category: 'Fitness & Yoga',
    categoryId: 'fitness-yoga',
    specialty: 'Hatha & Vinyasa Yoga',
    bio: 'Calm, alignment-focused classes for stiff bodies, stress relief, and breathing.',
    skills: ['Hatha Yoga', 'Vinyasa', 'Pranayama'],
    location: 'Chandigarh, Punjab',
    city: 'Chandigarh',
    state: 'Punjab',
    experienceYears: 6,
    hourlyRate: 550,
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
    id: 'neha-gupta',
    name: 'Neha Gupta',
    category: 'Dance',
    categoryId: 'dance',
    specialty: 'Bollywood & Freestyle Choreography',
    bio: 'Former reality-show choreographer. High-energy Bollywood dance, wedding choreography, and..',
    skills: ['Bollywood Dance', 'Freestyle', 'Wedding Choreography'],
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
    bio: 'Tech lead with eight years building enterprise web apps. Interactive code walkthroughs and real..',
    skills: ['JavaScript', 'TypeScript', 'Angular'],
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
      background: '#DCE9E1',
    },
  },
  {
    id: 'kavya-nair',
    name: 'Kavya Nair',
    category: 'Dance',
    categoryId: 'dance',
    specialty: 'Kathak & Contemporary Dance',
    bio: 'Eleven years on stage. Technique, expression and performance prep for all ages.',
    skills: ['Kathak', 'Contemporary', 'Stage'],
    location: 'Noida, Uttar Pradesh',
    city: 'Noida',
    state: 'Uttar Pradesh',
    experienceYears: 11,
    hourlyRate: 800,
    teachingMode: 'offline',
    verified: true,
    rating: { value: 4.9, count: 41 },
    avatar: {
      skin: '#D9A07A',
      hair: '#2B1D16',
      hairStyle: 'bun',
      outfit: '#1F6048',
      background: '#DCE9E1',
    },
  },
  {
    id: 'vikram-aditya',
    name: 'Vikram Aditya',
    category: 'Music',
    categoryId: 'music',
    specialty: 'Tabla & Indian Rhythm Systems',
    bio: 'Delhi and Farrukhabad gharana exponent. Structured rhythm lessons covering TeenTaal, kaidas and stage accompaniment.',
    skills: ['Tabla', 'Rhythm & Beats', 'Percussion'],
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
      background: '#DCE9E1',
    },
  },
  {
    id: 'meera-joshi',
    name: 'Meera Joshi',
    category: 'Cooking',
    categoryId: 'cooking',
    specialty: 'Home Baking & Patisserie',
    bio: 'Fluffy cakes and artisan cookies using a home oven. Small batches, clear recipes.',
    skills: ['Baking', 'Patisserie', 'Cookies'],
    location: 'Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    experienceYears: 10,
    hourlyRate: 700,
    teachingMode: 'offline',
    verified: true,
    rating: { value: 4.9, count: 47 },
    avatar: {
      skin: '#E0AC85',
      hair: '#3A2A20',
      hairStyle: 'long',
      outfit: '#7FA894',
      background: '#DCE9E1',
    },
  },
  {
    id: 'david-wilson',
    name: 'David Wilson',
    category: 'Languages',
    categoryId: 'languages',
    specialty: 'Spoken English & IELTS',
    bio: 'Fluency drills, mock interviews and IELTS speaking practice with feedback.',
    skills: ['Spoken English', 'IELTS', 'Fluency'],
    location: 'Hyderabad, Telangana',
    city: 'Hyderabad',
    state: 'Telangana',
    experienceYears: 9,
    hourlyRate: 400,
    teachingMode: 'online',
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
    id: 'rohan-mehta',
    name: 'Rohan Mehta',
    category: 'Music',
    categoryId: 'music',
    specialty: 'Guitar & Music Production',
    bio: 'Learn chords, fingerstyle and how to record your first song at home.',
    skills: ['Acoustic Guitar', 'Fingerstyle', 'Production'],
    location: 'Delhi, NCT of Delhi',
    city: 'Delhi',
    state: 'NCT of Delhi',
    experienceYears: 7,
    hourlyRate: 650,
    teachingMode: 'both',
    verified: true,
    rating: { value: 4.9, count: 52 },
    avatar: {
      skin: '#A8714B',
      hair: '#2B1D16',
      hairStyle: 'short',
      outfit: '#5B8F76',
      background: '#DCE9E1',
    },
  },
  {
    id: 'arjun-rao',
    name: 'Arjun Rao',
    category: 'Technology',
    categoryId: 'technology',
    specialty: 'Python & Web Development',
    bio: 'Practical, project-based Python and web app development for beginners.',
    skills: ['Python', 'Django', 'FastAPI'],
    location: 'Saharanpur, Uttar Pradesh',
    city: 'Saharanpur',
    state: 'Uttar Pradesh',
    experienceYears: 5,
    hourlyRate: 500,
    teachingMode: 'online',
    verified: true,
    rating: { value: 4.8, count: 35 },
    avatar: {
      skin: '#9C6642',
      hair: '#1F2937',
      hairStyle: 'short',
      outfit: '#174E38',
      background: '#DCE9E1',
    },
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    category: 'Art & Craft',
    categoryId: 'art-craft',
    specialty: 'Watercolor & Botanical Art',
    bio: 'Mindful sketchbook habits and botanical illustration with loose watercolor.',
    skills: ['Watercolor', 'Botanical Art', 'Sketching'],
    location: 'Dehradun, Uttarakhand',
    city: 'Dehradun',
    state: 'Uttarakhand',
    experienceYears: 6,
    hourlyRate: 800,
    teachingMode: 'both',
    verified: true,
    rating: { value: 4.9, count: 42 },
    avatar: {
      skin: '#C68B63',
      hair: '#1F2937',
      hairStyle: 'bun',
      outfit: '#5B8F76',
      background: '#DCE9E1',
    },
  },
  {
    id: 'imran-qureshi',
    name: 'Imran Qureshi',
    category: 'Photography',
    categoryId: 'photography',
    specialty: 'Portrait & Street Photography',
    bio: 'DSLR fundamentals, manual exposure, composition and visual storytelling.',
    skills: ['DSLR Basics', 'Portrait', 'Lightroom'],
    location: 'Lucknow, Uttar Pradesh',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    experienceYears: 6,
    hourlyRate: 550,
    teachingMode: 'offline',
    verified: true,
    rating: { value: 4.7, count: 38 },
    avatar: {
      skin: '#B97F59',
      hair: '#1F2937',
      hairStyle: 'curly',
      outfit: '#2E4A3F',
      background: '#DCE9E1',
    },
  },
];

@Injectable()
export class TeachersRepositoryImpl extends TeachersRepository {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiService = inject(TeachersApiService, { optional: true });

  override getTeachers(filter?: TeacherFilterQuery): Observable<readonly Teacher[]> {
    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.getTeachers(filter).pipe(
        map((res) => {
          if (res.data?.teachers && res.data.teachers.length > 0) {
            return res.data.teachers.map((t, idx) => toTeacherCardEntity(t, idx));
          }
          return this.getMockTeachers(filter);
        }),
        catchError(() => of(this.getMockTeachers(filter))),
      );
    }
    return of(this.getMockTeachers(filter));
  }

  override getTeacherById(id: string): Observable<Teacher | null> {
    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService.getTeacherDetail(id).pipe(
        map((res) => {
          if (res.data) {
            return toTeacherDetailEntity(res.data);
          }
          return this.getMockTeacherById(id);
        }),
        catchError(() => of(this.getMockTeacherById(id))),
      );
    }
    return of(this.getMockTeacherById(id));
  }

  override sendEnquiry(
    teacherId: string | number,
    payload: TeacherEnquiryPayload,
  ): Observable<TeacherEnquiryResult> {
    if (isPlatformBrowser(this.platformId) && this.apiService) {
      return this.apiService
        .sendEnquiry(teacherId, {
          teaching_mode: payload.teachingMode,
          preferred_date: payload.preferredDate,
          message: payload.message,
          skill_listing_id: payload.skillListingId,
        })
        .pipe(
          map((res) => toTeacherEnquiryResult(res.data)),
          catchError(() =>
            of({
              id: Date.now(),
              teacherId: Number(teacherId) || 101,
              teachingMode: payload.teachingMode || 'online',
              preferredDate: payload.preferredDate,
              message: payload.message || 'Enquiry',
              status: 'pending',
              createdAt: new Date().toISOString(),
            }),
          ),
        );
    }

    return of({
      id: Date.now(),
      teacherId: Number(teacherId) || 101,
      teachingMode: payload.teachingMode || 'online',
      preferredDate: payload.preferredDate,
      message: payload.message || 'Enquiry',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  }

  private getMockTeachers(filter?: TeacherFilterQuery): readonly Teacher[] {
    let result = [...MOCK_TEACHERS];

    if (!filter) {
      return result;
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
          break;
      }
    }

    return result;
  }

  private getMockTeacherById(id: string): Teacher | null {
    const teacher =
      MOCK_TEACHERS.find((t) => t.id === id) ||
      MOCK_TEACHERS.find((t) => t.id.includes(id) || id.includes(t.id));
    if (!teacher) {
      return null;
    }

    const enriched: Teacher = {
      ...teacher,
      about:
        teacher.about ||
        `${teacher.bio} With over ${teacher.experienceYears} years of teaching and stage experience, I believe learning should be structured yet enjoyable. My lessons are tailored to each student's pace, whether you are picking up this skill as a beginner hobby or preparing for advanced performances and certifications.`,
      languages: teacher.languages || ['English', 'Hindi'],
      qualifications: teacher.qualifications || [
        `${teacher.experienceYears}+ years of teaching & professional practice`,
        `Certified instructor in ${teacher.category}`,
        `Mentored 150+ students across India and abroad`,
      ],
      reviews: teacher.reviews || [
        {
          id: 'rev-1',
          studentName: 'Aarav Patel',
          rating: 5,
          date: '2 weeks ago',
          comment: `Amazing teacher! Extremely patient and gives personalized feedback after every class. Highly recommended.`,
        },
        {
          id: 'rev-2',
          studentName: 'Pooja Sharma',
          rating: 5,
          date: '1 month ago',
          comment: `I have seen huge improvement in my technique within just 4 sessions. Very organized and knowledgeable.`,
        },
        {
          id: 'rev-3',
          studentName: 'Rohan Verma',
          rating: 4.8,
          date: '2 months ago',
          comment: `Great guidance and step-by-step methodology. Always on time and very encouraging.`,
        },
      ],
      faqs: teacher.faqs || [
        {
          question: 'What should I prepare for the first trial session?',
          answer: `Just bring your enthusiasm! For online lessons, ensure a quiet space and a stable internet connection. If instruments or materials are required, I will guide you on what to acquire before subsequent classes.`,
        },
        {
          question: 'How do online sessions work?',
          answer: `We connect over Google Meet or Zoom. I use high-definition audio and multi-angle camera setups to ensure you can clearly see techniques and posture. After each session, you receive notes and practice exercises.`,
        },
        {
          question: 'Can I reschedule or cancel a class?',
          answer: `Yes, you can easily reschedule anytime up to 6 hours before the scheduled session with no cancellation fee.`,
        },
      ],
    };

    return enriched;
  }
}
