import React, { useState } from 'react'
import Axios from 'axios';
import Cookies from 'universal-cookie';

function Login({ setIsAuth }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const cookies = new Cookies();

    const login = () => {
        Axios.post("http://localhost:3001/login", { username, password }).then(res => {
            if (res.data.failedLogin) {
                alert("Password is incorrect");
                return;
            } else if (res.data.failedUsername) {
                alert("Username does not exist");
                return;
            }
            const { firstName, lastName, username, token, userID } = res.data;
            cookies.set("token", token);
            cookies.set("userID", userID);
            cookies.set("username", username);
            cookies.set("firstName", firstName);
            cookies.set("lastName", lastName);
            setIsAuth(true);
        });
    }

    return (
        <div className="login">
            <label>Login</label>
            <input 
              placeholder="Username" 
              onChange={(event) => setUsername(event.target.value)}
            />
            <input 
              placeholder="Password"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <button onClick={login}>Login</button>
        </div>
    )
}

export default Login;