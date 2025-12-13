import React from 'react';

interface FeedbackItem {
  icon: string;
  title: string;
  score: string;
  width: string;
}

const feedbackItems: FeedbackItem[] = [
  {
    icon: 'https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/7e0a06827bb99c36821877820b1508fa8c99b69d?placeholderIfAbsent=true',
    title: 'Overall Score',
    score: '85%',
    width: 'w-[103px]'
  },
  {
    icon: 'https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/8d64929d3a163a68facf8a79c2e4c6875ce30d18?placeholderIfAbsent=true',
    title: 'Accent Recognition',
    score: '92%',
    width: 'w-[150px]'
  },
  {
    icon: 'https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/5f44f5920d9f71010a05bd7ca954b3da9ff93e8b?placeholderIfAbsent=true',
    title: 'Nuance Understanding',
    score: '78%',
    width: 'w-[177px]'
  },
  {
    icon: 'https://api.builder.io/api/v1/image/assets/0563f1bcd048449a9d84f6dc7c33482e/35270d7104b49a01f2e4bcb226603091c5541de8?placeholderIfAbsent=true',
    title: 'Contextual Comprehension',
    score: '80%',
    width: 'w-[209px]'
  }
];

interface AIFeedbackProps {
  onNextExercise: () => void;
}

export const AIFeedback: React.FC<AIFeedbackProps> = ({ onNextExercise }) => {
  return (
    <aside className="min-w-60 min-h-[695px] overflow-hidden w-[360px]">
      <div className="w-full text-lg text-[rgba(13,20,28,1)] font-bold leading-none pt-4 pb-2 px-4">
        <div>AI Feedback</div>
      </div>
      <div className="w-full text-base text-[rgba(13,20,28,1)] font-normal leading-6 pt-1 pb-3 px-4">
        <div>
          Live analysis of your listening comprehension. Results will appear as you interact with the audio.
        </div>
      </div>
      
      {feedbackItems.map((item, index) => (
        <div
          key={index}
          className="bg-[rgba(247,250,252,1)] flex min-h-[72px] w-full items-center gap-4 px-4 py-3"
        >
          <div className="bg-[rgba(229,237,245,1)] self-stretch flex min-h-12 items-center justify-center w-12 h-12 my-auto rounded-lg">
            <img
              src={item.icon}
              className="aspect-[1] object-contain w-6 self-stretch my-auto"
              alt={item.title}
            />
          </div>
          <div className={`self-stretch flex flex-col items-stretch justify-center ${item.width} my-auto`}>
            <div className={`max-w-full ${item.width} overflow-hidden text-base text-[rgba(13,20,28,1)] font-medium`}>
              <div>{item.title}</div>
            </div>
            <div className={`max-w-full ${item.width} overflow-hidden text-sm text-[rgba(69,112,161,1)] font-normal whitespace-nowrap`}>
              <div>{item.score}</div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex w-full text-sm text-[rgba(247,250,252,1)] font-bold text-center px-4 py-3">
        <button
          onClick={onNextExercise}
          className="bg-[rgba(0,122,255,1)] flex min-w-[84px] min-h-10 w-full max-w-[480px] items-center overflow-hidden justify-center flex-1 shrink basis-[0%] px-4 rounded-xl hover:bg-[rgba(0,100,220,1)] transition-colors"
        >
          <div className="self-stretch w-[94px] overflow-hidden my-auto">
            <div>Next Exercise</div>
          </div>
        </button>
      </div>
    </aside>
  );
};
