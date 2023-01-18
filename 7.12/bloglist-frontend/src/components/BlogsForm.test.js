import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogsForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm onSubmit={createBlog} />);

  const input = screen.getAllByRole("textbox");
  const sendButton = screen.getByText("create");

  await user.type(input[0], "title Blog");
  await user.type(input[1], "Author of the Blog");
  await user.type(input[2], "URL of the Blog");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  //console.log(createBlog.mock)
  //I used this way instead of createNote.mock.calls[0][0].content because I don't really understand what this really do, sorry :(
  expect(createBlog.mock.lastCall[0].title).toBe("title Blog");
  expect(createBlog.mock.lastCall[0].author).toBe("Author of the Blog");
  expect(createBlog.mock.lastCall[0].url).toBe("URL of the Blog");
});
