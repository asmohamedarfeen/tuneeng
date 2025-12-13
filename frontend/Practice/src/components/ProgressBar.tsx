import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label = 'Progress' }) => {
  return (
    <div className="w-full">
      <div className="flex w-full gap-[40px_100px] text-[rgba(13,20,28,1)] whitespace-nowrap justify-between flex-wrap max-md:max-w-full">
        <div className="text-base font-medium w-[68px]">
          <div>{label}</div>
        </div>
        <div className="min-h-6 text-sm font-normal w-[29px]">
          <div>{progress}%</div>
        </div>
      </div>
      <div className="rounded bg-[rgba(204,219,235,1)] flex w-full flex-col mt-3 max-md:max-w-full">
        <div
          className="rounded bg-[rgba(0,122,255,1)] flex min-h-2 max-w-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
