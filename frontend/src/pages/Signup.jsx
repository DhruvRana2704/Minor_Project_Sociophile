import React from 'react';
import { useNavigate } from 'react-router-dom';
function Signup() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const API = import.meta.env.VITE_API_URL;
    const response =await fetch(`${API}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // include cookies for session
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if(responseData.success===true){
      navigate(responseData.redirectUrl)
    }
    else{
      alert(responseData.error || "Registration failed");
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
        <h2 className="fw-bold mb-4" style={{fontSize:'2em', color: '#e1306c'}}>Sign Up for Urban Wave</h2>
        <form onSubmit={handleSubmit}>
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
      <footer className="mt-5 text-white-50">&copy; 2025 Urban Wave. Inspired by Instagram.</footer>
    </div>
  );
}

export default Signup;
