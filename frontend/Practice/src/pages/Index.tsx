import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { PracticeHub } from '@/components/PracticeHub';
import { AIFeedback } from '@/components/AIFeedback';

const Index = () => {
  const [exerciseStarted, setExerciseStarted] = useState(false);

  const handlePlayExercise = () => {
    setExerciseStarted(true);
  };

  const handleNextExercise = () => {
    setExerciseStarted(false);
  };

  return (
    <div className="bg-white">
      <div className="bg-[rgba(247,250,252,1)] min-h-[800px] w-full overflow-hidden max-md:max-w-full">
        <div className="w-full max-md:max-w-full">
          <Header />
          <div className="flex w-full gap-1 justify-center flex-1 flex-wrap h-full px-6 py-5 max-md:max-w-full max-md:px-5">
            <PracticeHub onPlayExercise={handlePlayExercise} />
            <AIFeedback onNextExercise={handleNextExercise} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
