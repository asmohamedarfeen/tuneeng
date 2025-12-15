import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactForm = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch(API_ENDPOINTS.contact.submit(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to send message');
      }

      const result = await response.json();
      
      toast({
        title: result.message || 'Message sent successfully!',
        description: result.submission_id 
          ? `Reference ID: ${result.submission_id}` 
          : "We'll get back to you soon.",
      });
      reset();
    } catch (error: any) {
      toast({
        title: 'Failed to send message',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="flex max-w-[960px] flex-col items-start flex-[1_0_0] w-full">
      <div className="flex justify-between items-start content-start gap-y-3 w-full flex-wrap box-border p-4">
        <div className="flex min-w-72 flex-col items-start gap-3">
          <div className="flex w-[456px] flex-col items-start max-md:w-full">
            <h1 className="text-[#0D141C] text-[32px] font-bold leading-10">
              Contact Us
            </h1>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-[#4570A1] text-sm font-normal leading-[21px]">
              We're here to help! Reach out to us with any questions or feedback.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex max-w-[480px] items-end content-end gap-4 flex-wrap box-border px-4 py-3 max-md:max-w-full">
          <div className="flex min-w-40 flex-col items-start flex-[1_0_0]">
            <div className="flex flex-col items-start w-full pb-2">
              <label htmlFor="name" className="text-[#0D141C] text-base font-medium leading-6">
                Your Name
              </label>
            </div>
            <div className="flex h-14 items-center w-full box-border bg-[#E5EDF5] rounded-lg">
              <input
                id="name"
                type="text"
                {...register('name')}
                placeholder="Enter your name"
                className="w-full h-full px-4 bg-transparent text-[#0D141C] text-base font-normal leading-6 placeholder:text-[#4570A1] border-none outline-none rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:ring-opacity-50"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
        </div>
        
        <div className="flex max-w-[480px] items-end content-end gap-4 flex-wrap box-border px-4 py-3 max-md:max-w-full">
          <div className="flex min-w-40 flex-col items-start flex-[1_0_0]">
            <div className="flex flex-col items-start w-full pb-2">
              <label htmlFor="email" className="text-[#0D141C] text-base font-medium leading-6">
                Your Email
              </label>
            </div>
            <div className="flex h-14 items-center w-full box-border bg-[#E5EDF5] rounded-lg">
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter your email"
                className="w-full h-full px-4 bg-transparent text-[#0D141C] text-base font-normal leading-6 placeholder:text-[#4570A1] border-none outline-none rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:ring-opacity-50"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
        
        <div className="flex max-w-[480px] items-end content-end gap-4 flex-wrap box-border px-4 py-3 max-md:max-w-full">
          <div className="flex min-w-40 flex-col items-start flex-[1_0_0]">
            <div className="flex flex-col items-start w-full pb-2">
              <label htmlFor="message" className="text-[#0D141C] text-base font-medium leading-6">
                Your Message
              </label>
            </div>
            <div className="flex min-h-36 items-start flex-[1_0_0] w-full box-border bg-[#E5EDF5] rounded-lg">
              <textarea
                id="message"
                {...register('message')}
                placeholder="Enter your message"
                rows={6}
                className="w-full h-full min-h-36 px-4 py-4 bg-transparent text-[#0D141C] text-base font-normal leading-6 placeholder:text-[#4570A1] border-none outline-none rounded-lg resize-none focus:ring-2 focus:ring-[#007AFF] focus:ring-opacity-50"
              />
            </div>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end items-start w-full box-border px-4 py-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-10 min-w-[84px] max-w-[480px] justify-center items-center bg-[#007AFF] px-4 py-0 rounded-lg hover:bg-[#0056CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="overflow-hidden text-[#F7FAFC] text-center text-ellipsis text-sm font-bold leading-[21px]">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
};

