// src/global.d.ts

// Extending the global namespace to declare the BeforeInstallPromptEvent
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: string; platform: string }>;
  }
}

// Ensure this is a module declaration to avoid the "Cannot find name" error.
export {};
