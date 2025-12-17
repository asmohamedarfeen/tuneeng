import { useState } from 'react';
import ProfileHeaderNav from '@/components/profile/Header';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import LearningStats from '@/components/profile/LearningStats';
import PreferencesSection from '@/components/profile/PreferencesSection';
import { Toaster } from '@/components/ui/toaster';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { User, Settings, BarChart } from 'lucide-react';

/**
 * Profile Page
 * Main profile and settings page for users
 */
export default function Profile() {
  const [profileData, setProfileData] = useState({
    fullName: 'Ava Carter',
    email: 'ava.carter@example.com',
    username: 'avacarter',
    password: '••••••••',
    phoneNumber: '+1 (555) 123-4567'
  });

  const handleSaveProfile = (data: typeof profileData) => {
    setProfileData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeaderNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile & Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <ProfileHeader
              name={profileData.fullName}
              title="Software Engineer"
            />
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Personal
                </TabsTrigger>
                <TabsTrigger value="learning" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" /> Stats
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardContent className="pt-6">
                    <PersonalInfoForm
                      initialData={profileData}
                      onSave={handleSaveProfile}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="learning">
                <Card>
                  <CardContent className="pt-6">
                    <LearningStats />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardContent className="pt-6">
                    <PreferencesSection />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
