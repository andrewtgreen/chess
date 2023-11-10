import React, { useState } from 'react';
import { Form, Row, Col, Button } from "react-bootstrap";
import Axios from "axios";
import Cookies from "universal-cookie";

function SignUp({ setIsAuth, theme }) {
    const [user, setUser] = useState(null);
    const [passwordConfirm, setPasswordConfirm] = useState(null);
    const cookies = new Cookies();

    const signUp = (e) => {
        e.preventDefault();
        if (user.password !== passwordConfirm) {
            alert("Passwords do not match");
            return;
        }
        Axios.post("http://localhost:3001/signup", user).then(res => {
            if (res.data.badResponse) {
              return alert(res.data.badResponse);
            }
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
            <h4>Create Account</h4>
            <Form onSubmit={signUp}>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                      <Form.Control 
                          placeholder="First Name" 
                          onChange={event => setUser({...user, firstName: event.target.value})}
                      />
                  </Form.Group>
                  <Form.Group as={Col}>
                      <Form.Control 
                          placeholder="Last Name" 
                          onChange={event => setUser({...user, lastName: event.target.value})}
                      />
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                    <Form.Control 
                        placeholder="New username" 
                        onChange={event => setUser({...user, username: event.target.value})}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control 
                        type="password"
                        placeholder="New password"
                        onChange={event => setUser({...user, password: event.target.value})}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control 
                        type="password"
                        placeholder="Confirm password"
                        onChange={event => setPasswordConfirm(event.target.value)}
                    />
                </Form.Group>
                <Button 
                    type="submit"
                    style={{background: theme.black, border: "none", color: theme.white}}
                >
                    Sign up
                </Button>
            </Form>
        </div>
    )
}

export default SignUp;