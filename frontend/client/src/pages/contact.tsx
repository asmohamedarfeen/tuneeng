import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ProfileAvatar from "@/components/ProfileAvatar";
import { ContactForm } from "@/components/contact/ContactForm";
import { FAQSection } from "@/components/contact/FAQSection";
import { ContactInfo } from "@/components/contact/ContactInfo";

/**
 * Contact Page
 * Integrated contact form, FAQ, and contact information
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar - Consistent with other pages */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="px-10 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
            <Menu className="h-4 w-4 text-gray-900" />
            <span className="text-lg font-bold text-gray-900">TuneEng</span>
          </Link>
          
          <nav className="flex items-center gap-9">
            <Link href="/dashboard" className="text-sm font-medium text-gray-900">Dashboard</Link>
            <Link href="/practice" className="text-sm font-medium text-gray-900">Practice</Link>
            <Link href="/learn" className="text-sm font-medium text-gray-900">Learn</Link>
            <Link href="#" className="text-sm font-medium text-gray-900">Assessments</Link>
            <Link href="#" className="text-sm font-medium text-gray-900">Community</Link>
            <Link href="/contact" className="text-sm font-medium text-blue-600 font-bold">Contact</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 h-10 px-4">
                <User className="h-5 w-5 mr-2" />
              </Button>
            </Link>
            <ProfileAvatar size="md" fallback="/images/avatar.png" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex justify-center items-start flex-1 w-full box-border px-40 py-5 max-md:px-10 max-md:py-5 max-sm:p-5 bg-[#F7FAFC]">
        <div className="flex max-w-[960px] flex-col items-start flex-1 w-full">
          <ContactForm />
          <FAQSection />
          <ContactInfo />
        </div>
      </main>
    </div>
  );
}
