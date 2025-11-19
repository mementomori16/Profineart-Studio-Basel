import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // 1. CRITICAL: Set the baseUrl for your application
    baseUrl: 'https://hieroglyphcode.ch', 
    
    // 2. CRITICAL: Set the specPattern to match your file name
    // (Assuming you kept the standard name: smoke.cy.ts)
    specPattern: 'cypress/e2e/**/*.cy.ts', 
    
    // 3. FIXES the "on and config have no value" errors
    setupNodeEvents(on, config) {
      // Return the config object to ensure it is used
      return config;
    },
  },
});