import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "סטארטר",
      price: "₹499",
      budget: "עד ₹5,000",
      features: [
        "14 יום ניסיון חינם",
        "ניהול עד 3 קמפיינים",
        "אופטימיזציה בסיסית",
        "דוחות שבועיים",
        "תמיכה באימייל",
      ],
    },
    {
      name: "מקצועי",
      price: "₹1,499",
      budget: "₹5,000 - ₹20,000",
      features: [
        "14 יום ניסיון חינם",
        "ניהול קמפיינים ללא הגבלה",
        "אופטימיזציה מתקדמת AI",
        "דוחות יומיים",
        "תמיכה בטלפון וצ'אט",
        "ייעוץ אסטרטגי חודשי",
      ],
      popular: true,
    },
    {
      name: "אנטרפרייז",
      price: "₹4,999",
      budget: "מעל ₹20,000",
      features: [
        "14 יום ניסיון חינם",
        "ניהול קמפיינים ללא הגבלה",
        "אופטימיזציה AI מותאמת אישית",
        "דוחות בזמן אמת",
        "מנהל חשבון ייעודי",
        "ייעוץ אסטרטגי שבועי",
        "הדרכת צוות",
        "אינטגרציות מותאמות אישית",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">תמחור שקוף וגמיש</h1>
          <p className="text-xl text-muted-foreground">
            התחל עם 14 יום ניסיון חינם. בחר את התוכנית המתאימה לתקציב הפרסום שלך
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-2 font-semibold rounded-t-lg">
                  הכי פופולרי
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.budget} תקציב חודשי</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/חודש</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  התחל ניסיון חינם
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            כל התוכניות כוללות 14 יום ניסיון חינם ללא צורך בכרטיס אשראי
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
