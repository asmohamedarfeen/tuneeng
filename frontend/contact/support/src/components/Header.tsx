import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="flex justify-between items-center w-full box-border px-10 py-3 border-b-[#E5E8EB] border-b border-solid bg-white">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-start">
          <h1 className="text-[#0D141C] text-lg font-bold leading-[23px]">
            TuneEng
          </h1>
        </div>
      </div>
      
      <div className="flex justify-end items-start gap-8 flex-[1_0_0]">
        <nav className="flex h-10 items-center gap-9 max-sm:hidden">
          <a href="#" className="text-[#0D141C] text-sm font-medium leading-[21px] hover:text-[#007AFF] transition-colors">
            Home
          </a>
          <a href="#" className="text-[#0D141C] text-sm font-medium leading-[21px] hover:text-[#007AFF] transition-colors">
            Features
          </a>
          <a href="#" className="text-[#0D141C] text-sm font-medium leading-[21px] hover:text-[#007AFF] transition-colors">
            Pricing
          </a>
          <a href="#" className="text-[#0D141C] text-sm font-medium leading-[21px] hover:text-[#007AFF] transition-colors">
            Resources
          </a>
        </nav>
        
        <button
          className="hidden cursor-pointer max-sm:block"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="text-2xl text-[#0D141C]" />
          ) : (
            <Menu className="text-2xl text-[#0D141C]" />
          )}
        </button>
        
        <button className="flex h-10 min-w-[84px] max-w-[480px] justify-center items-center bg-[#007AFF] px-4 py-0 rounded-lg max-sm:hidden hover:bg-[#0056CC] transition-colors">
          <span className="overflow-hidden text-[#F7FAFC] text-center text-ellipsis text-sm font-bold leading-[21px]">
            Get Started
          </span>
        </button>
      </div>
      
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-[#E5E8EB] shadow-lg sm:hidden z-50">
          <nav className="flex flex-col p-4 gap-4">
            <a href="#" className="text-[#0D141C] text-sm font-medium leading-[21px] hover:text-[#007AFF] transition-colors">
              Home
            </a>
            <a href="#" className="text-[#0D141C] text-sm font-medium leading-[21px] hover:text-[#007AFF] transition-colors">
              Features
            </a>
            <a href="#" className="text-[#0D141C] text-sm font-medium leading-[21px] hover:text-[#007AFF] transition-colors">
              Pricing
            </a>
            <a href="#" className="text-[#0D141C] text-sm font-medium leading-[21px] hover:text-[#007AFF] transition-colors">
              Resources
            </a>
            <button className="flex h-10 justify-center items-center bg-[#007AFF] px-4 py-0 rounded-lg hover:bg-[#0056CC] transition-colors mt-2">
              <span className="text-[#F7FAFC] text-sm font-bold leading-[21px]">
                Get Started
              </span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
