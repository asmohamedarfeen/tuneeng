import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // No API routes needed for this landing page MVP
  // The Express server serves the static React app via Vite

  const httpServer = createServer(app);

  return httpServer;
}
