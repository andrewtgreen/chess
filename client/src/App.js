import React, { useState, useEffect } from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import { javaChipTheme } from './components/NavBar.js';
import { Modal } from 'react-bootstrap';
import SignUp from './components/SignUp';
import Login from './components/Login';
import JoinGame from './components/JoinGame';
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react"
import Cookies from 'universal-cookie';

function App() {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const client = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY);
    const [isAuth, setIsAuth] = useState(false);
    const [theme, setTheme] = useState(cookies.get("theme") || javaChipTheme);
    const [pieceSet, setPieceSet] = useState(cookies.get("pieceSet") || "original");

    const logout = () => {
        cookies.remove("token");
        cookies.remove("userID");
        cookies.remove("firstName");
        cookies.remove("lastName");
        cookies.remove("hashedPassword");
        cookies.remove("username");
        // will not remove theme or pieceSet cookies so that these can be persistent on browser until another user logs in
        client.disconnectUser();
        setIsAuth(false);
    };

    // set cookie when theme is changed so this is permanent for session, and update user to reflect this change/render it permanently for this user
    useEffect(() => {
        document.body.style = `background: ${theme.backgroundColor}`;
        if (client.userID) {
            client.partialUpdateUser({id: client.userID, set: {theme: theme}});
        }
        cookies.set("theme", theme);
    }, [theme]);

    // update user when pieceSet is changed to reflect this change/render it permanently for this user
    useEffect(() => {
        if (client.userID) {
            client.partialUpdateUser({id: client.userID, set: {pieceSet: pieceSet}});
        }
        cookies.set("pieceSet", pieceSet);
    }, [pieceSet]);

    useEffect(() => {
        if (token) {
            client.connectUser({
                id: cookies.get("userID"),
                name: cookies.get("username"),
                firstName: cookies.get("firstName"),
                lastName: cookies.get("lastName"),
                hashedPassword: cookies.get("hashedPassword")
            }, token).then(user => {
                setIsAuth(true);
                setTheme(user.me.theme || theme);
                setPieceSet(user.me.pieceSet || pieceSet);
            })
        }
    }, [isAuth]);

    return (
        <div className="App">
            <NavBar theme={theme} setTheme={setTheme} game="chess" pieceSet={pieceSet} setPieceSet={setPieceSet} logout={logout} />
            <Chat client={client}>
                <JoinGame theme={theme} pieceSet={pieceSet} />
            </Chat>
            <Modal
                show={!isAuth}
                backdrop="static"
                centered
                style={{background: theme.backgroundColor}} // put this here to have "sign in page" effect (can't do or see anything without signing in)
            >
                <Modal.Header style={{background: theme.black, color: theme.white, justifyContent: "center"}}>
                    <Modal.Title><h1>BobaShop</h1></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{background: theme.white, color: theme.black}}>
                    <Login setIsAuth={setIsAuth} theme={theme} />
                    <hr style={{color: theme.black, backgroundColor: theme.black}}/>
                    <SignUp setIsAuth={setIsAuth} theme={theme} />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default App;