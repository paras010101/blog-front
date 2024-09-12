import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../helpers/Authcontext";
import './Login.css'

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuth } = useContext(Authcontext);

    const login = async () => {
        try {
            const data = { username, password };
            const response = await axios.post("http://localhost:3001/auth/login", data);

            if (response.data.error) {
                alert(response.data.error);
            } else {
                localStorage.setItem("accessToken", response.data.token);
                setAuth({usename: response.data.username ,id: response.data.id,status:true});
                navigate('/');
            }
        } catch (error) {
            console.error("There was an error logging in:", error);
            alert("An error occurred during login. Please try again.");
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <div className="form-group">
                <label htmlFor="username">User Name</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="input-field"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="input-field"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <button onClick={login} className="submit-button">
                Submit
            </button>
        </div>
    );
}

export default Login;
