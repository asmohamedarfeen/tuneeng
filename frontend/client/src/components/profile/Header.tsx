import { Link } from "wouter";
import ProfileAvatar from "@/components/ProfileAvatar";

/**
 * Profile Page Header Component
 * Navigation header for the profile page
 */
const ProfileHeader = () => {
  return (
    <header className="flex justify-between items-center w-full box-border px-10 py-3 border-b-[#E5E8EB] border-b border-solid max-md:px-5 max-md:py-3 max-sm:px-4 max-sm:py-3">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-start" />
        <div className="flex flex-col items-start">
          <Link href="/dashboard">
            <h1 className="text-[#0D121C] text-lg font-bold leading-[23px] cursor-pointer hover:opacity-80">
              TuneEng
            </h1>
          </Link>
        </div>
      </div>
      <div className="flex justify-end items-start gap-8 flex-[1_0_0] max-sm:gap-4">
        <nav className="flex h-10 items-center gap-9 max-md:gap-6 max-sm:hidden">
          <Link href="/dashboard" className="text-[#0D121C] text-sm font-medium leading-[21px] hover:opacity-80">
            Dashboard
          </Link>
          <Link href="/learn" className="text-[#0D121C] text-sm font-medium leading-[21px] hover:opacity-80">
            Learn
          </Link>
          <Link href="/leaderboard" className="text-[#0D121C] text-sm font-medium leading-[21px] hover:opacity-80">
            Community
          </Link>
          <Link href="/profile" className="text-[#0D121C] text-sm font-medium leading-[21px] hover:opacity-80">
            Profile
          </Link>
        </nav>
        <div className="flex h-10 max-w-[480px] justify-center items-center gap-2 bg-[#E5EBF5] px-2.5 py-0 rounded-xl">
          <div className="flex flex-col items-center flex-[1_0_0]">
            <div className="flex-[1_0_0] w-full relative">
              <svg
                width="20"
                height="20"
                viewBox="0 0 15 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="notification-icon w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.8271 11.8703C14.3936 11.1234 13.749 9.01016 13.749 6.25C13.749 2.79822 10.9508 0 7.49902 0C4.04724 0 1.24902 2.79822 1.24902 6.25C1.24902 9.01094 0.603711 11.1234 0.170117 11.8703C-0.0552549 12.2568 -0.0568941 12.7342 0.165819 13.1223C0.388532 13.5103 0.801635 13.7497 1.24902 13.75H4.4373C4.73458 15.2046 6.01432 16.2493 7.49902 16.2493C8.98373 16.2493 10.2635 15.2046 10.5607 13.75H13.749C14.1963 13.7494 14.6091 13.5099 14.8316 13.1219C15.0542 12.734 15.0525 12.2567 14.8271 11.8703ZM7.49902 15C6.70464 14.9998 5.99663 14.4989 5.73184 13.75H9.26621C9.00142 14.4989 8.2934 14.9998 7.49902 15ZM1.24902 12.5C1.85059 11.4656 2.49902 9.06875 2.49902 6.25C2.49902 3.48858 4.7376 1.25 7.49902 1.25C10.2604 1.25 12.499 3.48858 12.499 6.25C12.499 9.06641 13.1459 11.4633 13.749 12.5H1.24902Z"
                  className="fill-[#0D121C]"
                />
              </svg>
            </div>
          </div>
        </div>
        <ProfileAvatar size="md" className="rounded-[20px]" />
      </div>
    </header>
  );
};

export default ProfileHeader;

