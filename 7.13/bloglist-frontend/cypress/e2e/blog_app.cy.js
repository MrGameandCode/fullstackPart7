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

    it('Blogs are sorted by likes when loaded', function () {
      //We create a new blog
      cy.get('#logout').parent().parent().find('div:nth-child(1) > button:nth-child(1)').click();
      cy.get("[name='Blogname']").type('Cypress test second blog');
      cy.get("[name='Blogauthor']").type('Cypress');
      cy.get("[name='Blogurl']").type('http://www.alternative.cypressblog.com');
      cy.get('#createBlog').click();
      cy.contains('Cypress test second blog by Cypress added');
      //We create another blog
      cy.get('button').eq(0).click();
      cy.get("[name='Blogname']").type('Cypress test other blog');
      cy.get("[name='Blogauthor']").type('Cypress');
      cy.get("[name='Blogurl']").type('http://www.alternative.cypressblog.com');
      cy.get('#createBlog').click();
      cy.contains('Cypress test other blog by Cypress added');
      //Then, we like it to make it first
      cy.get(
        '#root > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div:nth-child(1) > button:nth-child(1)'
      ).click();
      cy.get('button').eq(3).click();
      cy.get('button').eq(4).click();
      cy.contains('Cypress test blog by Cypress updated');
      //And then, we compare the string of the divs. We get the text of the div (and remove the text from the buttons)
      //It comes in a promise, so we check the second likes and then, we use "expect"
      cy.get('.blogLikes')
        .eq(0)
        .invoke('text')
        .then((text) => {
          const firstLikes = text.substring(0, text.indexOf('Like'));
          cy.log(firstLikes);
          cy.get('.blogLikes')
            .eq(1)
            .invoke('text')
            .then((text2) => {
              const secondLikes = text2.substring(0, text2.indexOf('Like'));
              cy.log(secondLikes);
              expect(parseInt(firstLikes)).to.gt(parseInt(secondLikes));
            });
        });
    });
  });
});
