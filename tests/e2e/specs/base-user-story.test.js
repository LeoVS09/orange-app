const { fetchPolfill } = require('../support/fetchPolyfill')

describe('Base User Story', () => {
    before(async () => {
        await fetchPolfill.loadPolyfill()
    })

    it('Go to problem page from main', () => {
        cy.server()
        cy.route({
            url: '/graphql',
            method: 'POST'
        }).as('graphql')

        cy.visit('/', fetchPolfill.visitOptions)
        cy.waitGql('Problems')
        cy.contains('h1', 'Problems')
        cy.get('.problems-list').should('be.visible')
        cy.wait(2000)
        cy.get('.problems-list .list-item').its('length').should('be.gte', 9)
        cy.get('.problems-list .list-item').should($div => {
            const text = $div.text()
            expect(text.length > 0).to.have.true
        })

        // Go to Problem page
        cy.get('.problems-list .list-item').last().then($elem => {
            const problemName = $elem.find('.list-item--property:first-child').text()
            cy.wrap($elem).click()
            cy.url().should('contain', 'problems')

            // Existed data displayed
            cy.get('.page-header--content h1').should('contain', problemName)

            // Additional data asked
            cy.waitGql('Problem')

            // tests asked
            cy.waitGql('Problem')
                .then(({ data: { problem } }) => {
                    const publicTests = problem.tests.nodes.filter(t => t.public)
                    cy.get('.page-section.text-width').should('contain', problem.description)

                    cy.wait(1500)

                    // check limits
                    cy.get('.problem--limits .data-view--value').each(($item, i) => {
                        cy.wrap($item.get(0)).should('be.not.empty')

                        // check input type
                        if(i === 2) {
                            cy.wrap($item.get(0)).should('contain', problem.inputType.name)
                        }

                        // check output type
                        if(i === 3) {
                            cy.wrap($item.get(0)).should('contain', problem.outputType.name)
                        }
                    })

                    // check tests
                    cy.get('.source-view--code').its('length').should('be.eq', publicTests.length * 2)
                    cy.get('.source-view--code').each(($item, i) => {
                        const test = publicTests[Math.trunc(i / 2)]
                        cy.wrap($item.get(0)).should('contain', i % 2 === 0 ? test.input : test.output)
                    })
                })
        })
    })


    it('Login', () => {
        cy.server()
        cy.route({
            url: '/graphql',
            method: 'POST'
        }).as('graphql')

        cy.login('admin', 'password', fetchPolfill.visitOptions)

        cy.waitGql('Login')
            .then(({ data: { login } }) => {
                const name = login.user.profiles.nodes[0].firstName
                
                cy.get('.top-bar--profile-text').should('contain', name)
            })
    })
})