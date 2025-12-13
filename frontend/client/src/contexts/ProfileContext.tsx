import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  updateProfileImage: (file: File) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const PROFILE_IMAGE_KEY = 'tuneeng_profile_image';

/**
 * Profile Context Provider
 * Manages profile image state across the entire application
 * Persists to localStorage for persistence across sessions
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileImage, setProfileImageState] = useState<string | null>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(PROFILE_IMAGE_KEY);
      return saved || null;
    }
    return null;
  });

  // Save to localStorage whenever profileImage changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (profileImage) {
        localStorage.setItem(PROFILE_IMAGE_KEY, profileImage);
      } else {
        localStorage.removeItem(PROFILE_IMAGE_KEY);
      }
    }
  }, [profileImage]);

  const setProfileImage = (image: string | null) => {
    setProfileImageState(image);
  };

  const updateProfileImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setProfileImageState(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage, updateProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
}

/**
 * Hook to use profile context
 * @throws Error if used outside ProfileProvider
 */
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

