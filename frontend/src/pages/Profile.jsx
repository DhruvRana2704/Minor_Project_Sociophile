import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import BottomMenu from '../components/BottomMenu';
import gsap from 'gsap';

function Profile() {
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showList, setShowList] = useState(null); // 'followers' or 'following' or null
  const [followerList, setFollowerList] = useState([]); // 'followers' or 'following' or null
  const [followingList, setFollowingList] = useState([]); // 'followers' or 'following' or null
  const listRef = useRef();
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.BASE_URL}/users/profile`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          setError(data.message || 'Failed to fetch profile');
          if (response.status === 401) {
            navigate('/');
          }
        }
      } catch (err) {
        setError('Network error: Failed to fetch profile' + err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFollower = async () => {
      try {
        const response = await fetch(`${process.env.BASE_URL}/followers/getfollowers`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        setFollowers(data.followers || []);
        setFollowing(data.following || []);
      } catch (error) {
        console.error('Error fetching followers:' + error);
      }
    };
    fetchProfile();
    fetchFollower();
  }, [username, navigate]);

  useEffect(() => {
    if (showList && listRef.current) {
      gsap.fromTo(
        listRef.current,
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [showList]);

  useEffect(() => {

    followers.forEach(f => { setFollowerList(prev => [...prev, f]) });
    following.forEach(f => { setFollowingList(prev => [...prev, f]) });

    // You can add any other side effects you want to trigger when followers or following change
  }, [followers, following]);


  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!user) return <div className="text-center mt-5">User not found</div>;

  return (
    <div className="instagram-home min-vh-100 d-flex flex-column align-items-center justify-content-center"
      style={{ overflow: 'hidden', width: '100vw', maxWidth: '100vw', overflowX: 'hidden', paddingBottom: '40px' }}>
      <div className="container-fluid py-5 d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '80vh', width: '100vw', maxWidth: '100vw', overflowX: 'hidden' }}>
        <div className="card p-4 mb-4 text-center instagram-card" style={{ maxWidth: 400, width: '100%', alignItems: "center" }}>
          <h2 className="font fw-bold mb-1">{user.fullName}</h2>
          <img src={`${process.env.BASE_URL}${user.avatar}`} style={{ objectFit: 'cover', height: '200px', width: '200px' }} alt="avatar" className="rounded-circle mb-3" width="100" height="100" />
          <div className="text-secondary mb-2">@{user.username}</div>
          <p className="mb-2" style={{ whiteSpace: 'pre-line' }}>{user.bio}</p>
          <div style={{ display: 'flex', gap: "20px", marginTop: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setShowList(showList === 'followers' ? null : 'followers')}>
              <div>Follower</div>
              <div style={{ color: '#e1306c', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {followers.length}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setShowList(showList === 'following' ? null : 'following')}>
              <div>Following</div>
              <div style={{ color: '#e1306c', fontWeight: 'bold', fontSize: '1.2rem' }}>
                {following.length}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: "20px" }}>
            <Link style={{ height: '30px', padding: '0.5rem', display: 'flex', fontSize: "0.8rem", alignItems: 'center', justifyContent: 'center', backgroundColor: '#e1306c', color: 'white', textDecoration: 'none', borderRadius: '5px' }} to={'/logout'}>Logout</Link>
            <Link style={{ height: '30px', padding: '0.5rem', display: 'flex', fontSize: "0.8rem", alignItems: 'center', justifyContent: 'center', backgroundColor: '#e1306c', color: 'white', textDecoration: 'none', borderRadius: '5px' }} to={'/update'}>Update Avatar</Link>
          </div>
        </div>
        {/* Floating Modal for Followers/Following */}
        {showList && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.35)',
                zIndex: 1000
              }}
              onClick={() => setShowList(null)}
            />
            <div
              ref={listRef}
              className="card p-3 text-center instagram-card"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: 350,
                width: '90vw',
                alignItems: "center",
                background: "#fff",
                boxShadow: "0 8px 32px rgba(225,48,108,0.15)",
                zIndex: 1001,
                borderRadius: 16
              }}
            >
              <div className="d-flex  mb-2" style={{justifyContent:'space-between',alignItems:'center', width:'100%'}}>
                <h5 className="m-0" style={{alignItems:'center'}}>{showList === 'followers' ? 'Followers' : 'Following'}</h5>
                <button className="btn btn-sm  " style={{fontSize:'1.5rem', justifyContent:'flex-end'}}  onClick={() => setShowList(null)}>x</button>
              </div>
              <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                {(showList === 'followers' ? followers : following).length === 0 ? (
                  <div className="text-secondary">No {showList} yet.</div>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {(showList === 'followers' ? followers : following).map((item, idx) => (
                      <li style={{display:'flex',alignItems:'center'}} key={idx} className="py-2 border-bottom">
                        <img src={showList === 'followers' ? `${process.env.BASE_URL}${item.followerId.avatar}` : `${process.env.BASE_URL}${item.followingId.avatar}`} width='40px' height='40px' alt="" style={{objectFit:'cover', borderRadius: '50%', marginRight:'10px'}}/>
                        <Link to={`/UserProfile/${showList === 'followers' ? item.followerId.username : item.followingId.username }`}>
                        {showList === 'followers' ? item.followerId.username : item.followingId.username}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}

        <div className="row w-100" style={{ maxWidth: 900 }}></div>
      </div>
      <BottomMenu />
    </div>
  );
}

export default Profile;