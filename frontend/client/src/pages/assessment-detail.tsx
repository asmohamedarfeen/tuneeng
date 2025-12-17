import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import ProfileHeader from "@/components/profile/Header";

// Mock Data for Assessments
const assessmentsData = {
    "1": {
        title: "English Proficiency Test",
        questions: [
            {
                id: 1,
                question: "Select the correct sentence:",
                options: [
                    "She don't like coffee.",
                    "She doesn't likes coffee.",
                    "She doesn't like coffee.",
                    "She don't likes coffee."
                ],
                correct: 2
            },
            {
                id: 2,
                question: "I have been living here _____ 2010.",
                options: ["since", "for", "from", "until"],
                correct: 0
            },
            {
                id: 3,
                question: "Which word is a synonym for 'Happy'?",
                options: ["Sad", "Angry", "Joyful", "Tired"],
                correct: 2
            }
        ]
    },
    "2": {
        title: "Grammar & Vocabulary Quiz",
        questions: [
            {
                id: 1,
                question: "Identify the noun in this sentence: 'The cat sleeps.'",
                options: ["The", "cat", "sleeps", "none"],
                correct: 1
            },
            {
                id: 2,
                question: "What is the past tense of 'go'?",
                options: ["gone", "went", "going", "goes"],
                correct: 1
            }
        ]
    },
    "3": {
        title: "Speaking Assessment",
        questions: [
            {
                id: 1,
                question: "How to pronounce 'Queue'?",
                options: ["Kweh-kweh", "Kyu", "Kwee", "Koo"],
                correct: 1
            }
        ]
    },
    "4": {
        title: "Quick Check",
        questions: [
            {
                id: 1,
                question: "Choose the correct spelling:",
                options: ["Accomodate", "Accommodate", "Acommodate", "Acomodate"],
                correct: 1
            }
        ]
    }
};

export default function AssessmentDetail() {
    const [match, params] = useRoute("/assessments/:id");
    const id = params?.id;
    const assessment = assessmentsData[id as keyof typeof assessmentsData];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [isCompleted, setIsCompleted] = useState(false);
    const [score, setScore] = useState(0);

    if (!assessment) {
        return (
            <div className="min-h-screen bg-white">
                <ProfileHeader />
                <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Assessment Not Found</h1>
                    <Link href="/assessments">
                        <Button variant="outline">Back to Assessments</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentQuestion = assessment.questions[currentQuestionIndex];
    const totalQuestions = assessment.questions.length;
    const progress = ((currentQuestionIndex) / totalQuestions) * 100;

    const handleOptionSelect = (index: number) => {
        setSelectedOption(index);
    };

    const handleNext = () => {
        if (selectedOption !== null) {
            setAnswers({ ...answers, [currentQuestion.id]: selectedOption });

            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
            } else {
                calculateScore();
                setIsCompleted(true);
            }
        }
    };

    const calculateScore = () => {
        let correctCount = 0;
        assessment.questions.forEach(q => {
            // We need to use the state 'answers' but for the last question it might not be updated yet if we use state directly in this sync function
            // So we combine state with current selection
            const finalAnswers = { ...answers, [currentQuestion.id]: selectedOption };
            if (finalAnswers[q.id] === q.correct) {
                correctCount++;
            }
        });
        setScore(correctCount);
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setAnswers({});
        setIsCompleted(false);
        setScore(0);
    };

    if (isCompleted) {
        const percentage = Math.round((score / totalQuestions) * 100);
        return (
            <div className="min-h-screen bg-white">
                <ProfileHeader />
                <div className="max-w-2xl mx-auto px-6 py-20">
                    <Card className="text-center p-8">
                        <div className="mb-6 flex justify-center">
                            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                                <CheckCircle className="h-12 w-12 text-blue-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Completed!</h2>
                        <p className="text-gray-600 mb-8">You have finished the {assessment.title}.</p>

                        <div className="text-5xl font-bold text-blue-600 mb-2">{percentage}%</div>
                        <p className="text-sm text-gray-500 mb-8">Score: {score} / {totalQuestions}</p>

                        <div className="flex justify-center gap-4">
                            <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
                                <RotateCcw className="h-4 w-4" /> Try Again
                            </Button>
                            <Link href="/assessments">
                                <Button className="bg-gray-900 text-white">Back to List</Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <ProfileHeader />

            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="mb-8">
                    <Link href="/assessments" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-4">
                        <ArrowLeft className="h-4 w-4" /> Back to Assessments
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{assessment.title}</h1>
                    <div className="flex items-center gap-4">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                            Question {currentQuestionIndex + 1} of {totalQuestions}
                        </span>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium leading-relaxed">
                            {currentQuestion.question}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={selectedOption !== null ? selectedOption.toString() : ""}
                            onValueChange={(val) => handleOptionSelect(parseInt(val))}
                            className="space-y-3"
                        >
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${selectedOption === index ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal text-base">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-4">
                        <Button
                            onClick={handleNext}
                            disabled={selectedOption === null}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        >
                            {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"} <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
