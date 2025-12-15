import { Link } from "wouter";
import { useProfile } from "@/contexts/ProfileContext";

interface ProfileAvatarProps {
  /** Size of the avatar */
  size?: "sm" | "md" | "lg";
  /** Whether the avatar should be clickable (links to profile) */
  clickable?: boolean;
  /** Custom className */
  className?: string;
  /** Fallback image URL if no profile image is set */
  fallback?: string;
}

/**
 * Profile Avatar Component
 * Displays the user's profile image from context
 * Automatically syncs across all instances when profile image changes
 */
export default function ProfileAvatar({ 
  size = "md", 
  clickable = true,
  className = "",
  fallback
}: ProfileAvatarProps) {
  const { profileImage } = useProfile();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const defaultFallback = "https://api.builder.io/api/v1/image/assets/TEMP/55b46a2e606d45a95951dca3bc59877eb465ba50?width=80";
  const imageSrc = profileImage || fallback || defaultFallback;

  const avatarElement = (
    <img
      src={imageSrc}
      alt="User avatar"
      className={`${sizeClasses[size]} rounded-full cursor-pointer hover:opacity-80 transition-opacity ${className}`}
    />
  );

  if (clickable) {
    return (
      <Link href="/profile">
        {avatarElement}
      </Link>
    );
  }

  return avatarElement;
}

