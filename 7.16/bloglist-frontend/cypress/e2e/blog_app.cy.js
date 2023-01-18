/* eslint-disable no-undef */
describe('Blog app', function () {
  beforeEach(function () {
    //cy.request('POST', 'http://localhost:3003/api/testing/reset')
    /*const user = {
            name: 'Cypress',
            username: 'cypress_user',
            password: '1234'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)*/
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('blogs');
    cy.contains('username');
    cy.contains('password');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('cypress_user');
      cy.get('#password').type('1234');
      cy.get('#login').click();
      cy.contains('Cypress logged in');
      cy.get('#logout').click();
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('i_dont_exist');
      cy.get('#password').type('what_is_that?');
      cy.get('#login').click();
      cy.contains('Wrong username or password');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      //cy.request('POST', 'http://localhost:3003/api/testing/reset')
      /*const user = {
                name: 'Cypress',
                username: 'cypress_user',
                password: '1234'
            }
            cy.request('POST', 'http://localhost:3003/api/users/', user)*/
      cy.visit('http://localhost:3000');
      cy.get('#username').type('cypress_user');
      cy.get('#password').type('1234');
      cy.get('#login').click();
      cy.contains('Cypress logged in');
    });

    it('A blog can be created', function () {
      cy.get('#logout').parent().parent().find('div:nth-child(1) > button:nth-child(1)').click();
      //This would also work, but any change on the UI could break it.
      //cy.get('#root > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > button:nth-child(1)').click()
      cy.get("[name='Blogname']").type('Cypress test blog');
      cy.get("[name='Blogauthor']").type('Cypress');
      cy.get("[name='Blogurl']").type('http://www.cypressblog.com');
      cy.get('#createBlog').click();
      cy.contains('Cypress test blog by Cypress added');
      cy.get('#logout').click();
    });

    it('A blog can be liked', function () {
      //This works, but any change on the UI could break it. Can't find a way to click the view blog button :(
      cy.get(
        '#root > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div:nth-child(1) > button:nth-child(1)'
      ).click();
      cy.get('#buttonLike:visible').click();
      cy.contains('Cypress test blog by Cypress updated');
    });

    it('A blog can be deleted', function () {
      //This works, but any change on the UI could break it. Can't find a way to click the view blog button :(
      cy.get(
        '#root > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div:nth-child(1) > button:nth-child(1)'
      ).click();
      cy.get('#buttonDelete:visible').click();
      cy.contains('Cypress test blog deleted');
    });
  });
});
