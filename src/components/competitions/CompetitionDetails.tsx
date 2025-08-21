import defaultImage from "@/assets/hot-girl-summer.jpg";
import { ContestJoinButton } from "@/components/global";
import { api } from "@/lib/api";
import { Contest_Status } from "@/lib/validations/contest.schema";
import { Route } from "@/routes/_public/competitions/$slug";
import { Contest } from "@/types/contest.types";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, Clock, DollarSign, Share2, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardSection } from "@/routes/dashboard/$section";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const formatDate = (date: string | Date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

export function CompetitionDetails() {
  const { user } = useAuth();
  const { slug } = useParams({ from: "/_public/competitions/$slug" });
  const initialData = Route.useLoaderData();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activeSection, setActiveSection] = useState<DashboardSection>("competitions");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleSetActiveSection = (newSection: DashboardSection) => {
    setActiveSection(newSection);
    navigate({ to: "/dashboard/$section", params: { section: newSection } });
  };

  const {
    data: competition,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["competition", slug],
    queryFn: async (): Promise<Contest> => {
      const response = await api.get<Contest>(`/api/v1/contest/slug/${slug}`);
      return response.data;
    },
    initialData,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Competition Not Found</h1>
          <p className="text-gray-600">The competition you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const getImageUrl = (images: { url: string }[] | null) => {
    if (images && images.length > 0) {
      return images[0].url;
    }
    return defaultImage;
  };

  const getStatusBadge = (status: keyof typeof Contest_Status) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-700 text-white">Active</Badge>;
      case "COMPLETED":
      case "BOOKED":
        return <Badge variant="secondary">Completed</Badge>;
      case "DRAFT":
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const shareCompetition = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link Copied!", {
        description: "Competition link has been copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Copy Failed", {
        description: "Failed to copy link to clipboard.",
      });
    }
  };

  const shareProfile = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${user?.username}`;
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied!", {
        description: "Share this link with your supporters to get more votes.",
      });
    } catch (error) {
      console.error("Error sharing profile:", error);
      toast.error("Copy Failed", {
        description: "Failed to copy profile link to clipboard.",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header onSidebarToggle={isAuthenticated ? handleSidebarToggle : undefined} />
        <div className="flex pt-16 min-h-screen">
          {/* Desktop Sidebar - Only show when authenticated */}
          {isAuthenticated && (
            <aside className="hidden md:block">
              <Sidebar activeSection={activeSection} setActiveSection={handleSetActiveSection} />
            </aside>
          )}

          {/* Mobile Sidebar - Only show when authenticated */}
          {isAuthenticated && (
            <Sidebar 
              activeSection={activeSection} 
              setActiveSection={handleSetActiveSection} 
              isMobile={true} 
              isOpen={isMobileSidebarOpen} 
              onToggle={() => setIsMobileSidebarOpen(false)} 
            />
          )}

          {/* Main content */}
          <main className={`overflow-y-auto ${isAuthenticated ? 'flex-1' : 'w-full'}`}>
            <div className="container mx-auto px-4 py-8">
              {/* Hero Section with Image and Title */}
              <div className="relative">
          <div className="relative h-[420px] rounded-2xl overflow-hidden mb-6">
            <img src={getImageUrl(competition?.images ?? [])} alt={competition.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-0 right-0 py-6 px-8">
              <div className="flex items-center space-x-3 mb-4">{getStatusBadge(competition.status)}</div>
            </div>
            <div className="absolute bottom-0 right-0 p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Button
                  onClick={shareCompetition}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-secondary hover:text-black"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 p-8 pr-40">
              <h1 className="text-3xl capitalize font-bold text-white mb-2">{competition.name}</h1>
              <p className="text-white/90 text-sm sentence-case max-w-3xl">{competition.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Competition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{competition.description}</p>
              </CardContent>
            </Card>

            {/* Rules & Requirements */}
            {competition.rules && (
              <Card>
                <CardHeader>
                  <CardTitle>Rules & Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{competition.rules}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {competition.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{competition.requirements}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Awards */}
            {competition.awards && competition.awards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Awards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {competition.awards.map((award) => (
                      <div key={award.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">{award.icon}</span>
                        <span className="font-medium">{award.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Competition Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Prize Pool</p>
                    <p className="font-semibold">${competition.prizePool?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-semibold">{formatDate(competition.startDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-semibold">{formatDate(competition.endDate)}</p>
                  </div>
                </div>

                {competition.registrationDeadline && (
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Registration Deadline</p>
                      <p className="font-semibold">{formatDate(competition.registrationDeadline)}</p>
                    </div>
                  </div>
                )}

                {competition.resultAnnounceDate && (
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Results Announcement</p>
                      <p className="font-semibold">{formatDate(competition.resultAnnounceDate)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Get Involved</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ContestJoinButton contest={competition} className="w-full" size="lg" showAuthModal={true} />
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link to={`/competitions/$slug/participants`} params={{ slug: competition.slug }}>
                    View Participants
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" size="lg" onClick={shareProfile}>
                     Share Public Profile
                 </Button>
                <Button variant="outline" className="w-full" size="lg" onClick={shareCompetition}>
                  Share Competition
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
