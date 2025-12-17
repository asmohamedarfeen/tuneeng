/**
 * Page Registry Configuration
 * 
 * This file makes it easy to add new pages to the application.
 * Simply add your page configuration here and the routing will be set up automatically.
 * 
 * @example
 * {
 *   path: "/new-page",
 *   component: () => import("@/pages/new-page"),
 *   title: "New Page"
 * }
 */

import type { ComponentType } from "react";

export interface PageConfig {
  /** The URL path for the page (e.g., "/home", "/about") */
  path: string;
  /** Lazy-loaded component import */
  component: () => Promise<{ default: ComponentType<any> }>;
  /** Optional page title for SEO/document title */
  title?: string;
  /** Optional: Set to true if this is a protected route */
  protected?: boolean;
}

/**
 * All application pages are registered here.
 * Add new pages by adding entries to this array.
 */
export const pages: PageConfig[] = [
  {
    path: "/",
    component: () => import("@/pages/home"),
    title: "Home - TuneEng AI",
  },
  {
    path: "/dashboard",
    component: () => import("@/pages/dashboard"),
    title: "Dashboard - TuneEng AI",
  },
  {
    path: "/learn",
    component: () => import("@/pages/learn"),
    title: "Learn - TuneEng AI",
  },
  {
    path: "/leaderboard",
    component: () => import("@/pages/leaderboard"),
    title: "Leaderboard - TuneEng AI",
  },
  {
    path: "/tracker",
    component: () => import("@/pages/tracker"),
    title: "Progress Tracker - TuneEng AI",
  },
  {
    path: "/profile",
    component: () => import("@/pages/profile"),
    title: "Profile & Settings - TuneEng AI",
  },
  {
    path: "/practice",
    component: () => import("@/pages/practice"),
    title: "Practice Hub - TuneEng AI",
  },
  {
    path: "/assessments",
    component: () => import("@/pages/assessments"),
    title: "Assessments - TuneEng AI",
  },
  {
    path: "/assessments/:id",
    component: () => import("@/pages/assessment-detail"),
    title: "Assessment - TuneEng AI",
  },
  {
    path: "/contact",
    component: () => import("@/pages/contact"),
    title: "Contact Support - TuneEng AI",
  },
  {
    path: "/sign-in",
    component: () => import("@/pages/sign-in"),
    title: "Sign In - TuneEng AI",
  },
  {
    path: "/sign-up",
    component: () => import("@/pages/sign-up"),
    title: "Sign Up - TuneEng AI",
  },
  {
    path: "/sign-out",
    component: () => import("@/pages/sign-out"),
    title: "Sign Out - TuneEng AI",
  },
];

/**
 * 404 Not Found page (always last)
 */
export const notFoundPage: PageConfig = {
  path: "*",
  component: () => import("@/pages/not-found"),
  title: "Page Not Found - TuneEng AI",
};

