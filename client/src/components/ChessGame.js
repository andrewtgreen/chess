import React, { useState } from 'react';
import { whitePiece, blackPiece, Board } from './Board';
import { useChatContext } from "stream-chat-react";

const emptyRow = () => {return [{piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}];};

const initBoard = [ // TODO: turn this into a generative function, highlight default value?
    [{piece: "BRook", highlight: null}, {piece: "BKnight", highlight: null}, {piece: "BBishop", highlight: null}, {piece: "BQueen", highlight: null}, {piece: "BKing", highlight: null}, {piece: "BBishop", highlight: null}, {piece: "BKnight", highlight: null}, {piece: "BRook", highlight: null}],
    [{piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}],
    emptyRow(), emptyRow(), emptyRow(), emptyRow(),
    [{piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}],
    [{piece: "WRook", highlight: null}, {piece: "WKnight", highlight: null}, {piece: "WBishop", highlight: null}, {piece: "WQueen", highlight: null}, {piece: "WKing", highlight: null}, {piece: "WBishop", highlight: null}, {piece: "WKnight", highlight: null}, {piece: "WRook", highlight: null}],
];

function ChessGame({ channel, theme, pieceSet, opponentName, playerIsWhite }) {
    const [playersJoined, setPlayersJoined] = useState(channel.state.watcher_count === 2);
    const [history, setHistory] = useState([initBoard]);
    const [currentMove, setCurrentMove] = useState(0);
    const whitesTurn = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const [whiteCapturedPieces, setWhiteCapturedPieces] = useState([]);
    const [blackCapturedPieces, setBlackCapturedPieces] = useState([]);
    
    const { client } = useChatContext();

    // if sync is false, the move is being made by the person in turn and needs to be reflected on opponent's board; if true, simply reflecting change on opponent's board
    async function handlePlay(nextSquares, captured, sync) {
        if (whitePiece(captured)) {
            setWhiteCapturedPieces([captured, ...whiteCapturedPieces]);
        } else if (blackPiece(captured)) {
            setBlackCapturedPieces([captured, ...blackCapturedPieces]);
        }
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        if (!sync) {
            await channel.sendEvent({
                type: "game-move",
                data: {nextSquares, captured}
            })
        }
    }

    // runs when connection is made to awaiting channel
    channel.on("user.watching.start", event => {
        setPlayersJoined(event.watcher_count === 2);
    });

    channel.on((event) => {
        if (event.user.id !== client.userID && event.type === "game-move") {
            handlePlay(event.data.nextSquares, event.data.captured, true);
        }
    })

    return (
        <div style={{color: theme.black}}>
            {playersJoined ? (
                <>
                    <div className="column1">
                        <Board theme={theme} pieceSet={pieceSet} whitesTurn={whitesTurn} opponentName={opponentName} playerIsWhite={playerIsWhite} squares={currentSquares} handlePlay={handlePlay} />
                    </div>
                    <div className="column2">
                        <h2>White Captured Pieces:</h2>
                        {[...Array(whiteCapturedPieces.length).keys()].map(i => {return (<img key={i} src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${whiteCapturedPieces[i]}.png`} width="60px" height="60px"/>)})}
                        <div style={{position:"absolute", top:"200px"}}>
                            <h2>Black Captured Pieces:</h2>
                            {[...Array(blackCapturedPieces.length).keys()].map(i => {return (<img key={i} src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${blackCapturedPieces[i]}.png`} width="60px" height="60px"/>)})}
                        </div>
                    </div>
                </>
            ) : (
                <div style={{textAlign: "center"}}>
                    <h1>Waiting for {opponentName} to join...</h1>
                </div>
            )}
        </div>
    );
}

export default ChessGame;