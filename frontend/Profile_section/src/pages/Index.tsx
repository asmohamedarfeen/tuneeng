import React, { useState } from 'react';
import Header from '@/components/Header';
import ProfileHeader from '@/components/ProfileHeader';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import LearningStats from '@/components/LearningStats';
import PreferencesSection from '@/components/PreferencesSection';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [profileData, setProfileData] = useState({
    fullName: 'Ava Carter',
    email: 'ava.carter@example.com',
    username: 'avacarter',
    password: '••••••••',
    phoneNumber: '+1 (555) 123-4567'
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSaveProfile = (data: typeof profileData) => {
    setProfileData(data);
  };

  const handleProfileImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex w-full flex-col items-start min-h-screen bg-white">
      <div className="flex min-h-[800px] flex-col items-start w-full bg-[#F7FAFC]">
        <div className="flex flex-col items-start w-full">
          <Header />
          
          <main className="flex justify-center items-start flex-[1_0_0] w-full box-border px-40 py-5 max-md:px-10 max-md:py-5 max-sm:px-4 max-sm:py-5">
            <div className="flex max-w-[960px] flex-col items-start flex-[1_0_0]">
              <div className="flex justify-between items-start content-start gap-y-3 w-full flex-wrap box-border p-4 max-sm:p-2">
                <div className="flex w-72 min-w-72 flex-col items-start">
                  <h1 className="w-full text-[#0D121C] text-[32px] font-bold leading-10 max-sm:text-2xl max-sm:leading-8">
                    Profile &amp; Settings
                  </h1>
                </div>
              </div>
              
              <ProfileHeader 
                name={profileData.fullName}
                title="Software Engineer"
                profileImage={profileImage}
                onProfileImageChange={handleProfileImageChange}
              />
              <PersonalInfoForm 
                initialData={profileData}
                onSave={handleSaveProfile}
              />
              <LearningStats />
              <PreferencesSection />
            </div>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
