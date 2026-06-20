// data/dsa-topics.ts - DSA Topics and Company Weights Configuration
// Customized question counts based on user's A2Z DSA Sheet analysis

import { Topic, CompanyReadiness } from '../types';

export const DSA_TOPICS: Topic[] = [
  // ==================== CORE TOPICS (Weight 5) ====================
  // These are the fundamental topics that appear in 80%+ of FAANG interviews

  // Learn the Basics - CUSTOMIZED: 54 questions (user specified)
  {
    id: 'basics',
    name: 'Learn the Basics',
    weight: 5,
    category: 'core',
    solved: 0,
    total: 54,
    companies: ['google', 'meta', 'amazon', 'microsoft', 'apple'],
  },
  // Sorting Techniques
  {
    id: 'sorting',
    name: 'Sorting Techniques',
    weight: 5,
    category: 'core',
    solved: 0,
    total: 7,
    companies: ['google', 'amazon', 'microsoft'],
  },
  // Arrays - CUSTOMIZED: 55 questions (user specified)
  {
    id: 'arrays',
    name: 'Arrays',
    weight: 5,
    category: 'core',
    solved: 0,
    total: 55,
    companies: ['google', 'meta', 'amazon', 'microsoft', 'apple'],
  },
  // Binary Search
  {
    id: 'binsearch',
    name: 'Binary Search',
    weight: 5,
    category: 'core',
    solved: 0,
    total: 32,
    companies: ['google', 'amazon', 'microsoft'],
  },
  // Strings
  {
    id: 'strings',
    name: 'Strings',
    weight: 5,
    category: 'core',
    solved: 0,
    total: 15,
    companies: ['google', 'meta', 'amazon'],
  },
  // Linked List
  {
    id: 'linkedlist',
    name: 'Linked List',
    weight: 5,
    category: 'core',
    solved: 0,
    total: 31,
    companies: ['google', 'meta', 'amazon', 'microsoft', 'apple'],
  },
  // Recursion
  {
    id: 'recursion',
    name: 'Recursion',
    weight: 5,
    category: 'core',
    solved: 0,
    total: 25,
    companies: ['google', 'amazon', 'microsoft'],
  },
  // Bit Manipulation
  {
    id: 'bitmanipulation',
    name: 'Bit Manipulation',
    weight: 5,
    category: 'core',
    solved: 0,
    total: 18,
    companies: ['google', 'meta', 'amazon'],
  },
  // Stack and Queues
  {
    id: 'stackqueues',
    name: 'Stack and Queues',
    weight: 5,
    category: 'core',
    solved: 0,
    total: 30,
    companies: ['google', 'meta', 'amazon', 'microsoft'],
  },

  // ==================== HIGH IMPORTANCE (Weight 4) ====================
  // These are common patterns in interviews, crucial for time management

  // Sliding Window
  {
    id: 'slidingwindow',
    name: 'Sliding Window',
    weight: 4,
    category: 'high',
    solved: 0,
    total: 6,
    companies: ['google', 'amazon', 'microsoft'],
  },
  // Two Pointers
  {
    id: 'twopointers',
    name: 'Two Pointers',
    weight: 4,
    category: 'high',
    solved: 0,
    total: 6,
    companies: ['google', 'meta', 'amazon'],
  },
  // Heap / Priority Queue
  {
    id: 'heap',
    name: 'Heap / Priority Queue',
    weight: 4,
    category: 'high',
    solved: 0,
    total: 17,
    companies: ['google', 'amazon', 'microsoft'],
  },
  // Greedy Algorithms
  {
    id: 'greedy',
    name: 'Greedy Algorithms',
    weight: 4,
    category: 'high',
    solved: 0,
    total: 16,
    companies: ['google', 'amazon', 'microsoft'],
  },
  // Binary Trees - CUSTOMIZED: 15 questions (user specified)
  {
    id: 'trees',
    name: 'Binary Trees',
    weight: 4,
    category: 'high',
    solved: 0,
    total: 15,
    companies: ['google', 'meta', 'amazon', 'microsoft', 'apple'],
  },
  // Binary Search Trees
  {
    id: 'bst',
    name: 'Binary Search Trees',
    weight: 4,
    category: 'high',
    solved: 0,
    total: 16,
    companies: ['google', 'amazon', 'microsoft'],
  },

  // ==================== MEDIUM IMPORTANCE (Weight 3) ====================
  // Supporting structures and important but less frequently asked

  // Graphs
  {
    id: 'graphs',
    name: 'Graphs',
    weight: 3,
    category: 'medium',
    solved: 0,
    total: 35,
    companies: ['google', 'amazon', 'microsoft', 'apple'],
  },
  // BFS
  {
    id: 'bfs',
    name: 'BFS',
    weight: 3,
    category: 'medium',
    solved: 0,
    total: 9,
    companies: ['google', 'amazon'],
  },
  // DFS
  {
    id: 'dfs',
    name: 'DFS',
    weight: 3,
    category: 'medium',
    solved: 0,
    total: 9,
    companies: ['google', 'amazon', 'microsoft'],
  },
  // Trie
  {
    id: 'trie',
    name: 'Trie',
    weight: 3,
    category: 'medium',
    solved: 0,
    total: 7,
    companies: ['google', 'amazon'],
  },
  // Advanced Strings
  {
    id: 'advancedstrings',
    name: 'Advanced Strings',
    weight: 3,
    category: 'medium',
    solved: 0,
    total: 9,
    companies: ['google', 'meta'],
  },

  // ==================== ADVANCED TOPICS (Weight 2) ====================
  // Differentiator for top-tier candidates, rarely asked but impressive

  // Dynamic Programming - CUSTOMIZED: 38 questions (user specified)
  {
    id: 'dp',
    name: 'Dynamic Programming',
    weight: 2,
    category: 'advanced',
    solved: 0,
    total: 38,
    companies: ['google', 'amazon', 'microsoft'],
  },
  // Advanced DP Patterns
  {
    id: 'advanceddp',
    name: 'Advanced DP Patterns',
    weight: 2,
    category: 'advanced',
    solved: 0,
    total: 55,
    companies: ['google', 'amazon'],
  },
];

