import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Heart, Zap, Shield, Users } from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen bg-background/80">
            <Navigation />

            <main className="container mx-auto px-4 py-32 max-w-6xl">
                {/* Hero Section */}
                <div className="text-center mb-20 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        We Are <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">SwatchGen</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Empowering designers, developers, and creators with intelligent color tools
                        that bridge the gap between imagination and reality.
                    </p>
                </div>

                {/* Mission */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-32 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Our Mission</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            At SwatchGen, we believe that color is the soul of design. Our mission is to
                            eliminate the friction in color selection and palette generation, giving you
                            futuristic tools that work as fast as your creativity flows.
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Founded by <span className="text-foreground font-semibold">Oluyemi Ayomikun</span>,
                            SwatchGen started as a simple idea: what if AI could understand color theory
                            better than humans?
                        </p>
                    </div>
                    <div className="relative h-80 rounded-3xl overflow-hidden glass-card">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-background to-secondary/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-4 p-8 opacity-50">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="w-16 h-16 rounded-xl bg-primary/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Zap, title: "Innovation", desc: "Pushing boundaries with AI" },
                            { icon: Heart, title: "Passion", desc: "Built with love for design" },
                            { icon: Shield, title: "Quality", desc: "Pixel-perfect precision" },
                            { icon: Users, title: "Community", desc: "Growing together" }
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-6 text-center hover-lift animate-fade-in-up" style={{ animationDelay: `${0.2 + (i * 0.1)}s` }}>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <item.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
