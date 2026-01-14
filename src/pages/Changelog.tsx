import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, GitCommit, Rocket } from "lucide-react";

const releases = [
    {
        version: "v1.0.0",
        date: "January 14, 2026",
        title: "Initial Release",
        type: "major",
        changes: [
            "AI-powered image color extraction",
            "Warm and Cool palette generators",
            "Interactive gradient creator",
            "Typography pairing suggestions",
            "Moodboard generator beta",
            "Image resizer and optimizer"
        ]
    },
    {
        version: "v0.9.0",
        date: "December 20, 2025",
        title: "Beta Launch",
        type: "minor",
        changes: [
            "Core palette extraction engine",
            "Basic user authentication",
            "Project saving functionality",
            "Export to PNG feature"
        ]
    }
];

const Changelog = () => {
    return (
        <div className="min-h-screen bg-background/80">
            <Navigation />

            <main className="container mx-auto px-4 py-32 max-w-4xl">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Changelog</h1>
                    <p className="text-xl text-muted-foreground">
                        Track our journey and see what's new in SwatchGen
                    </p>
                </div>

                <div className="space-y-12">
                    {releases.map((release, index) => (
                        <div
                            key={index}
                            className="glass-card p-8 relative overflow-hidden animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold">{release.version}</h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${release.type === 'major' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                                            }`}>
                                            {release.type.toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-medium text-muted-foreground">{release.title}</h3>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-lg">
                                    <Calendar className="w-4 h-4" />
                                    {release.date}
                                </div>
                            </div>

                            <ul className="space-y-3">
                                {release.changes.map((change, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1.5">
                                            {index === 0 ? (
                                                <Rocket className="w-4 h-4 text-primary" />
                                            ) : (
                                                <GitCommit className="w-4 h-4 text-muted-foreground" />
                                            )}
                                        </div>
                                        <span className="text-foreground/90">{change}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Changelog;
