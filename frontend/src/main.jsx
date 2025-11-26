
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
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingOverlay from './components/LoadingOverlay';
import RouteWrapper from './components/RouteWrapper';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <BrowserRouter>
        <LoadingOverlay />
        <Routes>
          <Route path="/" element={<RouteWrapper Component={Home} />} />
          <Route path="/signup" element={<RouteWrapper Component={Signup} />} />
          <Route path="/login" element={<RouteWrapper Component={Login} />} />
          <Route path="/profile" element={<RouteWrapper Component={Profile} />} />
          <Route path="/UserProfile/:username" element={<RouteWrapper Component={UserProfile} />} />
          <Route path="/explore" element={<RouteWrapper Component={Explore} />} />
          <Route path="/create" element={<RouteWrapper Component={CreatePost} />} />
          <Route path="/logout" element={<RouteWrapper Component={Logout} />} />
          <Route path="/update" element={<RouteWrapper Component={Update} />} />
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  </StrictMode>
);
