import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { token, user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setFormData({
        name: response.data.user.name || '',
        phone: response.data.user.phone || '',
        address: {
          street: response.data.user.address?.street || '',
          city: response.data.user.address?.city || '',
          state: response.data.user.address?.state || '',
          zipCode: response.data.user.address?.zipCode || '',
          country: response.data.user.address?.country || ''
        }
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put('http://localhost:5000/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Profile</h1>
        {!editing && (
          <button onClick={() => setEditing(true)} className="auth-btn" style={{ width: 'auto', padding: '0.5rem 1.5rem' }}>
            Edit Profile
          </button>
        )}
      </div>

      {!editing ? (
        <div style={{ background: 'white', borderRadius: '10px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: '#666', fontSize: '0.9rem' }}>Full Name</label>
              <p style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{user?.name}</p>
            </div>
            <div>
              <label style={{ color: '#666', fontSize: '0.9rem' }}>Email Address</label>
              <p style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{user?.email}</p>
            </div>
            <div>
              <label style={{ color: '#666', fontSize: '0.9rem' }}>Phone Number</label>
              <p style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <label style={{ color: '#666', fontSize: '0.9rem' }}>Role</label>
              <p style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  backgroundColor: user?.role === 'admin' ? '#f44336' : '#4caf50',
                  color: 'white'
                }}>
                  {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </p>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Shipping Address</h3>
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ color: '#666', fontSize: '0.9rem' }}>Street</label>
                <p>{user?.address?.street || 'Not provided'}</p>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '0.9rem' }}>City</label>
                <p>{user?.address?.city || 'Not provided'}</p>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '0.9rem' }}>State</label>
                <p>{user?.address?.state || 'Not provided'}</p>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '0.9rem' }}>ZIP Code</label>
                <p>{user?.address?.zipCode || 'Not provided'}</p>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '0.9rem' }}>Country</label>
                <p>{user?.address?.country || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
            <p><strong>Member since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
            {user?.lastLogin && <p><strong>Last login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '10px', padding: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" />
          </div>

          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Shipping Address</h3>

          <div className="form-group">
            <label>Street Address</label>
            <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>ZIP Code</label>
              <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="address.country" value={formData.address.country} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setEditing(false)} style={{ padding: '0.75rem 1.5rem', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;