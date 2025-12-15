import { motion } from "framer-motion";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ProfileAvatar from "@/components/ProfileAvatar";

export default function Leaderboard() {
  const leaderboardData = [
    { rank: 1, name: "Hari Prasath", points: 1250, badges: 5 },
    { rank: 2, name: "Lavanya Mohan", points: 1180, badges: 4 },
    { rank: 3, name: "Sanjay Venkatesh", points: 1120, badges: 3 },
    { rank: 4, name: "Revathi Narayanan", points: 1050, badges: 2 },
    { rank: 5, name: "Manoj Kiran", points: 980, badges: 1 },
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
            <ProfileAvatar size="md" fallback="/images/avatar_leaderboard.png" />
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
            {/* Leaderboard Button - Active */}
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-100 rounded-lg">
              <Menu className="h-6 w-6 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">Leaderboard</span>
            </div>
            {/* Tracker Button */}
            <Link href="/tracker" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
              <Menu className="h-6 w-6 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">Tracker</span>
            </Link>
          </div>
        </div>

        {/* Main Content Area - Flex 1 */}
        <div className="flex-1">
          {/* Header with Tabs */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Leaderboard & Daily Challenges</h1>
            
            {/* Tabs */}
            <div className="border-b border-gray-200 pb-3 px-4 mb-6">
              <div className="flex gap-8">
                <button className="pb-3 px-2 text-sm font-bold border-b-2 border-blue-600 text-blue-600">
                  Leaderboard
                </button>
                <button className="pb-3 px-2 text-sm font-bold border-b-2 border-transparent text-gray-600">
                  Daily Challenges
                </button>
              </div>
            </div>

            {/* Overall Ranking Section */}
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-left">Overall Ranking</h2>
            
            {/* Leaderboard Table */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              {/* Table Header */}
              <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
                <div className="px-4 py-3 text-sm font-medium text-gray-900 text-left">Rank</div>
                <div className="px-4 py-3 text-sm font-medium text-gray-900 text-left">Student</div>
                <div className="px-4 py-3 text-sm font-medium text-gray-900 text-left">Points</div>
                <div className="px-4 py-3 text-sm font-medium text-gray-900 text-left">Badges</div>
              </div>
              
              {/* Table Rows */}
              {leaderboardData.map((student) => (
                <div key={student.rank} className="grid grid-cols-4 border-b border-gray-200 last:border-b-0">
                  <div className="px-4 py-4 text-sm text-blue-600 text-left">{student.rank}</div>
                  <div className="px-4 py-4 text-sm font-medium text-gray-900 text-left">{student.name}</div>
                  <div className="px-4 py-4 text-sm text-blue-600 text-left">{student.points}</div>
                  <div className="px-4 py-4 text-sm text-blue-600 text-left">{student.badges}</div>
                </div>
              ))}
            </div>

            {/* Daily Streak Section */}
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-left">Daily Streak</h2>
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <div className="text-sm font-medium text-gray-600 mb-2">Current Streak</div>
              <div className="text-2xl font-bold text-gray-900">7 Days</div>
            </div>

            {/* Badges Earned Section */}
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-left">Badges Earned</h2>
            <div className="flex gap-4 px-4">
              <img src="/images/badge1.png" alt="Badge 1" className="h-16 w-16 rounded-lg object-cover" />
              <img src="/images/badge2.png" alt="Badge 2" className="h-16 w-16 rounded-lg object-cover" />
              <img src="/images/badge3.png" alt="Badge 3" className="h-16 w-16 rounded-lg object-cover" />
              <img src="/images/badge4.png" alt="Badge 4" className="h-16 w-16 rounded-lg object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}