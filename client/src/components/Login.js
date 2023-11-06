import React, { useState } from 'react'
import Axios from 'axios';
import Cookies from 'universal-cookie';
import { Form, Button } from "react-bootstrap";

function Login({ setIsAuth, theme }) {
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
        <>
            <h4>Log In</h4>
            <Form onSubmit={login}>
                <Form.Group className="mb-3">
                    <Form.Control 
                        placeholder="Username"
                        onChange={(event) => setUsername(event.target.value)}
                        autoFocus
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control 
                        type="password"
                        placeholder="Password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </Form.Group>
                <Button 
                    type="submit"
                    style={{background: theme.black, border: "none", color: theme.white}}
                >
                    Submit
                </Button>
            </Form>
        </>
    )
}

export default Login;