import React, { useState } from 'react'

const Blog = ({ blog, deleteBlog, addLikes, user }) => {
  const { title, author, url, likes, user: blogUser } = blog
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  if (likes === null) {
    blog.likes = 0
  }

  const like = () => {
    const updated = {
      title: title,
      author: author,
      url: url,
      likes: likes + 1,
      user: blog.user ? blog.user.id || blog.user : null,
    }
    addLikes(blog.id, updated)
  }

  const remove = () => {
    const { id } = blog
    deleteBlog(id)
  }

  return (
    <li className="blog">
      <div>
        <b>{title}</b> {'|'} {author}
        <button onClick={toggleVisibility}>{visible ? 'Hide' : 'View'}</button>
      </div>

      {visible && (
        <div>
          <small>
            Title: <i> {title} </i>
            <br />
            Author: <i> {author} </i>
            <br />
            Likes: <i> {likes} </i>
            <button onClick={like}>like</button>
            <br />
            Url: <i> {url} </i>
            <br />
          </small>
          {blogUser && (
            <div>
              <small>
                Added by: <i>{blogUser.name}</i>
              </small>
              {user && user.username === blogUser.username && (
                <button onClick={remove}>remove</button>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  )
}

export default Blog
