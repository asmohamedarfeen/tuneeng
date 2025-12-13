import React from 'react';
import Header from '@/components/Header';
import ContactForm from '@/components/ContactForm';
import FAQSection from '@/components/FAQSection';
import ContactInfo from '@/components/ContactInfo';

const Index = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <div className="flex w-full justify-center items-center min-h-screen bg-white font-['Lexend']">
        <div className="flex w-full min-h-[800px] flex-col items-start shrink-0 bg-[#F7FAFC]">
          <div className="flex flex-col items-start w-full">
            <Header />
            
            <main className="flex justify-center items-start flex-[1_0_0] w-full box-border px-40 py-5 max-md:px-10 max-md:py-5 max-sm:p-5">
              <div className="flex max-w-[960px] flex-col items-start flex-[1_0_0] w-full">
                <ContactForm />
                <FAQSection />
                <ContactInfo />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
