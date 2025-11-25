import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Logout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <div className="card shadow-lg p-4 rounded-4 instagram-card text-center" 
           style={{maxWidth: 400, width: '90%', background: 'rgba(255,255,255,0.95)'}}>
        <h2 className="font mb-4" style={{ color: '#e1306c', letterSpacing: '1px' }}>
          Ready to Leave?
        </h2>
        
        <p className="text-muted mb-4">
          We'll miss you! Are you sure you want to log out?
        </p>

        <div className="d-flex gap-3 justify-content-center">
          <button 
            className="btn btn-gradient-pink text-white fw-bold rounded-pill px-4"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? 'Logging out...' : 'Yes, Log me out'}
          </button>
          
          <Link 
            to="/home" 
            className="btn btn-outline-secondary rounded-pill px-4"
          >
            Cancel
          </Link>
        </div>
      </div>


    </div>
  );
}

export default Logout;