import { useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

interface ProfileHeaderProps {
  name: string;
  title: string;
}

/**
 * Profile Header Component
 * Displays user name, title, and profile image with upload functionality
 * Uses shared profile context for image synchronization
 */
const ProfileHeaderComponent: React.FC<ProfileHeaderProps> = ({
  name,
  title
}) => {
  const { profileImage, updateProfileImage } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateProfileImage(file);
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="relative group mb-4">
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage
            src={profileImage || "https://api.builder.io/api/v1/image/assets/TEMP/261bcfcd6d43ef0ffff4591d9da529f113ef0161?width=640"}
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-100 text-4xl">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <Button
          onClick={handleImageClick}
          size="icon"
          className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-1">{name}</h2>
      <p className="text-gray-500 text-sm mb-6">{title}</p>

      <div className="flex gap-3 w-full">
        <Button className="flex-1 bg-gray-900 text-white hover:bg-gray-800">
          Edit Profile
        </Button>
        <Button variant="outline" className="flex-1">
          Share
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload profile image"
      />
    </div>
  );
};

export default ProfileHeaderComponent;

