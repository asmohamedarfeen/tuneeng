import { useState } from "react";
import { Menu, User, Headphones, Mic, BookOpen, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import ProfileAvatar from "@/components/ProfileAvatar";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'listening' | 'speaking' | 'reading' | 'writing'>('listening');

  const allModules = [
    {
      title: "Listening Comprehension",
      description:
        "Enhance your ability to understand spoken English in various contexts. Practice with diverse accents and scenarios.",
      tab: "listening",
      icon: Headphones,
      gradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Speaking Fluency",
      description:
        "Improve your spoken English with interactive exercises. Focus on pronunciation, intonation, and natural conversation flow.",
      tab: "speaking",
      icon: Mic,
      gradient: "from-green-50 to-emerald-100",
    },
    {
      title: "Reading Proficiency",
      description:
        "Develop your reading speed and comprehension skills. Engage with a variety of texts, from articles to literature.",
      tab: "reading",
      icon: BookOpen,
      gradient: "from-purple-50 to-indigo-100",
    },
    {
      title: "Writing Accuracy",
      description:
        "Refine your writing skills with exercises covering grammar, vocabulary, and style. Practice different writing formats.",
      tab: "writing",
      icon: PenTool,
      gradient: "from-orange-50 to-amber-100",
    },
  ];

  // Filter modules based on active tab
  const filteredModules = allModules.filter(module => module.tab === activeTab);

  const handleTabClick = (tab: 'listening' | 'speaking' | 'reading' | 'writing') => {
    setActiveTab(tab);
    // Scroll to top of modules section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssessmentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Assessments Coming Soon",
      description: "This feature is under development. Stay tuned!",
    });
  };

  const handleCommunityClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Community Coming Soon",
      description: "This feature is under development. Stay tuned!",
    });
  };

  const handleModulesClick = () => {
    setActiveTab('listening');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar - Exactly as Figma */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="px-10 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
            <Menu className="h-4 w-4 text-gray-900" />
            <span className="text-lg font-bold text-gray-900">TuneEng</span>
          </Link>
          
          <nav className="flex items-center gap-9">
            <Link href="/dashboard" className={`text-sm font-medium ${location === '/dashboard' ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
              Dashboard
            </Link>
            <Link href="/practice" className={`text-sm font-medium ${location.startsWith('/practice') ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
              Practice
            </Link>
            <Link href="/learn" className={`text-sm font-medium ${location === '/learn' ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
              Learn
            </Link>
            <a 
              href="#" 
              onClick={handleAssessmentsClick}
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Assessments
            </a>
            <a 
              href="#" 
              onClick={handleCommunityClick}
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Community
            </a>
            <Link href="/contact" className={`text-sm font-medium ${location === '/contact' ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 h-10 px-4">
                <User className="h-5 w-5 mr-2" />
              </Button>
            </Link>
            <ProfileAvatar size="md" fallback="/images/avatar.png" />
          </div>
        </div>
      </div>

      {/* Main Content Area - Figma Layout */}
      <div className="flex px-6 py-6 gap-2">
        {/* Left Sidebar - 320px width exactly as Figma */}
        <div className="w-80 bg-gray-50 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            {/* Modules Button - Active */}
            <button
              onClick={handleModulesClick}
              className="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-left"
            >
              <Menu className="h-6 w-6 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">Modules</span>
            </button>
            {/* Leaderboard Button */}
            <Link href="/leaderboard">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                <Menu className="h-6 w-6 text-gray-900" />
                <span className="text-sm font-medium text-gray-900">Leaderboard</span>
              </div>
            </Link>
            {/* Tracker Button */}
            <Link href="/tracker">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                <Menu className="h-6 w-6 text-gray-900" />
                <span className="text-sm font-medium text-gray-900">Tracker</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content Area - Flex 1 */}
        <div className="flex-1">
          {/* Title and Tabs Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">LSRW Skill Modules</h1>
            
            {/* LSRW Tabs - Exactly as Figma */}
            <div className="border-b border-gray-200 pb-3 px-4">
              <div className="flex gap-8">
                <button 
                  onClick={() => handleTabClick('listening')}
                  className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'listening' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Listening
                </button>
                <button 
                  onClick={() => handleTabClick('speaking')}
                  className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'speaking' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Speaking
                </button>
                <button 
                  onClick={() => handleTabClick('reading')}
                  className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'reading' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Reading
                </button>
                <button 
                  onClick={() => handleTabClick('writing')}
                  className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'writing' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Writing
                </button>
              </div>
            </div>
          </div>

          {/* Modules Grid - Exactly as Figma */}
          <div className="space-y-4">
            {filteredModules.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No modules available for this skill type.</p>
              </div>
            ) : (
              filteredModules.map((module, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg overflow-hidden border-0"
              >
                <div className="flex">
                  {/* Module Illustration - Icon-based, always visible */}
                  <div
                    className={`w-[242px] h-[242px] flex-shrink-0 rounded-lg bg-gradient-to-br ${module.gradient} flex items-center justify-center`}
                  >
                    {(() => {
                      const Icon = module.icon as typeof Headphones;
                      return (
                        <Icon className="w-16 h-16 text-blue-700 opacity-90" />
                      );
                    })()}
                  </div>

                  {/* Module Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {module.title}
                    </h3>

                    <div className="flex justify-between items-end gap-3">
                      {/* Description */}
                      <p className="text-base text-gray-600 flex-1 max-w-[318px] leading-relaxed">
                        {module.description}
                      </p>

                      {/* Start Module Button */}
                      <Link href={`/practice?tab=${module.tab}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-4 flex-shrink-0">
                          Start Module
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

