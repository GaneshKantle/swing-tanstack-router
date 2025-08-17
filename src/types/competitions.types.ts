import { Pagination } from './common.types';

/**
 * Award interface for competitions
 */
export interface Award {
  id: string;
  name: string;
  icon: string;
  contestId: string;
}

/**
 * Image interface for competitions
 */
export interface CompetitionImage {
  id: string;
  key: string;
  caption: string | null;
  url: string;
}

/**
 * Competition interface matching the API schema
 */
export interface Competition {
  id: string;
  name: string;
  description: string;
  prizePool: number;
  startDate: string;
  endDate: string;
  registrationDeadline: string | null;
  resultAnnounceDate: string | null;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'VOTING' | 'JUDGING' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED';
  visibility: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY' | 'RESTRICTED';
  isFeatured: boolean;
  isVerified: boolean;
  isVotingEnabled: boolean;
  rules: string | null;
  requirements: string | null;
  winnerProfileId: string | null;
  createdAt: string;
  updatedAt: string;
  awards: Award[];
  images: CompetitionImage[] | null;
}

/**
 * Competitions API response with pagination
 */
export interface CompetitionsListResponse {
  data: Competition[];
  pagination: Pagination;
}

