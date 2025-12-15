import React, { useEffect, useRef } from 'react';
import { Button } from "../ui/button";
import { ArrowRight, Play, CheckCircle2, Headphones, Mic, BookOpen, PenTool } from 'lucide-react';
import gsap from 'gsap';
import { use3DTilt } from "../../hooks/use-3d-tilt";

export default function Hero() {
  const containerRef = useRef(null);
  const heroContentRef = useRef(null);
  const { ref: cardRef, shineRef } = use3DTilt({ intensity: 10 });

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(heroContentRef.current.children, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
    );

    tl.fromTo(cardRef.current,
      { y: 100, opacity: 0, rotateX: 20 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "expo.out" },
      "-=0.8"
    );

    gsap.to(".floating-orb", {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 1
    });

  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-24 px-4">
      {/* Light blue and white gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-blue-100/30 to-white pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-100/40 via-blue-50/30 to-transparent pointer-events-none" />
      
      {/* Light blue floating orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-blue-200/30 to-blue-100/20 rounded-full blur-[100px] floating-orb" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-blue-100/20 rounded-full blur-[100px] floating-orb" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-blue-100/15 to-blue-50/15 rounded-full blur-[120px] floating-orb" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        <div ref={heroContentRef} className="max-w-2xl space-y-8 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500">
              Master Your
            </span>
            <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400">
              Interview Skills.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
            The powerful, student-friendly platform to excel in corporate LSRW rounds through practice, precision, and performance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-stretch sm:items-center">
            <Button size="lg" variant="premium" magnetic>
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" magnetic>
              <Play className="mr-2 h-4 w-4 fill-current" /> Get Started
            </Button>
          </div>

          <div className="pt-8 flex items-center gap-6 justify-center lg:justify-start text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>1000+ Test Sets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>AI Feedback</span>
            </div>
          </div>
        </div>

        <div className="relative perspective-1000 flex justify-center lg:justify-end" ref={containerRef}>
          <div 
            ref={cardRef}
            className="relative w-full max-w-[500px] aspect-[4/3] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 preserve-3d group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div ref={shineRef} className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-white/80 to-transparent opacity-0 z-50" />
            
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-3xl -z-10" />
            
            <div className="w-full h-full bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden relative transform translate-z-[20px]">
              <div className="h-12 border-b px-4 flex items-center gap-2 bg-slate-50/50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-4 text-xs font-medium text-slate-400">LSRW Dashboard</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <Headphones className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                    <p className="text-[10px] text-slate-500">Listening</p>
                    <p className="text-sm font-bold text-slate-800">92%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <Mic className="w-4 h-4 mx-auto text-green-500 mb-1" />
                    <p className="text-[10px] text-slate-500">Speaking</p>
                    <p className="text-sm font-bold text-slate-800">88%</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <BookOpen className="w-4 h-4 mx-auto text-purple-500 mb-1" />
                    <p className="text-[10px] text-slate-500">Reading</p>
                    <p className="text-sm font-bold text-slate-800">95%</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <PenTool className="w-4 h-4 mx-auto text-orange-500 mb-1" />
                    <p className="text-[10px] text-slate-500">Writing</p>
                    <p className="text-sm font-bold text-slate-800">90%</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600">Daily Practice Streak</span>
                    <span className="text-xs font-bold text-primary">7 Days</span>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6,7].map(i => (
                      <div key={i} className="w-6 h-6 rounded bg-primary/80 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-slate-600 mb-2">Recent Activity</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-slate-500">Completed Speaking Drill</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-slate-500">HR Interview Practice</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 top-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 transform translate-z-[60px] animate-float">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 font-bold">A+</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium">Fluency Score</p>
                        <p className="text-sm font-bold text-slate-900">Excellent</p>
                    </div>
                </div>
            </div>

            <div className="absolute -left-8 bottom-12 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 transform translate-z-[40px] animate-float-delayed">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mic className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500">AI Feedback</p>
                        <p className="text-xs font-semibold text-slate-800">Ready!</p>
                    </div>
                </div>
            </div>

            <div className="absolute -right-4 bottom-8 bg-white px-3 py-2 rounded-xl shadow-lg border border-slate-100 transform translate-z-[50px] animate-float">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <span className="text-xs font-bold text-slate-700">1000+ Tests</span>
                </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
