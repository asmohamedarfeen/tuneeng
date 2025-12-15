import { useState } from "react";
import { Menu, User, BookOpen, Play, Clock, CheckCircle2, ArrowRight, Headphones, Mic, FileText, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useToast } from "@/hooks/use-toast";

interface LearningTopic {
  id: string;
  title: string;
  description: string;
  category: 'listening' | 'speaking' | 'reading' | 'writing';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  completed?: boolean;
}

export default function LearnPage() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'listening' | 'speaking' | 'reading' | 'writing'>('all');

  const topics: LearningTopic[] = [
    {
      id: '1',
      title: 'Business Meeting Comprehension',
      description: 'Master understanding of corporate meetings, board discussions, and executive briefings. Includes Q4 financial reviews, strategic planning sessions, and stakeholder presentations.',
      category: 'listening',
      duration: '2h 15m',
      level: 'Intermediate',
      lessons: 12,
      completed: false,
    },
    {
      id: '2',
      title: 'Technical Interview Preparation',
      description: 'Structured approach to answering behavioral and technical questions. Covers system design discussions, code review scenarios, and architecture explanations for software engineering roles.',
      category: 'speaking',
      duration: '3h 20m',
      level: 'Advanced',
      lessons: 18,
      completed: false,
    },
    {
      id: '3',
      title: 'Engineering Documentation Analysis',
      description: 'Systematic method for reading API specifications, technical RFCs, and system architecture documents. Focus on extracting requirements and understanding implementation details.',
      category: 'reading',
      duration: '2h 45m',
      level: 'Intermediate',
      lessons: 15,
      completed: false,
    },
    {
      id: '4',
      title: 'Professional Email Communication',
      description: 'Write effective emails for client correspondence, project updates, and status reports. Includes follow-up sequences, escalation procedures, and stakeholder communication templates.',
      category: 'writing',
      duration: '1h 30m',
      level: 'Beginner',
      lessons: 10,
      completed: true,
    },
    {
      id: '5',
      title: 'Pronunciation for Global Teams',
      description: 'Reduce accent barriers in distributed team environments. Focus on clarity in video calls, pronunciation of technical terms, and effective communication with international colleagues.',
      category: 'speaking',
      duration: '4h 10m',
      level: 'Intermediate',
      lessons: 20,
      completed: false,
    },
    {
      id: '6',
      title: 'Conference Call Participation',
      description: 'Navigate multi-party video conferences, understand rapid-fire discussions, and contribute effectively in cross-functional team meetings. Includes handling interruptions and clarifying points.',
      category: 'listening',
      duration: '2h 30m',
      level: 'Advanced',
      lessons: 12,
      completed: false,
    },
    {
      id: '7',
      title: 'Industry Report Analysis',
      description: 'Read and synthesize market research reports, competitive analysis documents, and industry trend publications. Extract actionable insights from dense business literature.',
      category: 'reading',
      duration: '1h 45m',
      level: 'Beginner',
      lessons: 8,
      completed: false,
    },
    {
      id: '8',
      title: 'Project Proposal Writing',
      description: 'Structure compelling proposals for new initiatives, budget approvals, and resource allocation. Includes executive summaries, ROI calculations, and risk assessment documentation.',
      category: 'writing',
      duration: '3h 15m',
      level: 'Advanced',
      lessons: 16,
      completed: false,
    },
    {
      id: '9',
      title: 'Regional Accent Recognition',
      description: 'Understand variations in English pronunciation across North American, British, Australian, and Indian business contexts. Practice with real-world audio samples from global teams.',
      category: 'listening',
      duration: '2h 50m',
      level: 'Intermediate',
      lessons: 14,
      completed: false,
    },
    {
      id: '10',
      title: 'Executive Presentation Skills',
      description: 'Deliver clear, concise presentations to C-suite executives and board members. Includes data visualization explanations, Q&A handling, and persuasive communication techniques.',
      category: 'speaking',
      duration: '3h 40m',
      level: 'Advanced',
      lessons: 18,
      completed: false,
    },
    {
      id: '11',
      title: 'Contract and Agreement Review',
      description: 'Read and understand service agreements, NDAs, vendor contracts, and partnership documents. Identify key terms, obligations, and potential negotiation points.',
      category: 'reading',
      duration: '4h 20m',
      level: 'Advanced',
      lessons: 20,
      completed: false,
    },
    {
      id: '12',
      title: 'Meeting Minutes Documentation',
      description: 'Capture action items, decisions, and discussion points accurately. Format minutes for distribution, track follow-ups, and maintain records for compliance and reference.',
      category: 'writing',
      duration: '1h 15m',
      level: 'Beginner',
      lessons: 6,
      completed: false,
    },
  ];

  const filteredTopics = selectedCategory === 'all' 
    ? topics 
    : topics.filter(topic => topic.category === selectedCategory);

  const handleStartLearning = (topic: LearningTopic) => {
    toast({
      title: `Opening: ${topic.title}`,
      description: `${topic.lessons} lessons available. Estimated completion time: ${topic.duration}.`,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'listening': return Headphones;
      case 'speaking': return Mic;
      case 'reading': return FileText;
      case 'writing': return PenTool;
      default: return BookOpen;
    }
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'listening':
        return {
          bg: 'bg-[#E8F4FD]',
          text: 'text-[#0066CC]',
          border: 'border-[#B3D9F2]',
          iconBg: 'bg-[#0066CC]',
        };
      case 'speaking':
        return {
          bg: 'bg-[#E6F7ED]',
          text: 'text-[#00875A]',
          border: 'border-[#B3E5C1]',
          iconBg: 'bg-[#00875A]',
        };
      case 'reading':
        return {
          bg: 'bg-[#F3E8FF]',
          text: 'text-[#5E4DB2]',
          border: 'border-[#D4C5F0]',
          iconBg: 'bg-[#5E4DB2]',
        };
      case 'writing':
        return {
          bg: 'bg-[#FFF4E6]',
          text: 'text-[#B7791F]',
          border: 'border-[#F4D19E]',
          iconBg: 'bg-[#B7791F]',
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          iconBg: 'bg-gray-600',
        };
    }
  };

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'Beginner':
        return {
          bg: 'bg-[#E6F7ED]',
          text: 'text-[#00875A]',
          border: 'border-[#B3E5C1]',
        };
      case 'Intermediate':
        return {
          bg: 'bg-[#FFF4E6]',
          text: 'text-[#B7791F]',
          border: 'border-[#F4D19E]',
        };
      case 'Advanced':
        return {
          bg: 'bg-[#FFEBEE]',
          text: 'text-[#C62828]',
          border: 'border-[#FFCDD2]',
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
        };
    }
  };

  const categoryCounts = {
    all: topics.length,
    listening: topics.filter(t => t.category === 'listening').length,
    speaking: topics.filter(t => t.category === 'speaking').length,
    reading: topics.filter(t => t.category === 'reading').length,
    writing: topics.filter(t => t.category === 'writing').length,
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Navigation Header */}
      <div className="bg-white border-b border-[#E1E8ED]">
        <div className="max-w-[1440px] mx-auto px-10 py-3.5 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <Menu className="h-4 w-4 text-[#0D121C]" />
            <span className="text-lg font-semibold text-[#0D121C] tracking-tight">TuneEng</span>
          </Link>
          
          <nav className="flex items-center gap-10">
            <Link 
              href="/dashboard" 
              className={`text-sm font-medium transition-colors ${
                location === '/dashboard' 
                  ? 'text-[#0066CC] font-semibold' 
                  : 'text-[#64748B] hover:text-[#0D121C]'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/practice" 
              className={`text-sm font-medium transition-colors ${
                location.startsWith('/practice') 
                  ? 'text-[#0066CC] font-semibold' 
                  : 'text-[#64748B] hover:text-[#0D121C]'
              }`}
            >
              Practice
            </Link>
            <Link 
              href="/learn" 
              className={`text-sm font-medium transition-colors ${
                location === '/learn' 
                  ? 'text-[#0066CC] font-semibold' 
                  : 'text-[#64748B] hover:text-[#0D121C]'
              }`}
            >
              Learn
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm font-medium transition-colors ${
                location === '/contact' 
                  ? 'text-[#0066CC] font-semibold' 
                  : 'text-[#64748B] hover:text-[#0D121C]'
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/profile">
              <Button variant="outline" className="bg-white hover:bg-[#F7FAFC] h-9 px-3.5 border-[#E1E8ED]">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <ProfileAvatar size="md" fallback="/images/avatar.png" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-10 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-[40px] font-semibold text-[#0D121C] mb-3 tracking-tight leading-[48px]">
            Learning Modules
          </h1>
          <p className="text-[16px] text-[#64748B] leading-6 max-w-2xl">
            Structured courses designed for professional English communication in business and technical contexts.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-1 bg-white border border-[#E1E8ED] rounded-lg p-1 inline-flex">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#0066CC] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D121C] hover:bg-[#F7FAFC]'
              }`}
            >
              All ({categoryCounts.all})
            </button>
            <button
              onClick={() => setSelectedCategory('listening')}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
                selectedCategory === 'listening'
                  ? 'bg-[#0066CC] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D121C] hover:bg-[#F7FAFC]'
              }`}
            >
              Listening ({categoryCounts.listening})
            </button>
            <button
              onClick={() => setSelectedCategory('speaking')}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
                selectedCategory === 'speaking'
                  ? 'bg-[#0066CC] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D121C] hover:bg-[#F7FAFC]'
              }`}
            >
              Speaking ({categoryCounts.speaking})
            </button>
            <button
              onClick={() => setSelectedCategory('reading')}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
                selectedCategory === 'reading'
                  ? 'bg-[#0066CC] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D121C] hover:bg-[#F7FAFC]'
              }`}
            >
              Reading ({categoryCounts.reading})
            </button>
            <button
              onClick={() => setSelectedCategory('writing')}
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
                selectedCategory === 'writing'
                  ? 'bg-[#0066CC] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#0D121C] hover:bg-[#F7FAFC]'
              }`}
            >
              Writing ({categoryCounts.writing})
            </button>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => {
            const categoryStyles = getCategoryStyles(topic.category);
            const levelStyles = getLevelStyles(topic.level);
            const IconComponent = getCategoryIcon(topic.category);
            
            return (
              <div
                key={topic.id}
                className="bg-white border border-[#E1E8ED] rounded-lg hover:border-[#0066CC] hover:shadow-[0_4px_12px_rgba(0,102,204,0.08)] transition-all duration-200 overflow-hidden group"
              >
                {/* Card Header */}
                <div className="p-6 pb-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 ${categoryStyles.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    {topic.completed && (
                      <CheckCircle2 className="w-5 h-5 text-[#00875A] flex-shrink-0" />
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded ${categoryStyles.bg} ${categoryStyles.text} border ${categoryStyles.border} uppercase tracking-wide`}>
                      {topic.category}
                    </span>
                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded border ${levelStyles.bg} ${levelStyles.text} ${levelStyles.border}`}>
                      {topic.level}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[18px] font-semibold text-[#0D121C] mb-2.5 leading-[26px] group-hover:text-[#0066CC] transition-colors">
                    {topic.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[14px] text-[#64748B] leading-6 mb-5 line-clamp-3">
                    {topic.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-5 text-[13px] text-[#94A3B8] mb-5 pb-5 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium">{topic.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{topic.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 pb-6">
                  <Button
                    onClick={() => handleStartLearning(topic)}
                    className={`w-full h-10 text-sm font-medium transition-all ${
                      topic.completed
                        ? 'bg-[#E6F7ED] text-[#00875A] hover:bg-[#D4EDDA] border border-[#B3E5C1]'
                        : 'bg-[#0066CC] text-white hover:bg-[#0052A3] shadow-sm hover:shadow-md'
                    }`}
                  >
                    {topic.completed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Review Course
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                      </>
                    )}
                    <ArrowRight className={`w-4 h-4 ml-2 ${topic.completed ? 'text-[#00875A]' : ''}`} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#E1E8ED] rounded-lg">
            <BookOpen className="w-12 h-12 text-[#CBD5E1] mx-auto mb-4" />
            <p className="text-[16px] font-medium text-[#64748B] mb-1">No modules available</p>
            <p className="text-[14px] text-[#94A3B8]">Select a different category to view available courses.</p>
          </div>
        )}
      </div>
    </div>
  );
}
