import React, { useState } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import BottomMenu from '../components/BottomMenu';
function CreatePost() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [type, setType] = useState('post');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

const handleSubmit = async (e) => {
  e.preventDefault();
  if(!file) return alert('Please select a file to upload.');
  
  else if(type==='post'){
 console.log('post creating')
    const formData = new FormData();
  formData.append('image', file);       // match upload.single('image')
  formData.append('type', type);
  formData.append('caption', caption);
  formData.append('hashtags', hashtags);


  setLoading(true);
  try {
    const res = await fetch(`${API}/posts/create_post`, {
      method: 'POST',
      body: formData,
      credentials:"include"
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
    navigate('/');
  }
  }

  else if(type==='reel'){
    console.log('Uploading reel...');
  const formData = new FormData();
  formData.append('video', file);       // match upload.single('image')
  formData.append('type', type);
  formData.append('caption', caption);
  formData.append('hashtags', hashtags);


  setLoading(true);
  try {
    const res = await fetch(`${API}/posts/create_reel`, {
      method: 'POST',
      body: formData,
      credentials:"include"
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
    navigate('/');
  }
  }
};


  return (
    <div style={{backgroundColor:'aliceblue'}} className="min-vh-100 d-flex flex-column align-items-center pt-4">
      <h1 className="font mb-4  gradient" style={{ fontSize: '2rem', background: 'linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%)', WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: '1px' }}>
        Create New Post
      </h1>
      
      <div className="card shadow-lg p-4 rounded-4 instagram-card" 
           style={{maxWidth: 500, width: '90%', background: 'rgba(255,255,255,0.95)'}}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="btn-group w-100">
              <button 
                type="button" 
                name='post'
                className={`btn rounded-pill px-4 ${type === 'post' 
                  ? 'btn-gradient-pink text-white' 
                  : 'btn-outline-secondary'}`}
                  onClick={() => setType('post')}
                  >
                Post
              </button>
              <button 
                type="button" 
                name='reel'
                className={`btn rounded-pill px-4 ${type === 'reel' 
                  ? 'btn-gradient-pink text-white' 
                  : 'btn-outline-secondary'}`}
                onClick={() => setType('reel')}
              >
                Reel
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Upload {type === 'post' ? 'Image' : 'Video'}</label>
            <input 
              type="file" 
              className="form-control rounded-pill"
              accept={type === 'post' ? 'image/*' : 'video/*'}
              onChange={(e) => setFile(e.target.files[0])}
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Caption</label>
            <textarea 
              className="form-control rounded-3"
              name="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows="3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Hashtags</label>
            <input 
              type="text"
              name="hashtags"
              className="form-control rounded-pill"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#nature #photography"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-gradient-pink text-white fw-bold rounded-pill w-100"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? 'Creating...' : 'Share Post'}
          </button>
        </form>


      </div>
           <BottomMenu></BottomMenu>
      
    </div>
  );
}

export default CreatePost;