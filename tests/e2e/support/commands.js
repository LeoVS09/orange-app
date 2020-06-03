// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (login, password, visitOptions) => { 
    Cypress.log({
        name: 'Login',
        displayName: 'login to application',
        message: login
    });

    cy.visit('/signin', visitOptions)
    cy.get('input[type="text"]').type(login)
    cy.get('input[type="password"]').type(password)

    cy.get('.button--submit').click()
})

Cypress.Commands.add('loginAsTeacher', (login, password, visitOptions) => { 
    Cypress.log({
        name: 'Login as teacher',
        displayName: 'set testing token with teacher value',
    });
    localStorage.setItem('testing', 'teacher')
    cy.login(login, password, visitOptions)
})

Cypress.Commands.add('setCurrentUserAsTeacher', () => {
    Cypress.log({
        name: 'Set current user as teacher',
        displayName: 'set testing token with teacher value',
    });
    localStorage.setItem('testing', 'teacher')
    localStorage.setItem('token', 'U2FsdGVkX19ZuRAqYrCH7faVLxPKF4vSYr5PSu14bYg=')
})


// Cypress currently not support graphql
// code based on solution in issue https://github.com/cypress-io/cypress/issues/3083
// Allow wait specific operation in graphql
Cypress.Commands.add('waitGql', (operationName, checkStatus = true) => {
    Cypress.log({
        name: 'GraphQL request',
        displayName: 'Wait for GraphQL request',
    });

    cy
        .wait('@graphql') 
        .then(async ({ response, request }) => {
            Cypress.log({
                name: 'GraphQL request',
                displayName: 'Graphql request was catched',
                message: request.body.operationName,
            })

            if (request.body.operationName !== operationName) {
                return cy.waitGql(operationName);
            }

            const body = await response.body;

            Cypress.log({
                name: 'GraphQL response',
                displayName: `GraphQL ${operationName} response`,
                message: operationName,
                consoleProps: () => ({ Response: body.data }),
            });

            if (checkStatus) {
                expect(body.errors, 'GraphQL response without errors').not.exist;
            }

            return {
                ...response,
                data: body.data,
            };
        });
});