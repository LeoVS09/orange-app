// cypress currently not support fetch,
// which need for wait graphql requests
// use fetch polyfill to fix this behavior
// https://github.com/cypress-io/cypress/issues/1053
//
// code based on cypress example 
// https://github.com/cypress-io/cypress-example-recipes/blob/master/examples/stubbing-spying__window-fetch/cypress/integration/polyfill-fetch-from-tests-spec.js
const fetchPolfill = {
    polyfillUrl: 'https://unpkg.com/unfetch/dist/unfetch.umd.js',
    
    polyfill: null,
  
    // run before all tests
    // grab fetch polyfill from remote URL, could be also from a local package
    async loadPolyfill() {
      const response = await cy.request(this.polyfillUrl)
      this.polyfill = response.body
    },
  
    // use cy.visit({onBeforeLoad: ...}) to delete native fetch and load polyfill code instead
    onBeforeLoad(win) {
      delete win.fetch
      // since the application code does not ship with a polyfill
      // load a polyfilled "fetch" from the test
      win.eval(this.polyfill)
      win.fetch = win.unfetch
    },
  
    get visitOptions() {
      return { onBeforeLoad: this.onBeforeLoad.bind(this)}
    }
  }

module.exports = {
    fetchPolfill
}