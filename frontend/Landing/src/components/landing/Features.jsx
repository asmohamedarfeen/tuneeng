import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from "../ui/card";
import { use3DTilt } from "../../hooks/use-3d-tilt";
import { FileText, Headphones, Mic, BookOpen, PenTool, BarChart3, Trophy, Users, Video, Brain, Target, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ icon: Icon, title, description, color, delay }) => {
    const { ref, shineRef } = use3DTilt({ intensity: 15 });

    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
        pink: "bg-pink-50 text-pink-600",
        cyan: "bg-cyan-50 text-cyan-600",
    };

    return (
        <div ref={ref} className="preserve-3d h-full">
            <Card className="h-full relative overflow-hidden border-blue-100 hover:border-blue-300 transition-colors bg-white group shadow-sm">
                <div ref={shineRef} className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/40 via-white/0 to-transparent opacity-0 z-20" />
                <CardContent className="p-8 relative z-10 h-full flex flex-col">
                    <div className={`w-12 h-12 rounded-xl ${colorClasses[color] || colorClasses.blue} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ease-out transform-style-3d translate-z-[20px]`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-slate-900 translate-z-[15px]">{title}</h3>
                    <p className="text-slate-500 leading-relaxed translate-z-[10px]">{description}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default function Features() {
    const containerRef = useRef(null);
    const lsrwRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".feature-card-wrapper", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            });

            gsap.from(".lsrw-card", {
                scrollTrigger: {
                    trigger: lsrwRef.current,
                    start: "top 80%",
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const features = [
        { icon: FileText, title: "1000+ Curated Test Sets", description: "Structured LSRW packages with 10 tasks each for Listening, Speaking, Reading, and Writing aligned with corporate formats.", color: "blue" },
        { icon: Headphones, title: "500 Guided Test Sets", description: "Step-by-step voice and text guidance with tips, model answers, and evaluation rubrics. Perfect for beginners.", color: "green" },
        { icon: Brain, title: "AI-Powered Evaluation", description: "Multi-modal AI analyzes tone, pitch, intonation, accent, clarity, and even body language for video responses.", color: "purple" },
        { icon: BarChart3, title: "Fluency Tracker", description: "Track your progress with detailed reports on pronunciation scores, fluency trends, and skill improvements.", color: "orange" },
        { icon: Trophy, title: "Leaderboards & Streaks", description: "Stay motivated with daily challenges, practice streaks, and compete with peers on leaderboards.", color: "pink" },
        { icon: Users, title: "Peer Review & Expert Sessions", description: "Learn from others with peer reviews and join webinars with HR managers and industry recruiters.", color: "cyan" },
    ];

    const lsrwSkills = [
        { icon: Headphones, title: "Listening", description: "Audio clips, fill-in-the-blanks, dictation exercises", color: "blue" },
        { icon: Mic, title: "Speaking", description: "Timed drills, voice recording with AI feedback", color: "green" },
        { icon: BookOpen, title: "Reading", description: "MCQs, inference tasks, vocabulary boosters", color: "purple" },
        { icon: PenTool, title: "Writing", description: "Email writing, essays, grammar correction", color: "orange" },
    ];

    return (
        <>
            <section id="skills" ref={lsrwRef} className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
                <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Master All Four <span className="text-primary">LSRW Skills</span>
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Comprehensive practice modules with adaptive learning that increases difficulty as your skills improve.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto justify-items-center">
                        {lsrwSkills.map((skill, idx) => {
                            const colorClasses = {
                                blue: "border-blue-200 bg-blue-50/70 hover:bg-blue-50",
                                green: "border-blue-200 bg-blue-50/70 hover:bg-blue-50",
                                purple: "border-blue-200 bg-blue-50/70 hover:bg-blue-50",
                                orange: "border-blue-200 bg-blue-50/70 hover:bg-blue-50",
                            };
                            const iconColors = {
                                blue: "text-blue-600 bg-blue-100",
                                green: "text-blue-600 bg-blue-100",
                                purple: "text-blue-600 bg-blue-100",
                                orange: "text-blue-600 bg-blue-100",
                            };
                            return (
                                <div key={idx} className={`lsrw-card p-6 rounded-2xl border-2 ${colorClasses[skill.color]} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center text-center`}>
                                    <div className={`w-12 h-12 rounded-xl ${iconColors[skill.color]} flex items-center justify-center mb-4`}>
                                        <skill.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">{skill.title}</h3>
                                    <p className="text-sm text-slate-500">{skill.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section id="features" ref={containerRef} className="py-24 bg-gradient-to-b from-blue-50 via-blue-100/20 to-blue-50 relative overflow-hidden">
                <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Powerful features for <br/>
                            <span className="text-primary">interview success.</span>
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Everything you need to ace corporate LSRW rounds and land your dream job.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 justify-items-stretch">
                        {features.map((feature, idx) => (
                            <div key={idx} className="feature-card-wrapper">
                                <FeatureCard {...feature} delay={idx * 0.1} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="bg-gradient-to-r from-blue-50 via-blue-100/50 to-white rounded-3xl p-8 md:p-12 text-slate-900 relative overflow-hidden border border-blue-100">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200/20 rounded-full translate-y-1/2 -translate-x-1/2" />
                        
                        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Company-Specific Practice</h3>
                                <p className="text-slate-600 text-lg">
                                    Prepare for interviews at top companies with role-specific questions for Tech, HR, Sales, and Marketing positions.
                                </p>
                                <div className="flex flex-wrap gap-3 pt-4">
                                    {["Tech Roles", "HR Interview", "Sales", "Marketing"].map((role, i) => (
                                        <span key={i} className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 border border-blue-200/50 shadow-sm hover:bg-white hover:shadow-md transition-all">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                    <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <p className="font-bold text-2xl text-slate-900">100+</p>
                                    <p className="text-sm text-slate-600">Companies</p>
                                </div>
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                    <Video className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <p className="font-bold text-2xl text-slate-900">Expert</p>
                                    <p className="text-sm text-slate-600">Webinars</p>
                                </div>
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                    <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <p className="font-bold text-2xl text-slate-900">Quick</p>
                                    <p className="text-sm text-slate-600">Revision</p>
                                </div>
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                    <p className="font-bold text-2xl text-slate-900">1:1</p>
                                    <p className="text-sm text-slate-600">Counselling</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
