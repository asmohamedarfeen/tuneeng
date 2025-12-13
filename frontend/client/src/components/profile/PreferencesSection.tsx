import { useState } from 'react';
import { Switch } from '@/components/ui/switch';

/**
 * Preferences Section Component
 * Allows users to manage their app preferences
 */
const PreferencesSection = () => {
  const [preferences, setPreferences] = useState({
    theme: false,
    notifications: false
  });

  const handleToggleChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <section>
      <div className="flex h-[60px] flex-col items-start w-full box-border pt-5 pb-3 px-4 max-sm:pt-4 max-sm:pb-2 max-sm:px-2">
        <h3 className="w-full text-[#0D121C] text-[22px] font-bold leading-7">
          Preferences
        </h3>
      </div>

      <div className="flex h-[72px] min-h-[72px] justify-between items-center w-full box-border bg-[#F7FAFC] px-4 py-2 max-sm:h-auto max-sm:min-h-[60px] max-sm:p-2">
        <div className="flex flex-col justify-center items-start max-sm:flex-1 max-sm:mr-4">
          <div className="flex flex-col items-start">
            <h4 className="text-[#0D121C] text-base font-medium leading-6">
              Theme
            </h4>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-[#4569A1] text-sm font-normal leading-[21px]">
              Switch between light and dark themes
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <Switch
            checked={preferences.theme}
            onCheckedChange={(checked) => handleToggleChange('theme', checked)}
            aria-label="Toggle theme"
          />
        </div>
      </div>

      <div className="flex h-[72px] min-h-[72px] justify-between items-center w-full box-border bg-[#F7FAFC] px-4 py-2 max-sm:h-auto max-sm:min-h-[60px] max-sm:p-2">
        <div className="flex flex-col justify-center items-start max-sm:flex-1 max-sm:mr-4">
          <div className="flex flex-col items-start">
            <h4 className="text-[#0D121C] text-base font-medium leading-6">
              Notifications
            </h4>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-[#4569A1] text-sm font-normal leading-[21px]">
              Receive notifications for new content and updates
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <Switch
            checked={preferences.notifications}
            onCheckedChange={(checked) => handleToggleChange('notifications', checked)}
            aria-label="Toggle notifications"
          />
        </div>
      </div>

      <div className="flex h-[72px] min-h-[72px] justify-between items-center w-full box-border bg-[#F7FAFC] px-4 py-2 max-sm:h-auto max-sm:min-h-[60px] max-sm:p-2">
        <div className="flex flex-col justify-center items-start max-sm:flex-1 max-sm:mr-4">
          <div className="flex flex-col items-start">
            <h4 className="text-[#0D121C] text-base font-medium leading-6">
              Language
            </h4>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-[#4569A1] text-sm font-normal leading-[21px]">
              Select your preferred language
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex flex-col items-start flex-[1_0_0]">
            <span className="text-[#0D121C] text-base font-normal leading-6">
              English
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreferencesSection;

