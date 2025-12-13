// No storage needed for this landing page MVP
// This file exists to maintain the project structure

export interface IStorage {
  // Add storage methods if needed
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
