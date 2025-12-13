import { Switch, Route } from "wouter";
import { Suspense, lazy, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { pages, notFoundPage } from "@/config/pages";

/**
 * Loading fallback component for lazy-loaded pages
 */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

/**
 * Pre-create lazy components for all pages
 * This ensures lazy() is only called once per page
 */
const lazyPages = pages.map((page) => ({
  ...page,
  LazyComponent: lazy(page.component),
}));

const NotFoundLazyComponent = lazy(notFoundPage.component);

/**
 * Wrapper component for lazy-loaded pages
 * Handles document title updates and suspense
 */
function LazyPageWrapper({ 
  component: Component, 
  title 
}: { 
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  title?: string;
}) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

/**
 * Dynamic Router that uses the page registry
 * Automatically sets up routes from the pages configuration
 */
function Router() {
  return (
    <Switch>
      {lazyPages.map((page) => (
        <Route key={page.path} path={page.path}>
          {() => <LazyPageWrapper component={page.LazyComponent} title={page.title} />}
        </Route>
      ))}
      {/* 404 Not Found - always last */}
      <Route path={notFoundPage.path}>
        {() => <LazyPageWrapper component={NotFoundLazyComponent} title={notFoundPage.title} />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ProfileProvider>
    </QueryClientProvider>
  );
}

export default App;
