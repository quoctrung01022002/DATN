import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Postt.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import bootstrap CSS
import { useSpring, animated } from 'react-spring';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://localhost:7138/api/Post');
        setPosts(response.data);
        console.log("sadsa",response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const [expandedPosts, setExpandedPosts] = useState([]);

  const toggleExpanded = postId => {
    if (expandedPosts.includes(postId)) {
      setExpandedPosts(expandedPosts.filter(id => id !== postId));
    } else {
      setExpandedPosts([...expandedPosts, postId]);
    }
  };
  const formatDate = dateString => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  return (
    <animated.div className="introduction-page" style={fadeIn}>
      <div className="post-list container">
      <div className="row">
        {posts.map(post => (
          <div key={post.postId} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100">
              <img
                src={`https://localhost:7138${post.imageUrl}`}
                className="card-img-top"
                alt={post.imageUrl}
              />
              <div className="card-body">
                <h5 className="card-title"><b>{post.title}</b></h5>
                <p className="card-text">{expandedPosts.includes(post.postId) ? post.content : post.content.slice(0, 100)}</p>
              </div>
              <div className="card-footer">
                {post.content.length > 100 && (
                  <button className="btn btn-primary" onClick={() => toggleExpanded(post.postId)}>
                    {expandedPosts.includes(post.postId) ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                )}
                <p className="card-text"><small className="text-muted">{formatDate(post.createAt)}</small></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </animated.div>
  );
};

export default PostList;
