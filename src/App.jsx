import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { Authcontext } from "./helpers/Authcontext"; // Assuming Authcontext is defined
import axios from "axios";
import "./App.css"; // Import specific CSS file
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Pofile";

function App() {
  const [auth, setAuth] = useState(
    {
      username:"",
      id:0,
      status:false
    }
  );
  const logout = ()=>{
    
    localStorage.removeItem("accessToken");
    setAuth({...auth,status:false});
    
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("https://blog-backend-k2au2wpqn-paras-sharma-s-projects-55e1989b.vercel.app//auth/auth", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        });

        if (response.data.error) {
          setAuth({...auth,status:false});
        } else {
          setAuth({
            username: response.data.username,
            id: response.data.id,
            status:true
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Handle potential errors during authentication check (optional)
      }
    };

    checkAuth();
  }, []);

  return (
    <Authcontext.Provider value={{ auth, setAuth }}>
      <BrowserRouter>
        <header className="header">
          <div className="header-content">
            <Link to="/" className="link">
              Home
            </Link>

            {auth.status && (
              <>
                <Link to="/createpost" className="link">
                Create Post
                </Link>
                <div className="auth-container">
                  <span className="username">Hello, {auth.username}</span>
                  <button className="logout-button" onClick={logout}>Logout</button>
                </div>
                
              </>
              
              
            )}
             

            {!auth.status && (
              <>
                <Link to="/login" className="link">
                  Login
                </Link>
                <Link to="/registration" className="link">
                  Registration
                </Link>
              </>
            )}
           
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createpost" element={<CreatePost auth={auth} />} />
          <Route path="/posts/:id" element={<Post />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:id" element = {<Profile/>}/>
          <Route path="*" element = {<PageNotFound/>} />
        </Routes>
      </BrowserRouter>
    </Authcontext.Provider>
  );
}

export default App;