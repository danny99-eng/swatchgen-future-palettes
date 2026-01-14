import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Mail, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("Message sent successfully! We'll get back to you soon.");
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen bg-background/80">
            <Navigation />

            <main className="container mx-auto px-4 py-32 max-w-6xl">
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Get in Touch</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Let's Create Something <br />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Extraordinary Together
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have a question, suggestion, or just want to say hello? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                        <div className="glass-card p-8 hover-lift">
                            <h3 className="text-2xl font-bold mb-6">Connect With Us</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email Us</p>
                                        <p className="font-medium">hello@swatchgen.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Social Media</p>
                                        <p className="font-medium">@swatchgen</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-64 rounded-3xl overflow-hidden glass-card p-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-lg font-medium text-center px-8">
                                    "Design is not just what it looks like and feels like. Design is how it works."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="glass-card p-8 md:p-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                    <Input placeholder="Your name" className="pl-10 h-12 bg-background/50" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                    <Input type="email" placeholder="your@email.com" className="pl-10 h-12 bg-background/50" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium ml-1">Message</label>
                                <Textarea
                                    placeholder="Tell us what's on your mind..."
                                    className="min-h-[150px] bg-background/50 resize-none p-4"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
