import React from 'react';

const blackSquareHighlight = "#edeaa6";
const whiteSquareHighlight = "#f4f2ca";

function Square({ theme, pieceSet, square, whiteSquare, onSquareClick }) {    
    return (
        <button className="square" onClick={onSquareClick} style={{background: square.highlight === "full" ? (whiteSquare ? whiteSquareHighlight : blackSquareHighlight) : (whiteSquare ? theme.white : theme.black), border: square.highlight === "border" ? `5px solid ${whiteSquare ? whiteSquareHighlight : blackSquareHighlight}` : "0px", opacity: (square.piece === "consideration") ? "0.2" : "1"}}>
            <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${square.piece}.png`} width={square.piece === "consideration" ? "35px" : "75px"} height={square.piece === "consideration" ? "40px" : "75px"} onError={e => e.target.src = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="}/>
        </button>
    );
}

export default Square;