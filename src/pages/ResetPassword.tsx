import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom"; // Assumes react-router is being used

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Check if we have a valid session to reset the password
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                setIsSessionValid(false);
            } else {
                setIsSessionValid(true);
            }
        };

        checkSession();

        // Listen for auth state changes just in case the URL hash takes a moment to process
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
                setIsSessionValid(!!session);
            } else if (event === 'SIGNED_OUT') {
                setIsSessionValid(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Client-side validation
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                throw error;
            }

            setIsSuccess(true);

            // Redirect after a short delay
            setTimeout(() => {
                navigate("/auth");
            }, 2000);

        } catch (err: any) {
            setError(err.message || "An error occurred while updating your password.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show a loading state while checking the session initially
    if (isSessionValid === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Verifying link...</p>
            </div>
        );
    }

    // Error state for invalid/expired tokens
    if (isSessionValid === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="w-full max-w-md space-y-6 p-8 bg-card rounded-2xl border border-destructive/20 shadow-glass text-center">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-destructive text-xl font-bold">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Invalid Reset Link</h2>
                    <p className="text-muted-foreground">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Button asChild className="w-full mt-4" variant="default">
                        <Link to="/forgot-password">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Forgot Password
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-2xl border border-border/50 shadow-glass">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Create New Password
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your new password below.
                    </p>
                </div>

                {isSuccess ? (
                    <Alert className="bg-primary/10 border-primary/20">
                        <AlertDescription className="text-primary font-medium text-center py-2 flex flex-col items-center gap-2">
                            Password updated!
                            <span className="text-sm font-normal flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Redirecting to login...
                            </span>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                    className="w-full bg-background"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                    className="w-full bg-background"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || password.length === 0 || confirmPassword.length === 0}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating password...
                                </>
                            ) : (
                                "Update password"
                            )}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
