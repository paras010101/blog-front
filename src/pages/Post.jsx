import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Post.css"; // Import specific CSS file
import {Authcontext} from "../helpers/Authcontext"
import { useNavigate } from "react-router-dom";

function Post() {
  const { id } = useParams();
  const [postData, setPostData] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState(null); // State for error handling
  const {auth} = useContext(Authcontext)
  const navigate = useNavigate();

  const deleteComment = (id)=>{
    axios.delete(`https://blog-backend-k2au2wpqn-paras-sharma-s-projects-55e1989b.vercel.app//${id}`,{
      headers: { accessToken: localStorage.getItem("accessToken") } 
    }
    )
  };
  const deletePost = (id)=>{
    // axios.delete(`http://localhost:3001/posts/${id}`,{
    //   headers: { accessToken: localStorage.getItem("accessToken") } 
    // }
    // )
    // navigate("/")
  };

  const addComment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/comments",
        { commentsBody: newComment, PostId: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );
  
      if (response.data.error) {
        // Assuming 'error' is a field in the response when there's an issue
        alert("You need to login to post a comment.");
      } else {
        setNewComment(""); // Clear comment input after successful submission
        fetchComments(); // Refresh comments after adding a new one
      }
    } catch (err) {
      // Handle network or server errors
      console.error("Error adding comment:", err);
  
      if (err.response && err.response.status === 401) {
        // Specific error handling for unauthorized requests
        alert("You need to login to post a comment.");
      } else {
        setError("Failed to add comment. Please try again."); // Set generic error message
      }
    }
  };
  
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/comments/${id}`);
      setComments(response.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("Error loading comments. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingComments(true); // Set loading indicator for comments
      setError(null); // Clear any previous errors

      try {
        const postResponse = await axios.get(
          `http://localhost:3001/posts/byId/${id}`
        );
        setPostData(postResponse.data);

        fetchComments();
      } catch (err) {
        console.error("Failed to fetch post data:", err);
        setError("Error loading post and comments. Please try again."); // Set error message
      } finally {
        setLoadingComments(false); // Clear loading indicator after fetching
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="post-container">
      {error && <div className="error-message">{error}</div>}

      {postData.title && (
        <>
          <h2>{postData.title}</h2>
          <div className="post-content">
            <p>{postData.posttext}</p>
            <span className="post-username">Posted By: {postData.username}</span>
          </div>
          {auth.username === postData.username && (
                    <button onClick={()=>{deletePost(postData.id)}}>delete</button>
                  )}
        </>
      )}

      {loadingComments ? (
        <p>Loading comments...</p>
      ) : (
        <div className="comments-section">
          <h3>Comments</h3>
          <ul>
            {comments.map((comment, key) => (
              <li key={key} className="comment-item">
                <div className="commentsection">
                  <span className="username">{comment.username}</span>
                  <p>{comment.commentsBody}</p>
                  {auth.username === comment.username && (
                    <button onClick={()=>{deleteComment(comment.id)}}>delete</button>
                  )}
                  
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="add-comment">
        <input
          type="text"
          placeholder="Write a new comment"
          className="comment-input"
          autoComplete="off"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
        />
        <button onClick={addComment} disabled={loadingComments}>
          Post Comment
        </button>
      </div>
    </div>
  );
}

export default Post;
