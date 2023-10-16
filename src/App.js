import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const WRook = 'whiteRook.png';
const WKnight = 'whiteKnight.png';
const WBishop = 'whiteBishop.png';
const WQueen = 'whiteQueen.png';
const WKing = 'whiteKing.png';
const WPawn = 'whitePawn.png';
const BRook = 'blackRook.png';
const BKnight = 'blackKnight.png';
const BBishop = 'blackBishop.png';
const BQueen = 'blackQueen.png';
const BKing = 'blackKing.png';
const BPawn = 'blackPawn.png';
const blackSquareHighlight = "#edeaa6";
const whiteSquareHighlight = "#f4f2ca";

const emptyRow = () => {return [{piece: null, highlight: false}, {piece: null, highlight: false}, {piece: null, highlight: false}, {piece: null, highlight: false}, {piece: null, highlight: false}, {piece: null, highlight: false}, {piece: null, highlight: false}, {piece: null, highlight: false}];};

const initBoard = [ // TODO: turn this into a generative function, border default value?
    [{piece: BRook, highlight: false}, {piece: BKnight, highlight: false}, {piece: BBishop, highlight: false}, {piece: BQueen, highlight: false}, {piece: BKing, highlight: false}, {piece: BBishop, highlight: false}, {piece: BKnight, highlight: false}, {piece: BRook, highlight: false}],
    [{piece: BPawn, highlight: false}, {piece: BPawn, highlight: false}, {piece: BPawn, highlight: false}, {piece: BPawn, highlight: false}, {piece: BPawn, highlight: false}, {piece: BPawn, highlight: false}, {piece: BPawn, highlight: false}, {piece: BPawn, highlight: false}],
    emptyRow(), emptyRow(), emptyRow(), emptyRow(),
    [{piece: WPawn, highlight: false}, {piece: WPawn, highlight: false}, {piece: WPawn, highlight: false}, {piece: WPawn, highlight: false}, {piece: WPawn, highlight: false}, {piece: WPawn, highlight: false}, {piece: WPawn, highlight: false}, {piece: WPawn, highlight: false}],
    [{piece: WRook, highlight: false}, {piece: WKnight, highlight: false}, {piece: WBishop, highlight: false}, {piece: WQueen, highlight: false}, {piece: WKing, highlight: false}, {piece: WBishop, highlight: false}, {piece: WKnight, highlight: false}, {piece: WRook, highlight: false}],
];

function whitePiece(piece) {
    return piece === WRook || piece === WKnight || piece === WBishop || piece === WQueen || piece === WKing || piece === WPawn;
}

function blackPiece(piece) {
    return piece === BRook || piece === BKnight || piece === BBishop || piece === BQueen || piece === BKing || piece === BPawn;
}

