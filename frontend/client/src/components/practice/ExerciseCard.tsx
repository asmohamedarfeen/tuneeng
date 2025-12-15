import React from 'react';
import { Play, Pause } from 'lucide-react';

interface ExerciseCardProps {
  title: string;
  level: string;
  imageUrl: string;
  onPlay: () => void;
  isPlaying?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ title, level, imageUrl, onPlay, isPlaying = false }) => {
  return (
    <div className="flex w-full flex-col items-stretch justify-center px-4 py-3 max-md:max-w-full">
      <div className="bg-[rgba(229,237,245,1)] flex w-full flex-col items-stretch justify-center px-4 py-3 rounded-xl max-md:max-w-full hover:bg-[rgba(204,219,235,1)] transition-colors cursor-pointer">
        <div className="flex w-full items-center gap-4 overflow-hidden flex-wrap max-md:max-w-full">
          <img
            src={imageUrl}
            className="aspect-[1] object-contain w-14 self-stretch shrink-0 my-auto rounded-lg"
            alt={title}
            onError={(e) => {
              // Fallback to a placeholder if image fails
              e.currentTarget.src = '/images/listening-hero.png';
            }}
          />
          <div className="self-stretch min-w-60 flex-1 shrink basis-[0%] my-auto max-md:max-w-full">
            <div className="w-full overflow-hidden text-base text-[rgba(13,20,28,1)] font-bold leading-none max-md:max-w-full">
              <div className="max-md:max-w-full">{title}</div>
            </div>
            <div className="w-full overflow-hidden text-sm text-[rgba(69,112,161,1)] font-normal max-md:max-w-full">
              <div className="max-md:max-w-full">{level}</div>
            </div>
          </div>
          <button
            onClick={onPlay}
            className={`self-stretch flex min-h-10 items-center justify-center w-10 h-10 my-auto rounded-[20px] transition-colors ${
              isPlaying 
                ? 'bg-[rgba(255,59,48,1)] hover:bg-[rgba(220,50,40,1)]' 
                : 'bg-[rgba(0,122,255,1)] hover:bg-[rgba(0,100,220,1)]'
            }`}
            aria-label={isPlaying ? "Pause exercise" : "Play exercise"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white fill-white" />
            ) : (
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

