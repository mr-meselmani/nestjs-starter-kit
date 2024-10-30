import { Post } from '@prisma/client';

// Dummy posts data
export const postData: Array<Pick<Post, 'userId' | 'title' | 'content'>> = [
  {
    userId: 2, // Make sure to use a valid user ID from your User table
    title: 'Understanding Localization in Software Development',
    content:
      'This article explains the importance of localization and how it can improve user experience.',
  },
  {
    userId: 2, // Change as needed for different users
    title: 'Top 10 JavaScript Frameworks in 2024',
    content:
      'A comprehensive look at the most popular JavaScript frameworks this year.',
  },
  {
    userId: 2, // Make sure to use valid user IDs
    title: 'Exploring the Future of AI in Development',
    content:
      'An insightful discussion on the role of AI in software development.',
  },
];
