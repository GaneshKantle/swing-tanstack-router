import { api } from '@/lib/api';
import { formatCurrency } from '@/utils/format';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { 
  Trophy, 
  Users, 
  Vote, 
  DollarSign, 
  UserCheck, 
  Gift, 
  CreditCard, 
  PlayCircle, 
  CheckCircle, 
  UserPlus, 
  TrendingUp,
  BarChart3,
  Activity,
  Calendar,
  Target
} from 'lucide-react';

export const Route = createFileRoute('/admin/')({
  component: () => <Page />,
  loader: async () => {
    const response = await api.get('/api/v1/analytics/dashboard');

    return response.data as DashboardAnalytics;
  },
});

type DashboardAnalytics = {
  totalCompetitions: number;
  totalUsers: number;
  totalVotes: number;
  totalPrizePool: number;
  totalOnboardedUsers: number;
  freeVotes: number;
  paidVotes: number;
  activeCompetitions: number;
  completedCompetitions: number;
  totalParticipants: number;
  totalRevenue: number;
};

export default function Page() {
  const dashboardResponse = Route.useLoaderData();
  const navigate = useNavigate();

  const stats: { 
    label: string; 
    value: number|string; 
    subtext: string; 
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    trend?: string;
    link?: string;
  }[] = [
    {
      label: 'Total Competitions',
      value: dashboardResponse.totalCompetitions,
      subtext: 'All competitions created',
      icon: <Trophy className="h-5 w-5" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      trend: '+12% from last month',
      link: '/admin/contests'
    },
    {
      label: 'Total Users',
      value: dashboardResponse.totalUsers,
      subtext: 'Registered platform users',
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+8% from last month',
      link: '/admin/users'
    },
    { 
      label: 'Total Votes', 
      value: dashboardResponse.totalVotes, 
      subtext: 'All votes cast',
      icon: <Vote className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+15% from last month'
    },
    {
      label: 'Total Onboarded Users',
      value: dashboardResponse.totalOnboardedUsers,
      subtext: 'Users who completed onboarding',
      icon: <UserCheck className="h-5 w-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: '+22% from last month'
    },
    { 
      label: 'Free Votes', 
      value: dashboardResponse.freeVotes, 
      subtext: 'Votes from free credits',
      icon: <Gift className="h-5 w-5" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      trend: '+5% from last month'
    },
    {
      label: 'Paid Votes',
      value: dashboardResponse.paidVotes,
      subtext: 'Votes purchased by users',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      trend: '+18% from last month'
    },
    {
      label: 'Active Competitions',
      value: dashboardResponse.activeCompetitions,
      subtext: 'Currently running contests',
      icon: <PlayCircle className="h-5 w-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      trend: 'Live now',
      link: '/admin/contests/create'
    },
    {
      label: 'Total Participants',
      value: dashboardResponse.totalParticipants,
      subtext: 'All unique participants',
      icon: <UserPlus className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '+11% from last month',
      link: '/admin/profiles'
    },
    { 
      label: 'Total Revenue', 
      value: formatCurrency(dashboardResponse.totalRevenue, 'USD'), 
      subtext: 'Revenue in USD',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      trend: '+25% from last month',
      link: '/admin/payments'
    },
  ];

  // const quickActions = [
  //   { label: 'View Analytics', icon: <BarChart3 className="h-4 w-4" />, href: '/admin/analytics' },
  //   { label: 'Manage Contests', icon: <Target className="h-4 w-4" />, href: '/admin/contests' },
  //   { label: 'User Management', icon: <Users className="h-4 w-4" />, href: '/admin/users' },
  //   { label: 'Payment History', icon: <CreditCard className="h-4 w-4" />, href: '/admin/payments' },
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
              <p className="text-slate-600 text-sm">
                Welcome back! Here's what's happening with your platform today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                System Online
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <h2 className="text-base font-semibold text-slate-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex items-center space-x-2 p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 bg-white hover:bg-slate-50"
              >
                <div className="text-slate-600">{action.icon}</div>
                <span className="text-xs font-medium text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div> */}

        {/* Stats Grid */}
        <div className="space-y-8">
          {/* Competitions Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-slate-800">Competitions</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent"></div>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {stats.filter(stat => 
                stat.label.includes('Competition') || stat.label.includes('Participants')
              ).map((stat, index) => (
                <div
                  key={stat.label}
                  className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all duration-300 group ${
                    stat.link ? 'cursor-pointer hover:border-slate-300' : ''
                  }`}
                  onClick={() => stat.link && navigate({ to: stat.link })}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    {stat.trend && (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {/* {stat.trend} */}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <h3 className="text-sm font-semibold text-slate-700">{stat.label}</h3>
                    <p className="text-xs text-slate-500">{stat.subtext}</p>
                    {stat.link && (
                      <div className="flex items-center space-x-1 mt-2">
                        <span className="text-xs text-blue-600 font-medium">Click to view →</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
       

          {/* Users Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-slate-800">Users & Engagement</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {stats.filter(stat => 
                stat.label.includes('Users') || stat.label.includes('Onboarded')
              ).map((stat, index) => (
                <div
                  key={stat.label}
                  className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all duration-300 group ${
                    stat.link ? 'cursor-pointer hover:border-slate-300' : ''
                  }`}
                  onClick={() => stat.link && navigate({ to: stat.link })}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    {stat.trend && (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {/* {stat.trend} */}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <h3 className="text-sm font-semibold text-slate-700">{stat.label}</h3>
                    <p className="text-xs text-slate-500">{stat.subtext}</p>
                    {stat.link && (
                      <div className="flex items-center space-x-1 mt-2">
                        <span className="text-xs text-blue-600 font-medium">Click to view →</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          

          {/* Voting Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-slate-800">Voting & Participation</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {stats.filter(stat => 
                stat.label.includes('Votes') || stat.label.includes('Free') || stat.label.includes('Paid')
              ).map((stat, index) => (
                <div
                  key={stat.label}
                  className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all duration-300 group ${
                    stat.link ? 'cursor-pointer hover:border-slate-300' : ''
                  }`}
                  onClick={() => stat.link && navigate({ to: stat.link })}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    {stat.trend && (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {/* {stat.trend} */}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <h3 className="text-sm font-semibold text-slate-700">{stat.label}</h3>
                    <p className="text-xs text-slate-500">{stat.subtext}</p>
                    {stat.link && (
                      <div className="flex items-center space-x-1 mt-2">
                        <span className="text-xs text-blue-600 font-medium">Click to view →</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Revenue Section */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-1 h-6 bg-teal-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-slate-800">Revenue & Performance</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-teal-200 to-transparent"></div>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {stats.filter(stat => 
                stat.label.includes('Revenue')
              ).map((stat, index) => (
                <div
                  key={stat.label}
                  className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-lg transition-all duration-300 group ${
                    stat.link ? 'cursor-pointer hover:border-slate-300' : ''
                  }`}
                  onClick={() => stat.link && navigate({ to: stat.link })}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    {stat.trend && (
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {/* {stat.trend} */}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <h3 className="text-sm font-semibold text-slate-700">{stat.label}</h3>
                    <p className="text-xs text-slate-500">{stat.subtext}</p>
                    {stat.link && (
                      <div className="flex items-center space-x-1 mt-2">
                        <span className="text-xs text-blue-600 font-medium">Click to view →</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
}
