import React, { useEffect } from "react";
import { useState  } from "react";
import { useParams  } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


function Profile (){
    const [username,setUsername] = useState("");
    const [listOfPosts,setListOfPosts] = useState([]);
    const [showMore, setShowMore] = useState({});
    const navigate = useNavigate();
   

    let {id} = useParams();
    useEffect(()=>{
        axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response)=>{
            setUsername(response.data.username);
        })
        axios.get(`http://localhost:3001/posts/byuserid/${id}`).then((response)=>{
            setListOfPosts(response.data)
        })
        
    },[])
    
    return(
        <>
        <div><h1>Username : {username}</h1></div>
        <div>Latest Post by : {username}</div>
        <div className="posts-container">
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
                <div className="post-author">by {post.username}</div>
                <div className="post-likes">

                  <span className="like-count">Number Of Likes :{post.Likes.length}</span>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
        </>
    )
}
export default Profile;