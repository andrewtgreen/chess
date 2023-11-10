import React, { useState } from 'react';
import ChessGame from './ChessGame';
import { Form, Button } from "react-bootstrap";
import { useChatContext, Channel } from 'stream-chat-react'

function JoinGame({ theme, pieceSet }) {
    const [opponentUsername, setOpponentUsername] = useState("");
    const { client } = useChatContext();
    const [channel, setChannel] = useState(null);

    const createChannel = async (e) => {
        e.preventDefault();
        const response = await client.queryUsers({name: { $eq: opponentUsername}});
        if (response.users.length === 0) {
            return alert("User not found");
        }
        if (response.users[0].id === client.userID) {
            return alert("Cannot play yourself");
        }
        const newChannel = await client.channel("messaging", {
            members: [client.userID, response.users[0].id]
        });
        await newChannel.watch();
        setChannel(newChannel);
    };
 
    return (
        <>
            {channel ? (
                <Channel channel={channel}>
                    <ChessGame channel={channel} theme={theme} pieceSet={pieceSet} />
                    {/* CHAT */}
                    {/* LEAVE GAME BUTTON */}
                </Channel>
            ) : (
            <>
                <h4>Create/Join Game</h4>
                <Form onSubmit={createChannel}>
                    <Form.Group className="mb-3">
                        <Form.Control 
                            placeholder="Opponent's username"
                            onChange={(event) => setOpponentUsername(event.target.value)}
                            autoFocus
                        />
                    </Form.Group>
                    <Button 
                        type="submit"
                        style={{background: theme.black, border: "none", color: theme.white}}
                    >
                        Go
                    </Button>
                </Form>
            </>
            )
            }
        </>
    );
}

export default JoinGame;