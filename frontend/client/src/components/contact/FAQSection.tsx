import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    id: 'faq-1',
    question: 'How does TuneEng work?',
    answer: 'TuneEng uses advanced AI to provide personalized language learning and interview practice. Our platform analyzes your responses and offers tailored feedback to help you improve your skills.'
  },
  {
    id: 'faq-2',
    question: 'What are the benefits of using TuneEng?',
    answer: 'TuneEng offers personalized learning paths, real-time feedback, interview simulation, progress tracking, and adaptive content that adjusts to your skill level and learning pace.'
  },
  {
    id: 'faq-3',
    question: 'How can I get started with TuneEng?',
    answer: 'Getting started is easy! Simply sign up for an account, complete our initial assessment to determine your current level, and begin your personalized learning journey with our AI-powered platform.'
  }
];

export const FAQSection = () => {
  return (
    <section className="w-full">
      <div className="flex h-[60px] flex-col items-start w-full box-border pt-5 pb-3 px-4">
        <h2 className="text-[#0D141C] text-[22px] font-bold leading-7">
          Frequently Asked Questions
        </h2>
      </div>
      
      <div className="flex flex-col items-start gap-3 w-full box-border p-4">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className="flex flex-col items-start w-full box-border bg-[#E5EDF5] px-4 py-2 rounded-lg"
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={faq.id} className="border-none">
                <AccordionTrigger className="flex justify-between items-center w-full px-0 py-2 hover:no-underline">
                  <span className="text-[#0D141C] text-sm font-medium leading-[21px] text-left">
                    {faq.question}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#0D141C] shrink-0 transition-transform duration-200" />
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <p className="text-[#4570A1] text-sm font-normal leading-[21px]">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </section>
  );
};

