import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfoFormProps {
  initialData: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    phoneNumber: string;
  };
  onSave: (data: any) => void;
}

/**
 * Personal Information Form Component
 * Allows users to edit and save their personal information
 */
const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  return (
    <section>
      <div className="flex justify-between items-center w-full box-border pt-5 pb-3 px-4 max-sm:pt-4 max-sm:pb-2 max-sm:px-2">
        <h3 className="text-[#0D121C] text-[22px] font-bold leading-7">
          Personal Information
        </h3>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
      
      <form className="space-y-0">
        <div className="flex max-w-[480px] items-end content-end gap-4 flex-wrap px-4 py-3 max-sm:max-w-full max-sm:p-2">
          <div className="flex min-w-40 flex-col items-start flex-[1_0_0]">
            <div className="flex flex-col items-start w-full pb-2">
              <label htmlFor="fullName" className="w-full text-[#0D121C] text-base font-medium leading-6">
                Full Name
              </label>
            </div>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full"
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="flex max-w-[480px] items-end content-end gap-4 flex-wrap px-4 py-3 max-sm:max-w-full max-sm:p-2">
          <div className="flex min-w-40 flex-col items-start flex-[1_0_0]">
            <div className="flex flex-col items-start w-full pb-2">
              <label htmlFor="email" className="w-full text-[#0D121C] text-base font-medium leading-6">
                Email
              </label>
            </div>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full"
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="flex max-w-[480px] items-end content-end gap-4 flex-wrap px-4 py-3 max-sm:max-w-full max-sm:p-2">
          <div className="flex min-w-40 flex-col items-start flex-[1_0_0]">
            <div className="flex flex-col items-start w-full pb-2">
              <label htmlFor="username" className="w-full text-[#0D121C] text-base font-medium leading-6">
                Username
              </label>
            </div>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full"
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="flex max-w-[480px] items-end content-end gap-4 flex-wrap px-4 py-3 max-sm:max-w-full max-sm:p-2">
          <div className="flex min-w-40 flex-col items-start flex-[1_0_0]">
            <div className="flex flex-col items-start w-full pb-2">
              <label htmlFor="password" className="w-full text-[#0D121C] text-base font-medium leading-6">
                Password
              </label>
            </div>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full"
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="flex flex-col items-start w-full box-border pt-1 pb-3 px-4">
          <button
            type="button"
            className="w-full text-[#4569A1] text-sm font-normal leading-[21px] cursor-pointer text-left hover:underline"
          >
            Change Password
          </button>
        </div>

        <div className="flex max-w-[480px] items-end content-end gap-4 flex-wrap px-4 py-3 max-sm:max-w-full max-sm:p-2">
          <div className="flex min-w-40 flex-col items-start flex-[1_0_0]">
            <div className="flex flex-col items-start w-full pb-2">
              <label htmlFor="phoneNumber" className="w-full text-[#0D121C] text-base font-medium leading-6">
                Phone Number
              </label>
            </div>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full"
              disabled={!isEditing}
            />
          </div>
        </div>
      </form>
    </section>
  );
};

export default PersonalInfoForm;

