// https://docs.cypress.io/api/introduction/api.html
const {fetchPolfill} = require('../support/fetchPolyfill')

describe('Main page', () => {
  before(async () => {
    await fetchPolfill.loadPolyfill()
  })

  beforeEach(() => {
    cy.server()
    cy.route({ 
      url: '/graphql',
      method: 'POST'
    }).as('graphql')
  })

  it('Display list of problems', () => {
    cy.visit('/', fetchPolfill.visitOptions)
    cy.waitGql('Problems')
      .then(({ data: { problems } }) => {
        cy.contains('h1', 'Problems')
        cy.get('.problems-list').should('be.visible')
    
        // wait for animation
        cy.wait(1500)
        cy.get('.problems-list .list-item').its('length').should('be.gte', 9)
        
        cy.get('.problems-list .list-item')
        .each(($item, i) => {
          cy.wrap($item.get(0))
            .find('.list-item--property:first-child')
            .should('have.text', problems.nodes[i].name)
        })
      })
  })
})


describe('Simple user', () => {
  before(async () => {
    await fetchPolfill.loadPolyfill()
  })

  beforeEach(() => {
    cy.server()
    cy.route({ 
      url: '/graphql',
      method: 'POST'
    }).as('graphql')
  })

  it('Go to problem page from main', () => {
    cy.visit('/', fetchPolfill.visitOptions)
    cy.waitGql('Problems')
    cy.contains('h1', 'Problems')
    cy.get('.problems-list').should('be.visible')
    cy.wait(1500)
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