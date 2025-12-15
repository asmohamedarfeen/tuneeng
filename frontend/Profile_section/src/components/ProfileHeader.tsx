import React, { useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  title: string;
  profileImage: string | null;
  onProfileImageChange: (file: File) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  name, 
  title, 
  profileImage,
  onProfileImageChange 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onProfileImageChange(file);
    }
  };

  return (
    <section className="flex flex-col items-start w-full box-border p-4 max-sm:p-2">
      <div className="flex justify-between items-start w-full rounded-xl max-md:flex-col max-md:gap-4">
        <div className="flex w-[608px] h-[171px] flex-col items-start gap-1 max-md:w-full max-md:h-auto">
          <div className="flex h-5 flex-col items-start shrink-0 w-full">
            <h2 className="w-full text-[#0D121C] text-base font-bold leading-5">
              {name}
            </h2>
          </div>
          <div className="flex flex-col items-start w-full">
            <p className="w-full text-[#4569A1] text-sm font-normal leading-[21px]">
              {title}
            </p>
          </div>
        </div>
        <div className="relative h-[171px] flex-[1_0_0] rounded-xl max-md:w-full max-md:h-[200px] group">
          <Avatar className="h-full w-full rounded-xl">
            <AvatarImage 
              src={profileImage || "https://api.builder.io/api/v1/image/assets/TEMP/261bcfcd6d43ef0ffff4591d9da529f113ef0161?width=640"} 
              alt="Profile" 
              className="object-cover rounded-xl"
            />
            <AvatarFallback className="rounded-xl bg-muted text-4xl">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <Button
            onClick={handleImageClick}
            size="icon"
            className="absolute bottom-4 right-4 rounded-full bg-primary hover:bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="h-5 w-5" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
