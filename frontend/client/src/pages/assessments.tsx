import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, BookOpen, Mic } from "lucide-react";
import ProfileHeader from "@/components/profile/Header";

export default function Assessments() {
    const assessments = [
        {
            id: 1,
            title: "English Proficiency Test",
            description: "Comprehensive evaluation of your listening, speaking, reading, and writing skills.",
            duration: "45 mins",
            questions: 40,
            icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
            color: "bg-blue-50",
        },
        {
            id: 2,
            title: "Grammar & Vocabulary Quiz",
            description: "Test your grasp of English grammar rules and your vocabulary range.",
            duration: "20 mins",
            questions: 25,
            icon: <BookOpen className="h-6 w-6 text-emerald-600" />,
            color: "bg-emerald-50",
        },
        {
            id: 3,
            title: "Speaking Assessment",
            description: "Record your responses to evaluate pronunciation, fluency, and intonation.",
            duration: "15 mins",
            questions: 10,
            icon: <Mic className="h-6 w-6 text-amber-600" />,
            color: "bg-amber-50",
        },
        {
            id: 4,
            title: "Quick Check",
            description: "A short quiz to check your daily progress and retention.",
            duration: "5 mins",
            questions: 10,
            icon: <Clock className="h-6 w-6 text-purple-600" />,
            color: "bg-purple-50",
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <ProfileHeader />

            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessments</h1>
                    <p className="text-gray-600">Evaluate your progress and identify areas for improvement.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assessments.map((assessment) => (
                        <div key={assessment.id} className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${assessment.color}`}>
                                    {assessment.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{assessment.title}</h3>
                                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{assessment.description}</p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{assessment.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="h-4 w-4" />
                                            <span>{assessment.questions} Questions</span>
                                        </div>
                                    </div>

                                    <Link href={`/assessments/${assessment.id}`}>
                                        <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                                            Start Assessment
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
