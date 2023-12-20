describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('')
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Testi Luoto',
      username: 'Tandy',
      password: 'salasanaTESTI'
    }
    const user2 = {
      name: 'Testi Luoto2',
      username: 'Tandy2',
      password: 'salasanaTESTI2'
    }
    const user3 = {
      name: 'Testi Luoto3',
      username: 'Tandy3',
      password: 'salasanaTESTI3'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user3)
  })

  it('login form is shown', function() {
    cy.contains('log in').click()
  })
  describe('Login',function() {

    it('user can login', function () {
      cy.contains('log in').click()
      cy.get('#username').type('Tandy')
      cy.get('#password').type('salasanaTESTI')
      cy.get('#login-button').click()

      cy.contains('Testi Luoto logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('Tandy')
      cy.get('#password').type('salasanaWRONG')
      cy.get('#login-button').click()

      cy.contains('Error: Wrong credentials')
    })
  })


  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Tandy', password: 'salasanaTESTI' })
    })

    it('a new blog can be created', function() {
      cy.contains('create a new blog').click()
      cy.get('#blogFormTitle').type('Cypress test blog')
      cy.get('#blogFormAuthor').type('Testi Luoto')
      cy.get('#blogFormUrl').type('http://url.com')
      cy.contains('Create').click()

      cy.contains('Cypress test blog Testi Luoto')
    })
  })

  describe('when a new blog is created', function() {
    beforeEach(function() {
      cy.login({ username: 'Tandy', password: 'salasanaTESTI' })
      cy.createBlog({
        title: 'Cypress test blog',
        author: 'Testi Luoto',
        url: 'http://url.com'
      })
    })

    it('blog gets liked', function() {
      cy.contains('View').click()
      cy.contains('like').click()
      cy.contains('Likes: 1')
    })

    it('blog can be deleted by user', function() {
      cy.contains('View').click()
      cy.contains('remove').click()
      cy.contains('Blog removed succesfully!')
      cy.get('html').should('not.contain', 'Cypress test blog')
    })

    it('only the creator can see the remove button', function() {
      cy.contains('logout').click()
      cy.contains('log in').click()
      cy.login({ username: 'Tandy2', password: 'salasanaTESTI2' })
      cy.contains('View').click()
      cy.contains('remove').should('not.exist')
    })

    it.only('blog with most likes is at top', function () {
      cy.contains('create a new blog').click()
      cy.get('#blogFormTitle').type('Blog with more Likes than Cypress blog')
      cy.get('#blogFormAuthor').type('Testi Luoto')
      cy.get('#blogFormUrl').type('http://url.com')
      cy.contains('Create').click()

      cy.contains('Blog with more Likes than Cypress blog | Testi Luoto').contains('View').click()
      cy.contains('like').click()

      cy.get('.blog').eq(0).should('contain', 'Blog with more Likes than Cypress blog')
      cy.get('.blog').eq(1).should('contain', 'Cypress test blog')
    })
  })
})