import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Update = () => {
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar: ''
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.BASE_URL}/users/profile`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            username: data.user.username || '',
            bio: data.user.bio || '',
            avatar: data.user.avatar || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('bio', formData.bio);
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }
      const response = await fetch(`${process.env.BASE_URL}/users/update`, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      });
      console.log(await response.json());
      if (!response.ok) {
        throw new Error('Update failed');
      }

      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-vh-100 d-flex flex-column align-items-center pt-4">
      <div className="card shadow-lg p-4 rounded-4 instagram-card" 
           style={{maxWidth: 500, width: '90%', background: 'rgba(255,255,255,0.95)'}}>
        <h2 className="text-center mb-4 font" style={{ color: '#e1306c', letterSpacing: '1px' }}>
          Update Profile
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Avatar Preview */}
          <div className="text-center mb-4">
            <div className="position-relative d-inline-block">
              <img
                src={formData.avatar instanceof File ? preview : `${process.env.BASE_URL}${formData.avatar}`}
                alt="Profile Preview"
                name='avatar'
                className="rounded-circle"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <label className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="d-none"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            </div>
          </div>

          {/* Username Input */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              className="form-control rounded-pill"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Enter username"
            />
          </div>

          {/* Bio Input */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Bio</label>
            <textarea
              className="form-control rounded-3"
              rows="3"
              name="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Tell us about yourself"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="btn btn-gradient-pink text-white fw-bold rounded-pill w-100"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update;