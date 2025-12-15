import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { PracticeHeader } from '@/components/practice/PracticeHeader';
import { PracticeHub } from '@/components/practice/PracticeHub';
import { AIFeedback } from '@/components/practice/AIFeedback';

/**
 * Practice Hub Page
 * Main practice page for language learning exercises
 */
export default function Practice() {
  const [location] = useLocation();
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [initialTab, setInitialTab] = useState('listening');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Extract tab parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['listening', 'speaking', 'reading', 'writing'].includes(tabParam)) {
      setInitialTab(tabParam);
    } else {
      setInitialTab('listening');
    }
  }, [location]);

  const handlePlayExercise = () => {
    setExerciseStarted(true);
    // TODO: Start actual exercise/audio/video based on active tab
    console.log('Exercise started:', initialTab);
  };

  const handleNextExercise = () => {
    setExerciseStarted(false);
    setCurrentExerciseIndex(prev => prev + 1);
    // TODO: Load next exercise
    console.log('Moving to next exercise');
  };

  return (
    <div className="bg-white">
      <div className="bg-[rgba(247,250,252,1)] min-h-[800px] w-full overflow-hidden max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <PracticeHeader />
          <div className="flex w-full gap-1 justify-center flex-1 flex-wrap h-full px-6 py-5 max-md:max-w-full max-md:px-5">
            <PracticeHub onPlayExercise={handlePlayExercise} initialTab={initialTab} />
            <AIFeedback onNextExercise={handleNextExercise} />
          </div>
        </div>
      </div>
    </div>
  );
}

