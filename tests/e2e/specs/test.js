// https://docs.cypress.io/api/introduction/api.html

describe('Main page', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Problems')
    cy.get('.problems-list').should('be.visible')
    // TODO: wait until requests is end
    cy.wait(3000)
    cy.get('.problems-list .list-item').its('length').should('be.gte', 9)
    cy.get('.problems-list .list-item').should($div => {
      const text = $div.text()
      expect(text.length > 0).to.have.true
    })
  })
})


describe('Base UseCase', () => {
  it('Go to problem', () => {
    cy.visit('/')
    cy.contains('h1', 'Problems')
    cy.get('.problems-list').should('be.visible')
    cy.wait(3000)
    cy.get('.problems-list .list-item').its('length').should('be.gte', 9)
    cy.get('.problems-list .list-item').should($div => {
      const text = $div.text()
      expect(text.length > 0).to.have.true
    })
    cy.get('.problems-list .list-item').last().click()
    cy.url().should('contain', 'problems')
    cy.get('.problem').should('contain', 'Examples')
  })
})