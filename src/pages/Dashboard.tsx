import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";
import { CampaignMetrics } from "@/components/CampaignMetrics";
import { CampaignInsights } from "@/components/CampaignInsights";

const Dashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Campaign Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor and optimize your marketing campaigns
            </p>
          </div>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="px-6 py-3 gradient-primary text-foreground font-semibold rounded-lg shadow-glow transition-smooth hover:scale-105"
          >
            {isChatOpen ? "Close Chat" : "Open Chat"}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Metrics & Insights */}
          <div className="lg:col-span-2 space-y-6">
            <CampaignMetrics />
            <CampaignInsights />
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-1">
            <Card className="glass-effect border-border h-[calc(100vh-12rem)] sticky top-8">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-border">
                  <h2 className="text-xl font-semibold">Campaign Assistant</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure and optimize your campaigns
                  </p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ChatInterface
                    isOnboarding={false}
                    onComplete={() => {}}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
