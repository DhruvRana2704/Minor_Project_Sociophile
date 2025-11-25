import { React, useEffect, useState, useRef, use } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomMenu from '../components/BottomMenu';

function Home() {
  const navigate = useNavigate();
  const watchStartTimes = {}; // { postId: timestamp }

  const [data, setData] = useState({ posts: [], reels: [] });
  const [loading, setLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const postRefs = useRef({});
  const videoRefs = useRef({}); // Store refs for each video
  const [activeAudio, setActiveAudio] = useState(null); // Only one video with audio
  const [startTime, setStartTime] = useState(null);
  const [watchTime, setWatchTime] = useState(0);

// const handlePlay = (postId) => {
//   watchStartTimes[postId] = Date.now(); // record start time
// };

// const handlePauseOrEnd = async (postId) => {
//   const startTime = watchStartTimes[postId];
//   if (!startTime) return; // ignore if play wasn’t recorded

//   const watchedSeconds = (Date.now() - startTime) / 1000;
//   delete watchStartTimes[postId]; // reset for next time

//   try {
//     await fetch("http://localhost:5000/interactions/watch", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ postId, watchedSeconds }),
//     });
//     console.log(`Watch time (${watchedSeconds}s) sent for post ${postId}`);
//   } catch (err) {
//     console.error("Failed to send watch time:", err);
//   }
// };

//   const onWatchUpdate = async (postId, watchedSeconds) => {
//   try {
//     console.log("Updating watch time:", { postId, watchedSeconds });
//     await fetch("http://localhost:5000/interactions/watch", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ postId, watchedSeconds }),
//       credentials: 'include'
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.BASE_URL}/posts/fetchposts`, {
          credentials: 'include'
        });

        if (response.status === 401) {
          navigate('/');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (error.message === 'Failed to fetch' || error.message.includes('unauthorized')) {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }

    };

    fetchData();
  }, [navigate]);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/interactions/fetchreels', {
  //         credentials: 'include',
  //         method: 'POST'
  //       });

  //       if (response.status === 401) {
  //         navigate('/');
  //         return;
  //       }

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch reels');
  //       }

  //       const jsonData = await response.json();

  //       setData(jsonData);
  //     } catch (error) {
  //       console.error('Error fetching reels:', error);
  //       if (error.message === 'Failed to fetch' || error.message.includes('unauthorized')) {
  //         navigate('/');
  //       }
  //     } finally {
  //       setLoading(false);
  //     }

  //   };

  //   fetchData();
  // }, [navigate]);




  // Lazy loading and video play/pause logic
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const postId = entry.target.dataset.id;
          if (entry.isIntersecting) {
            setVisiblePosts(prev => {
              if (!prev.includes(postId)) {
                return [...prev, postId];
              }
              return prev;
            });
            // Play video if it's a reel and visible
            if (videoRefs.current[postId]) {
              videoRefs.current[postId].play().catch(() => { });
            }
          } else {
            // Pause video if it's a reel and not visible
            if (videoRefs.current[postId]) {
              videoRefs.current[postId].pause();
            }
          }
        });
      },
      { threshold: 0.55 }
    );

    Object.values(postRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [data.posts]);

  // Ensure only one video has audio at a time
  const toggleAudio = (postId) => {
    setActiveAudio(prev => {
      if (prev === postId) {
        // If already active, mute it
        if (videoRefs.current[postId]) videoRefs.current[postId].muted = true;
        return null;
      } else {
        // Mute all, unmute this one
        Object.entries(videoRefs.current).forEach(([id, video]) => {
          if (video) video.muted = id !== postId;
        });
        if (videoRefs.current[postId]) videoRefs.current[postId].muted = false;
        return postId;
      }
    });
  };
  async function handleLike(postid) {
    const response = await fetch(`${process.env.BASE_URL}/likes/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ postId: postid }),
      credentials: 'include'
    });
    const result = await response.json();
    if (result.success) {
      console.log('Post liked successfully');
    } else {
      console.error('Error liking post:', result.message);
    }
  }
  return (
    console.log(data),
    <div className="instagram-home min-vh-100 d-flex flex-column align-items-center justify-content-start"
    style={{ width: '100vw', maxWidth: '100vw', overflowX: 'hidden', margin: 0, padding: 0 }}>
      
      {/* Top Title Only */}
      <div className="w-100 d-flex justify-content-center align-items-center p-3" >
        <h1 className="font m-0" style={{ fontSize: '2rem', color: '#e1306c', letterSpacing: '1px' }}>Sociophile</h1>
      </div>

      <div className="mt-3 container-fluid d-flex flex-column align-items-center justify-content-center p-0 m-0"
        style={{ minHeight: '80vh', width: '100vw', maxWidth: '100vw', overflowX: 'hidden', margin: 0, padding: 0, paddingBottom: '90px' }}>
        <div className="mt-3 d-flex flex-column gap-4 align-items-center w-100" style={{ maxWidth: 420 }}>
          {data.posts? data.posts.map(post => {
            const postId = post._id || post.id;
            return (
              <div
                key={postId}
                ref={el => postRefs.current[postId] = el}
                data-id={postId}
                style={{ minHeight: 400, width: '100%' }}
              >
                {visiblePosts.includes(postId) ? (
                  post.type === 'post' ? (
                    <div className="card shadow-sm instagram-card w-100" style={{ maxWidth: 400, backgroundColor: '#ecf8f5ff' }}>
                      <div className="card-header d-flex align-items-center bg-white border-0" style={{ height: '50px' }}>

                        <img
                          src='https://randomuser.me/api/portraits/men/32.jpg'
                          alt="avatar"
                          className="rounded-circle me-2"
                          width="40"
                          height="40"
                          style={{ objectFit: 'cover' }}
                        />
                        <Link
                          to={`/Userprofile/${post.user[0].username}`}
                          className="fw-semibold text-decoration-none"
                          style={{ fontFamily: "Dancing Script", color: 'black', marginLeft: '0.5rem', fontSize: '1.25rem' }}
                        >
                          {post.user[0].username}
                        </Link>
                      </div>
                      <img
                        src={`${process.env.BASE_URL}${post.url}`}
                        className="card-img-top"
                        alt={post.caption}
                        style={{ maxHeight: 450, objectFit: 'cover' }}
                        loading="lazy"
                      />
                      <div className="card-body">
                        <p className="card-text mb-2" style={{ fontSize: '0.9rem', marginTop: '-0.25rem' }}>{post.caption}</p>
                        <p className="card-text mb-2" style={{ color: 'blue', fontSize: '0.85rem', marginTop: '-0.5rem' }}>{post.hashtags}</p>
                        <div className="d-flex align-items-center gap-3">
                          <span className="fw-bold" onClick={() => handleLike(post._id)} style={{ color: '#e1306c', fontSize: '1.4rem', marginTop: '-0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            &hearts; <span style={{ fontSize: '1rem' }}>{post.likesCount || 0}</span>
                          </span>
                          <span className="text-secondary" style={{ color: '#e1306c', fontSize: '1rem', marginTop: '-0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            💬 <span style={{ fontSize: '1rem' }}>{post.comments?.length || 0}</span>
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.65rem', color: 'gray' }}>{post.createdAt.split('T')[0]}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="card shadow-sm instagram-card w-100" style={{ maxWidth: '600' }}>
                      <div className="card-header d-flex align-items-center bg-white border-0">

                        <img
                          src='https://randomuser.me/api/portraits/men/32.jpg'
                          alt="avatar"
                          style={{ objectFit: 'cover' }}
                          className="rounded-circle me-2"
                          width="40"
                          height="40"
                        />
                        {/* <Link
                          to={`/UserProfile/${post.user[0].username}`}
                          className="fw-semibold text-decoration-none"
                          style={{ fontFamily: "Dancing Script", color: 'black' }}
                        >
                          {post.user[0].username}
                        </Link> */}
                        {post.type}
                      </div>
                      {/* {console.log(post)} */}
                      <video
                        className="w-100 rounded-3"
                        loop
                        onPlay={() => handlePlay(postId)}
                        onPause={() => handlePauseOrEnd(postId)}
                        onEnded={() => handlePauseOrEnd(postId)}
                        autoPlay
                        playsInline
                        muted={activeAudio !== postId}
                        ref={el => videoRefs.current[postId] = el}
                        style={{ maxHeight: 450, objectFit: 'cover', background: '#000' }}
                        loading="lazy"
                        onClick={() => handleVideoClick(postId)}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.parentNode.innerHTML = `
      <div class="d-flex flex-column align-items-center justify-content-center" style="height: 300px;">
        <span style="color: #e1306c; font-size: 1.2rem;">Video not supported or unavailable</span>
      </div>
    `;
                        }}
                      >
                        <source src={`${process.env.BASE_URL}${post.url}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="d-flex justify-content-end mt-2">
                        <button
                          className={`btn btn-sm rounded-pill ${activeAudio === postId ? 'btn' : 'btn'}`}
                          onClick={() => toggleAudio(postId)}
                          style={{ fontSize: '0.9em', outline: 'none', position: 'absolute', top: '5' }}
                          data-id={postId}
                        >
                          {activeAudio === postId ? <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFDEzEabLLKvdBsXPW60NJKjQeZsDS4lt3SQ&s' width='20px' height='20px' alt="Audio On" /> : <img src='https://static.vecteezy.com/system/resources/thumbnails/008/070/291/small_2x/speaker-volume-sound-off-icon-illustration-free-vector.jpg' width='30px' height='20px' alt="Audio Off" />}
                        </button>
                      </div>
                      <div className="card-body">
                        <p className="card-text " style={{ fontSize: '0.9rem', marginTop: '-0.5rem', width: '90%' }}>{post.caption}</p>
                        <p className="card-text " style={{ color: 'blue', fontSize: '0.85rem', marginTop: '-1rem' }}>{post.hashtags}</p>
                        <div className="d-flex align-items-center gap-3">
                          <span className="fw-bold" onClick={() => handleLike(post._id)} style={{ color: '#e1306c', fontSize: '1.4rem', marginTop: '-0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            &hearts; <span style={{ fontSize: '1rem' }}>{post.likesCount || 0}</span>
                          </span>
                          <span className="text-secondary" style={{ color: '#e1306c', fontSize: '1rem', marginTop: '-0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                            💬 <span style={{ fontSize: '1rem' }}>{post.comments?.length || 0}</span>
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.65rem', color: 'gray' }}>{post.createdAt.split('T')[0]}</span>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="card shadow-sm instagram-card w-100" style={{ maxWidth: 400, minHeight: 480, background: "#f5f5f5" }}>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: 400 }}>
                      <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }) : <h1>No Posts Available</h1>}
        </div>

      </div>
      <BottomMenu />
    </div>
  );
}

export default Home;