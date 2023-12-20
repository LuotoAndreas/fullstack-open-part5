import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  const fetchBlogs = async () => {
    try {
      const fetchedBlogs = await blogService.getAll()
      setBlogs(fetchedBlogs)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes)

  const addLikes = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      fetchBlogs()
      console.log('Updated Blog:', updatedBlog)
      setBlogs(blogs.map(blog => (blog.id === id ? updatedBlog : blog)))
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  const deleteBlog = async (id, title, author) => {
    try {
      const blogToDelete = blogs.find(blog => blog.id === id)

      if (blogToDelete.user.username === user.username) {
        if (window.confirm(`Remove blog "${title}" by ${author}?`)) {
          await blogService.remove(id)
          setBlogs(blogs.filter(blog => blog.id !== id))
          fetchBlogs()
          setErrorMessage('Blog removed succesfully!')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
      } else {
        setErrorMessage('Error: unauthorized deletion')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      fetchBlogs()
    } catch (exception) {
      setErrorMessage('Error: Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs([...blogs, returnedBlog])
        fetchBlogs()
        setErrorMessage(`A new blog "${blogObject.title}" by ${blogObject.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch((error) => {
        console.error('Failed to add a new blog', error)
        setErrorMessage('Error: Failed to add a new blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }


  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />

        {!user && loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create a new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <ul>
        {sortedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLikes={addLikes}
            deleteBlog={() => deleteBlog(blog.id, blog.title, blog.author)} user = {user} />
        ))}
      </ul>
    </div>
  )
}

export default App
