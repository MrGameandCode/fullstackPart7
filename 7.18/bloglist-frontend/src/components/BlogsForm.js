import { useState } from 'react';
/*
Just a friendly reminder to myself added for exercise 5.6:
    - We create a function on App that we pass here (On App it's called 'createNewBlog', here 'onSubmit')
    - Then, on the onSudmit event, we call the 'onSubmit' function we passed before, with the parameter it needs :)
*/
const BlogsForm = ({ onSubmit }) => {
  const [blogname, setBlogname] = useState('');
  const [blogauthor, setBlogauthor] = useState('');
  const [blogurl, setBlogurl] = useState('');

  const createNewBlog = async (event) => {
    event.preventDefault();
    const blog = {
      title: blogname,
      author: blogauthor,
      url: blogurl,
    };
    setBlogname('');
    setBlogauthor('');
    setBlogurl('');
    onSubmit(blog);
  };

  return (
    <div>
      <form onSubmit={createNewBlog}>
        <div>
          title:
          <input type="text" value={blogname} name="Blogname" onChange={({ target }) => setBlogname(target.value)} />
        </div>
        <div>
          author:
          <input
            type="text"
            value={blogauthor}
            name="Blogauthor"
            onChange={({ target }) => setBlogauthor(target.value)}
          />
        </div>
        <div>
          url:
          <input type="text" value={blogurl} name="Blogurl" onChange={({ target }) => setBlogurl(target.value)} />
        </div>
        <button type="submit" id="createBlog">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogsForm;
