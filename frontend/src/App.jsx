import './App.css';

function App() {
  return (
    <div className="instagram-home gradient-bg min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent w-100 mb-5">
        <div className="container-fluid justify-content-center">
          {/* <span className="navbar-brand mb-0 h1 display-4 fw-bold text-white">Urban Wave</span> */}
        </div>
      </nav>
      <div className="card shadow-lg p-4 rounded-4 instagram-card text-center" style={{maxWidth: 400, background: 'rgba(255,255,255,0.95)'}}>
        {/* <img src="https://img.icons8.com/fluency/96/instagram-new.png" alt="Urban Wave Logo" className="mb-3" style={{width: 80}} /> */}
        <h2 className="fw-bold mb-4" style={{fontSize:'2em', color: '#e1306c'}}>Log in to Urban Wave</h2>
        <form>
          <div className="mb-3 text-start">
            <label htmlFor="inputUsername" className="form-label fw-semibold">Username</label>
            <input type="text" className="form-control rounded-pill" id="inputUsername" placeholder="Enter your username" />
          </div>
          <div className="mb-3 text-start">
            <label htmlFor="inputPassword" className="form-label fw-semibold">Password</label>
            <input type="password" className="form-control rounded-pill" id="inputPassword" placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn btn-gradient-pink text-white fw-bold rounded-pill w-100 mb-3">Log In</button>
        </form>
        <div className="mt-2">
          <span className="text-secondary">Don't have an account? </span>
          <a href="#" className="fw-bold" style={{color: '#e1306c', textDecoration: 'underline'}}>Sign up</a>
        </div>
      </div>
      <footer className="mt-5 text-white-50">&copy; 2025 Urban Wave. Inspired by Instagram.</footer>
    </div>
  );
}

export default App;
