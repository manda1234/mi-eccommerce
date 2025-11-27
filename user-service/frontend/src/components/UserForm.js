import React, { useState } from 'react'

const UserForm = ({ onAddUser }) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: '' })
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const response = await fetch('http://localhost:4000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!response.ok) {
      setErrors(data.errors)
      return
    }

    onAddUser(data)
    setFormData({ name: '', email: '', role: '' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <div className="invalid-feedback">{errors.name}</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <div className="invalid-feedback">{errors.email}</div>
      </div>

      <div className="mb-3">
        <label className="form-label">Role</label>
        <input
          type="text"
          className={`form-control ${errors.role ? 'is-invalid' : ''}`}
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
        <div className="invalid-feedback">{errors.role}</div>
      </div>

      <button type="submit" className="btn btn-primary w-100">Add User</button>
    </form>
  )
}

export default UserForm
