import { useState } from 'react';
import './App.css';

import WRook from './pieces/main/whiteRook.png';
import WKnight from './pieces/main/whiteKnight.png';
import WBishop from './pieces/main/whiteBishop.png';
import WQueen from './pieces/main/whiteQueen.png';
import WKing from './pieces/main/whiteKing.png'
import WPawn from './pieces/main/whitePawn.png';
import BRook from './pieces/main/blackRook.png';
import BKnight from  './pieces/main/blackKnight.png';
import BBishop from  './pieces/main/blackBishop.png';
import BQueen from  './pieces/main/blackQueen.png';
import BKing from './pieces/main/blackKing.png';
import BPawn from './pieces/main/blackPawn.png';

// import WRook from './pieces/evilPrincess/whiteRook.png';
// import WKnight from './pieces/evilPrincess/whiteKnight.png';
// import WBishop from './pieces/evilPrincess/whiteBishop.png';
// import WQueen from './pieces/evilPrincess/whiteQueen.png';
// import WKing from './pieces/evilPrincess/whiteKing.png'
// import WPawn from './pieces/evilPrincess/whitePawn.png';
// import BRook from './pieces/evilPrincess/blackRook.png';
// import BKnight from  './pieces/evilPrincess/blackKnight.png';
// import BBishop from  './pieces/evilPrincess/blackBishop.png';
// import BQueen from  './pieces/evilPrincess/blackQueen.png';
// import BKing from './pieces/evilPrincess/blackKing.png';
// import BPawn from './pieces/evilPrincess/blackPawn.png';

const BLACK = "rgb(138, 106, 87)";
const WHITE = "rgb(224, 218, 202)";

