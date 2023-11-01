import React, { useState } from 'react';
import Axios from "axios";
import Cookies from "universal-cookie";

function SignUp({ setIsAuth }) {
    const [user, setUser] = useState(null);
    const [passwordConfirm, setPasswordConfirm] = useState(null);
    const cookies = new Cookies();

    const signUp = () => {
        if (user.password !== passwordConfirm) {
            alert("Passwords do not match");
            return;
        }
        Axios.post("http://localhost:3001/signup", user).then(res => {
            const { token, userID, firstName, lastName, username, hashedPassword } = res.data;
            cookies.set("token", token);
            cookies.set("userID", userID);
            cookies.set("username", username);
            cookies.set("firstName", firstName);
            cookies.set("lastName", lastName);
            cookies.set("hashedPassword", hashedPassword);
            setIsAuth(true);
        });
    }

    return (
        <div className="signUp">
            <label>Sign Up</label>
            <input 
              placeholder="First Name" 
              onChange={event => setUser({...user, firstName: event.target.value})}
            />
            <input 
              placeholder="Last Name" 
              onChange={event => setUser({...user, lastName: event.target.value})}
            />
            <input 
              placeholder="Username" 
              onChange={event => setUser({...user, username: event.target.value})}
            />
            <input 
              placeholder="Password"
              type="password"
              onChange={event => setUser({...user, password: event.target.value})}
            />
            <input 
              placeholder="Confirm Password"
              type="password"
              onChange={event => setPasswordConfirm(event.target.value)}
            />
            <button onClick={signUp}>Sign Up</button>
        </div>
    )
}

export default SignUp;