import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import BottomMenu from '../components/BottomMenu';

const UserProfile = () => {
      const { username } = useParams();
      const API = import.meta.env.VITE_API_URL;
      const [user,setUser]=useState(null);
      useEffect(() => {
        async function fetchuser() {
          const response = await fetch(`${API}/users/profile/${username}`);
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        }
        fetchuser();
      }, []);


  const [showNotFound, setShowNotFound] = useState(false);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        setShowNotFound(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  if (showNotFound) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <h3>Time Out</h3>
      </div>
    );
  }

  // show loading spinner before 5 sec
  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <h4>Loading user...</h4>
      </div>
    );
  }


    return (
    <div className="instagram-home min-vh-100 d-flex flex-column align-items-center justify-content-center" 
         style={{width:'100vw', maxWidth:'100vw', overflowX:'hidden', paddingBottom:'90px'}}>
      <div className="container-fluid py-5 d-flex flex-column align-items-center justify-content-center">
        {/* Profile Info Card */}
        <div className="card p-4 mb-4 text-center instagram-card" style={{maxWidth:400, width:'100%'}}>
          <h2 className="font fw-bold mb-1">{user.fullName}</h2>
          <img src={user.avatar?`${user.avatar}`:"https://randomuser.me/api/portraits/men/32.jpg"} style={{objectFit:'cover'}} alt={user.fullName} className="rounded-circle mb-3 mx-auto" width="100" height="100" />
          <div className="text-secondary mb-2">@{username}</div>
           <p className="mb-2" style={{whiteSpace:'break-spaces'}}>{user.bio ? user.bio : "Bio for " + user.username.toUpperCase()}</p>
        </div>

        {/* Posts and Reels Grid */}
        <div className="row w-100" style={{maxWidth:900}}>
          {/* Posts Section */}
          {/* <div className="col-md-6 mb-4">
            <div className="mb-3 text-center">
              <img src="https://img.icons8.com/color/48/gallery.png" alt="Posts" width="36" height="36" />
            </div>
            {user.posts.length === 0 ? (
              <div className="text-secondary mb-4 text-center">No posts yet.</div>
            ) : (
              <div className="row row-cols-1 row-cols-md-3 g-3">
                {user.posts.map(post => (
                  <div key={post.id} className="col">
                    <div className="card shadow-sm instagram-card h-100">
                      <img 
                        src={post.image} 
                        className="card-img-top" 
                        alt={post.caption}
                        style={{maxHeight:180, objectFit:'cover'}}
                      />
                      <div className="card-body p-2">
                        <p className="card-text mb-0 small">{post.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div> */}

          {/* Reels Section */}
          {/* <div className="col-md-6 mb-4">
            <div className="mb-3 text-center">
              <img src="https://img.icons8.com/fluency/48/video-playlist.png" alt="Reels" width="36" height="36" />
            </div>
            {user.reels.length === 0 ? (
              <div className="text-secondary mb-4 text-center">No reels yet.</div>
            ) : (
              <div className="row row-cols-1 row-cols-md-3 g-3">
                {user.reels.map(reel => (
                  <div key={reel.id} className="col">
                    <div className="card shadow-sm instagram-card h-100">
                      <video 
                        className="w-100 rounded-3" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        controls={false}
                        style={{maxHeight:180, objectFit:'cover', background:'#000'}}
                      >
                        <source src={reel.video} type="video/mp4" />
                      </video>
                      <div className="card-body p-2">
                        <p className="card-text mb-0 small">{reel.description}</p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div> */}
        </div>
      </div>

            <BottomMenu></BottomMenu>
    </div>
  );
}

export default UserProfile;