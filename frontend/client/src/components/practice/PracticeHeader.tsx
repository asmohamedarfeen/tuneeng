import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, X } from 'lucide-react';
import ProfileAvatar from '@/components/ProfileAvatar';

interface PracticeHeaderProps {
  activeTab?: string;
}

export const PracticeHeader: React.FC<PracticeHeaderProps> = ({ activeTab = 'Practice' }) => {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="flex w-full items-center justify-between flex-wrap px-10 py-3 border-[rgba(229,232,235,1)] border-b max-md:max-w-full max-md:px-5">
      <Link href="/" className="self-stretch flex items-center gap-4 my-auto cursor-pointer hover:opacity-80 transition-opacity">
        <div className="self-stretch w-4 my-auto">
          <div className="flex min-h-4 w-4 flex-1" />
        </div>
        <div className="self-stretch text-lg text-[rgba(13,20,28,1)] font-bold whitespace-nowrap leading-none w-[78px] my-auto">
          <div>TuneEng</div>
        </div>
      </Link>
      <div className="self-stretch flex min-w-60 gap-8 flex-wrap flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
        {/* Centered primary navigation links */}
        <nav className="flex min-w-60 min-h-10 items-center justify-center gap-9 text-sm text-[rgba(13,20,28,1)] font-medium whitespace-nowrap flex-1 max-md:max-w-full">
          <Link href="/dashboard" className={`self-stretch w-[74px] my-auto cursor-pointer hover:text-blue-600 transition-colors ${location === '/dashboard' ? 'text-blue-600 font-bold' : ''}`}>
            <div>Dashboard</div>
          </Link>
          <Link href="/practice" className={`self-stretch w-14 my-auto cursor-pointer hover:text-blue-600 transition-colors ${location.startsWith('/practice') ? 'text-blue-600 font-bold' : ''}`}>
            <div>Practice</div>
          </Link>
          <Link href="/learn" className={`self-stretch w-[38px] my-auto cursor-pointer hover:text-blue-600 transition-colors ${location === '/learn' ? 'text-blue-600 font-bold' : ''}`}>
            <div>Learn</div>
          </Link>
          <Link href="#" className="self-stretch w-[90px] my-auto cursor-pointer hover:text-blue-600 transition-colors">
            <div>Assessments</div>
          </Link>
          <Link href="#" className="self-stretch w-[77px] my-auto cursor-pointer hover:text-blue-600 transition-colors">
            <div>Community</div>
          </Link>
          <Link href="/contact" className={`self-stretch w-[77px] my-auto cursor-pointer hover:text-blue-600 transition-colors ${location === '/contact' ? 'text-blue-600 font-bold' : ''}`}>
            <div>Contact</div>
          </Link>
        </nav>
        
        {/* Search button/input */}
        {searchOpen ? (
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="outline-none text-sm w-32"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSearchClose}
              className="hover:bg-gray-100 rounded p-1 transition-colors"
              aria-label="Close search"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </form>
        ) : (
          <button
            onClick={handleSearchClick}
            className="bg-[rgba(229,237,245,1)] flex min-h-10 items-center gap-2 overflow-hidden justify-center w-10 h-10 max-w-[480px] px-2.5 rounded-xl hover:bg-[rgba(204,219,235,1)] transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        )}
        
        {/* Mini profile avatar, consistent across the app */}
        <ProfileAvatar size="sm" fallback="/images/avatar.png" />
      </div>
    </header>
  );
};

