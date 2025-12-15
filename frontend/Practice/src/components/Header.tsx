import React from 'react';

interface HeaderProps {
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab = 'Practice' }) => {
  return (
    <header className="flex w-full items-center justify-between flex-wrap px-10 py-3 border-[rgba(229,232,235,1)] border-b max-md:max-w-full max-md:px-5">
      <div className="self-stretch flex items-center gap-4 my-auto">
        <div className="self-stretch w-4 my-auto">
          <div className="flex min-h-4 w-4 flex-1" />
        </div>
        <div className="self-stretch text-lg text-[rgba(13,20,28,1)] font-bold whitespace-nowrap leading-none w-[78px] my-auto">
          <div>TuneEng</div>
        </div>
      </div>
      <div className="self-stretch flex min-w-60 gap-8 flex-wrap flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
        <nav className="flex min-w-60 min-h-10 items-center gap-9 text-sm text-[rgba(13,20,28,1)] font-medium whitespace-nowrap max-md:max-w-full">
          <div className="self-stretch w-[74px] my-auto">
            <div>Dashboard</div>
          </div>
          <div className="self-stretch w-14 my-auto">
            <div>Practice</div>
          </div>
          <div className="self-stretch w-[38px] my-auto">
            <div>Learn</div>
          </div>
          <div className="self-stretch w-[90px] my-auto">
            <div>Assessments</div>
          </div>
          <div className="self-stretch w-[77px] my-auto">
            <div>Community</div>
          </div>
        </nav>
        <div className="bg-[rgba(229,237,245,1)] flex min-h-10 items-center gap-2 overflow-hidden justify-center w-10 h-10 max-w-[480px] px-2.5 rounded-xl">
          <div className="self-stretch w-full flex-1 shrink basis-[0%] my-auto">
            <img
              src="https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/92aed33cf604f62e2363b949025aa31832d4a2b1?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-5 flex-1"
              alt="Search"
            />
          </div>
        </div>
        <img
          src="https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/fe6c2cf110812e51f6b4360abdd4181481d51349?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-10 shrink-0 rounded-[20px]"
          alt="User Avatar"
        />
      </div>
    </header>
  );
};
