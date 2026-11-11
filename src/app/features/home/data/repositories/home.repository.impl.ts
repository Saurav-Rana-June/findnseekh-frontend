import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HomeOverview } from '../../domain/entities/home.entity';
import { HomeRepository } from '../../domain/repositories/home.repository';

const INITIAL_HOME_OVERVIEW: HomeOverview = {
  popularSkills: ['Guitar', 'Yoga', 'Photography', 'Python Programming'],
  categories: [
    {
      id: 'music',
      title: 'Music',
      description: 'Vocals, guitar, keys, tabla and more.',
    },
    {
      id: 'dance',
      title: 'Dance',
      description: 'Classical, Bollywood, hip-hop and freestyle.',
    },
    {
      id: 'photography',
      title: 'Photography',
      description: 'Compose, shoot and edit like a pro.',
    },
    {
      id: 'art-craft',
      title: 'Art & Craft',
      description: 'Drawing, painting, pottery and DIY.',
    },
    {
      id: 'fitness-yoga',
      title: 'Fitness & Yoga',
      description: 'Yoga, strength and mindful movement.',
    },
    {
      id: 'cooking',
      title: 'Cooking',
      description: 'Home recipes, baking and regional cuisines.',
    },
    {
      id: 'technology',
      title: 'Technology',
      description: 'Coding, design tools and digital skills.',
    },
    {
      id: 'languages',
      title: 'Languages',
      description: 'Spoken English, Hindi, French and more.',
    },
  ],
  featuredTeachers: [
    {
      id: 'ananya-verma',
      name: 'Ananya Verma',
      category: 'Music',
      specialty: 'Hindustani Classical Vocals',
      location: 'Dehradun, Uttarakhand',
      experienceYears: 9,
      rating: 4.8,
      reviewCount: 64,
      avatarVariant: 'ananya',
    },
    {
      id: 'rohan-mehta',
      name: 'Rohan Mehta',
      category: 'Music',
      specialty: 'Guitar & Music Production',
      location: 'Delhi',
      experienceYears: 7,
      avatarVariant: 'rohan',
    },
    {
      id: 'kavya-nair',
      name: 'Kavya Nair',
      category: 'Dance',
      specialty: 'Kathak & Contemporary Dance',
      location: 'Noida, Uttar Pradesh',
      experienceYears: 11,
      rating: 4.9,
      reviewCount: 41,
      avatarVariant: 'kavya',
    },
    {
      id: 'imran-qureshi',
      name: 'Imran Qureshi',
      category: 'Photography',
      specialty: 'Portrait & Street Photography',
      location: 'Lucknow, Uttar Pradesh',
      experienceYears: 6,
      avatarVariant: 'imran',
    },
    {
      id: 'simran-kaur',
      name: 'Simran Kaur',
      category: 'Fitness & Yoga',
      specialty: 'Hatha & Vinyasa Yoga',
      location: 'Chandigarh',
      experienceYears: 8,
      rating: 4.7,
      reviewCount: 28,
      avatarVariant: 'simran',
    },
    {
      id: 'arjun-rao',
      name: 'Arjun Rao',
      category: 'Technology',
      specialty: 'Python & Web Development',
      location: 'Saharanpur, Uttar Pradesh',
      experienceYears: 5,
      avatarVariant: 'arjun',
    },
  ],
  steps: [
    {
      stepNumber: 1,
      icon: 'discover',
      title: 'Discover',
      description: 'Search for the skill you want to learn in your city.',
    },
    {
      stepNumber: 2,
      icon: 'explore',
      title: 'Explore',
      description: 'Browse teachers and their profiles to compare experience.',
    },
    {
      stepNumber: 3,
      icon: 'connect',
      title: 'Connect',
      description: 'Find the right teacher and start learning.',
    },
  ],
};

@Injectable()
export class HomeRepositoryImpl extends HomeRepository {
  override getOverview(): Observable<HomeOverview> {
    return of(INITIAL_HOME_OVERVIEW);
  }
}

