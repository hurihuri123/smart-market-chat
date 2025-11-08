import { Card } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";
import { Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-marketing.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Main gradient mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-[128px] animate-float" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-secondary/30 rounded-full mix-blend-multiply filter blur-[128px] animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/25 rounded-full mix-blend-multiply filter blur-[128px] animate-float" style={{ animationDelay: '4s' }} />
        </div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(189 95% 65%) 1px, transparent 1px), linear-gradient(90deg, hsl(189 95% 65%) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-effect border border-primary/30 shadow-glow animate-pulse-glow animate-in fade-in duration-500">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">קמפיינים שמנהלים את עצמם</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-in fade-in duration-700 tracking-normal drop-shadow-2xl leading-tight py-2">
            Campainly.AI
          </h1>
          
          <p className="text-2xl md:text-4xl font-bold text-foreground max-w-2xl mx-auto animate-in fade-in duration-700 text-glow">
           קמפיינר אישי מבוסס AI
          </p>
          
          <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-1000">
            <p className="text-lg md:text-xl text-muted-foreground/90 leading-relaxed">
              יוצר עבורך אסטרטגיה שיווקית, כותב מודעות ממירות ומריץ קמפיינים
            </p>
            <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-relaxed">
              שמביאים לקוחות משלמים – לגמרי לבד
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in duration-1200">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-primary/20">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-medium text-foreground">ללא כרטיס אשראי</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-secondary/20">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="text-sm font-medium text-foreground">שיחה קצרה והקמפיין רץ</span>
            </div>
          </div>
        </div>

        {/* Features Section - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 animate-in fade-in duration-1000 delay-200">
          {/* Feature 1 */}
          <div className="group relative overflow-hidden rounded-2xl border border-primary/30 glass-card p-8 glow-hover">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative space-y-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">יוצר אסטרטגייה שיווקית</h3>
              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">ניתוח מעמיק של השוק והקהל היעד שלך</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative overflow-hidden rounded-2xl border border-secondary/30 glass-card p-8 glow-hover">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative space-y-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center shadow-secondary-glow group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors duration-300">בונה מודעות ממירות</h3>
              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">עיצוב וכתיבה יצירתית שמושכת לקוחות</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative overflow-hidden rounded-2xl border border-accent/30 glass-card p-8 glow-hover">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative space-y-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shadow-accent-glow group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">מפעיל ומנהל את הקמפיין</h3>
              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">אופטימיזציה אוטומטית למקסימום תוצאות</p>
            </div>
          </div>
        </div>

        {/* Chat Card */}
        <Card className="w-full overflow-hidden border border-primary/25 glass-card shadow-glow animate-in slide-in-from-bottom duration-1000 hover:border-primary/40 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          <div className="relative">
            <ChatInterface isOnboarding={true} />
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4 animate-in fade-in duration-1200">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-effect border border-primary/10">
            <span className="text-sm font-medium bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              מופעל על ידי AI • פרסום בפייסבוק ואינסטגרם • אופטימיזציה בזמן אמת
            </span>
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="group flex items-center gap-2.5 px-4 py-2 rounded-lg glass-effect border border-primary/10 hover:border-primary/30 transition-all hover:shadow-glow">
              <svg className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
              </svg>
              <span className="text-xs font-semibold text-primary">OpenAI</span>
            </div>
            <div className="group flex items-center gap-2.5 px-4 py-2 rounded-lg glass-effect border border-secondary/10 hover:border-secondary/30 transition-all hover:shadow-secondary-glow">
              <svg className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-xs font-semibold text-secondary">Meta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