function Square({ theme, pieceSet, square, whiteSquare, onSquareClick }) {    
    return (
        <button className="square" onClick={onSquareClick} style={{background: whiteSquare ? (square.highlight ?  whiteSquareHighlight : theme.white) : (square.highlight ? blackSquareHighlight : theme.black)}}>
            <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${square.piece}`} width="75px" height="75px" onError = {e => e.target.src = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="}/>
        </button>
    );
  }

function Row({ theme, pieceSet, row, firstSquareIsWhite, onRowClick }) {
    return (
        <div className="board-row">
            <Square theme={theme} pieceSet={pieceSet} square={row[0]} whiteSquare={firstSquareIsWhite} onSquareClick={() => onRowClick(0)} />
            <Square theme={theme} pieceSet={pieceSet} square={row[1]} whiteSquare={!firstSquareIsWhite} onSquareClick={() => onRowClick(1)} />
            <Square theme={theme} pieceSet={pieceSet} square={row[2]} whiteSquare={firstSquareIsWhite} onSquareClick={() => onRowClick(2)} />
            <Square theme={theme} pieceSet={pieceSet} square={row[3]} whiteSquare={!firstSquareIsWhite} onSquareClick={() => onRowClick(3)} />
            <Square theme={theme} pieceSet={pieceSet} square={row[4]} whiteSquare={firstSquareIsWhite} onSquareClick={() => onRowClick(4)} />
            <Square theme={theme} pieceSet={pieceSet} square={row[5]} whiteSquare={!firstSquareIsWhite} onSquareClick={() => onRowClick(5)} />
            <Square theme={theme} pieceSet={pieceSet} square={row[6]} whiteSquare={firstSquareIsWhite} onSquareClick={() => onRowClick(6)} />
            <Square theme={theme} pieceSet={pieceSet} square={row[7]} whiteSquare={!firstSquareIsWhite} onSquareClick={() => onRowClick(7)} />
        </div>
    )
}

function Board({ theme, pieceSet, whitesTurn, squares, onPlay }) {
    //const [WRook, WKnight, WBishop, WQueen, WKing, WPawn, BRook, BKnight, BBishop, BQueen, BKing, BPawn] = pieceSet;
    const [firstClick, setFirstClick] = useState(true);
    const [squareSelected, setSquareSelected] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [gameOverStatus, setGameOverStatus] = useState(null);

    // Test for checkmate and stalemate on every render (before every move)
    useEffect( () => {
        // if condition for checkmate satisfied, then check for stalemate
        // TODO: refactor logic now that I'm checking all possible moves at the start of each turn, may as well set them for each piece after checking and reference for the rest of the turn
        
        // Check to see if opponent has any moves to make (this function is called right before it becomes the opponent's move)
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((whitesTurn && whitePiece(squares[i][j].piece)) || (!whitesTurn && blackPiece(squares[i][j].piece))) {
                    // IMPORTANT Make separate parameter for highlight as third parameter should be true
                    if (getPossibleMoves(i, j, true, false).length > 0) {
                        //console.log(`${i}, ${j}, ${getPossibleMoves(i, j, true)}`);
                        return;
                    }
                }
            }
        }
        // Stalemate test (test to see if the king in turn is in check or not)
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((whitesTurn && blackPiece(squares[i][j].piece)) || (!whitesTurn && whitePiece(squares[i][j].piece))) {
                    // IMPORTANT Make separate parameter for highlight as third parameter should be true
                    let possibleMoves = getPossibleMoves(i, j, true, false);
                    for (let k = 0; k < possibleMoves.length; k++) {
                        if (squares[possibleMoves[k][0]][possibleMoves[k][1]].piece === (whitesTurn ? WKing : BKing)) {
                            setGameOverStatus(whitesTurn ? "Black Wins!" : "White Wins!");
                            return;
                        }
                    }
                }
            }
        }
        setGameOverStatus("Stalemate");
    });

    // TODO: delete firstClick and just check whether squareSelected === null ?

    // Also highlights squares of possible moves if highlight set to true
    // note: if checking king safety, we care about a move possibility for the next move on the board. if not, we are seeing if a piece can capture a king in the immediate next move, regardless of whether it puts their own king in check or not
    const getPossibleMoves = (row, col, checkingKingSafety, highlight) => {

        const sameColorPiece = (p1, p2) => {
            if ((whitePiece(p1) && whitePiece(p2)) || (blackPiece(p1) && blackPiece(p2))) {
                return true;
            }
            return false;
        };

        /* (Helper function for getPossibleMovesSelect) In iterating through diagonal or orthogonal move possibilities for certain pieces, there are four directions to consider (up & left, up & right, down & left, down & right; up, down, right, left). 
        This helper function is meant to return the row of the square in consideration as a possible move for one of those pieces. */ 
        const rowConsideration = (row, direction, count, geometry) => {
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
        const colConsideration = (col, direction, count, geometry) => {
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
        const getPossibleMovesSelect = (row, col, geometry, checkingKingSafety) => {
            let rowConsidered, colConsidered, list = [];
            // Iterates through the four directions from the perspective of a given piece, given a geometry (diagonal or orthogonal)
            for (let direction = 0; direction < 4; direction++) {
                for (let count = 1; (rowConsidered = rowConsideration(row, direction, count, geometry)) >= 0 && rowConsidered <= 7 && (colConsidered = colConsideration(col, direction, count, geometry)) >= 0 && colConsidered <= 7; count++) {
                    let pieceConsidered = squares[rowConsidered][colConsidered].piece;
                    if (!sameColorPiece(piece, pieceConsidered)) {
                        if (!checkingKingSafety || kingIsSafe(rowConsidered, colConsidered)) {
                            list.push([rowConsidered, colConsidered]);
                        }
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

        // Checks if the king in turn is safe at a position given by rowConsidered, colConsidered
        const kingIsSafe = (rowConsidered, colConsidered) => {
            // IDEA: check outward in every direction (including knights) for opposing piece
            const testPieceToMove = squares[row][col].piece;
            const testCaptured = squares[rowConsidered][colConsidered].piece;
            squares[rowConsidered][colConsidered].piece = testPieceToMove;
            squares[row][col].piece = null;
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if ((whitesTurn && blackPiece(squares[i][j].piece)) || (!whitesTurn && whitePiece(squares[i][j].piece))) {
                        let possibleMoves = getPossibleMoves(i, j, false, false);
                        for (let k = 0; k < possibleMoves.length; k++) {
                            // Note: dont't actually need ternary check (even for castling), just looks cleaner than ... == WKing || ... == BKing)
                            if (squares[possibleMoves[k][0]][possibleMoves[k][1]].piece === (whitesTurn ? WKing : BKing)) {
                                // revert test and stop checking
                                squares[row][col].piece = testPieceToMove;
                                squares[rowConsidered][colConsidered].piece = testCaptured;
                                return false;
                            }
                        }
                    }
                }
            }
            // revert test and return
            squares[row][col].piece = testPieceToMove;
            squares[rowConsidered][colConsidered].piece = testCaptured;
            return true;
        };

        // variables default set for white pieces
        const piece = squares[row][col].piece;
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
                        if (!checkingKingSafety || kingIsSafe(rowConsidered, col)) {
                            list.push([rowConsidered, col]);
                        }
                    } else {
                        break;
                    }
                }
                // Captures
                for (let i = -1; i <= 1; i += 2) {
                    if ((rowConsidered = row + direction) >= 0 && rowConsidered <= 7 && (colConsidered = col + i) >= 0 && colConsidered <= 7) {
                        let pieceConsidered = squares[rowConsidered][colConsidered].piece;
                        if (pieceConsidered !== null && !sameColorPiece(piece, pieceConsidered) && (checkingKingSafety ? kingIsSafe(rowConsidered, colConsidered) : true)) {
                            list.push([rowConsidered, colConsidered]);
                        }
                    }
                }
                // TODO: En Passant
                break;
            case BKing:
            case WKing:
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        // don't consider it if it's the same square the King is on, or if it's out of bounds
                        if ((i !== 0 || j !== 0) && (rowConsidered = row + i) >= 0 && rowConsidered <= 7 && (colConsidered = col + j) >= 0 && colConsidered <= 7) {
                            let pieceConsidered = squares[rowConsidered][colConsidered].piece;
                            if (!sameColorPiece(piece, pieceConsidered) && (checkingKingSafety ? kingIsSafe(rowConsidered, colConsidered) : true)) {
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
                            if (!sameColorPiece(piece, pieceConsidered) && (checkingKingSafety ? kingIsSafe(rowConsidered, colConsidered) : true)) {
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
                list = list.concat(getPossibleMovesSelect(row, col, "diagonals", checkingKingSafety));
                if (!bypass) {
                    break;
                }
            case BRook:
            case WRook:
                list = list.concat(getPossibleMovesSelect(row, col, "orthogonals", checkingKingSafety));                  
            default:
        }
        if (highlight) {
            list.forEach(elt => squares[elt[0]][elt[1]].highlight = true);
        }
        return list;
    };
    
    const handleClick = (row, col) => {

        const pairInArray = (pair, array) => {
            for (let i = 0; i < array.length; i++) {
                if (array[i][0] === pair[0] && array[i][1] === pair[1]) {
                    return true;
                }
            }
            return false;
        };

        // Move piece in squareSelected to square clicked
        const makeMove = () => {
            //castling case handled here
            //TODO: record points/pieces captured, add captured pieces as icons on the side
            //remove piece from original square and set other squares piece to piece considered
            const selectedRow = squareSelected[0];
            const selectedCol = squareSelected[1];
            const pieceToMove = squares[selectedRow][selectedCol].piece;
            const captured = squares[row][col].piece;
            squares[row][col] = {piece: pieceToMove, highlight: true};
            squares[selectedRow][selectedCol] = {piece: null, highlight: true};
            //set to opponents move
            onPlay(captured);
        };

        if (gameOverStatus) {
            return;
        }

        // clear highlights: idea that is not working: possibleMoves.forEach(elt => squares[elt[0]][elt[1]].highlight = false"); (instead this will clear every highlight on the board)
        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 7; j++) {
                squares[i][j].highlight = false;
            }
        }
        if ((whitesTurn && whitePiece(squares[row][col].piece)) || (!whitesTurn && blackPiece(squares[row][col].piece))) {
            // if castling: makeMove()
            setSquareSelected([row, col]);
            squares[row][col].highlight = true;
            setPossibleMoves(getPossibleMoves(row, col, true, true));
            setFirstClick(false);
            return;
        }
        if (firstClick) {
            return;
        }
        if (pairInArray([row, col], possibleMoves)) {
            makeMove();
        }
        setSquareSelected(null);
        setPossibleMoves([]);
        setFirstClick(true);      
    };
    
    return (
      <>
        <div className="board" style={{border: `25px ridge ${theme.ridge}`}}>
            <Row theme={theme} pieceSet={pieceSet} row={squares[0]} firstSquareIsWhite={true} onRowClick={(col) => handleClick(0, col)} />
            <Row theme={theme} pieceSet={pieceSet} row={squares[1]} firstSquareIsWhite={false} onRowClick={(col) => handleClick(1, col)} />
            <Row theme={theme} ieceSet={pieceSet} row={squares[2]} firstSquareIsWhite={true} onRowClick={(col) => handleClick(2, col)} />
            <Row theme={theme} pieceSet={pieceSet} row={squares[3]} firstSquareIsWhite={false} onRowClick={(col) => handleClick(3, col)} />
            <Row theme={theme} pieceSet={pieceSet} row={squares[4]} firstSquareIsWhite={true} onRowClick={(col) => handleClick(4, col)} />
            <Row theme={theme} pieceSet={pieceSet} row={squares[5]} firstSquareIsWhite={false} onRowClick={(col) => handleClick(5, col)} />
            <Row theme={theme} pieceSet={pieceSet} row={squares[6]} firstSquareIsWhite={true} onRowClick={(col) => handleClick(6, col)} />
            <Row theme={theme} pieceSet={pieceSet} row={squares[7]} firstSquareIsWhite={false} onRowClick={(col) => handleClick(7, col)} />
        </div>
        <h1>{gameOverStatus ? gameOverStatus : (whitesTurn ? "white's turn" : "black's turn")}</h1>
      </>
    );
} 

export default function Game() {
    const [pieceSet, setPieceSet] = useState("original");
    const [history, setHistory] = useState([initBoard]); // TODO: add history
    const [currentMove, setCurrentMove] = useState(0);
    const whitesTurn = currentMove % 2 === 0;
    const currentSquares = history[0];
    // Rule of thumb for themes: keep same white, set black, ridge is one tint lighter than black, background is five tints lighter than black
    const decafTheme = {name: "decaf", white: "#e0daca", black: "#8a6a57", ridge: "#967968", backgroundColor: "#c5b5ab"};
    const matchaTheme = {name: "matcha", white: "#e0daca", black: "#5d7854", ridge: "#6d8665", backgroundColor: "#aebcaa"};
    const strawberryMilkTheme = {name: "strawberry milk", white: "#e0daca", black: "#bb8484", ridge: "#c29090", backgroundColor: "#ddc2c2"}  //"#c09aa5"
    const [theme, setTheme] = useState(decafTheme);
    const [whiteCapturedPieces, setWhiteCapturedPieces] = useState([]);
    const [blackCapturedPieces, setBlackCapturedPieces] = useState([]);

    // JS run when page renders and "Game" component mounts: (TODO: set this to a variable listened to for theme)
    useEffect(() => {document.body.style = `background: ${theme.backgroundColor}`;}, [theme]);

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
                {whiteCapturedPieces.map(elt => <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${elt}`} width="60px" height="60px"/>)}
                <div style={{position:"absolute", top:"140px"}}>
                    <h2>Black Captured Pieces:</h2>
                    {blackCapturedPieces.map(elt => <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${elt}`} width="60px" height="60px"/>)}
                </div>
                <div style={{position:"absolute", top:"280px"}}>
                    <h2>Options:</h2>
                    {/*make dropdown button linked to 'BLACK' variable at top of page, make theme button (themes using https://maketintsandshades.com/)*/}
                    {/* <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle id="dropdown-custom-1">{"Pieces: " + pieces}</Dropdown.Toggle>
                        <Dropdown.Menu bsPrefix="super-colors" style={{background: BLACK}} className="super-colors">
                        <Dropdown.Item /*func={() => setSelectedTheme("evil princess")} active={pieces === "evil princess"}>evil princess</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item /*func={() => setSelectedTheme("evil princess")} active={pieces === "original"}>original</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}

                    <DropdownButton variant="default" className="dropdown-button" title={"pieces: " + pieceSet}>
                        <Dropdown.Menu variant="default" style={{background: theme.black}} className="super-colors">
                            <Dropdown.Item onClick={() => setPieceSet("evil princess")} active={pieceSet === "evil princess"}>evil princess</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => setPieceSet("original")} active={pieceSet === "original"}>original</Dropdown.Item>
                        </Dropdown.Menu>
                    </DropdownButton>
                    <DropdownButton variant="default" className="dropdown-button" title={"theme: " + theme.name}>
                        <Dropdown.Menu variant="default" style={{background: theme.black}}>
                            <Dropdown.Item onClick={() => setTheme(matchaTheme)} active={theme.name === "matcha"}>matcha</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTheme(strawberryMilkTheme)} active={theme.name === "strawberry milk"}>strawberry milk</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => setTheme(decafTheme)} active={theme.name === "decaf"}>decaf</Dropdown.Item>
                        </Dropdown.Menu>
                    </DropdownButton>
                </div>
            </div>
        </div>
    );
}