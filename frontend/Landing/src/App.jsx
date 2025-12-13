import React from 'react';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import InfiniteCarousel from './components/landing/InfiniteCarousel';
import { Button } from "./components/ui/button";
import { ArrowRight, GraduationCap, Building2, Users } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-blue-100 selection:text-blue-900">
      
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-6 lg:px-8 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">T</div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">TuneEng</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#skills" className="hover:text-primary transition-colors">LSRW Skills</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
             <Button
               variant="ghost"
               size="sm"
               className="hidden sm:flex"
               onClick={() => {
                 // Navigate into the main app's sign-in route
                 window.location.href = "/sign-in";
               }}
             >
               Log in
             </Button>
             <Button
               size="sm"
               className="rounded-full px-6"
               magnetic
               onClick={() => {
                 // Primary CTA goes to sign-up
                 window.location.href = "/sign-up";
               }}
             >
               Get Started
             </Button>
          </div>
        </div>
      </header>

      <main>
        <Hero />
        <InfiniteCarousel />
        <Features />
        
        <section id="pricing" className="py-24 bg-gradient-to-b from-blue-50 via-blue-100/30 to-white relative">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Simple, transparent <span className="text-primary">pricing</span>
              </h2>
              <p className="text-slate-500 text-lg">
                Choose the plan that fits your needs. All plans include access to our AI-powered learning platform.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto justify-items-stretch">
              <div className="bg-white rounded-2xl p-8 lg:p-10 border border-slate-200 hover:border-primary/50 transition-colors hover:shadow-lg flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl">Student</h3>
                </div>
                <p className="text-slate-500 mb-6">Perfect for individual learners</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">&#8377;199</span>
                  <span className="text-slate-500">/year</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-slate-600 flex-grow">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> 250 Curated Test Sets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> Basic Practice Module
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> AI Feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> Progress Tracking
                  </li>
                </ul>
                <Button className="w-full mt-auto" variant="outline">Get Started</Button>
              </div>

              <div className="bg-white rounded-2xl p-8 lg:p-10 border-2 border-blue-300 relative hover:shadow-xl transition-shadow flex flex-col h-full shadow-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                  POPULAR
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl">Standard</h3>
                </div>
                <p className="text-slate-500 mb-6">For serious placement aspirants</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">&#8377;399</span>
                  <span className="text-slate-500">/year</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-slate-600 flex-grow">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> 1000+ Curated Test Sets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> 500 Guided Test Sets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> Full Practice Module
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> Company-Specific Practice
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> Detailed Analytics
                  </li>
                </ul>
                <Button className="w-full mt-auto">Get Started</Button>
              </div>

              <div className="bg-white rounded-2xl p-8 lg:p-10 border border-blue-100 hover:border-blue-300 transition-colors hover:shadow-lg flex flex-col h-full shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl">Institution</h3>
                </div>
                <p className="text-slate-500 mb-6">For colleges & training centers</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">Custom</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-slate-600 flex-grow">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> Everything in Standard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> Trainer Dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> Batch Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> Expert Webinars
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">&#10003;</span> Custom Branding
                  </li>
                </ul>
                <Button className="w-full mt-auto" variant="outline">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-white via-blue-50/30 to-white relative">
          <div className="container mx-auto px-6 lg:px-8 max-w-7xl text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Ready to ace your interviews?
              </h2>
              <p className="text-xl text-slate-500">
                Join thousands of students preparing smarter with TuneEng LSRW.
              </p>
              <div className="flex justify-center pt-4">
                <Button size="lg" variant="premium" className="h-16 px-10 text-lg rounded-full" magnetic>
                  Start Learning Now <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-b from-blue-50 to-white py-12 border-t border-blue-100">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
             <div className="font-bold text-slate-900 mb-4">Product</div>
             <ul className="space-y-2 text-slate-500">
                <li>Features</li>
                <li>Test Sets</li>
                <li>Pricing</li>
                <li>AI Feedback</li>
             </ul>
          </div>
          <div>
             <div className="font-bold text-slate-900 mb-4">For Users</div>
             <ul className="space-y-2 text-slate-500">
                <li>Students</li>
                <li>Trainers</li>
                <li>Institutions</li>
                <li>Corporates</li>
             </ul>
          </div>
          <div>
             <div className="font-bold text-slate-900 mb-4">Resources</div>
             <ul className="space-y-2 text-slate-500">
                <li>Blog</li>
                <li>Webinars</li>
                <li>Help Center</li>
                <li>Community</li>
             </ul>
          </div>
          <div>
             <div className="font-bold text-slate-900 mb-4">Legal</div>
             <ul className="space-y-2 text-slate-500">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
             </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
           © 2024 TuneEng LSRW. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
