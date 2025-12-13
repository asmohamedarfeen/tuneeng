import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, CheckCircle2, ArrowRight } from "lucide-react";

export default function SignOutPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    // Add floating animation to orbs
    const style = document.createElement("style");
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      .floating-orb {
        animation: float 6s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    // Automatically sign out on page load
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Remove token from localStorage
      localStorage.removeItem("auth_token");
      setSignedOut(true);
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out. We hope to see you again soon!",
      });
    } else {
      setSignedOut(true);
    }
  }, [toast]);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Light blue and white gradient background - matching landing theme */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-blue-100/30 to-white pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-100/40 via-blue-50/30 to-transparent pointer-events-none" />
      
      {/* Light blue floating orbs - matching landing theme */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-blue-200/30 to-blue-100/20 rounded-full blur-[100px] floating-orb" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-blue-100/20 rounded-full blur-[100px] floating-orb [animation-delay:1s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-100/15 to-blue-50/15 rounded-full blur-[120px] floating-orb [animation-delay:2s]" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center mb-2">
              {signedOut ? (
                <CheckCircle2 className="h-8 w-8 text-white" />
              ) : (
                <LogOut className="h-8 w-8 text-white" />
              )}
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500">
                {signedOut ? "Signed Out" : "Signing Out..."}
              </span>
            </CardTitle>
            <CardDescription className="text-base text-slate-600">
              {signedOut 
                ? "You have been successfully signed out. Thank you for using TuneEng!"
                : "Please wait while we sign you out..."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {signedOut && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-700">
                    Your session has been ended securely. We hope to see you again soon!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleGoHome}
                    variant="outline"
                    className="flex-1 h-12 border-slate-200 hover:bg-slate-50"
                  >
                    Go to Home
                  </Button>
                  <Button
                    onClick={handleSignIn}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                  >
                    Sign In Again
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

