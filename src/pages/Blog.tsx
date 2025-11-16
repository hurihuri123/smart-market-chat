import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      slug: "ai-revolution-marketing",
      title: "מהפכת ה-AI בשיווק דיגיטלי: איך לנצל את הכוח של בינה מלאכותית",
      excerpt: "גלו כיצד בינה מלאכותית משנה את פני השיווק הדיגיטלי ומה זה אומר עבור העסק שלכם",
      date: "2024-03-15",
      readTime: "5 דקות קריאה",
      category: "AI ושיווק",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">הבלוג שלנו</h1>
            <p className="text-xl text-muted-foreground">
              תובנות, טיפים ומגמות בעולם השיווק הדיגיטלי וה-AI
            </p>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md">
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
                    <CardTitle className="text-2xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
