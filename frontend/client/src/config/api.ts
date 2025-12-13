/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints.
 * Update this to point to your FastAPI backend.
 */

// FastAPI backend URL
// When frontend is served from the same origin as backend, use relative URL
// Otherwise, use full URL (e.g., for development with separate servers)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Helper function to build API URLs
export function apiUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}

// Common API endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    register: () => apiUrl("auth/register"),
    login: () => apiUrl("auth/login"),
    logout: () => apiUrl("auth/logout"),
    me: () => apiUrl("auth/me"),
  },
  
  // Users
  users: {
    list: () => apiUrl("users/"),
    get: (userId: number) => apiUrl(`users/${userId}`),
  },
  
  // Practice
  practice: {
    exercises: (skillType?: string) => 
      skillType ? apiUrl(`practice/exercises?skill_type=${skillType}`) : apiUrl("practice/exercises"),
    startSession: () => apiUrl("practice/sessions"),
    getFeedback: () => apiUrl("practice/feedback"),
    getSession: (sessionId: string) => apiUrl(`practice/sessions/${sessionId}`),
  },
  
  // Leaderboard
  leaderboard: {
    list: (skillType?: string, limit?: number) => {
      const params = new URLSearchParams();
      if (skillType) params.append("skill_type", skillType);
      if (limit) params.append("limit", limit.toString());
      const query = params.toString();
      return query ? apiUrl(`leaderboard/?${query}`) : apiUrl("leaderboard/");
    },
    getUserRank: (userId: number) => apiUrl(`leaderboard/user/${userId}/rank`),
  },
  
  // Profile
  profile: {
    get: () => apiUrl("profile/"),
    update: () => apiUrl("profile/"),
    stats: () => apiUrl("profile/stats"),
  },
  
  // Tracker
  tracker: {
    progress: (skillType?: string, days?: number) => {
      const params = new URLSearchParams();
      if (skillType) params.append("skill_type", skillType);
      if (days) params.append("days", days.toString());
      const query = params.toString();
      return query ? apiUrl(`tracker/progress?${query}`) : apiUrl("tracker/progress");
    },
    summary: () => apiUrl("tracker/summary"),
  },
  
  // Contact
  contact: {
    submit: () => apiUrl("contact/submit"),
  },
} as const;

