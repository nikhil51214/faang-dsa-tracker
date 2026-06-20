// utils/scoring.ts - Scoring and calculation utilities

import { Topic, AppState } from '../types';

export const calculateFAAnGScore = (topics: Topic[]): number => {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  topics.forEach((topic) => {
    const solvePercentage = topic.total > 0 ? (topic.solved / topic.total) * 100 : 0;
    const weightedScore = (solvePercentage * topic.weight) / 100;
    totalWeightedScore += weightedScore;
    totalWeight += topic.weight;
  });

  return totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 0;
};

export const calculateCompanyReadiness = (
  topics: Topic[],
  companyWeights: Record<string, Record<string, number>>
): Record<string, number> => {
  const scores: Record<string, number> = {};

  Object.entries(companyWeights).forEach(([companyId, weights]) => {
    let companyScore = 0;
    let totalWeight = 0;

    topics.forEach((topic) => {
      if (topic.companies.includes(companyId)) {
        const solvePercentage = topic.total > 0 ? (topic.solved / topic.total) * 100 : 0;
        const weight = weights[topic.id] || 1;
        const weightedScore = (solvePercentage * weight * topic.weight) / 100;
        companyScore += weightedScore;
        totalWeight += weight * topic.weight;
      }
    });

    scores[companyId] = totalWeight > 0 ? Math.round((companyScore / totalWeight) * 100) : 0;
  });

  return scores;
};

export const getReadinessClass = (score: number): string => {
  if (score <= 20) return 'Beginner';
  if (score <= 40) return 'Developing';
  if (score <= 60) return 'Interview Ready';
  if (score <= 80) return 'Strong Candidate';
  return 'FAANG Ready';
};

export const getReadinessColor = (score: number): string => {
  if (score <= 20) return '#EF4444';
  if (score <= 40) return '#F59E0B';
  if (score <= 60) return '#3B82F6';
  if (score <= 80) return '#10B981';
  return '#8B5CF6';
};

export const getWeakTopicsForRoadmap = (topics: Topic[], count: number = 3): Topic[] => {
  return topics
    .filter((t) => t.category === 'core' || t.category === 'high')
    .sort((a, b) => {
      const aProgress = a.total > 0 ? a.solved / a.total : 0;
      const bProgress = b.total > 0 ? b.solved / b.total : 0;
      return aProgress - bProgress;
    })
    .slice(0, count);
};

export const calculateProgressStats = (state: AppState) => {
  const totalSolved = state.topics.reduce((acc, t) => acc + t.solved, 0);
  const totalQuestions = state.topics.reduce((acc, t) => acc + t.total, 0);
  const solvedPercentage = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

  const categoryStats = {
    core: calculateCategoryStats(state.topics.filter((t) => t.category === 'core')),
    high: calculateCategoryStats(state.topics.filter((t) => t.category === 'high')),
    medium: calculateCategoryStats(state.topics.filter((t) => t.category === 'medium')),
    advanced: calculateCategoryStats(state.topics.filter((t) => t.category === 'advanced')),
  };

  return {
    totalSolved,
    totalQuestions,
    solvedPercentage,
    categoryStats,
  };
};

const calculateCategoryStats = (topics: Topic[]) => {
  const solved = topics.reduce((acc, t) => acc + t.solved, 0);
  const total = topics.reduce((acc, t) => acc + t.total, 0);
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
  return { solved, total, percentage };
};

export const isAllCompleted = (state: AppState): boolean => {
  const totalSolved = state.topics.reduce((acc, t) => acc + t.solved, 0);
  const totalQuestions = state.topics.reduce((acc, t) => acc + t.total, 0);
  return totalSolved > 0 && totalSolved === totalQuestions;
};

export const estimateDaysToCompletion = (state: AppState): number => {
  const { totalSolved, totalQuestions } = calculateProgressStats(state);
  const remaining = totalQuestions - totalSolved;
  const daysToComplete = Math.ceil(remaining / state.profile.dailyGoal);
  return Math.max(0, daysToComplete);
};