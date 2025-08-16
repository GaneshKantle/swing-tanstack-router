import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Heart, 
  Star, 
  Clock, 
  Calendar,
  Eye,
  TrendingUp,
  MapPin,
  Trophy
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface VoteRecord {
  id: string;
  modelName: string;
  modelProfileImage: string;
  contestName: string;
  contestCategory: string;
  voteType: 'free' | 'premium';
  voteCount: number;
  timestamp: string;
  contestEndDate: string;
  contestStatus: 'active' | 'ended' | 'upcoming';
  modelRank?: number;
  totalContestVotes: number;
}

export function VoteHistory() {
  const { user } = useAuth();
  const [voteHistory, setVoteHistory] = useState<VoteRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<VoteRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedVoteType, setSelectedVoteType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVotes: 0,
    freeVotes: 0,
    premiumVotes: 0,
    contestsVotedIn: 0,
    favoriteModels: 0
  });

  const filters = [
    { value: 'all', label: 'All Votes' },
    { value: 'recent', label: 'Recent (7 days)' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const voteTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'free', label: 'Free Votes' },
    { value: 'premium', label: 'Premium Votes' }
  ];

  useEffect(() => {
    // Fetch vote history from API
    const fetchVoteHistory = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await getVoteHistory(user?.profile?.id);
        // setVoteHistory(response.data);
        
        // Mock data for now
        const mockData: VoteRecord[] = [
          {
            id: '1',
            modelName: 'Sarah Johnson',
            modelProfileImage: '/api/placeholder/100/100',
            contestName: 'Summer Glow 2025',
            contestCategory: 'boudoir',
            voteType: 'premium',
            voteCount: 5,
            timestamp: '2025-01-28T10:30:00Z',
            contestEndDate: '2025-02-15T23:59:59Z',
            contestStatus: 'active',
            modelRank: 3,
            totalContestVotes: 156
          },
          {
            id: '2',
            modelName: 'Emma Davis',
            modelProfileImage: '/api/placeholder/100/100',
            contestName: 'Urban Elegance',
            contestCategory: 'fashion',
            voteType: 'free',
            voteCount: 1,
            timestamp: '2025-01-27T15:45:00Z',
            contestEndDate: '2025-01-30T23:59:59Z',
            contestStatus: 'active',
            modelRank: 1,
            totalContestVotes: 89
          },
          {
            id: '3',
            modelName: 'Mia Rodriguez',
            modelProfileImage: '/api/placeholder/100/100',
            contestName: 'Artistic Expression',
            contestCategory: 'artistic',
            voteType: 'premium',
            voteCount: 10,
            timestamp: '2025-01-26T09:15:00Z',
            contestEndDate: '2025-03-01T23:59:59Z',
            contestStatus: 'active',
            modelRank: 2,
            totalContestVotes: 234
          },
          {
            id: '4',
            modelName: 'Alex Thompson',
            modelProfileImage: '/api/placeholder/100/100',
            contestName: 'Winter Beauty',
            contestCategory: 'portrait',
            voteType: 'free',
            voteCount: 1,
            timestamp: '2025-01-20T14:20:00Z',
            contestEndDate: '2025-01-25T23:59:59Z',
            contestStatus: 'ended',
            modelRank: 5,
            totalContestVotes: 67
          }
        ];
        
        setVoteHistory(mockData);
        
        // Calculate stats
        const totalVotes = mockData.reduce((sum, vote) => sum + vote.voteCount, 0);
        const freeVotes = mockData.filter(vote => vote.voteType === 'free').reduce((sum, vote) => sum + vote.voteCount, 0);
        const premiumVotes = mockData.filter(vote => vote.voteType === 'premium').reduce((sum, vote) => sum + vote.voteCount, 0);
        const contestsVotedIn = new Set(mockData.map(vote => vote.contestName)).size;
        const favoriteModels = new Set(mockData.map(vote => vote.modelName)).size;
        
        setStats({
          totalVotes,
          freeVotes,
          premiumVotes,
          contestsVotedIn,
          favoriteModels
        });
        
      } catch (error) {
        console.error('Error fetching vote history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.profile?.id) {
      fetchVoteHistory();
    }
  }, [user?.profile?.id]);

  useEffect(() => {
    // Filter vote history based on search and filters
    let filtered = voteHistory;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vote =>
        vote.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vote.contestName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply time filter
    if (selectedFilter !== 'all') {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      filtered = filtered.filter(vote => {
        const voteDate = new Date(vote.timestamp);
        switch (selectedFilter) {
          case 'recent':
            return voteDate >= sevenDaysAgo;
          case 'month':
            return voteDate >= monthStart;
          case 'year':
            return voteDate >= yearStart;
          default:
            return true;
        }
      });
    }

    // Apply vote type filter
    if (selectedVoteType !== 'all') {
      filtered = filtered.filter(vote => vote.voteType === selectedVoteType);
    }

    setFilteredHistory(filtered);
  }, [voteHistory, searchTerm, selectedFilter, selectedVoteType]);

  const getContestStatusBadge = (status: string, endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    
    if (status === 'ended' || end < now) {
      return <Badge variant="secondary">Ended</Badge>;
    } else if (end.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return <Badge variant="destructive">Ending Soon</Badge>;
    } else {
      return <Badge variant="default">Active</Badge>;
    }
  };

  const getVoteTypeBadge = (voteType: string) => {
    return voteType === 'premium' ? (
      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
        <Star className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    ) : (
      <Badge variant="outline">
        <Heart className="w-3 h-3 mr-1" />
        Free
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vote History</h1>
          <p className="text-muted-foreground mt-2">
            Track your voting activity and support for models
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              All time votes cast
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Votes</CardTitle>
            <Heart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.freeVotes}</div>
            <p className="text-xs text-muted-foreground">
              Daily free votes used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Votes</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premiumVotes}</div>
            <p className="text-xs text-muted-foreground">
              Premium votes used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contests</CardTitle>
            <Trophy className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contestsVotedIn}</div>
            <p className="text-xs text-muted-foreground">
              Contests participated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Models</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteModels}</div>
            <p className="text-xs text-muted-foreground">
              Unique models voted for
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by model name or contest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            aria-label="Filter by time period"
          >
            {filters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          
          <select
            value={selectedVoteType}
            onChange={(e) => setSelectedVoteType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            aria-label="Filter by vote type"
          >
            {voteTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vote History List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Voting Activity</span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredHistory.length} votes found
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No votes found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedFilter !== 'all' || selectedVoteType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start voting for models to see your history here'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((vote) => (
                <div 
                  key={vote.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* Model Image */}
                  <img
                    src={vote.modelProfileImage}
                    alt={vote.modelName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  
                  {/* Vote Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-foreground">{vote.modelName}</h4>
                      {getVoteTypeBadge(vote.voteType)}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4" />
                        <span>{vote.contestName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span className="capitalize">{vote.contestCategory}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{vote.voteCount} vote{vote.voteCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(vote.timestamp), { addSuffix: true })}</span>
                      </div>
                      {vote.modelRank && (
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>Rank #{vote.modelRank} of {vote.totalContestVotes} votes</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contest Status */}
                  <div className="flex flex-col items-end space-y-2">
                    {getContestStatusBadge(vote.contestStatus, vote.contestEndDate)}
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Contest
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default VoteHistory;
