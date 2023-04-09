describe('My First Test', () => {
  it('finds the content "type"', () => {
    cy.visit('https://mapworkshop2.herokuapp.com')

    cy.contains('count')

    cy.url().should('include', 'mapworkshop')
  })
})