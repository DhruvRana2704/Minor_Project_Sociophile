import React from 'react'
import {  useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'
const BottomMenu = () => {
  return (
    <div className='bottom-menu'>
        {/* Bottom Menu Bar */}
      <div className="bottom-menu-bar">
        <Link to="/home" className="btn btn-link text-decoration-none text-dark d-flex flex-column align-items-center " title="Home">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 12L12 4l9 8" stroke="#e1306c" strokeWidth="2" /><path d="M5 10v10h14V10" stroke="#e1306c" strokeWidth="2" /></svg>
          <span style={{ fontSize: '0.8em' }}>Home</span>
        </Link>
        <Link to="/explore" className="btn btn-link text-decoration-none text-dark d-flex flex-column align-items-center" title="Explore">
          <img src='https://img.icons8.com/search.png' height={'22'} alt="Explore" />
          <span style={{ fontSize: '0.8em' }}>Explore</span>
        </Link>
        <Link to="/create" className="btn btn-link text-decoration-none text-dark d-flex flex-column align-items-center" title="Create">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#e1306c" strokeWidth="2" />
            <path d="M12 8v8M8 12h8" stroke="#e1306c" strokeWidth="2" />
          </svg>
          <span style={{ fontSize: '0.8em' }}>Create</span>
        </Link>
        <Link to={`/profile`} className="btn btn-link text-decoration-none text-dark d-flex flex-column align-items-center" title="Profile">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#e1306c" strokeWidth="2" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#e1306c" strokeWidth="2" /></svg>
          <span style={{ fontSize: '0.8em' }}>Profile</span>
        </Link>
        

      </div>
    </div>
  )
}

export default BottomMenu