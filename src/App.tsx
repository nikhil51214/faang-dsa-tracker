import React, { useState, useEffect, useCallback } from 'react';
import { Activity, AlertCircle, BookOpen, CheckCircle2, Download, Edit2, Gift, Zap, TrendingUp, BarChart3, Calendar, Target, Medal, FileText, Trash2, Plus, Minus, Check, X, ChevronDown, ChevronUp, User, Settings, LayoutDashboard, ListChecks, Briefcase } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

import { Topic, AppState, UserProfile, LeetCodeStats, PlacementApplication } from './types';
import { DSA_TOPICS, COMPANY_WEIGHTS, APPLICATION_STATUSES, COMPANIES } from './data/dsa-topics';
import { calculateFAAnGScore, calculateCompanyReadiness, getReadinessClass, getReadinessColor, getWeakTopicsForRoadmap, calculateProgressStats, estimateDaysToCompletion } from './utils/scoring';
import { StorageUtils } from './utils/storage';

// Default initial state
const createInitialState = (): AppState => ({
  profile: {
    name: 'Pranjil',
    college: 'IIT BHU',
    major: 'Chemical Engineering',
    targetRole: 'SDE',
    dailyGoal: 2,
    dreamCompanies: ['google', 'meta', 'amazon', 'microsoft', 'apple'],
    startDate: new Date().toISOString().split('T')[0],
  },
  topics: JSON.parse(JSON.stringify(DSA_TOPICS)),
  leetcodeStats: {
    totalSolved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    contestRating: 0,
    contestRank: 0,
  },
  applications: [],
  lastUpdated: new Date().toISOString(),
});

