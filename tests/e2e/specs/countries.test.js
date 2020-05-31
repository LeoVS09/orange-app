const { fetchPolfill } = require('../support/fetchPolyfill')

describe('Countries', () => {
  before(async () => {
    await fetchPolfill.loadPolyfill()
  })

  it('Show countries list', () => {
    cy.server()
    cy.route({
      url: '/graphql',
      method: 'POST'
    }).as('graphql')

    cy.visit('/countries', fetchPolfill.visitOptions)
    cy.waitGql('Countries')
      .then(({ data: { countries }}) => {
        cy.contains('h1', 'Countries')
        cy.get('.list').should('be.visible')

        // wait for animation
        cy.wait(2000)
        cy.get('.list .list-item').its('length').should('be.gte', 9)
        
        cy.get('.list .list-item')
          .each(($item, i) => {
            cy.wrap($item.get(0))
              .find('.list-item--property:first-child')
              .should('have.text', countries.nodes[i].name)

          })

      })
  })

  
})