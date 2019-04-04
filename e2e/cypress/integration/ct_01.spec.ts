context('CT_01', () => {
  before(() => {
    cy.exec('gulp limparFirestore')
      .visit('http://localhost:4200');
  });

  it('1. Inserir um caixa financeiro', () => {
    cy.get('app-inicio ion-header ion-title').should('have.text', 'Saldo');
    cy.get('app-inicio ion-content ion-button')
      .last()
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

    cy.wait(200);

    cy.get('app-inicio .item-caixa').should('have.length', 1);
    cy.get('app-inicio .item-caixa h2 b').should('have.text', 'Banco Inter');
  });

  it('2. Inserir um Caixa Financeiro de um Cartão de Crédito', () => {
    cy.get('app-inicio ion-header ion-title').should('have.text', 'Saldo');
    cy.get('app-inicio ion-content ion-item ion-button')
      .last()
      .should('contain', 'Caixa Financeiro')
      .click();

    cy.wait(1000);
    cy.get('app-caixa-financeiro ion-header ion-title').should('contain', 'Caixa Financeiro');
    cy.get('app-caixa-financeiro [formControlName="nome"] input').type('Mastercard Santander');
    cy.get('app-caixa-financeiro [formControlName="tipo"]').click();

    cy.get('ion-select-popover ion-item')
      .last()
      .should('contain', 'Cartão Crédito')
      .click();

    cy.get('app-caixa-financeiro [formcontrolname="diaFechamentoFatura"] input').type('23');

    cy.get('app-caixa-financeiro ion-button[type="submit"]')
      .should('contain', 'Salvar')
      .click();

    cy.wait(200);

    cy.get('app-inicio .item-caixa').should('have.length', 2);
    cy.get('app-inicio .item-caixa:eq(1) h2 b').should('have.text', 'Mastercard Santander');
  });
});