function Square({ square, whiteSquare, onSquareClick }) {    
    return (
        <button
            style={{background: whiteSquare ? WHITE : BLACK, width: "90px", height: "90px", border: square.border}}
            className="square" onClick={onSquareClick}><img src={square.piece || 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA='} 
            width="75px"
            height="75px"
            onError = {e => e.target.style.display = 'none'}/>
        </button>
    );
  }

function Row({ row, initialWhiteSquare, onRowClick }) {
    return (
        <div className="board-row">
            <Square square={row[0]} whiteSquare={initialWhiteSquare} onSquareClick={() => onRowClick(0)} />
            <Square square={row[1]} whiteSquare={!initialWhiteSquare} onSquareClick={() => onRowClick(1)} />
            <Square square={row[2]} whiteSquare={initialWhiteSquare} onSquareClick={() => onRowClick(2)} />
            <Square square={row[3]} whiteSquare={!initialWhiteSquare} onSquareClick={() => onRowClick(3)} />
            <Square square={row[4]} whiteSquare={initialWhiteSquare} onSquareClick={() => onRowClick(4)} />
            <Square square={row[5]} whiteSquare={!initialWhiteSquare} onSquareClick={() => onRowClick(5)} />
            <Square square={row[6]} whiteSquare={initialWhiteSquare} onSquareClick={() => onRowClick(6)} />
            <Square square={row[7]} whiteSquare={!initialWhiteSquare} onSquareClick={() => onRowClick(7)} />
        </div>
    )
}

function Board({ whitesTurn, squares, onPlay }) {
    const [firstClick, setFirstClick] = useState(true);
    const [squareSelected, setSquareSelected] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    // TODO: delete firstClick and just check whether squareSelected === null ?
    
    const handleClick = (row, col) => {
        const clearBorders = () => {
            // idea that is not working: possibleMoves.forEach(elt => squares[elt[0]][elt[1]].border = "0px"); (instead this will clear every border on the board)
            for (let i = 0; i <= 7; i++) {
                for (let j = 0; j <= 7; j++) {
                    squares[i][j].border = "0px";
                }
            }
        }

        // Also highlights squares of possible moves
        const getPossibleMoves = (piece) => {
            const sameColorPiece = (p1, p2) => {
                if ((whitePiece(p1) && whitePiece(p2)) || (blackPiece(p1) && blackPiece(p2))) {
                    return true;
                }
                return false;
            };

            /* (Helper function for getPossibleMovesSelect) In iterating through diagonal or orthogonal move possibilities for certain pieces, there are four directions to consider (up & left, up & right, down & left, down & right; up, down, right, left). 
            This helper function is meant to return the row of the square in consideration as a possible move for one of those pieces. */ 
            const rowConsideration = (direction, count, geometry) => {
                switch (geometry) {
                    case "diagonals":
                        switch (direction) {
                            case 0:
                            case 1:
                                return row - count;
                            case 2:
                            case 3:
                                return row + count;
                            default:
                        }
                    case "orthogonals":
                        switch (direction) {
                            case 0:
                                return row + count;
                            case 1:
                                return row - count;
                            case 2:
                            case 3:
                                return row;
                            default:
                        }
                    default:
                }
            };

            /* (Helper function for getPossibleMovesSelect) In iterating through diagonal or orthogonal move possibilities for certain pieces, there are four directions to consider (up & left, up & right, down & left, down & right; up, down, right, left). 
            This helper function is meant to return the column of the square in consideration as a possible move for one of those pieces. */ 
            const colConsideration = (direction, count, geometry) => {
                switch (geometry) {
                    case "diagonals":
                        switch (direction) {
                            case 0:
                            case 3:
                                return col - count;
                            case 1:
                            case 2:
                                return col + count;
                            default:
                        }
                    case "orthogonals":
                        switch (direction) {
                            case 0:
                            case 1:
                                return col;
                            case 2:
                                return col + count;
                            case 3:
                                return col - count;
                            default:
                        }
                    default:
                }
            };

            /* For a select few pieces (Rook, Bishop, Queen), this function considers squares in diagonal and/or orthogonal directions as possible moves for the piece.
            The geometry parameter ("diagonals"/"orthogonals") specifies which board squares we're considering from the piece this function is being called on. */
            const getPossibleMovesSelect = (geometry) => {
                let rowConsidered, colConsidered, list = [];
                // Iterates through the four directions from the perspective of a given piece, given a geometry (diagonal or orthogonal)
                for (let direction = 0; direction < 4; direction++) {
                    for (let count = 1; (rowConsidered = rowConsideration(direction, count, geometry)) >= 0 && rowConsidered <= 7 && (colConsidered = colConsideration(direction, count, geometry)) >= 0 && colConsidered <= 7; count++) {
                        let pieceConsidered = squares[rowConsidered][colConsidered].piece;
                        
                        if (!sameColorPiece(piece, pieceConsidered)) {
                            list.push([rowConsidered, colConsidered]);
                            if (pieceConsidered !== null) {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                }
                return list;
            };

            // variables default set for white pieces
            let list = [], rowConsidered, colConsidered, direction = -1, pawnHasntMoved = row === 6, bypass = false;
            if (blackPiece(piece)) {
                direction = 1;
                pawnHasntMoved = row === 1;
            }
            switch (piece) {
                case BPawn:
                case WPawn:
                    // Regular pawn moves
                    for (let i = 1; pawnHasntMoved ? i <= 2 : i <= 1; i++) {
                        if ((rowConsidered = row + (i * direction)) >= 0 && rowConsidered <= 7 && squares[rowConsidered][col].piece === null) {
                            list.push([rowConsidered, col]);
                        } else {
                            break;
                        }
                    }
                    // Captures
                    for (let i = -1; i <= 1; i += 2) {
                        if ((rowConsidered = row + direction) >= 0 && rowConsidered <= 7 && (colConsidered = col + i) >= 0 && colConsidered <= 7) {
                            let pieceConsidered = squares[rowConsidered][colConsidered].piece;
                            if (pieceConsidered !== null && !sameColorPiece(piece, pieceConsidered)) {
                                list.push([rowConsidered, colConsidered]);
                            }
                        }
                    }
                    // TODO: En Passant if (board.enPassantAvailable)...
                    break;
                case BKing:
                case WKing:
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            // don't consider if it's the same square the King is on or if it's out of bounds
                            if ((i !== 0 || j !== 0) && (rowConsidered = row + i) >= 0 && rowConsidered <= 7 && (colConsidered = col + j) >= 0 && colConsidered <= 7) {
                                let pieceConsidered = squares[rowConsidered][colConsidered].piece;
                                if ((!sameColorPiece(piece, pieceConsidered)) /*&& !isInCheck(board, rowConsidered, colConsidered)*/) {
                                    list.push([rowConsidered, colConsidered]);
                                }   
                            }
                        }
                    }
                    // TODO: Castling!!
                    break;
                case BKnight:
                case WKnight:
                    for (let i = -2; i <= 2; i++) {
                        for (let j = -2; j <= 2; j++) {
                            if (i !== 0 && j !== 0 && Math.abs(i) !== Math.abs(j) && (rowConsidered = row + i) >= 0 && rowConsidered <= 7 && (colConsidered = col + j) >= 0 && colConsidered <= 7) {
                                let pieceConsidered = squares[rowConsidered][colConsidered].piece;
                                if (!sameColorPiece(piece, pieceConsidered)) {
                                    list.push([rowConsidered, colConsidered]);
                                }
                            }
                        }
                    }
                    break;
                case BQueen:
                case WQueen:
                    bypass = true;
                case BBishop:
                case WBishop:
                    list = list.concat(getPossibleMovesSelect("diagonals"));
                    if (!bypass) {
                        break;
                    }
                case BRook:
                case WRook:
                    list = list.concat(getPossibleMovesSelect("orthogonals"));                  
                default:
            }
            list.forEach(elt => squares[elt[0]][elt[1]].border = "2px solid blue");
            return list;
        };

        const pairInArray = (pair, array) => {
            for (let i = 0; i < array.length; i++) {
                if (array[i][0] === pair[0] && array[i][1] === pair[1]) {
                    return true;
                }
            }
            return false;
        };

        const makeMove = () => {
            //castling case handled here
            //TODO: record points/pieces captured, add captured pieces as icons on the side
            //remove piece from original square and set other squares piece to piece considered
            const selectedRow = squareSelected[0];
            const selectedCol = squareSelected[1];
            squares[row][col].piece = squares[selectedRow][selectedCol].piece;
            squares[selectedRow][selectedCol].piece = null;
            //set to opponents move
            //onPlay();
        };
        
        if (checkmate(squares, whitesTurn)) {
            return;
        }
        clearBorders();
        if ((whitesTurn && whitePiece(squares[row][col].piece)) || (!whitesTurn && blackPiece(squares[row][col].piece))) {
            // if castling: makeMove()
            setSquareSelected([row, col]);
            squares[row][col].border = "5px solid red";
            setPossibleMoves(getPossibleMoves(squares[row][col].piece));
            setFirstClick(false);
            return;
        }
        if (firstClick) {
            return;
        }
        if (pairInArray([row, col], possibleMoves)) {
            makeMove();
            onPlay();
        }
        setSquareSelected(null);
        setPossibleMoves([]);
        setFirstClick(true);      
    };
    
    return (
      <>
        <Row row={squares[0]} initialWhiteSquare={true} onRowClick={(col) => handleClick(0, col)} />
        <Row row={squares[1]} initialWhiteSquare={false} onRowClick={(col) => handleClick(1, col)} />
        <Row row={squares[2]} initialWhiteSquare={true} onRowClick={(col) => handleClick(2, col)} />
        <Row row={squares[3]} initialWhiteSquare={false} onRowClick={(col) => handleClick(3, col)} />
        <Row row={squares[4]} initialWhiteSquare={true} onRowClick={(col) => handleClick(4, col)} />
        <Row row={squares[5]} initialWhiteSquare={false} onRowClick={(col) => handleClick(5, col)} />
        <Row row={squares[6]} initialWhiteSquare={true} onRowClick={(col) => handleClick(6, col)} />
        <Row row={squares[7]} initialWhiteSquare={false} onRowClick={(col) => handleClick(7, col)} />
      </>
    );
  } 
  
  const emptyRow = () => {return [{piece: null, border: "0px"}, {piece: null, border: "0px"}, {piece: null, border: "0px"}, {piece: null, border: "0px"}, {piece: null, border: "0px"}, {piece: null, border: "0px"}, {piece: null, border: "0px"}, {piece: null, border: "0px"}];}

  const initBoard = [ // TODO: turn this into a generative function, border default value?
    [{piece: BRook, border: "0px"}, {piece: BKnight, border: "0px"}, {piece: BBishop, border: "0px"}, {piece: BQueen, border: "0px"}, {piece: BKing, border: "0px"}, {piece: BBishop, border: "0px"}, {piece: BKnight, border: "0px"}, {piece: BRook, border: "0px"}],
    [{piece: BPawn, border: "0px"}, {piece: BPawn, border: "0px"}, {piece: BPawn, border: "0px"}, {piece: BPawn, border: "0px"}, {piece: BPawn, border: "0px"}, {piece: BPawn, border: "0px"}, {piece: BPawn, border: "0px"}, {piece: BPawn, border: "0px"}],
    emptyRow(), emptyRow(), emptyRow(), emptyRow(),
    [{piece: WPawn, border: "0px"}, {piece: WPawn, border: "0px"}, {piece: WPawn, border: "0px"}, {piece: WPawn, border: "0px"}, {piece: WPawn, border: "0px"}, {piece: WPawn, border: "0px"}, {piece: WPawn, border: "0px"}, {piece: WPawn, border: "0px"}],
    [{piece: WRook, border: "0px"}, {piece: WKnight, border: "0px"}, {piece: WBishop, border: "0px"}, {piece: WQueen, border: "0px"}, {piece: WKing, border: "0px"}, {piece: WBishop, border: "0px"}, {piece: WKnight, border: "0px"}, {piece: WRook, border: "0px"}],
]

  export default function Game() {
    const [history, setHistory] = useState([initBoard]); // TODO: add history
    const [currentMove, setCurrentMove] = useState(0);
    const whitesTurn = currentMove % 2 === 0;
    const currentSquares = history[0];

    function handlePlay() {
        setCurrentMove(currentMove + 1);
    }

    return (
        <>
            <div className="board">
                <Board whitesTurn={whitesTurn} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <h1>{whitesTurn ? "White's Turn" : "Black's Turn"}</h1>
        </>
    );
  }

  function whitePiece(piece) {
    return piece === WRook || piece === WKnight || piece === WBishop || piece === WQueen || piece === WKing || piece === WPawn;
  }

  function blackPiece(piece) {
    return piece === BRook || piece === BKnight || piece === BBishop || piece === BQueen || piece === BKing || piece === BPawn;
  }

  function checkmate(squares, whitesTurn) {
    return false;
  }