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

  it('Show country', () => {
    cy.server()
    cy.route({
      url: '/graphql',
      method: 'POST'
    }).as('graphql')

    cy.visit('/countries/xB2Ox5aDV', fetchPolfill.visitOptions)
    cy.waitGql('Country')
      .then(({ data: { country }}) => {
        cy.contains('h1', country.name)
        cy.contains(country.code)
        cy.get('.list').should('be.visible')

        // wait for animation
        cy.wait(2000)
        
        cy.get('.list .list-item')
          .each(($item, i) => {
            cy.wrap($item.get(0))
              .find('.list-item--property:first-child')
              .should('have.text', country.cities.nodes[i].name)

          })

      })
  })
  
  it('Show city', () => {
    cy.server()
    cy.route({
      url: '/graphql',
      method: 'POST'
    }).as('graphql')

    cy.visit('/cities/xB2Ox5aDV', fetchPolfill.visitOptions)
    cy.waitGql('City')
      .then(({ data: { city }}) => {
        cy.contains('h1', city.name)
        cy.get('.list').should('be.visible')

        // wait for animation
        cy.wait(2000)
        
        cy.get('.list .list-item')
          .each(($item, i) => {
            cy.wrap($item.get(0))
              .find('.list-item--property:first-child')
              .should('have.text', city.universities.nodes[i].longName)

          })

      })
  })

  it('Show university', () => {
    cy.server()
    cy.route({
      url: '/graphql',
      method: 'POST'
    }).as('graphql')

    cy.visit('/universities/xB2Ox5aDV', fetchPolfill.visitOptions)
    cy.waitGql('University')
      .then(({ data: { university }}) => {
        cy.contains('h1', university.shortName)
        cy.contains(university.longName)
      })
  })

  it('Go by path: countries > country > city > university', () => {
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
        cy.get('.list .list-item').last().then($country => {
          const countryName = $country.find('.list-item--property:first-child').text()
          const countryCode = $country.find('.list-item--property:nth-child(2)').text()
          cy.wrap($country).click()
          cy.url().should('contain', 'countries')

          cy.contains(countryName)

          cy.waitGql('Country')
            .then(({ data: { country }}) => {
              cy.contains(countryCode)
              cy.get('.list').should('be.visible')

              // wait for animation
              cy.wait(2000)
              
              cy.get('.list .list-item')
                .each(($item, i) => {
                  cy.wrap($item.get(0))
                    .find('.list-item--property:first-child')
                    .should('have.text', country.cities.nodes[i].name)

                })

                cy.get('.list .list-item').last().then($city => {
                  const cityName = $city.find('.list-item--property:first-child').text()
                  cy.wrap($city).click()
                  cy.url().should('contain', 'cities')

                  cy.contains(cityName)

                  cy.waitGql('City')
                    .then(({ data: { city }}) => {
                      cy.get('.list').should('be.visible')

                      // wait for animation
                      cy.wait(2000)
                      
                      cy.get('.list .list-item')
                        .each(($item, i) => {
                          cy.wrap($item.get(0))
                            .find('.list-item--property:first-child')
                            .should('have.text', city.universities.nodes[i].longName)

                        })

                        cy.get('.list .list-item').last().then($university => {
                          const universityName = $university.find('.list-item--property:first-child').text()
                          const universityShortName = $university.find('.list-item--property:nth-child(2)').text()
                          cy.wrap($university).click()                      
                          cy.url().should('contain', 'universities')

                          cy.contains(universityName)
                          cy.contains(universityShortName)

                          cy.waitGql('University')

                        })

                    })
                })

            })
        })

      })
  })
})