export const COMPANY_WEIGHTS: Record<string, CompanyReadiness & { weights: Record<string, number> }> = {
  google: {
    name: 'Google',
    score: 0,
    color: '#4285F4',
    weights: { 
      arrays: 1.2, binsearch: 1.2, graphs: 1.2, trees: 1.2, dp: 1.1,
      recursion: 1.1, heap: 1.0, greedy: 1.0, bitmanipulation: 1.1
    },
  },
  meta: {
    name: 'Meta',
    score: 0,
    color: '#0A66C2',
    weights: { 
      arrays: 1.2, strings: 1.2, trees: 1.1, recursion: 1.1,
      linkedlist: 1.1, slidingwindow: 1.0, twopointers: 1.1
    },
  },
  amazon: {
    name: 'Amazon',
    score: 0,
    color: '#FF9900',
    weights: { 
      heap: 1.2, graphs: 1.2, trees: 1.1, slidingwindow: 1.1,
      greedy: 1.1, arrays: 1.0, binsearch: 1.1
    },
  },
  microsoft: {
    name: 'Microsoft',
    score: 0,
    color: '#00A4EF',
    weights: { 
      trees: 1.2, linkedlist: 1.2, graphs: 1.1, dp: 1.1,
      binsearch: 1.1, stackqueues: 1.1
    },
  },
  apple: {
    name: 'Apple',
    score: 0,
    color: '#555555',
    weights: { 
      trees: 1.2, graphs: 1.1, arrays: 1.0, dp: 1.0
    },
  },
};

export const APPLICATION_STATUSES = [
  { id: 'applied', label: 'Applied', color: 'slate' },
  { id: 'oa_cleared', label: 'OA Cleared', color: 'blue' },
  { id: 'interview_scheduled', label: 'Interview Scheduled', color: 'purple' },
  { id: 'interview_cleared', label: 'Interview Cleared', color: 'emerald' },
  { id: 'offer_received', label: 'Offer Received', color: 'yellow' },
];

export const COMPANIES = [
  'Google',
  'Meta',
  'Amazon',
  'Microsoft',
  'Apple',
  'Uber',
  'Atlassian',
  'Adobe',
  'Flipkart',
  'Walmart Global Tech',
];
