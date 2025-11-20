import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "UI/UX Designer",
    company: "Stripe",
    content: "SwatchGen has transformed my workflow. The AI typography suggestions are incredibly accurate and save me hours of work.",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Creative Director",
    company: "Figma",
    content: "The gradient generator is phenomenal. I can create and export perfect gradients in seconds. This tool is a game-changer.",
    avatar: "MR",
    rating: 5,
  },
  {
    name: "Emily Thompson",
    role: "Brand Designer",
    company: "Notion",
    content: "Finally, a color tool that understands designers. The warm/cool palette generator is pure magic. Highly recommended!",
    avatar: "ET",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by Designers Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of designers who trust SwatchGen for their color workflows
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card p-8 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold shadow-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
