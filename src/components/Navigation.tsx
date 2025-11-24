import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Shield, LogOut, LogIn, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          SwatchGen
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          <ThemeToggle />
          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="outline" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <div className="text-sm text-muted-foreground">
                {profile?.email}
              </div>
              <Button variant="outline" onClick={signOut} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden gap-2 items-center">
          <ThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-4 mt-8">
                {user ? (
                  <>
                    <div className="text-sm text-muted-foreground pb-4 border-b">
                      {profile?.email}
                    </div>
                    {profile?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full gap-2">
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Button variant="outline" onClick={() => { signOut(); setMobileMenuOpen(false); }} className="gap-2">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full gap-2">
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
