import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaThumbsUp } from 'react-icons/fa';
import { Authcontext } from '../helpers/Authcontext'; // Import the context
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [showMore, setShowMore] = useState({});
  const navigate = useNavigate();
  const { authState } = useContext(Authcontext); // Access auth state


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/posts',{headers :{accessToken : localStorage.getItem("accessToken")}});
        setListOfPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, []);

  const likeAPost = (postId) => {
    axios.post(
      'http://localhost:3001/like',
      { PostId: postId },
      {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
        },
      }
    ).then((response) => {
      setListOfPosts(
        listOfPosts.map((post) => {
          if (post.id === postId) {
            if (response.data.liked) {
              return {
                ...post,
                Likes: [...post.Likes, { UserId: response.data.UserId }]
              };
            } else {
              const updatedLikes = post.Likes.filter(like => like.UserId !== response.data.UserId);
              return {
                ...post,
                Likes: updatedLikes
              };
            }
          } else {
            return post;
          }
        })
      );
    });
  };

  const toggleShowMore = (postId) => {
    setShowMore((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="posts-container">
      <h1>Latest Posts</h1>
      {listOfPosts.length > 0 ? (
        <ul className="post-list">
          {listOfPosts.map((post) => (
            <li key={post.id} className="post-item">
              <header className="post-header">
                <h2 className="post-title">{post.title}</h2>
              </header>
              <div className="post-body" onClick={() => navigate(`/posts/${post.id}`)}>
                {showMore[post.id] ? post.posttext : post.posttext.substring(0, 60)}...
                {post.posttext.length > 60 && (
                  <span className="see-more" onClick={() => toggleShowMore(post.id)}>
                    {showMore[post.id] ? 'See less' : 'See more'}
                  </span>
                )}
              </div>
              <footer className="post-footer">
                <div className="post-author" >by <Link to={`/profile/${post.id}`}>{post.username}</Link></div>
                <div className="post-likes">
                  <button className="like-button" onClick={() => likeAPost(post.id)}>
                    <FaThumbsUp /> Like
                  </button>
                  <span className="like-count">{post.Likes.length}</span>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}

export default Home;
