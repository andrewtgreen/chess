import React, { useState } from 'react'
import './App.css';
import Game from './components/Game';
import SignUp from './components/SignUp';
import Login from './components/Login';
import { StreamChat } from "stream-chat";
import Cookies from 'universal-cookie';

function App() {
    const api_key = process.env.REACT_APP_STREAM_API_KEY;
    const cookies = new Cookies();
    const token = cookies.get("token");
    const client = StreamChat.getInstance(api_key);
    const [isAuth, setIsAuth] = useState(false);

    if (token) {
        client.connectUser({
            id: cookies.get("userID"),
            name: cookies.get("username"),
            firstName: cookies.get("firstName"),
            lastName: cookies.get("lastName"),
            hashedPassword: cookies.get("hashedPassword")
        }, token).then(user => {
            setIsAuth(true);
        })
    }

    return (
        <div className="App">
            <Game />
            {isAuth ? 
                <button onClick={() => {
                    cookies.remove("token");
                    cookies.remove("userID");
                    cookies.remove("firstName");
                    cookies.remove("lastName");
                    cookies.remove("hashedPassword");
                    //cookies.remove("channelName");
                    cookies.remove("username");
                    client.disconnectUser();
                    setIsAuth(false);
                }}>Log out
                </button> :
                <div className="column2">
                    <div style={{position:"absolute", top:"400px"}}>
                        <SignUp setIsAuth={setIsAuth} />
                    </div>
                    <div style={{position:"absolute", top:"500px"}}>
                        <Login setIsAuth={setIsAuth} />
                    </div>
                </div>
            }
        </div>
    )
}

export default App;