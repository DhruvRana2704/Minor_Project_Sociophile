
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import Explore from './pages/Explore.jsx';
import UserProfile from './pages/UserProfile.jsx';
import CreatePost from './pages/CreatePost.jsx';
import Logout from './pages/Logout.jsx';
import Update from './pages/Update.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/UserProfile/:username" element={<UserProfile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/update" element={<Update />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
