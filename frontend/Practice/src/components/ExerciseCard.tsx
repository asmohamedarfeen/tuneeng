import React from 'react';

interface ExerciseCardProps {
  title: string;
  level: string;
  imageUrl: string;
  onPlay: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ title, level, imageUrl, onPlay }) => {
  return (
    <div className="flex w-full flex-col items-stretch justify-center px-4 py-3 max-md:max-w-full">
      <div className="bg-[rgba(229,237,245,1)] flex w-full flex-col items-stretch justify-center px-4 py-3 rounded-xl max-md:max-w-full">
        <div className="flex w-full items-center gap-4 overflow-hidden flex-wrap max-md:max-w-full">
          <img
            src={imageUrl}
            className="aspect-[1] object-contain w-14 self-stretch shrink-0 my-auto rounded-lg"
            alt={title}
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
            className="bg-[rgba(0,122,255,1)] self-stretch flex min-h-10 items-center justify-center w-10 h-10 my-auto rounded-[20px] hover:bg-[rgba(0,100,220,1)] transition-colors"
            aria-label="Play exercise"
          >
            <div className="self-stretch flex w-5 flex-col items-center my-auto">
              <img
                src="https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/ad1c3cbb079b7973dff20629f21a4c71fd940f52?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-full flex-1"
                alt="Play"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
