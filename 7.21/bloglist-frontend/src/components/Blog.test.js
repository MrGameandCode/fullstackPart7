/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/render-result-naming-convention */
/* eslint-disable testing-library/no-debugging-utils */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-render-in-setup */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import Blog from './Blog';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Blog cases', () => {
  let container;

  /*const setup = () => {
    const blog = {
      _id:'1dbl0g',
      title:'How to create an awesome blog',
      url:'https://www.easyblog.com',
      likes:513,
      author:'Totally not a scam',
      user:{
        id:'t0t4llyN0rm4l1d'
      }
    }
    render(
      <Blog key={blog._id} blog={blog}/>
    )
  }*/

  beforeEach(() => {
    //container = setup().container
    const blog = {
      _id: '1dbl0g',
      title: 'How to create an awesome blog',
      url: 'https://www.easyblog.com',
      likes: 513,
      author: 'Totally not a scam',
      user: {
        id: 't0t4llyN0rm4l1d',
      },
    };

    container = render(<Router><Blog key={blog._id} blog={blog} /></Router>).container;
  });

  test('renders names', async () => {
    //screen.debug(container)
    const divName = container.querySelector('.blogName');
    expect(divName).toBeVisible();
  });

});
describe('Blog cases with mocks', () => {
  //OUTDATED TEST
  /*test('click the view button twice', async () => {
    const mockHandler = jest.fn();
    const blog = {
      _id: '1dbl0g',
      title: 'How to create an awesome blog',
      url: 'https://www.easyblog.com',
      likes: 513,
      author: 'Totally not a scam',
      user: {
        id: 't0t4llyN0rm4l1d',
      },
    };
    const component = render(<Blog key={blog._id} blog={blog} updateLikes={mockHandler} />);
    const button = component.getByText('Like');
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });*/
});
