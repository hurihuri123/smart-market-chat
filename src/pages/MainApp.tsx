import { useState, useEffect, useRef } from "react";
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
import { API_BASE_URL } from "@/constants/api";

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
  const [originalStrategyJson, setOriginalStrategyJson] = useState<Record<string, unknown> | null>(null);
  const [currentStrategyAds, setCurrentStrategyAds] = useState<Message["strategyAds"]>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // Convert uploaded URLs to MediaItem format and use proxy for S3 URLs
    const getProxyUrl = (s3Url: string) => {
      if (!s3Url) return s3Url;
      // If it's already a proxy URL, return as is
      if (s3Url.includes('/media/proxy')) return s3Url;
      // If it's an S3 URL, convert to proxy URL
      if (s3Url.includes('.s3.') || s3Url.includes('s3.amazonaws.com')) {
        return `${API_BASE_URL}/media/proxy?url=${encodeURIComponent(s3Url)}`;
      }
      // Otherwise return as is (might be a data URL or other)
      return s3Url;
    };
    
    const mediaItems: { url: string; type: "image" | "video" }[] = urls.map((url) => {
      const lowerUrl = url.toLowerCase();
      const isVideo =
        lowerUrl.endsWith(".mp4") ||
        lowerUrl.endsWith(".mov") ||
        lowerUrl.endsWith(".avi") ||
        lowerUrl.endsWith(".mkv") ||
        lowerUrl.endsWith(".webm");
      return {
        url: getProxyUrl(url),
        type: isVideo ? "video" : "image",
      };
    });

    // After media upload, automatically send brief + media info to the strategy agent
    try {
      setIsStrategyLoading(true);
      const response = await sendStrategyBriefAndMedia(conversationId ?? undefined);
      if (response.conversation_id && response.conversation_id !== conversationId) {
        setConversationId(response.conversation_id);
      }
      // Don't show raw JSON - we'll replace this with a friendly message
      let strategyContent = "";
      let strategyAds: Message["strategyAds"] | undefined;

      // Debug logging
      console.log("Strategy response:", response);
      console.log("Strategy schema:", response.strategy_schema);

      // Try to parse strategy_schema from response, or parse from message if schema is missing
      let schema = null;
      if (response.strategy_schema && typeof response.strategy_schema === "object") {
        schema = response.strategy_schema;
      } else {
        // Fallback: try to parse JSON from the message itself
        try {
          // Try to extract JSON from markdown code blocks or plain JSON
          let jsonStr = response.message;
          // Remove markdown code blocks if present
          jsonStr = jsonStr.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          // Try to find JSON object in the string
          const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            schema = JSON.parse(jsonMatch[0]);
            console.log("Parsed schema from message:", schema);
          }
        } catch (e) {
          console.error("Failed to parse JSON from message:", e);
        }
      }

      if (schema && typeof schema === "object") {
        // Store original strategy JSON for later updates
        setOriginalStrategyJson(schema);
        
        // Extract creative section from strategy JSON
        const creative = schema.creative || schema;
        
        console.log("Full schema:", schema);
        console.log("Creative section:", creative);
        
        // Parse the creative section with arrays
        const headlines = Array.isArray(creative.headlines) ? creative.headlines : [];
        const primaryTexts = Array.isArray(creative.primary_texts) ? creative.primary_texts : [];
        const descriptions = Array.isArray(creative.descriptions) ? creative.descriptions : [];
        const hooks = Array.isArray(creative.hooks) ? creative.hooks : [];
        const cta = creative.cta || creative.buttonText || "למידע נוסף";
        
        // Get media from creative.media_assets (preferred) or fallback to uploaded media
        let strategyMedia: { url: string; type: "image" | "video" }[] = [];
        if (creative.media_assets) {
          const selectedImages = Array.isArray(creative.media_assets.selected_images)
            ? creative.media_assets.selected_images
            : [];
          const selectedVideos = Array.isArray(creative.media_assets.selected_videos)
            ? creative.media_assets.selected_videos
            : [];
          
          console.log("Strategy media_assets:", creative.media_assets);
          console.log("Selected images:", selectedImages);
          console.log("Selected videos:", selectedVideos);
          
          // Convert S3 URLs to proxy URLs to avoid CORS issues
          const getProxyUrlForStrategy = (s3Url: string) => {
            if (!s3Url) return s3Url;
            // If it's already a proxy URL, return as is
            if (s3Url.includes('/media/proxy')) return s3Url;
            // If it's an S3 URL, convert to proxy URL
            if (s3Url.includes('.s3.') || s3Url.includes('s3.amazonaws.com')) {
              return `${API_BASE_URL}/media/proxy?url=${encodeURIComponent(s3Url)}`;
            }
            // Otherwise return as is
            return s3Url;
          };
          
          strategyMedia = [
            ...selectedImages.map((url: string) => ({ url: getProxyUrlForStrategy(url), type: "image" as const })),
            ...selectedVideos.map((url: string) => ({ url: getProxyUrlForStrategy(url), type: "video" as const })),
          ];
          
          console.log("Parsed strategy media:", strategyMedia);
        }
        
        console.log("Uploaded media items:", mediaItems);
        
        // Use strategy media if available, otherwise fallback to uploaded media
        const availableMedia = strategyMedia.length > 0 ? strategyMedia : mediaItems;
        
        console.log("Available media for ads:", availableMedia);
        
        // Determine number of ads (up to 3) based on available content
        const maxAds = Math.min(
          3,
          Math.max(
            headlines.length,
            primaryTexts.length,
            descriptions.length,
            hooks.length
          )
        );
        
        // Only create ads if we have at least some content
        if (maxAds > 0) {
          // Create ads by pairing arrays at same index
          strategyAds = [];
          for (let i = 0; i < maxAds; i++) {
            // Get headline from headlines array, with fallbacks
            const headline = headlines[i] || hooks[i] || descriptions[i] || "";
            
            // Get primary text from primary_texts array
            const primaryText = primaryTexts[i] || "";
            
            // Get description separately (not combined with primary text)
            const description = descriptions[i] || "";
            
            // Distribute media across ads
            // If there's only one image/video, give it to all ads
            // Otherwise, distribute across ads
            let adMedia: { url: string; type: "image" | "video" }[] = [];
            if (availableMedia.length > 0) {
              if (availableMedia.length === 1) {
                // Single media item: give it to all ads
                adMedia = availableMedia;
              } else if (maxAds === 1) {
                // Single ad gets all media
                adMedia = availableMedia;
              } else if (maxAds === 2) {
                // Two ads: split media roughly in half
                const midPoint = Math.ceil(availableMedia.length / 2);
                adMedia = i === 0 ? availableMedia.slice(0, midPoint) : availableMedia.slice(midPoint);
              } else {
                // Three ads: distribute evenly, but ensure each ad gets at least one if possible
                const perAd = Math.ceil(availableMedia.length / 3);
                const start = i * perAd;
                const end = Math.min(start + perAd, availableMedia.length);
                adMedia = availableMedia.slice(start, end);
                // If this ad got no media but there's media available, give it at least one
                if (adMedia.length === 0 && availableMedia.length > 0) {
                  adMedia = [availableMedia[i % availableMedia.length]];
                }
              }
            }
            
            console.log(`Ad ${i + 1} media:`, adMedia);
            
            // Only add ad if it has at least a headline or primary text
            if (headline || primaryText || description) {
              const adData = {
                headline: headline || "מודעה",
                primaryText: primaryText || "",
                description: description || undefined,
                buttonText: cta || "למידע נוסף",
                // Always include media array, even if empty (don't set to undefined)
                media: adMedia.length > 0 ? adMedia : [],
              };
              
              console.log(`Ad ${i + 1} data:`, adData);
              console.log(`Ad ${i + 1} media array:`, adData.media);
              console.log(`Ad ${i + 1} media length:`, adData.media.length);
              strategyAds.push(adData);
            }
          }
          
          // If no ads were created but we have content, create at least one ad with available data
          if (strategyAds.length === 0 && (headlines.length > 0 || primaryTexts.length > 0)) {
            strategyAds.push({
              headline: headlines[0] || hooks[0] || descriptions[0] || "מודעה",
              primaryText: primaryTexts[0] || "",
              description: descriptions[0] || undefined,
              buttonText: cta,
              media: availableMedia.length > 0 ? availableMedia : undefined,
            });
          }
        }

        // If we successfully parsed strategy ads, replace raw JSON content with a friendly label
        const adCount = strategyAds?.length || 0;
        if (adCount > 0) {
          // Don't show the raw JSON - only show friendly message
          strategyContent =
            adCount === 1
              ? "הנה מודעת פייסבוק שהכנתי עבורך על בסיס הבריף והמדיה:"
              : `הנה ${adCount} מודעות פייסבוק שהכנתי עבורך על בסיס הבריף והמדיה:`;
          
          console.log("Created strategy ads:", strategyAds);
        } else {
          console.warn("Strategy schema parsed but no ads were created");
          // If no ads were created, show a generic message instead of raw JSON
          strategyContent = "הכנתי עבורך אסטרטגיית קמפיין, אך לא הצלחתי ליצור מודעות. אנא נסה שוב.";
        }
      } else {
        console.warn("No strategy schema found or parsing failed");
        // If parsing failed, show a generic message instead of raw JSON
        strategyContent = "הכנתי עבורך אסטרטגיית קמפיין. אנא בדוק את הפרטים.";
      }

      // Store current strategy ads for the save button
      if (strategyAds && strategyAds.length > 0) {
        setCurrentStrategyAds(strategyAds);
      }

      // Only add message if we have ads to show, otherwise show error message
      const strategyMsg: Message = {
        id: `${Date.now()}-strategy-response`,
        role: "assistant",
        content: strategyContent,
        strategyAds: strategyAds && strategyAds.length > 0 ? strategyAds : undefined,
        isStrategyAd: !!strategyAds && strategyAds.length > 0,
      };
      
      console.log("Adding strategy message to chat:", strategyMsg);
      addMessage(strategyMsg);
      
      // Add a follow-up message with "הקמפיין מוכן" button after the ads
      if (strategyAds && strategyAds.length > 0) {
        const readyMsg: Message = {
          id: `${Date.now()}-campaign-ready`,
          role: "assistant",
          content: "",
          showCampaignReadyButton: true,
        };
        addMessage(readyMsg);
      }
    } catch (e) {
      console.error("Failed to send brief + media to strategy agent", e);
    } finally {
      setIsStrategyLoading(false);
    }
  };

  const handleCampaignReady = async () => {
    if (!originalStrategyJson) {
      console.error("Cannot save campaign: missing strategy JSON");
      return;
    }

    // Use current strategy ads (which may have been edited)
    const adsToSave = currentStrategyAds;
    if (!adsToSave || adsToSave.length === 0) {
      console.error("Cannot save campaign: no strategy ads found");
      return;
    }

    try {
      // Update the strategy JSON with edited ad content
      const updatedStrategy = { ...originalStrategyJson } as Record<string, unknown>;
      
      if (updatedStrategy.creative && typeof updatedStrategy.creative === 'object') {
        const creative = updatedStrategy.creative as Record<string, unknown>;
        // Update headlines, primary_texts, descriptions from edited ads
        creative.headlines = adsToSave.map(ad => ad.headline);
        creative.primary_texts = adsToSave.map(ad => ad.primaryText);
        creative.descriptions = adsToSave.map(ad => ad.description || "");
        // CTA might have been edited in one of the ads, use the first one
        if (adsToSave[0]?.buttonText) {
          creative.cta = adsToSave[0].buttonText;
        }
      }

      // Save to backend
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.error("No auth token available");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/campaign/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          strategy_json: updatedStrategy,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save campaign: ${response.status}`);
      }

      const data = await response.json();
      console.log("Campaign saved successfully:", data);

      // Add success message
      const successMsg: Message = {
        id: `${Date.now()}-campaign-saved`,
        role: "assistant",
        content: `הקמפיין נשמר בהצלחה! מזהה הקמפיין: ${data.campaign_id}`,
      };
      addMessage(successMsg);
    } catch (e) {
      console.error("Failed to save campaign:", e);
      const errorMsg: Message = {
        id: `${Date.now()}-campaign-error`,
        role: "assistant",
        content: "מצטער, לא הצלחתי לשמור את הקמפיין. אנא נסה שוב.",
      };
      addMessage(errorMsg);
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
                    onCampaignReady={message.showCampaignReadyButton ? handleCampaignReady : undefined}
                    onStrategyAdUpdate={(adIndex, updatedAd) => {
                      // Update the current strategy ads state when an ad is edited
                      setCurrentStrategyAds((prev) => {
                        if (!prev) return prev;
                        const updated = [...prev];
                        updated[adIndex] = updatedAd;
                        return updated;
                      });
                    }}
                  />
                ))
              )}
              
              {isStrategyLoading && (
                <div className="animate-in fade-in">
                  <TypingIndicator text="בונה לך אסטרטגיה לקמפיין חדש..." />
                </div>
              )}
              <div ref={messagesEndRef} />
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
