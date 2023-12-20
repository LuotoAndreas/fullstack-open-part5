import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  test('calls the event handler with the right details when a new blog is created', () => {
    const createBlogMock = jest.fn()

    const component = render(<BlogForm createBlog={createBlogMock} />)

    const titleInput = component.container.querySelector('input[name="Title"]')
    const authorInput = component.container.querySelector('input[name="Author"]')
    const urlInput = component.container.querySelector('input[name="url"]')

    fireEvent.change(titleInput, { target: { value: 'Test Blog' } })
    fireEvent.change(authorInput, { target: { value: 'Test Author' } })
    fireEvent.change(urlInput, { target: { value: 'http://test.com' } })

    const submitButton = component.container.querySelector('button[type="submit"]')
    fireEvent.click(submitButton)

    expect(createBlogMock).toHaveBeenCalledWith({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
    })

    createBlogMock.mockClear()
  })
})
