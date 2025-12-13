import React from 'react';

const ContactInfo = () => {
  return (
    <section className="w-full">
      <div className="flex h-[60px] flex-col items-start w-full box-border pt-5 pb-3 px-4">
        <h2 className="text-[#0D141C] text-[22px] font-bold leading-7">
          Contact Information
        </h2>
      </div>
      
      <div className="flex flex-col items-start gap-6 w-full box-border p-4">
        <div className="flex items-start gap-6 flex-[1_0_0] w-full max-md:flex-col max-md:gap-0 max-sm:flex-col">
          <div className="flex w-[186px] flex-col items-start box-border px-0 py-5 border-t-[#E5E8EB] border-t border-solid max-md:w-full max-sm:w-full">
            <div className="flex items-start flex-[1_0_0] w-full">
              <div className="flex w-full flex-col items-start">
                <span className="text-[#4570A1] text-sm font-normal leading-[21px]">
                  Email
                </span>
              </div>
            </div>
            <div className="flex items-start flex-[1_0_0] w-full">
              <div className="flex w-full flex-col items-start">
                <a 
                  href="mailto:support@tuneeng.com"
                  className="text-[#0D141C] text-sm font-normal leading-[21px] hover:text-[#007AFF] transition-colors"
                >
                  support@tuneeng.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex w-[718px] flex-col items-start box-border flex-1 px-0 py-5 border-t-[#E5E8EB] border-t border-solid max-md:w-full max-sm:w-full">
            <div className="flex items-start flex-[1_0_0] w-full">
              <div className="flex w-full flex-col items-start">
                <span className="text-[#4570A1] text-sm font-normal leading-[21px]">
                  Phone
                </span>
              </div>
            </div>
            <div className="flex items-start flex-[1_0_0] w-full">
              <div className="flex w-full flex-col items-start">
                <a 
                  href="tel:+15551234567"
                  className="text-[#0D141C] text-sm font-normal leading-[21px] hover:text-[#007AFF] transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-6 flex-[1_0_0] w-full max-md:flex-col max-md:gap-0 max-sm:flex-col">
          <div className="flex w-full flex-col items-start box-border px-0 py-5 border-t-[#E5E8EB] border-t border-solid max-md:w-full max-sm:w-full">
            <div className="flex items-start w-full">
              <div className="flex w-full flex-col items-start">
                <span className="text-[#4570A1] text-sm font-normal leading-[21px]">
                  Address
                </span>
              </div>
            </div>
            <div className="flex items-start w-full">
              <div className="flex w-full flex-col items-start">
                <address className="text-[#0D141C] text-sm font-normal leading-[21px] not-italic">
                  123 Learning Lane, Suite 456, Techville, CA 90001
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
