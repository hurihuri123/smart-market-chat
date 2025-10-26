import { Card } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";

export const CampaignMetrics = () => {
  const metrics = [
    {
      title: "Total Reach",
      value: "124.5K",
      change: "+12.5%",
      icon: Users,
      color: "text-accent",
    },
    {
      title: "Conversions",
      value: "3,842",
      change: "+8.2%",
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Ad Spend",
      value: "$5,230",
      change: "-3.1%",
      icon: DollarSign,
      color: "text-accent-glow",
    },
    {
      title: "ROI",
      value: "340%",
      change: "+15.7%",
      icon: TrendingUp,
      color: "text-primary-glow",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isPositive = metric.change.startsWith("+");

        return (
          <Card
            key={metric.title}
            className="glass-effect border-border p-6 transition-smooth hover:border-primary hover:shadow-glow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <h3 className="text-2xl font-bold mt-2">{metric.value}</h3>
                <p
                  className={`text-sm mt-1 ${
                    isPositive ? "text-accent" : "text-destructive"
                  }`}
                >
                  {metric.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-secondary ${metric.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
