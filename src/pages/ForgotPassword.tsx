import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic client-side validation
        if (!email) {
            setError("Please enter your email address.");
            setIsLoading(false);
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        try {
            // Debugging the site URL resolution
            const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
            const finalRedirectUrl = `${siteUrl}/reset-password`;

            console.log("Reset password redirecting to:", finalRedirectUrl);
            toast({
                title: "Sending request",
                description: `Requesting redirect to: ${finalRedirectUrl}`,
            });

            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: finalRedirectUrl,
            });

            if (resetError) {
                throw resetError;
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || "An error occurred while resetting your password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-2xl border border-border/50 shadow-glass">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {isSuccess ? (
                    <Alert className="bg-primary/10 border-primary/20">
                        <AlertDescription className="text-primary font-medium text-center py-2">
                            Check your inbox for a reset link.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                                className="w-full bg-background"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending link...
                                </>
                            ) : (
                                "Send reset link"
                            )}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