export default function FAAnGDSATracker() {
  const [state, setState] = useState<AppState>(() => {
    const saved = StorageUtils.loadState();
    return saved || createInitialState();
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'topics' | 'applications' | 'settings'>('dashboard');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    StorageUtils.saveState(state);
  }, [state]);

  useEffect(() => {
    const { totalSolved, totalQuestions } = calculateProgressStats(state);
    if (totalSolved > 0 && totalSolved === totalQuestions) {
      setShowCelebration(true);
    }
  }, [state.topics]);

  const faanGScore = calculateFAAnGScore(state.topics);
  const companyScores = calculateCompanyReadiness(state.topics, 
    Object.fromEntries(Object.entries(COMPANY_WEIGHTS).map(([k, v]) => [k, v.weights]))
  );
  const { totalSolved, totalQuestions } = calculateProgressStats(state);
  const daysToComplete = estimateDaysToCompletion(state);

  const updateTopicSolved = (topicId: string, increment: number) => {
    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((t) =>
        t.id === topicId ? { ...t, solved: Math.max(0, Math.min(t.total, t.solved + increment)) } : t
      ),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateTopicTotal = (topicId: string, newTotal: number) => {
    setState((prev) => ({
      ...prev,
      topics: prev.topics.map((t) =>
        t.id === topicId ? { ...t, total: Math.max(1, newTotal), solved: Math.min(t.solved, Math.max(1, newTotal)) } : t
      ),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateProfile = (profile: UserProfile) => {
    setState((prev) => ({ ...prev, profile, lastUpdated: new Date().toISOString() }));
  };

  const updateLeetCodeStats = (stats: LeetCodeStats) => {
    setState((prev) => ({ ...prev, leetcodeStats: stats, lastUpdated: new Date().toISOString() }));
  };

  const addApplication = (app: PlacementApplication) => {
    setState((prev) => ({
      ...prev,
      applications: [...prev.applications, app],
      lastUpdated: new Date().toISOString(),
    }));
  };

  const updateApplication = (id: string, updates: Partial<PlacementApplication>) => {
    setState((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => (a.id === id ? { ...a, ...updates } : a)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const deleteApplication = (id: string) => {
    setState((prev) => ({
      ...prev,
      applications: prev.applications.filter((a) => a.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const resetAllData = () => {
    if (confirm('This will delete ALL your data. Are you sure?')) {
      StorageUtils.clearState();
      setState(createInitialState());
    }
  };

  const exportData = () => {
    const data = StorageUtils.exportState(state);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faang-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string) => {
    const imported = StorageUtils.importState(jsonString);
    if (imported) {
      setState(imported);
      return true;
    }
    return false;
  };

  const tabIcons = {
    dashboard: <LayoutDashboard className="w-4 h-4" />,
    topics: <ListChecks className="w-4 h-4" />,
    applications: <Briefcase className="w-4 h-4" />,
    settings: <Settings className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                FAANG DSA Tracker
              </h1>
              <p className="text-xs text-slate-500">Striver A-Z Curriculum</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-sm">
                <span className="text-slate-400">Readiness:</span>
                <span className="text-blue-400 font-bold ml-1">{faanGScore}%</span>
                <span className="text-slate-500 text-xs ml-1">({getReadinessClass(faanGScore)})</span>
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 rounded-lg border border-slate-800">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-400">
                <span className="text-emerald-400 font-bold">{daysToComplete}</span> days left
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-slate-900/50 border-b border-slate-800/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {(['dashboard', 'topics', 'applications', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-all duration-200 flex items-center gap-2 capitalize ${
                activeTab === tab
                  ? 'border-blue-400 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tabIcons[tab]}
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <DashboardTab 
            state={state} 
            companyScores={companyScores} 
            faanGScore={faanGScore} 
            totalSolved={totalSolved} 
            totalQuestions={totalQuestions}
            daysToComplete={daysToComplete}
          />
        )}
        {activeTab === 'topics' && (
          <TopicsTab state={state} updateTopicSolved={updateTopicSolved} updateTopicTotal={updateTopicTotal} />
        )}
        {activeTab === 'applications' && (
          <ApplicationsTab 
            state={state} 
            addApplication={addApplication}
            updateApplication={updateApplication}
            deleteApplication={deleteApplication}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab 
            state={state} 
            updateProfile={updateProfile}
            updateLeetCodeStats={updateLeetCodeStats}
            resetAllData={resetAllData}
            exportData={exportData}
            importData={importData}
          />
        )}
      </main>

      {/* Celebration Modal */}
      {showCelebration && (
        <CelebrationModal onClose={() => setShowCelebration(false)} profile={state.profile} faanGScore={faanGScore} />
      )}
    </div>
  );
}

// ==================== DASHBOARD TAB ====================
function DashboardTab({ state, companyScores, faanGScore, totalSolved, totalQuestions, daysToComplete }: any) {
  const weakTopics = getWeakTopicsForRoadmap(state.topics, 3);
  const categoryStats = calculateProgressStats(state).categoryStats;

  const chartData = state.topics.map((topic: Topic) => ({
    name: topic.name.length > 12 ? topic.name.substring(0, 12) + '...' : topic.name,
    solved: topic.solved,
    remaining: topic.total - topic.solved,
    total: topic.total,
    category: topic.category,
  }));

  const categoryChartData = [
    { name: 'Core', solved: categoryStats.core.solved, total: categoryStats.core.total, color: '#3B82F6' },
    { name: 'High', solved: categoryStats.high.solved, total: categoryStats.high.total, color: '#EC4899' },
    { name: 'Medium', solved: categoryStats.medium.solved, total: categoryStats.medium.total, color: '#F59E0B' },
    { name: 'Advanced', solved: categoryStats.advanced.solved, total: categoryStats.advanced.total, color: '#8B5CF6' },
  ];

  const pieData = [
    { name: 'Solved', value: totalSolved, color: '#10B981' },
    { name: 'Remaining', value: totalQuestions - totalSolved, color: '#334155' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Row: Profile + Readiness Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">
              {state.profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold">{state.profile.name}'s Journey</h2>
              <p className="text-xs text-slate-400">{state.profile.college}</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Major</span>
              <span className="font-medium">{state.profile.major}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Target Role</span>
              <span className="font-medium text-emerald-400">{state.profile.targetRole}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Daily Goal</span>
              <span className="font-medium">{state.profile.dailyGoal} questions/day</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Started</span>
              <span className="font-medium">{state.profile.startDate}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Est. Completion</span>
              <span className="font-medium text-amber-400">{daysToComplete} days</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Current Readiness</div>
                <div className="text-2xl font-bold" style={{ color: getReadinessColor(faanGScore) }}>
                  {faanGScore}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Status</div>
                <div className="text-sm font-semibold px-2 py-1 rounded bg-slate-800" style={{ color: getReadinessColor(faanGScore) }}>
                  {getReadinessClass(faanGScore)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Readiness Rings */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            FAANG Readiness
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {/* Overall Score */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 mb-2">
                <CircularProgressbar
                  value={faanGScore}
                  text={`${faanGScore}%`}
                  styles={buildStyles({
                    rotation: 0,
                    strokeLinecap: 'round',
                    textSize: '22px',
                    pathTransitionDuration: 0.5,
                    pathColor: getReadinessColor(faanGScore),
                    textColor: '#fff',
                    trailColor: '#334155',
                  })}
                />
              </div>
              <span className="text-xs font-semibold text-center">Overall</span>
              <span className="text-xs text-slate-500">{getReadinessClass(faanGScore)}</span>
            </div>

            {/* Company Scores */}
            {state.profile.dreamCompanies.map((company: string) => {
              const score = companyScores[company] || 0;
              const companyData = COMPANY_WEIGHTS[company];
              if (!companyData) return null;
              return (
                <div key={company} className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-2">
                    <CircularProgressbar
                      value={score}
                      text={`${score}%`}
                      styles={buildStyles({
                        rotation: 0,
                        strokeLinecap: 'round',
                        textSize: '18px',
                        pathTransitionDuration: 0.5,
                        pathColor: companyData.color,
                        textColor: '#fff',
                        trailColor: '#334155',
                      })}
                    />
                  </div>
                  <span className="text-xs font-semibold text-center">{companyData.name}</span>
                  <span className="text-xs text-slate-500">{getReadinessClass(score)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Solved" 
          value={totalSolved} 
          unit={`/ ${totalQuestions}`} 
          icon={<CheckCircle2 className="w-5 h-5" />} 
          color="blue" 
          subtext={`${Math.round((totalSolved/totalQuestions)*100)}% complete`}
        />
        <StatCard 
          label="Readiness Level" 
          value={getReadinessClass(faanGScore)} 
          unit="" 
          icon={<Target className="w-5 h-5" />} 
          color={faanGScore >= 60 ? 'emerald' : faanGScore >= 40 ? 'blue' : 'amber'} 
          subtext={`${faanGScore}% score`}
        />
        <StatCard 
          label="LeetCode Easy" 
          value={state.leetcodeStats.easy} 
          unit="solved" 
          icon={<BookOpen className="w-5 h-5" />} 
          color="green" 
          subtext={`+${state.leetcodeStats.medium} medium`}
        />
        <StatCard 
          label="Applications" 
          value={state.applications.length} 
          unit="tracked" 
          icon={<Briefcase className="w-5 h-5" />} 
          color="purple" 
          subtext={`${state.applications.filter((a: any) => a.status === 'offer_received').length} offers`}
        />
      </div>

      {/* Smart Roadmap */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-400" />
          Recommended Roadmap
          <span className="text-xs font-normal text-slate-500 ml-2">Focus on these next</span>
        </h3>
        <div className="space-y-3">
          {weakTopics.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Medal className="w-12 h-12 mx-auto mb-3 text-amber-400 opacity-50" />
              <p className="text-lg font-semibold">All high-priority topics completed! 🎉</p>
              <p className="text-sm mt-1">You're crushing it! Move to medium and advanced topics.</p>
            </div>
          ) : (
            weakTopics.map((topic: Topic, idx: number) => {
              const progress = topic.total > 0 ? Math.round((topic.solved / topic.total) * 100) : 0;
              const categoryColors: Record<string, string> = { core: '#3B82F6', high: '#EC4899', medium: '#F59E0B', advanced: '#8B5CF6' };
              return (
                <div key={topic.id} className="flex items-center gap-4 p-4 bg-slate-900/60 rounded-xl border-l-4 hover:bg-slate-900/80 transition-colors" style={{ borderLeftColor: categoryColors[topic.category] }}>
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-blue-400 font-bold text-lg border border-slate-700">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-base">{topic.name}</p>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {topic.weight}x weight
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: categoryColors[topic.category] }} />
                      </div>
                      <span className="text-xs text-slate-400 w-20 text-right">{topic.solved}/{topic.total} ({progress}%)</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-wrap gap-1">
                    {topic.companies.map((c: string) => (
                      <span key={c} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                        {c.slice(0, 2)}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress by Topic */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Progress by Topic
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }}
                labelStyle={{ color: '#94a3b8' }}
                cursor={{ fill: '#1e293b', opacity: 0.5 }}
              />
              <Bar dataKey="solved" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} />
              <Bar dataKey="remaining" stackId="a" fill="#1e293b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Category Progress
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }}
                labelStyle={{ color: '#94a3b8' }}
                cursor={{ fill: '#1e293b', opacity: 0.5 }}
              />
              <Bar dataKey="solved" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" fill="#334155" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overall Progress Pie */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Overall Progress
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              You've solved <span className="text-emerald-400 font-bold">{totalSolved}</span> out of <span className="text-white font-bold">{totalQuestions}</span> questions across all categories.
            </p>
            <div className="space-y-2">
              {categoryChartData.map((cat: any) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-slate-300 w-20">{cat.name}</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${cat.total > 0 ? (cat.solved/cat.total)*100 : 0}%`, backgroundColor: cat.color }} />
                  </div>
                  <span className="text-xs text-slate-500 w-16 text-right">{cat.solved}/{cat.total}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width={280} height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TOPICS TAB ====================
function TopicsTab({ state, updateTopicSolved, updateTopicTotal }: any) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('core');
  const [editMode, setEditMode] = useState(false);

  const categories = ['core', 'high', 'medium', 'advanced'];
  const categoryLabels: Record<string, string> = {
    core: 'Core Topics',
    high: 'High Importance',
    medium: 'Medium Importance',
    advanced: 'Advanced Topics',
  };
  const categoryColors: Record<string, string> = {
    core: '#3B82F6',
    high: '#EC4899',
    medium: '#F59E0B',
    advanced: '#8B5CF6',
  };
  const categoryWeights: Record<string, number> = {
    core: 5, high: 4, medium: 3, advanced: 2,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Info Banner + Edit Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-400">Progress is earned, not assumed.</p>
            <p className="text-slate-400 mt-1">Only count progress when you manually mark questions complete. Use +1 for each solved problem, or "Complete" to mark the entire topic.</p>
          </div>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 flex-shrink-0 ${
            editMode 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Edit2 className="w-4 h-4" />
          {editMode ? 'Done Editing' : 'Edit Question Counts'}
        </button>
      </div>

      {/* Category Cards */}
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryTopics = state.topics.filter((t: Topic) => t.category === category);
          const totalSolved = categoryTopics.reduce((acc: number, t: Topic) => acc + t.solved, 0);
          const totalQuestions = categoryTopics.reduce((acc: number, t: Topic) => acc + t.total, 0);
          const percentage = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;

          return (
            <div key={category} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 overflow-hidden backdrop-blur-sm">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[category] }} />
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-lg">{categoryLabels[category]}</h3>
                    <p className="text-sm text-slate-400">
                      {totalSolved} / {totalQuestions} questions · Weight {categoryWeights[category]}x
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 hidden sm:block">
                    <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: categoryColors[category] }}
                      />
                    </div>
                  </div>
                  <span className="font-bold text-xl w-14 text-right" style={{ color: categoryColors[category] }}>
                    {percentage}%
                  </span>
                  {expandedCategory === category ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {expandedCategory === category && (
                <div className="border-t border-slate-700/50 divide-y divide-slate-700/30">
                  {categoryTopics.map((topic: Topic) => {
                    const progress = topic.total > 0 ? Math.round((topic.solved / topic.total) * 100) : 0;
                    return (
                      <div key={topic.id} className="px-6 py-4 bg-slate-900/30 hover:bg-slate-900/50 transition-colors flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-base">{topic.name}</h4>
                            <span className="text-xs text-slate-500">({topic.weight}x)</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-[200px]">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${progress}%`, backgroundColor: categoryColors[category] }}
                              />
                            </div>
                            {editMode ? (
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-slate-400">{topic.solved} /</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={999}
                                  value={topic.total}
                                  onChange={(e) => updateTopicTotal(topic.id, parseInt(e.target.value) || 1)}
                                  className="w-14 px-1 py-0.5 bg-slate-800 border border-slate-600 rounded text-center text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                              </div>
                            ) : (
                              <p className="text-sm text-slate-400">
                                {topic.solved} / {topic.total}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {topic.companies.map((c: string) => (
                              <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 uppercase tracking-wider">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                        {!editMode && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateTopicSolved(topic.id, -1)}
                              disabled={topic.solved <= 0}
                              className="w-8 h-8 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-emerald-400 min-w-[40px] text-center">{progress}%</span>
                            <button
                              onClick={() => updateTopicSolved(topic.id, 1)}
                              disabled={topic.solved >= topic.total}
                              className="w-8 h-8 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateTopicSolved(topic.id, topic.total - topic.solved)}
                              disabled={topic.solved >= topic.total}
                              className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Complete
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== APPLICATIONS TAB ====================
function ApplicationsTab({ state, addApplication, updateApplication, deleteApplication }: any) {
  const [newApp, setNewApp] = useState({ company: '', status: 'applied' as const });

  const statusColors: Record<string, string> = {
    applied: 'bg-slate-700 text-slate-300 border-slate-600',
    oa_cleared: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    interview_scheduled: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    interview_cleared: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    offer_received: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  const statusLabels: Record<string, string> = {
    applied: 'Applied',
    oa_cleared: 'OA Cleared',
    interview_scheduled: 'Interview Scheduled',
    interview_cleared: 'Interview Cleared',
    offer_received: 'Offer Received',
  };

  const handleAdd = () => {
    if (!newApp.company) return;
    addApplication({
      id: Date.now().toString(),
      company: newApp.company,
      status: newApp.status,
      appliedDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setNewApp({ company: '', status: 'applied' });
  };

  const statusCounts = APPLICATION_STATUSES.map((s) => ({
    ...s,
    count: state.applications.filter((a: any) => a.status === s.id).length,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Add Application */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-400" />
          Track New Application
        </h3>
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Company</label>
            <select
              value={newApp.company}
              onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Select Company</option>
              {COMPANIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Status</label>
            <select
              value={newApp.status}
              onChange={(e) => setNewApp({ ...newApp, status: e.target.value as any })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newApp.company}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg font-semibold transition-colors text-sm"
          >
            Add Application
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {state.applications.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 border-dashed">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-lg font-semibold text-slate-400">No applications yet</p>
            <p className="text-sm text-slate-500 mt-1">Start tracking your FAANG journey by adding your first application above.</p>
          </div>
        ) : (
          state.applications.map((app: any) => (
            <div key={app.id} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 p-5 flex items-center justify-between gap-4 backdrop-blur-sm hover:border-slate-600/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-lg">{app.company}</h4>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColors[app.status]}`}>
                    {statusLabels[app.status]}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">Applied on {app.appliedDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={app.status}
                  onChange={(e) => updateApplication(app.id, { status: e.target.value })}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => deleteApplication(app.id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      {state.applications.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {statusCounts.map((status) => (
            <div key={status.id} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold" style={{ color: status.color === 'slate' ? '#94a3b8' : status.color === 'blue' ? '#60a5fa' : status.color === 'purple' ? '#a78bfa' : status.color === 'emerald' ? '#34d399' : '#fbbf24' }}>
                {status.count}
              </div>
              <div className="text-xs text-slate-400 mt-1">{status.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== SETTINGS TAB ====================
function SettingsTab({ state, updateProfile, updateLeetCodeStats, resetAllData, exportData, importData }: any) {
  const [editProfile, setEditProfile] = useState(state.profile);
  const [editStats, setEditStats] = useState(state.leetcodeStats);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importError, setImportError] = useState('');

  const saveProfile = () => {
    updateProfile(editProfile);
    alert('Profile saved successfully!');
  };

  const saveStats = () => {
    updateLeetCodeStats(editStats);
    alert('LeetCode stats updated!');
  };

  const handleImport = () => {
    setImportError('');
    const success = importData(importText);
    if (success) {
      alert('Data imported successfully!');
      setShowImport(false);
      setImportText('');
    } else {
      setImportError('Invalid JSON data. Please check your backup file.');
    }
  };

  const allCompanies = Object.keys(COMPANY_WEIGHTS);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Profile Settings */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-400" />
          Profile Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Name</label>
            <input
              type="text"
              value={editProfile.name}
              onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">College</label>
            <input
              type="text"
              value={editProfile.college}
              onChange={(e) => setEditProfile({ ...editProfile, college: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Major</label>
            <input
              type="text"
              value={editProfile.major}
              onChange={(e) => setEditProfile({ ...editProfile, major: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Target Role</label>
            <input
              type="text"
              value={editProfile.targetRole}
              onChange={(e) => setEditProfile({ ...editProfile, targetRole: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Daily Goal (Questions/Day)</label>
            <input
              type="number"
              min={1}
              max={50}
              value={editProfile.dailyGoal}
              onChange={(e) => setEditProfile({ ...editProfile, dailyGoal: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Start Date</label>
            <input
              type="date"
              value={editProfile.startDate}
              onChange={(e) => setEditProfile({ ...editProfile, startDate: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Dream Companies</label>
          <div className="flex flex-wrap gap-2">
            {allCompanies.map((company) => (
              <label key={company} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                editProfile.dreamCompanies.includes(company) 
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={editProfile.dreamCompanies.includes(company)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEditProfile({ ...editProfile, dreamCompanies: [...editProfile.dreamCompanies, company] });
                    } else {
                      setEditProfile({ ...editProfile, dreamCompanies: editProfile.dreamCompanies.filter((c: string) => c !== company) });
                    }
                  }}
                  className="w-4 h-4 rounded accent-blue-500"
                />
                <span className="text-sm font-medium">{COMPANY_WEIGHTS[company].name}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          onClick={saveProfile}
          className="mt-6 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold transition-colors text-sm"
        >
          Save Profile Changes
        </button>
      </div>

      {/* LeetCode Stats */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-400" />
          LeetCode Statistics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Total Solved</label>
            <input
              type="number"
              min={0}
              value={editStats.totalSolved}
              onChange={(e) => setEditStats({ ...editStats, totalSolved: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Easy</label>
            <input
              type="number"
              min={0}
              value={editStats.easy}
              onChange={(e) => setEditStats({ ...editStats, easy: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Medium</label>
            <input
              type="number"
              min={0}
              value={editStats.medium}
              onChange={(e) => setEditStats({ ...editStats, medium: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Hard</label>
            <input
              type="number"
              min={0}
              value={editStats.hard}
              onChange={(e) => setEditStats({ ...editStats, hard: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Contest Rating</label>
            <input
              type="number"
              min={0}
              value={editStats.contestRating}
              onChange={(e) => setEditStats({ ...editStats, contestRating: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Contest Rank</label>
            <input
              type="number"
              min={0}
              value={editStats.contestRank}
              onChange={(e) => setEditStats({ ...editStats, contestRank: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
        <button
          onClick={saveStats}
          className="mt-6 w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-500 rounded-lg font-semibold transition-colors text-sm"
        >
          Update LeetCode Stats
        </button>
      </div>

      {/* Data Management */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 backdrop-blur-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-400" />
          Data Management
        </h3>
        <div className="space-y-3">
          <button
            onClick={exportData}
            className="w-full px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data (Download JSON)
          </button>
          <button
            onClick={() => { setShowImport(!showImport); setImportError(''); }}
            className="w-full px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {showImport ? 'Cancel Import' : 'Import Data'}
          </button>
          {showImport && (
            <div className="space-y-2 animate-fade-in">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste your exported JSON data here..."
                className="w-full h-32 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
              {importError && <p className="text-red-400 text-xs">{importError}</p>}
              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg font-medium transition-colors text-sm"
              >
                Import Data
              </button>
            </div>
          )}
          <div className="border-t border-slate-700/50 pt-3 mt-3">
            <button
              onClick={resetAllData}
              className="w-full px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== STAT CARD COMPONENT ====================
function StatCard({ label, value, unit, icon, color, subtext }: any) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/10 to-blue-600/10 text-blue-400 border-blue-500/20',
    emerald: 'from-emerald-500/10 to-emerald-600/10 text-emerald-400 border-emerald-500/20',
    green: 'from-green-500/10 to-green-600/10 text-green-400 border-green-500/20',
    yellow: 'from-yellow-500/10 to-yellow-600/10 text-yellow-400 border-yellow-500/20',
    amber: 'from-amber-500/10 to-amber-600/10 text-amber-400 border-amber-500/20',
    purple: 'from-purple-500/10 to-purple-600/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4 backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div className="mt-1 opacity-80">{icon}</div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold mt-0.5">
            {value}
            <span className="text-sm text-slate-500 ml-1 font-normal">{unit}</span>
          </p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}

// ==================== CELEBRATION MODAL ====================
function CelebrationModal({ onClose, profile, faanGScore }: any) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-400/50 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl shadow-amber-500/10">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-3xl font-bold text-amber-400 mb-2">Congratulations!</h3>
        <p className="text-lg text-slate-300 mb-6">
          {profile.name}, you have completed all <span className="text-white font-bold">615+</span> Striver A-Z DSA questions!
        </p>
        <div className="bg-slate-800/80 rounded-2xl p-6 mb-6 border border-slate-700">
          <p className="text-sm text-slate-400 mb-1">Final FAANG Readiness Score</p>
          <p className="text-5xl font-bold text-blue-400">{faanGScore}%</p>
          <p className="text-sm text-slate-500 mt-2">{getReadinessClass(faanGScore)}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-500">You're now ready to crack FAANG interviews! 🚀</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold transition-all text-white shadow-lg shadow-blue-500/20"
        >
          Close Celebration
        </button>
      </div>
    </div>
  );
}
