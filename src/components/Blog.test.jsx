import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog Component', () => {

  const blog = {
    title: 'Sample Blog',
    author: 'Andreas Luoto',
    url: 'https://example.com',
    likes: 5,
  }

  test('renders blog title', () => {

    render(<Blog blog={blog} />)
    const titleElement = screen.getByText(blog.title, { selector: 'b' })
    expect(titleElement).toBeInTheDocument()
  })

  test('shows details when View button is pressed', async () => {

    const user = userEvent.setup()
    const { container } = render(<Blog blog={blog} />)

    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    const likes = container.querySelector('likes')
    const url = container.querySelector('url')
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('like button is pressed twice calls event handler twice', async () => {
    const mockHandler = jest.fn()

    render(<Blog blog={blog} addLikes={mockHandler} />)

    const viewButton = screen.getByText('View')
    await userEvent.click(viewButton)

    const likeButton = screen.getByText('like')
    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})