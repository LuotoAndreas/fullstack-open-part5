import React, { useState } from 'react'
import PropTypes from 'prop-types'

const AddBlogForm = ({ createBlog }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    url: '',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(formData)

    setFormData({
      title: '',
      author: '',
      url: '',
    })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="blogFormTitle"
            type="text"
            value={formData.title}
            name="title"
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          author:
          <input
            id="blogFormAuthor"
            type="text"
            value={formData.author}
            name="author"
            onChange={handleInputChange}
          />
        </div>
        <div>
          url:
          <input
            id="blogFormUrl"
            type="url"
            value={formData.url}
            name="url"
            onChange={handleInputChange}
          />
        </div>
        <button id="blogFormCreate" type="submit">
          Create
        </button>
      </form>
    </div>
  )
}

AddBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default AddBlogForm