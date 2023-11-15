import React, { useState } from 'react';
import ChessGame from './ChessGame';
import { Form, Button, Card, Row, Col, ListGroup } from "react-bootstrap";
import { useChatContext, Channel } from 'stream-chat-react'

function JoinGame({ theme, pieceSet }) {
    const [opponentUsername, setOpponentUsername] = useState("");
    const [playerIsWhite, setPlayerIsWhite] = useState(true);
    const [opponentName, setOpponentName] = useState("");
    const [invitations, setInvitations] = useState([]);
    const [channel, setChannel] = useState(null);

    const { client } = useChatContext();

    const createChannel = async (e) => {
        e.preventDefault();
        const response = await client.queryUsers({name: opponentUsername});
        // see if invitation is already made from opponent (if invitations contains...)
        if (response.users.length === 0) {
            return alert("User not found");
        }
        if (response.users[0].name === client.user.name) {
            return alert("Cannot invite yourself");
        }
        console.log(response.users[0]);
        if (!response.users[0].online) {
            return alert("User is not online");
        }
        const newChannel = await client.channel("messaging", {
            members: [client.userID, response.users[0].id],
            creatorPlayingAsWhite: playerIsWhite
        });
        await newChannel.watch();
        setOpponentName(response.users[0].firstName);
        setChannel(newChannel);
    };

    const checkInvitations = async () => {
        const filter = { type: 'messaging', members: { $in: [`${client.userID}`] } };
        const sort = [{ created_at: -1 }];

        try {
            const channels = await client.queryChannels(filter, sort, {
                watch: false,
            });
            channels.map((chan) => {
                //chan.delete(); // CLEAR CHANNELS
                //console.log(chan);
                //channel.state.members[0 or 1].user.name is path to usernames of channel members
                //OR channel.queryMembers
                //OR channel.createdBy.name; not working
                // console.log("STATE RECEIVED ", chan.state);
                // console.log("DATA RECEIVED ", chan.data);
                // console.log(chan.data.creatorPlayingAsWhite);
            })
            setInvitations(() => channels.map((chan) => {
                console.log("HEY");
                if (chan.data.created_by.id !== client.userID) {
                    return (
                        <ListGroup.Item key={chan.cid} style={{background: theme.white, color: theme.black}}>
                            <b>{chan.data.created_by.name}</b> wants to play as <b>{chan.data.creatorPlayingAsWhite ? "white" : "black"}</b>
                            &nbsp;&nbsp;&nbsp;
                            <Button 
                              style={{background: theme.black, border: "none", color: theme.white}}
                              onClick={async () => {
                                setPlayerIsWhite(!chan.data.creatorPlayingAsWhite);
                                setOpponentName(chan.data.created_by.firstName);
                                await chan.watch();
                                setChannel(chan);
                              }} >
                                Accept
                            </Button>
                            <Button 
                              style={{background: theme.black, border: "none", color: theme.white}}
                              onClick={async () => {
                                chan.delete();
                                checkInvitations();
                              }} >
                                Decline
                            </Button>
                        </ListGroup.Item>
                    )
                }
            }));
        } catch (e) {
            console.log(e);
        }
    };
    //checkInvitations();
    //console.log(client.user.name) //USERNAME!!!!!!
 
    return (
        <>
            {channel ? (
                <Channel channel={channel}>
                    <ChessGame channel={channel} theme={theme} pieceSet={pieceSet} opponentName={opponentName} playerIsWhite={playerIsWhite}/>
                    {/* CHAT */}
                    {/* LEAVE GAME BUTTON */}
                </Channel>
            ) : (
            <div style={{textAlign: "center", color: theme.black}}>
                <h4>Create Invitation To Play</h4>
                <Form onSubmit={createChannel}>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Control 
                                placeholder="Opponent's username"
                                onChange={(event) => setOpponentUsername(event.target.value)}
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Button 
                                style={{color: theme.black, background: theme.backgroundColor, border: `1px solid ${theme.black}`}}
                                onClick={() => setPlayerIsWhite(!playerIsWhite)} >
                                    I'm playing as: {playerIsWhite ? "White" : "Black"}
                            </Button>
                        </Form.Group>
                    </Row>
                    <Button 
                        type="submit"
                        style={{background: theme.black, border: "none", color: theme.white}}
                    >
                        Send
                    </Button>
                </Form>
                <Card /*style={{ width: '18rem' }}*/>
                    <Card.Header style={{background: theme.black, color: theme.white, justifyContent: "center"}} as="h5">
                        Your Invitations&nbsp;&nbsp;&nbsp;
                        <Button style={{fontSize: "25px", background: theme.black, border: `1px solid ${theme.white}`, color: theme.white}} onClick={checkInvitations}>&#10226;</Button>
                    </Card.Header>
                    {/* <Card.Body style={{background: theme.white, color: theme.black}}> */}
                        <ListGroup>
                            {/* <Card.Title>Special title treatment</Card.Title> */}
                            {/* <Card.Text>
                            With supporting text below as a natural lead-in to additional content.
                            </Card.Text> */}
                            {invitations}
                        </ListGroup>
                    {/* </Card.Body> */}
                </Card>
            </div>
            )
            }
        </>
    );
}

export default JoinGame;