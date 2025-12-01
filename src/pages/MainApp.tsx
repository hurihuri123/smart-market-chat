import { useState, useEffect } from "react";
import { MessageSquare, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChat, Message } from "@/hooks/useChat";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { FileUploadDialog } from "@/components/FileUploadDialog";
import { fetchUserMessages } from "@/services/messageService";
import { sendStrategyBriefAndMedia } from "@/services/chatService";

type Tab = "chat" | "analytics";

const QuickActionButtons = ({ onAction }: { onAction: (action: string) => void }) => {
  const actions = [
    { label: "📊 בדוק ביצועים", value: "בדוק את ביצועי הקמפיין שלי", disabled: true },
    { label: "✨ שפר קמפיין", value: "אני רוצה לשפר את הקמפיין הנוכחי", disabled: true },
    { label: "🎯 צור מודעה", value: "CREATE_AD_PREVIEW", disabled: false },
    { label: "💡 עצות", value: "תן לי עצות לשיפור", disabled: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
      {actions.map((action) => (
        <Button
          key={action.value}
          onClick={() => !action.disabled && onAction(action.value)}
          disabled={action.disabled}
          variant="outline"
          className={cn(
            "h-auto py-4 px-6 text-right justify-start glass-effect border-primary/20 transition-smooth",
            action.disabled
              ? "opacity-60 cursor-not-allowed"
              : "hover:glass-card hover:border-primary/40 hover:translate-y-[-2px] hover:shadow-glow"
          )}
        >
          <span className="text-base font-medium">{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

const MainApp = () => {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const { messages, input, setInput, isLoading, handleSend, handleKeyDown, addMessage, conversationId, setConversationId } =
    useChat({
      isOnboarding: false,
      mode: "strategy",
    });
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [hasAutoCreatedAdPreview, setHasAutoCreatedAdPreview] = useState(false);
  const [isStrategyLoading, setIsStrategyLoading] = useState(false);

  // Load chat history from backend when /app loads
  useEffect(() => {
    if (hasLoadedHistory) return;

    const loadHistory = async () => {
      try {
        const stored = await fetchUserMessages();
        if (stored.length) {
          for (const m of stored) {
            const [maybeRole, ...rest] = m.content.split(": ");
            let role: "user" | "assistant" = "assistant";
            let text = m.content;
            if (maybeRole === "user" || maybeRole === "assistant") {
              role = maybeRole;
              text = rest.join(": ");
            }
            const msg: Message = {
              id: String(m.id),
              role,
              content: text,
            };
            addMessage(msg);
          }
        }
      } catch (e) {
        // Silently ignore; /app will just start fresh
        console.error("Failed to load messages from backend", e);
      } finally {
        setHasLoadedHistory(true);
      }
    };

    loadHistory();
  }, [addMessage, hasLoadedHistory]);

  // Auto-run the "צור מודעה" action once, after history (if any) is loaded
  useEffect(() => {
    if (!hasLoadedHistory) return;
    if (hasAutoCreatedAdPreview) return;
    if (messages.length === 0) return;

    const hasAdPreview = messages.some((msg) => msg.adPreview);
    if (!hasAdPreview) {
      // Same operation as clicking the "CREATE_AD_PREVIEW" quick action
      const adMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: "יאללה בוא נריץ קמפיין חדש, תעלה לי לכאן תמונות או סרטונים שתרצה שאריץ עבורך:",
        adPreview: {
          headline: "",
          primaryText: "",
          buttonText: "",
        },
      };
      addMessage(adMessage);
      setHasAutoCreatedAdPreview(true);
    }
  }, [messages, hasAutoCreatedAdPreview, addMessage, hasLoadedHistory]);

  const handleQuickAction = (action: string) => {
    if (action === "אני רוצה להתחיל קמפיין חדש") {
      setFileUploadOpen(true);
    } else if (action === "CREATE_AD_PREVIEW") {
      // Create a sample ad preview message
      const adMessage = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: "יאללה בוא נריץ קמפיין חדש, תעלה לי לכאן תמונות או סרטונים שתרצה שאריץ עבורך:",
        adPreview: {
          headline: "",
          primaryText: "",
          buttonText: "",
        },
      };
      addMessage(adMessage);
    } else {
      setInput(action);
    }
  };

  const handleAdUploadComplete = async (urls: string[]) => {
    if (!urls.length) return;
    const content = `הקבצים הועלו בהצלחה. כתובות המדיה הן:\n${urls.join("\n")}`;
    const msg: Message = {
      id: `${Date.now()}-upload-urls`,
      role: "assistant",
      content,
    };
    addMessage(msg);

    // After media upload, automatically send brief + media info to the strategy agent
    try {
      setIsStrategyLoading(true);
      const response = await sendStrategyBriefAndMedia(conversationId ?? undefined);
      if (response.conversation_id && response.conversation_id !== conversationId) {
        setConversationId(response.conversation_id);
      }
      const strategyMsg: Message = {
        id: `${Date.now()}-strategy-response`,
        role: "assistant",
        content: response.message ?? "…",
      };
      addMessage(strategyMsg);
    } catch (e) {
      console.error("Failed to send brief + media to strategy agent", e);
    } finally {
      setIsStrategyLoading(false);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    // For now, just set a message that files were uploaded
    // In a real implementation, you would handle the file upload to your backend
    const fileNames = files.map(f => f.name).join(", ");
    setInput(`אני רוצה להתחיל קמפיין חדש עם הקבצים הבאים: ${fileNames}`);
  };

  const tabs = [
    { id: "chat" as Tab, label: "צ'אט", icon: MessageSquare },
    { id: "analytics" as Tab, label: "אנליטיקס", icon: BarChart3, comingSoon: true },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-20 lg:w-64 glass-effect border-l border-border/50 flex flex-col items-center lg:items-stretch p-4 space-y-4">
        {/* Logo */}
        <div className="flex items-center justify-center lg:justify-start gap-3 py-4">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="hidden lg:block text-xl font-bold gradient-text">Campainly.AI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.comingSoon && setActiveTab(tab.id)}
              disabled={tab.comingSoon}
              className={cn(
                "w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl transition-smooth relative group",
                activeTab === tab.id
                  ? "gradient-primary shadow-glow text-white"
                  : "hover:glass-card text-muted-foreground hover:text-foreground",
                tab.comingSoon && "opacity-50 cursor-not-allowed"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden lg:block font-medium">{tab.label}</span>
              {tab.comingSoon && (
                <span className="hidden lg:block absolute left-3 text-xs px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                  בקרוב
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Interface */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto">
                  <div className="text-center space-y-6 animate-in fade-in duration-700">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-effect border border-primary/30 shadow-glow">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-sm font-semibold gradient-text">AI Campaign Manager</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold gradient-text">
                      שלום! 👋
                    </h2>
                    
                    <p className="text-xl text-muted-foreground max-w-2xl">
                      אני הקמפיינר האישי שלך. איך אני יכול לעזור לך היום?
                    </p>

                    <QuickActionButtons onAction={handleQuickAction} />
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onAdUploadComplete={handleAdUploadComplete}
                    conversationId={conversationId}
                  />
                ))
              )}
              
              {isStrategyLoading && (
                <div className="animate-in fade-in">
                  <TypingIndicator text="בונה לך אסטרטגיה לקמפיין חדש..." />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border/50 bg-background/80 backdrop-blur-xl p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-3 items-end">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="שאל אותי כל דבר..."
                    className="min-h-[60px] max-h-[200px] resize-none rounded-2xl bg-secondary/60 border-border/50 focus:border-primary transition-smooth focus-visible:ring-0 focus-visible:outline-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    size="lg"
                    className="gradient-primary shadow-glow transition-smooth hover:shadow-[0_12px_30px_rgba(56,189,248,0.45)] hover:translate-y-[-1px] h-[60px] px-6"
                  >
                    <Send className="w-5 h-5 ml-2" />
                    שלח
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics (Coming Soon) */}
        {activeTab === "analytics" && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4 animate-in fade-in">
              <BarChart3 className="w-16 h-16 mx-auto text-primary/40" />
              <h3 className="text-2xl font-bold text-muted-foreground">בקרוב...</h3>
              <p className="text-muted-foreground">אנליטיקס מתקדמת של הקמפיינים שלך</p>
            </div>
          </div>
        )}
      </div>

      {/* File Upload Dialog */}
      <FileUploadDialog
        open={fileUploadOpen}
        onOpenChange={setFileUploadOpen}
        onFilesSelected={handleFilesSelected}
      />
    </div>
  );
};

export default MainApp;
