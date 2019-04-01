context('CT_01', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    cy.wait(5000);
  });

  it('1. Inserir um caixa financeiro', () => {
    cy.get('app-inicio ion-header ion-title').should('have.text', 'Saldo');
    cy.get('app-inicio ion-content ion-button')
      .should('contain', 'Caixa Financeiro')
      .click();

    cy.wait(1000);
    cy.get('app-caixa-financeiro ion-header ion-title').should('contain', 'Caixa Financeiro');
    cy.get('app-caixa-financeiro [formControlName="nome"] input').type('Banco Inter');
    cy.get('app-caixa-financeiro [formControlName="tipo"]').click();

    cy.get('ion-select-popover ion-item')
      .first()
      .should('contain', 'Carteira')
      .click();

    cy.get('app-caixa-financeiro ion-button[type="submit"]')
      .should('contain', 'Salvar')
      .click();
  });
});
