/* eslint-disable no-undef */
describe('Basic Test', () => {
  it('contains name', () => {
    cy.visit('https://turquoise-mapworkshop.herokuapp.com')

    cy.contains('MapWorkshop')
  })
})

describe('Second Basic Test', () => {
  it('register link works', () => {
    cy.visit('https://turquoise-mapworkshop.herokuapp.com')

    cy.contains('Register').click()

    cy.url().should('include', '/register')
  })
})