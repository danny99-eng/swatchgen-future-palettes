import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaystack } from "@/lib/paystack";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    features: [
      "Basic palette extraction",
      "3 palettes per day",
      "Standard gradients",
      "PNG export (watermarked)",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
    planId: "free",
  },
  {
    name: "Pro",
    price: "₦5,000",
    period: "per month",
    features: [
      "Unlimited palette extraction",
      "Warm/Cool palette generator",
      "Advanced gradient controls",
      "PNG export (no watermark)",
      "AI typography suggestions",
      "Save 200 palettes",
      "Shareable links",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
    planId: "premium",
  },
];

const Pricing = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { initializePayment } = usePaystack();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanClick = async (planId: string) => {
    if (planId === "free") {
      if (!user) {
        navigate("/auth");
      } else {
        navigate("/");
      }
      return;
    }

    if (planId === "premium") {
      if (!user) {
        navigate("/auth");
        return;
      }

      if (profile?.role === "premium" || profile?.role === "admin") {
        return; // Already premium
      }

      setIsProcessing(true);
      try {
        initializePayment();
        // Note: isProcessing will be reset when payment modal closes or completes
        // The payment flow is async, so we don't reset immediately
      } catch (error) {
        console.error("Payment error:", error);
        setIsProcessing(false);
        toast.error("Failed to initialize payment. Please try again.");
      }
    }
  };
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your creative workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "glass-card p-8 hover-lift animate-fade-in-up relative",
                plan.popular && "ring-2 ring-primary shadow-xl"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanClick(plan.planId)}
                  disabled={isProcessing || (plan.planId === "premium" && (profile?.role === "premium" || profile?.role === "admin"))}
                  className={cn(
                    "w-full py-6 rounded-full text-lg font-medium transition-all duration-300",
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105"
                      : "bg-accent hover:bg-accent/80 text-accent-foreground",
                    (plan.planId === "premium" && (profile?.role === "premium" || profile?.role === "admin")) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isProcessing 
                    ? "Processing..." 
                    : plan.planId === "premium" && (profile?.role === "premium" || profile?.role === "admin")
                    ? "Current Plan"
                    : plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default Pricing;
