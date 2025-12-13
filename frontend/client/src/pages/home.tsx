import LandingApp from "@landing/App";

/**
 * Home page entrypoint.
 *
 * Directly mounts the Landing SPA module from `Landing/src`.
 * Other routes (/practice, /profile, etc.) remain as-is; only "/" renders this module.
 */
export default function Home() {
  return <LandingApp />;
}
