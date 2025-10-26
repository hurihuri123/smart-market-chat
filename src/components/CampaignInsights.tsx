import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, PlayCircle, CheckCircle2 } from "lucide-react";

export const CampaignInsights = () => {
  const campaigns = [
    {
      name: "Summer Product Launch",
      status: "running",
      budget: "$2,500",
      reach: "52.3K",
      conversions: "1,234",
      insights: "Performing 23% above industry average",
    },
    {
      name: "Brand Awareness Q4",
      status: "running",
      budget: "$1,800",
      reach: "38.2K",
      conversions: "892",
      insights: "Consider increasing budget for better reach",
    },
    {
      name: "Holiday Special Promo",
      status: "scheduled",
      budget: "$3,500",
      reach: "-",
      conversions: "-",
      insights: "Scheduled to start in 5 days",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <PlayCircle className="w-4 h-4" />;
      case "scheduled":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-accent/20 text-accent";
      case "scheduled":
        return "bg-primary/20 text-primary";
      case "completed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="glass-effect border-border p-6">
      <h2 className="text-xl font-semibold mb-6">Active Campaigns</h2>
      <div className="space-y-4">
        {campaigns.map((campaign, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-secondary border border-border transition-smooth hover:border-primary"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{campaign.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {campaign.insights}
                </p>
              </div>
              <Badge className={getStatusColor(campaign.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(campaign.status)}
                  {campaign.status}
                </span>
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="font-semibold mt-1">{campaign.budget}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reach</p>
                <p className="font-semibold mt-1">{campaign.reach}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Conversions</p>
                <p className="font-semibold mt-1">{campaign.conversions}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
