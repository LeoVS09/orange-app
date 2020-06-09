const { fetchPolfill } = require('../support/fetchPolyfill')

describe('Problems', () => {
    before(async () => {
        await fetchPolfill.loadPolyfill()
    })

    it('Open problem page by direct link', () => {
        cy.server()
        cy.route({
            url: '/graphql',
            method: 'POST'
        }).as('graphql')

        cy.visit('/problems/xB2Ox5aDV', fetchPolfill.visitOptions)

        // base data asked
        cy.waitGql('Problem')

        // tests asked
        cy.waitGql('Problem').then(({ data: { problem }}) => {
            cy.contains(problem.name)
            cy.contains(problem.description)

            const expectedTests = problem.tests.nodes.filter(({ public }) => public)
            for(const test of expectedTests) {
                cy.contains(test.input)
                cy.contains(test.output)
            }
        })
    })

    it('Open problem page as teacher', () => {
        cy.server()
        cy.route({
            url: '/graphql',
            method: 'POST'
        }).as('graphql')

        cy.setCurrentUserAsTeacher()

        cy.visit('/problems/xB2Ox5aDV', fetchPolfill.visitOptions)

        // base data asked
        cy.waitGql('Problem')

        // tests asked
        cy.waitGql('Problem').then(({ data: { problem }}) => {
            cy.get('.page-header--input').should('have.value', problem.name)
            cy.get('textarea').should('have.value', problem.description)
            
            const tests = problem.tests.nodes
            cy.get('.source-view textarea').each(($item, i) => {
                cy.wrap($item.get(0))
                .should('have.value', tests[Math.floor(i / 2)][i % 2 !== 0 ? 'output': 'input'])
            })
        })
    })
})