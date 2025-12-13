import React from 'react';

interface Tab {
  id: string;
  label: string;
  width: string;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'listening', label: 'Listening', width: 'w-16' },
  { id: 'speaking', label: 'Speaking', width: 'w-[65px]' },
  { id: 'reading', label: 'Reading', width: 'w-14' },
  { id: 'writing', label: 'Writing', width: 'w-[51px]' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full text-sm text-[rgba(69,112,161,1)] font-bold whitespace-nowrap pb-3 max-md:max-w-full">
      <div className="flex w-full gap-8 flex-wrap px-4 border-[rgba(204,219,235,1)] border-b max-md:max-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center ${tab.width} pt-4 pb-[13px] border-b-[3px] ${
              activeTab === tab.id
                ? 'text-[rgba(13,20,28,1)] border-[rgba(0,122,255,1)]'
                : 'border-[rgba(229,232,235,1)]'
            }`}
          >
            <div className={tab.width}>
              <div>{tab.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

