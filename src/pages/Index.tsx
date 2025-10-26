import { Card } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";
import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-marketing.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(2px)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary/50 shadow-glow">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold">Campaigns that run themselves</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent animate-in fade-in duration-700">
            Campainly.AI
          </h1>
          
          <p className="text-2xl md:text-3xl font-semibold text-foreground max-w-2xl mx-auto animate-in fade-in duration-700">
            Your personal AI campaign manager.
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in duration-1000">
            Chat for 2 minutes — Campainly.AI will build and launch your Facebook campaigns automatically.
          </p>
        </div>

        {/* Chat Card */}
        <Card className="glass-effect border-primary/30 shadow-glow animate-in slide-in-from-bottom duration-1000">
          <div className="h-[500px] flex flex-col">
            <ChatInterface isOnboarding={true} />
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground animate-in fade-in duration-1200">
          <p>Powered by AI • Facebook & Instagram Ads • Real-time Optimization</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
