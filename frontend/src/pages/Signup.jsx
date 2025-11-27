import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchWithLoader from '../hooks/useFetchWithLoader';

function Signup() {
  const navigate = useNavigate();
  const fetchWithLoader = useFetchWithLoader({ delayMs: 200 });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setAvatarFile(null);
      setPreview(null);
      return;
    }
    // show preview
    const url = URL.createObjectURL(file);
    setAvatarFile(file);
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const API = import.meta.env.VITE_API_URL;

    try {
      const response = await fetchWithLoader(`${API}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // include cookies for session
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData.success === true) {
        // if user selected an avatar, upload it immediately using the update endpoint
        if (avatarFile) {
          try {
            const fd = new FormData();
            fd.append('avatar', avatarFile);
            // update route requires authentication; register auto-logs-in the user
            const up = await fetchWithLoader(`${API}/users/update`, {
              method: 'POST',
              credentials: 'include',
              body: fd,
            });
            const upData = await up.json();
            // ignore errors but log
            if (!up.ok) console.warn('Avatar upload failed', upData);
          } catch (err) {
            console.error('Avatar upload error:', err);
          }
        }

        navigate(responseData.redirectUrl);
      } else {
        alert(responseData.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Network or server error during registration');
    }
  };
  return (
    <div className="instagram-home gradient-bg min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent w-100 mb-5">
        <div className="container-fluid justify-content-center">
          {/* <span className="navbar-brand mb-0 h1 display-4 fw-bold text-white">Urban Wave</span> */}
        </div>
      </nav>
      <div className="card shadow-lg p-4 rounded-4 instagram-card text-center" style={{maxWidth: 400, background: 'rgba(255,255,255,0.95)'}}>
        <h2 className="fw-bold mb-4" style={{fontSize:'2em', color: '#e1306c'}}>Sign Up for Sociophile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-center">
            <label className="form-label fw-semibold">Profile Photo (optional)</label>
            <div className="d-flex flex-column align-items-center">
              <div style={{ width: 96, height: 96, borderRadius: '50%', overflow: 'hidden', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                {preview ? (
                  <img src={preview} alt="avatar preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#bbb' }}>No photo</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="signupFullName" className="form-label fw-semibold">Full Name</label>
            <input name="fullName" type="text" className="form-control rounded-pill" id="signupFullName" placeholder="Your Name" required/>
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="signupUsername" className="form-label fw-semibold">Username</label>
            <input name="username" type="text" className="form-control rounded-pill" id="signupUsername" placeholder="Choose a username" required />
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="signupEmail" className="form-label fw-semibold">Email</label>
            <input name="email" type="email" className="form-control rounded-pill" id="signupEmail" placeholder="Enter your email" required/>
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="signupPassword" className="form-label fw-semibold">Password</label>
            <input name="password" type="password" className="form-control rounded-pill" id="signupPassword" placeholder="Create a password" required/>
          </div>
          <button type="submit" className="btn btn-gradient-pink text-white fw-bold rounded-pill w-100 mb-3">Sign Up</button>
        </form>
        <div className="mt-2">
          <span className="text-secondary">Already have an account? </span>
          <a href="/" className="fw-bold" style={{color: '#e1306c', textDecoration: 'underline'}}>Log in</a>
        </div>
      </div>
      <footer className="mt-5 text-white-50">&copy; 2025 Sociophile. Inspired by Instagram.</footer>
    </div>
  );
}

export default Signup;
