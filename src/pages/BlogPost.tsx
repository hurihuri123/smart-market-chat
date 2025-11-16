import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { slug } = useParams();

  // In a real app, this would fetch from an API based on slug
  const post = {
    title: "מהפכת ה-AI בשיווק דיגיטלי: איך לנצל את הכוח של בינה מלאכותית",
    date: "2024-03-15",
    readTime: "5 דקות קריאה",
    category: "AI ושיווק",
    content: `
      <h2>מבוא: עידן חדש בשיווק</h2>
      <p>
        בשנים האחרונות, בינה מלאכותית הפכה לכוח מניע מרכזי בעולם השיווק הדיגיטלי. 
        מה שהתחיל כטכנולוגיה עתידנית הפך למציאות יומיומית שמשנה את הדרך שבה עסקים 
        מתקשרים עם הלקוחות שלהם.
      </p>

      <h2>למה AI חשוב בשיווק?</h2>
      <p>
        בינה מלאכותית מאפשרת לנו לנתח כמויות עצומות של מידע בזמן אמת, להבין דפוסי 
        התנהגות של צרכנים, ולהתאים את המסרים השיווקיים בצורה מדויקת יותר מאי פעם.
      </p>

      <h3>היתרונות העיקריים:</h3>
      <ul>
        <li><strong>אופטימיזציה אוטומטית:</strong> AI מנתח את ביצועי הקמפיינים ומבצע שיפורים בזמן אמת</li>
        <li><strong>פרסונליזציה מתקדמת:</strong> התאמת תוכן ומסרים לכל משתמש בנפרד</li>
        <li><strong>חיזוי מגמות:</strong> זיהוי הזדמנויות ומגמות לפני שהן הופכות למיינסטרים</li>
        <li><strong>חיסכון בזמן ובכסף:</strong> אוטומציה של משימות חוזרות ושיפור ROI</li>
      </ul>

      <h2>כיצד ליישם AI בקמפיינים שלכם?</h2>
      <p>
        היישום של AI בשיווק לא חייב להיות מסובך. הנה כמה דרכים מעשיות להתחיל:
      </p>

      <h3>1. ניתוח קהל יעד</h3>
      <p>
        השתמשו ב-AI כדי לנתח את קהל היעד שלכם בצורה מעמיקה. הטכנולוגיה יכולה לזהות 
        דפוסים שקשה לגלות ידנית ולחלק את הקהל לסגמנטים מדויקים יותר.
      </p>

      <h3>2. יצירת תוכן מותאם אישית</h3>
      <p>
        AI יכול לעזור ביצירת וריאציות שונות של תוכן שיווקי, מודעות ומסרים, תוך 
        התאמה לאפיונים השונים של קהל היעד.
      </p>

      <h3>3. אופטימיזציה של תקציבים</h3>
      <p>
        אלגוריתמים חכמים יכולים להקצות תקציבי פרסום בצורה דינמית, תוך התמקדות 
        בערוצים ובקמפיינים המצליחים ביותר.
      </p>

      <h2>מקרי מבחן והצלחות</h2>
      <p>
        חברות רבות כבר מיישמות AI בהצלחה בקמפיינים שלהן. ראינו שיפורים של:
      </p>
      <ul>
        <li>עלייה של 45% בשיעורי ההמרה</li>
        <li>הפחתה של 30% בעלויות רכישת לקוח</li>
        <li>שיפור של 60% בדיוק הטרגוט</li>
      </ul>

      <h2>העתיד כבר כאן</h2>
      <p>
        השאלה כבר לא "האם להשתמש ב-AI בשיווק?" אלא "איך להשתמש בו בצורה היעילה ביותר?". 
        העסקים שיאמצו את הטכנולוגיה הזו מוקדם יהנו מיתרון תחרותי משמעותי.
      </p>

      <h2>הצעדים הבאים</h2>
      <p>
        אם אתם מעוניינים להתחיל לשלב AI בקמפיינים השיווקיים שלכם, התחילו עם כלים 
        פשוטים ובנו את הידע והניסיון שלכם בהדרגה. הטכנולוגיה משתפרת כל הזמן, והזמן 
        להתחיל הוא עכשיו.
      </p>
    `,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-16">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לבלוג
            </Button>
          </Link>

          <article>
            <div className="mb-8">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-md">
                  {post.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('he-IL')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </div>
              
              <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
            </div>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                lineHeight: '1.8',
              }}
            />

            <div className="mt-12 pt-8 border-t">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg">
                <h3 className="text-xl font-bold mb-4">מוכנים להתחיל?</h3>
                <p className="text-muted-foreground mb-4">
                  גלו כיצד Camplify.AI יכול לעזור לכם ליישם את הטכנולוגיות המתקדמות ביותר בקמפיינים שלכם
                </p>
                <Link to="/app">
                  <Button size="lg">התחל עכשיו בחינם</Button>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
