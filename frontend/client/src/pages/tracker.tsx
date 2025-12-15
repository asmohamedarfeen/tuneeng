import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ProfileAvatar from "@/components/ProfileAvatar";

export default function Tracker() {
  const skillLevels = [
    { skill: "Listening", level: "Advanced" },
    { skill: "Speaking", level: "Intermediate" },
    { skill: "Reading", level: "Proficient" },
    { skill: "Writing", level: "Beginner" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Menu className="h-4 w-4 text-gray-900" />
            <span className="text-lg font-bold text-gray-900">TuneEng</span>
          </div>
          
          <nav className="flex items-center gap-9">
            <Link href="/dashboard" className="text-sm font-medium text-gray-900">Dashboard</Link>
            <Link href="/practice" className="text-sm font-medium text-gray-900">Practice</Link>
            <Link href="/learn" className="text-sm font-medium text-gray-900">Learn</Link>
            <Link href="#" className="text-sm font-medium text-gray-900">Assessments</Link>
            <Link href="#" className="text-sm font-medium text-gray-900">Community</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-900">Contact</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 h-10 px-4">
                <User className="h-5 w-5 mr-2" />
              </Button>
            </Link>
            <ProfileAvatar size="md" fallback="/images/avatar_tracker.png" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex px-6 py-6 gap-2">
        {/* Left Sidebar - 320px width */}
        <div className="w-80 bg-gray-50 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            {/* Modules Button */}
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              <Menu className="h-6 w-6 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">Modules</span>
            </Link>
            {/* Multi Stash Button */}
            <Link href="/leaderboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              <Menu className="h-6 w-6 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">Leaderboard</span>
            </Link>
            {/* Tracker Button - Active */}
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-lg">
              <Menu className="h-6 w-6 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">Tracker</span>
            </div>
          </div>
        </div>

        {/* Main Content Area - Flex 1 */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Fluency Tracker</h1>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 pb-3 px-4 mb-6">
              <div className="flex gap-8">
                <button className="pb-3 px-2 text-sm font-bold border-b-2 border-blue-600 text-blue-600">
                  Overall
                </button>
                <button className="pb-3 px-2 text-sm font-bold border-b-2 border-transparent text-gray-600">
                  Listening
                </button>
                <button className="pb-3 px-2 text-sm font-bold border-b-2 border-transparent text-gray-600">
                  Speaking
                </button>
                <button className="pb-3 px-2 text-sm font-bold border-b-2 border-transparent text-gray-600">
                  Reading
                </button>
              </div>
            </div>

            {/* Weekly Progress Card */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              <div className="mb-4">
                <div className="text-base font-medium text-gray-600 mb-2">Weekly Progress</div>
                <div className="text-3xl font-bold text-gray-900">85%</div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base text-gray-600">Last 7 Days</span>
                <span className="text-base font-medium text-green-600">+5%</span>
              </div>

              {/* Progress Chart - Bar Graph */}
              <div className="mb-4">
                <div className="h-32 bg-white rounded-lg border border-gray-200 flex items-end justify-between gap-2 p-4">
                  {[60, 70, 65, 80, 75, 85, 90].map((height, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      {/* Dynamic height requires inline style - necessary for bar chart visualization */}
                      {/* eslint-disable-next-line react/forbid-dom-props */}
                      <div 
                        className="w-full bg-blue-600 rounded-t min-h-[4px]"
                        style={{ height: `${height}%` } as React.CSSProperties}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Labels */}
              <div className="flex justify-between text-xs font-bold text-blue-600 px-4">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Skill Level Analytics */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 px-4">Skill Level Analytics</h2>
            <div className="grid grid-cols-2 gap-4 px-4">
              {skillLevels.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="text-base font-medium text-gray-600 mb-2">{item.skill}</div>
                  <div className="text-2xl font-bold text-gray-900">{item.level}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}