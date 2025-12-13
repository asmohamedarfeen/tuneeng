import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { TabNavigation } from './TabNavigation';
import { ExerciseCard } from './ExerciseCard';
import { ProgressBar } from './ProgressBar';

interface PracticeHubProps {
  onPlayExercise: () => void;
  initialTab?: string;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({ onPlayExercise, initialTab = 'listening' }) => {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [progress, setProgress] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);

  // Update active tab when initialTab prop changes
  useEffect(() => {
    if (initialTab && ['listening', 'speaking', 'reading', 'writing'].includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL to reflect the active tab
    setLocation(`/practice?tab=${tabId}`);
  };

  const handlePlayExercise = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setProgress(Math.min(progress + 10, 100));
      onPlayExercise();
    } else {
      // Pause functionality
      setIsPlaying(false);
    }
  };

  const getExerciseContent = () => {
    switch (activeTab) {
      case 'listening':
        return {
          title: 'Understanding Accents',
          level: 'Advanced Level',
          description: 'Listen to the audio clip and answer the questions in the AI Feedback panel. Focus on understanding different accents and nuances in speech.',
          imageUrl: 'https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/d90ee2188ce496950cf46f0b7177b669661ce635?placeholderIfAbsent=true'
        };
      case 'speaking':
        return {
          title: 'Pronunciation Practice',
          level: 'Intermediate Level',
          description: 'Practice speaking with proper pronunciation and intonation. Record your voice and get instant feedback.',
          imageUrl: 'https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/d90ee2188ce496950cf46f0b7177b669661ce635?placeholderIfAbsent=true'
        };
      case 'reading':
        return {
          title: 'Reading Comprehension',
          level: 'Advanced Level',
          description: 'Read the passage and answer comprehension questions to test your understanding.',
          imageUrl: 'https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/d90ee2188ce496950cf46f0b7177b669661ce635?placeholderIfAbsent=true'
        };
      case 'writing':
        return {
          title: 'Essay Writing',
          level: 'Advanced Level',
          description: 'Write a structured essay on the given topic and receive detailed feedback on grammar and style.',
          imageUrl: 'https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/d90ee2188ce496950cf46f0b7177b669661ce635?placeholderIfAbsent=true'
        };
      default:
        return {
          title: 'Understanding Accents',
          level: 'Advanced Level',
          description: 'Listen to the audio clip and answer the questions in the AI Feedback panel. Focus on understanding different accents and nuances in speech.',
          imageUrl: 'https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/d90ee2188ce496950cf46f0b7177b669661ce635?placeholderIfAbsent=true'
        };
    }
  };

  const exerciseContent = getExerciseContent();

  return (
    <main className="min-w-60 min-h-[695px] max-w-[920px] overflow-hidden flex-1 shrink basis-[0%] max-md:max-w-full">
      <div className="flex w-full gap-[12px_0px] justify-between flex-wrap p-4 max-md:max-w-full">
        <div className="min-w-72 w-[406px]">
          <div className="w-full text-[32px] text-[rgba(13,20,28,1)] font-bold leading-none">
            <div>Practice Hub</div>
          </div>
          <div className="w-full text-sm text-[rgba(69,112,161,1)] font-normal mt-3">
            <div>
              Enhance your language skills with targeted practice modules.
            </div>
          </div>
        </div>
      </div>
      
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="w-full text-lg text-[rgba(13,20,28,1)] font-bold leading-none pt-4 pb-2 px-4 max-md:max-w-full">
        <div className="max-md:max-w-full">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Exercise
        </div>
      </div>
      
      <ExerciseCard
        title={exerciseContent.title}
        level={exerciseContent.level}
        imageUrl={exerciseContent.imageUrl}
        onPlay={handlePlayExercise}
        isPlaying={isPlaying}
      />
      
      <div className="w-full text-base text-[rgba(13,20,28,1)] font-normal leading-6 pt-1 pb-3 px-4 max-md:max-w-full">
        <div className="max-md:max-w-full">
          {exerciseContent.description}
        </div>
      </div>
      
      <div className="w-full p-4 max-md:max-w-full">
        <ProgressBar progress={progress} />
      </div>
    </main>
  );
};

