// cypress/e2e/smoke.cy.ts

describe('Smoke Test', () => {
  it('successfully loads the hieroglyphcode homepage', () => {
    // cy.visit('/') uses your configured baseUrl
    cy.visit('/'); 

    // Check for the title to confirm the page loaded
    cy.title().should('eq', 'Hieroglyph Code - Custom Software Solutions'); 
  });
});