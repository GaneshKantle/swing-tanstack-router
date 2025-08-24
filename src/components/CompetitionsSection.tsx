import { useContests } from "@/hooks/api/useContests";
import { RefreshCw } from "lucide-react";
import CompetitionCard from "./competitions/CompetitionCard";

const CompetitionsSection = () => {
  const { data, isLoading } = useContests(1, 12, "active");
  const competitions = data?.data;

  // Sort competitions by prize pool in descending order (highest to lowest)
  const sortedCompetitions = competitions?.sort((a, b) => b.prizePool - a.prizePool) || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading competitions...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-muted/40 via-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Active Competitions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose from our exciting competitions and start your journey to winning amazing prizes</p>
        </div>

        {/* Competitions Grid */}
        {sortedCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} contest={competition} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-r from-muted/30 to-muted/10 rounded-2xl border border-muted/20">
            <h3 className="text-xl font-semibold mb-2">No Active Competitions</h3>
            <p className="text-muted-foreground">Check back soon for exciting new competitions!</p>
          </div>
        )}

        {/* More Competitions CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">More competitions launching soon!</p>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 border border-accent/20">
            <span className="w-2 h-2 bg-accent rounded-full mr-3 animate-pulse"></span>
            <span className="text-accent font-medium">Stay tuned for upcoming opportunities</span>
          </div>
        </div>

        {/* Video Section */}
        <div className="mt-20 bg-gradient-to-br from-muted/40 to-muted/20 rounded-3xl p-8 md:p-12 border border-muted/30 shadow-xl">
          <div className="text-center mb-10">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
               How It Works
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Watch our comprehensive guide to understand the complete process and discover how easy it is to participate in our competitions
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/30">
              <iframe
                src="https://www.youtube.com/embed/Mfg7-Bl5Gy8"
                title="How It Works - Competition Guide"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="text-center mt-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-background/80 rounded-full border border-muted/30">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                <p className="text-sm text-muted-foreground font-medium">
                  Learn the step-by-step process to maximize your chances of winning
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionsSection;
