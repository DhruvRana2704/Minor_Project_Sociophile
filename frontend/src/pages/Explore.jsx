import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomMenu from '../components/BottomMenu';
import useFetchWithLoader from '../hooks/useFetchWithLoader';
const API = import.meta.env.VITE_API_URL;
// ...existing imports...
function Explore() {
  const fetchWithLoader = useFetchWithLoader({ delayMs: 200 });
  const [following, setFollowing] = useState([]);
  const [username,setUsername]=useState(null);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);

  const handleFollow = async (username) => {
    const response = await fetchWithLoader(`${API}/followers/create_follower`, {
      method: 'POST',
      body: JSON.stringify({ username }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (result.success) {
      setFollowing((prev) => [...prev, username]);
    } else {
      alert(result.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async (username) => {
    const response = await fetchWithLoader(`${API}/followers/remove_follower`, {
      method: 'POST',
      body: JSON.stringify({ username }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    
    if (result.success) {
      setFollowing((prev) => prev.filter((user) => user !== username));
    } else {
      alert(result.message || 'Failed to unfollow user');
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetchWithLoader(`${API}/users/fetchusers`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      setData(data.users);

      // Fetch following list for the logged-in user
      const followingRes = await fetchWithLoader(`${API}/followers/getfollowers`, {
        method: 'GET',
        credentials: 'include'
      });
      const followingData = await followingRes.json();
      setUsername(followingData.username);
      // console.log(followingData.following);
      if (followingData.following) {
      setFollowing(followingData.following.map((u) => {
        
        return u.followingId.username; // Add 'return' here
      }));
      }
    }
    fetchData();
  }, []);


  const filteredUsers = data.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    
  );

  return (
    <div className="instagram-home min-vh-100 d-flex flex-column align-items-center justify-content-center">
      
      <div className="container py-5" style={{ maxWidth: 500 }}>
        <h2 className="fw-bold mb-4 text-center" style={{ color: '#e1306c' }}>Find New Users</h2>
        <div className="mb-4">
          <input
            type="text"
            className="form-control rounded-pill text-center"
            placeholder="Search users by name or username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: '1.1em' }}
          />
        </div>
        <div className="list-group" style={{paddingBottom:'1rem'}}>
          {filteredUsers.map((user) => (
            <div key={user.username} className="list-group-item d-flex align-items-center justify-content-between instagram-card mb-3 p-3">
              <div className="d-flex align-items-center gap-3">
                <img src={user.avatar ? `${user.avatar}` : 'https://randomuser.me/api/portraits/men/32.jpg'} style={{ objectFit: 'cover' }} alt={user.name} className="rounded-circle" width="48" height="48" />
                <div>
                  <Link to={`/UserProfile/${user.username}`}  className="fw-bold text-decoration-none selectable" style={{ cursor:"pointer", color: 'black', fontSize: '1em' }}>{user.fullName}</Link>
                  <div className="text-secondary small selectable">@{user.username}</div>
                  <div className="small selectable">{user.bio}</div>
                </div>
              </div>
              {username!==user.username && (following.includes(user.username) ? (
                <button
                  className="btn btn-sm rounded-pill fw-bold btn-secondary"
                  onClick={() => handleUnfollow(user.username)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="btn btn-sm rounded-pill fw-bold btn-gradient-pink text-white"
                  onClick={() => handleFollow(user.username)}
                >
                  Follow
                </button>
              ))}
            </div>
          ))}
        </div>
        <BottomMenu />
      </div>
    </div>
  );
}

export default Explore;