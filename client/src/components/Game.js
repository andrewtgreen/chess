import React, { useLayoutEffect, useState } from 'react';
import { whitePiece, blackPiece, Board } from './Board';

const emptyRow = () => {return [{piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}];};

const initBoard = [ // TODO: turn this into a generative function, highlight default value?
    [{piece: "BRook", highlight: null}, {piece: "BKnight", highlight: null}, {piece: "BBishop", highlight: null}, {piece: "BQueen", highlight: null}, {piece: "BKing", highlight: null}, {piece: "BBishop", highlight: null}, {piece: "BKnight", highlight: null}, {piece: "BRook", highlight: null}],
    [{piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}],
    emptyRow(), emptyRow(), emptyRow(), emptyRow(),
    [{piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}],
    [{piece: "WRook", highlight: null}, {piece: "WKnight", highlight: null}, {piece: "WBishop", highlight: null}, {piece: "WQueen", highlight: null}, {piece: "WKing", highlight: null}, {piece: "WBishop", highlight: null}, {piece: "WKnight", highlight: null}, {piece: "WRook", highlight: null}],
];

function Game({ theme, pieceSet }) {
    const [history, setHistory] = useState([initBoard]); // TODO: add history
    const [currentMove, setCurrentMove] = useState(0);
    const whitesTurn = currentMove % 2 === 0;
    const currentSquares = history[0];
    const [whiteCapturedPieces, setWhiteCapturedPieces] = useState([]);
    const [blackCapturedPieces, setBlackCapturedPieces] = useState([]);
 
    // JS run when page renders and "Game" component mounts: (TODO: set this to a variable listened to for theme)
    useLayoutEffect(() => {document.body.style = `background: ${theme.backgroundColor}`;}, [theme]);

    function handlePlay(captured) {
        if (whitePiece(captured)) {
            setWhiteCapturedPieces([captured, ...whiteCapturedPieces]);
        } else if (blackPiece(captured)) {
            setBlackCapturedPieces([captured, ...blackCapturedPieces]);
        }
        setCurrentMove(currentMove + 1);
    }

    return (
        <div style={{color: theme.black}}>
            <div className="column1">
                <Board theme={theme} pieceSet={pieceSet} whitesTurn={whitesTurn} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="column2">
                <h2>White Captured Pieces:</h2>
                {whiteCapturedPieces.map(elt => <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${elt}.png`} width="60px" height="60px"/>)}
                <div style={{position:"absolute", top:"140px"}}>
                    <h2>Black Captured Pieces:</h2>
                    {blackCapturedPieces.map(elt => <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${elt}.png`} width="60px" height="60px"/>)}
                </div>
            </div>
        </div>
    );
}

export default Game;