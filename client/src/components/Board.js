import React, { useLayoutEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from './Row';

function whitePiece(piece) {
    return piece === "WRook" || piece === "WKnight" || piece === "WBishop" || piece === "WQueen" || piece === "WKing" || piece === "WPawn";
}

function blackPiece(piece) {
    return piece === "BRook" || piece === "BKnight" || piece === "BBishop" || piece === "BQueen" || piece === "BKing" || piece === "BPawn";
}

function Board({ theme, pieceSet, whitesTurn, squares, onPlay }) {
    const [firstClick, setFirstClick] = useState(true);
    const [squareSelected, setSquareSelected] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [gameOverStatus, setGameOverStatus] = useState(null);
    const [highlightsToSave, setHighlightsToSave] = useState([]);
    const [whiteOOPossible, setWhiteOOPossible] = useState(true);
    const [blackOOPossible, setBlackOOPossible] = useState(true);
    const [whiteOOOPossible, setWhiteOOOPossible] = useState(true);
    const [blackOOOPossible, setBlackOOOPossible] = useState(true);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [destinationSquare, setDestinationSquare] = useState(null);
    // TODO: solution for why it doesn't work without this separate variable (can't just use squareSelected)
    const [upgradeSquareSelected, setUpgradeSquareSelected] = useState(null);

    // Test for checkmate and stalemate on every render (before every move): if condition for checkmate satisfied, then check for stalemate
    useLayoutEffect(() => {
        // TODO: refactor logic now that I'm checking all possible moves at the start of each turn, may as well set them for each piece after checking and reference for the rest of the turn
        
        // Check to see if player in turn has any moves to make
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((whitesTurn && whitePiece(squares[i][j].piece)) || (!whitesTurn && blackPiece(squares[i][j].piece))) {
                    // IMPORTANT Make separate parameter for highlight as third parameter should be true
                    if (getPossibleMoves(i, j, true, false).length > 0) {
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
                        if (squares[possibleMoves[k][0]][possibleMoves[k][1]].piece === (whitesTurn ? "WKing" : "BKing")) {
                            setGameOverStatus(whitesTurn ? "BLACK WINS!" : "WHITE WINS!");
                            return;
                        }
                    }
                }
            }
        }
        setGameOverStatus("Draw: Stalemate");
    });

    // TODO: delete firstClick and just check whether squareSelected === null ?

    // Move piece fromSquare toSquare
    const makeMove = (fromSquare, toSquare, pieceToMove) => {
        // TODO: record points/pieces captured, list scores next to pieces on side of board
        // remove piece from original square and set other squares piece to piece considered
        const fromRow = fromSquare[0];
        const fromCol = fromSquare[1];
        const toRow = toSquare[0];
        const toCol = toSquare[1];
        let captured = squares[toRow][toCol].piece;

        const castleIfApplicable = () => {
            let colDiff = fromCol - toCol;
                if (colDiff === 2) {
                    squares[toRow][3].piece = (whitesTurn ? "WRook" : "BRook");
                    squares[toRow][0].piece = null;
                } else if (colDiff === -2) {
                    squares[toRow][5].piece = (whitesTurn ? "WRook" : "BRook");
                    squares[toRow][7].piece = null;
                }
        }

        switch(pieceToMove) {
            case "WPawn":
            case "BPawn":
                // upgrade pawn check
                if (toRow === (whitesTurn ? 0 : 7)) {
                    // store destination square
                    setDestinationSquare([toRow, toCol]);          
                    setShowUpgrade(true);
                    setSquareSelected([fromRow, fromCol]);
                    setUpgradeSquareSelected([fromRow, fromCol]);
                    return;
                } // en passant check
                    else if (fromCol !== toCol && squares[toRow][toCol].piece === null) {
                    captured = squares[highlightsToSave[1][0]][highlightsToSave[1][1]].piece;
                    squares[highlightsToSave[1][0]][highlightsToSave[1][1]].piece = null;
                }
                break;
            // castle/break castle possibility if applicable
            case "WKing":
                castleIfApplicable();
                setWhiteOOPossible(false);
                setWhiteOOOPossible(false);
                break;
            case "BKing":
                castleIfApplicable();
                setBlackOOPossible(false);
                setBlackOOOPossible(false);
                break;
            case "WRook":
                if (fromRow === 7 && fromCol === 0) {
                    setWhiteOOOPossible(false);
                } else if (fromRow === 7 && fromCol === 7) {
                    setWhiteOOPossible(false);
                }
                break;
            case "BRook":
                if (fromRow === 0 && fromCol === 0) {
                    setBlackOOOPossible(false);
                } else if (fromRow === 0 && fromCol === 7) {
                    setBlackOOPossible(false);
                }
                break;
            default:
        } 
        // clear highlights from previous move now that move is definitively being made
        highlightsToSave.forEach(elt => squares[elt[0]][elt[1]].highlight = null);
        // set highlights for this move
        squares[fromRow][fromCol] = {piece: null, highlight: "full"};
        squares[toRow][toCol] = {piece: pieceToMove, highlight: "full"};
        setHighlightsToSave([[fromRow, fromCol], [toRow, toCol]]);
        // cleanup for pawn upgrade calling this function
        setShowUpgrade(false);
        setDestinationSquare(null);
        setUpgradeSquareSelected(null);
        // set to opponents move and record captured piece (if any)
        onPlay(captured);
    }; 

    const pairInArray = (pair, array) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i][0] === pair[0] && array[i][1] === pair[1]) {
                return true;
            }
        }
        return false;
    };

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
            squares[row][col].piece = null;
            squares[rowConsidered][colConsidered].piece = testPieceToMove;
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if ((whitesTurn && blackPiece(squares[i][j].piece)) || (!whitesTurn && whitePiece(squares[i][j].piece))) {
                        let possibleMoves = getPossibleMoves(i, j, false, false);
                        for (let k = 0; k < possibleMoves.length; k++) {
                            // Note: dont't actually need ternary check (even for castling), just looks cleaner than ... == "WKing" || ... == "BKing")
                            if (squares[possibleMoves[k][0]][possibleMoves[k][1]].piece === (whitesTurn ? "WKing" : "BKing")) {
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
            case "BPawn":
            case "WPawn":
                // Regular pawn moves
                for (let i = 1; pawnHasntMoved ? i <= 2 : i <= 1; i++) {
                    if ((rowConsidered = row + (i * direction)) >= 0 && rowConsidered <= 7 && squares[rowConsidered][col].piece === null && checkingKingSafety && kingIsSafe(rowConsidered, col)) {
                        list.push([rowConsidered, col]);
                    } else {
                        break;
                    }
                }
                // Captures/en passant
                for (let i = -1; i <= 1; i += 2) {
                    // Captures
                    if ((rowConsidered = row + direction) >= 0 && rowConsidered <= 7 && (colConsidered = col + i) >= 0 && colConsidered <= 7) {
                        let pieceConsidered = squares[rowConsidered][colConsidered].piece;
                        if (pieceConsidered !== null && !sameColorPiece(piece, pieceConsidered) && (checkingKingSafety ? kingIsSafe(rowConsidered, colConsidered) : true)) {
                            list.push([rowConsidered, colConsidered]);
                        }
                        // En passant: if there's an opposing pawn that just moved it will be at highlightsToSave[1] and the square it came from will be at highlightsToSave[0])
                         else if (checkingKingSafety && highlightsToSave.length === 2 // (piece just moved, will be true after first move of game)
                            && (highlightsToSave[1][0] + highlightsToSave[0][0])/2 === rowConsidered // (row in between highlighted squares from last move, or old and new square for last piece that moved, is rowConsidered)
                            && highlightsToSave[1][1] === colConsidered // (colConsidered is the same column as new square for last piece that moved)
                            && squares[highlightsToSave[1][0]][highlightsToSave[1][1]].piece === (whitesTurn ? "BPawn" : "WPawn") // (piece that just moved is a pawn)
                            && Math.abs(highlightsToSave[1][0] - highlightsToSave[0][0]) === 2) { // (said pawn moved two squares)
                            list.push([rowConsidered, colConsidered]);
                        }
                    }
                }
                break;
            case "BKing":
            case "WKing":
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
                // Castling
                if (!checkingKingSafety) {
                    break;
                }
                let OOOThisMove = whitesTurn ? whiteOOOPossible : blackOOOPossible, OOThisMove = whitesTurn ? whiteOOPossible : blackOOPossible;
                for (let i = 0; i <= 2; i++) {
                    if (OOOThisMove && !(pairInArray([row, col - i], list) || ((i === 0 || squares[row][col - i].piece === null) && kingIsSafe(row, col - i)))) {
                        OOOThisMove = false;
                    }
                    if (OOThisMove && !(pairInArray([row, col + i], list) || ((i === 0 || squares[row][col + i].piece === null) && kingIsSafe(row, col + i)))) {
                        OOThisMove = false;
                    }
                }
                if (OOOThisMove && squares[row][col - 3].piece === null) {
                    list.push([row, col - 2]);
                }
                if (OOThisMove) {
                    list.push([row, col + 2]);
                }
                break;
            case "BKnight":
            case "WKnight":
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
            case "BQueen":
            case "WQueen":
                bypass = true;
            case "BBishop":
            case "WBishop":
                list = list.concat(getPossibleMovesSelect(row, col, "diagonals", checkingKingSafety));
                if (!bypass) {
                    break;
                }
            case "BRook":
            case "WRook":
                list = list.concat(getPossibleMovesSelect(row, col, "orthogonals", checkingKingSafety));                  
            default:
        }
        if (highlight) {
            list.forEach(elt => squares[elt[0]][elt[1]].piece ? squares[elt[0]][elt[1]].highlight = "border" : squares[elt[0]][elt[1]].piece = "consideration");
        }
        return list;
    };
    
    const handleClick = (row, col) => {

        if (gameOverStatus) {
            return;
        }

        // clear highlights and move possibilities: idea that is not working: possibleMoves.forEach(elt => squares[elt[0]][elt[1]].highlight = false"); (instead this will clear every highlight on the board)
        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 7; j++) {
                if (pairInArray([i,j], highlightsToSave)) {
                    squares[i][j].highlight = "full";
                } else {
                    squares[i][j].highlight = null;
                }
                if (squares[i][j].piece === "consideration") {
                    squares[i][j].piece = null;
                }
            }
        }
        if ((whitesTurn && whitePiece(squares[row][col].piece)) || (!whitesTurn && blackPiece(squares[row][col].piece))) {
            setSquareSelected([row, col]);
            squares[row][col].highlight = "full";
            setPossibleMoves(getPossibleMoves(row, col, true, true));
            setFirstClick(false);
            return;
        }
        if (firstClick) {
            return;
        }
        if (pairInArray([row, col], possibleMoves)) {
            makeMove(squareSelected, [row, col], squares[squareSelected[0]][squareSelected[1]].piece);
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
            <Row theme={theme} pieceSet={pieceSet} row={squares[2]} firstSquareIsWhite={true} onRowClick={(col) => handleClick(2, col)} />
            <Row theme={theme} pieceSet={pieceSet} row={squares[3]} firstSquareIsWhite={false} onRowClick={(col) => handleClick(3, col)} />
            <Row theme={theme} pieceSet={pieceSet} row={squares[4]} firstSquareIsWhite={true} onRowClick={(col) => handleClick(4, col)} />
            <Row theme={theme} pieceSet={pieceSet} row={squares[5]} firstSquareIsWhite={false} onRowClick={(col) => handleClick(5, col)} />
            <Row theme={theme} pieceSet={pieceSet} row={squares[6]} firstSquareIsWhite={true} onRowClick={(col) => handleClick(6, col)} />
            <Row theme={theme} pieceSet={pieceSet} row={squares[7]} firstSquareIsWhite={false} onRowClick={(col) => handleClick(7, col)} />
        </div>
        <h1>{gameOverStatus ? gameOverStatus : (whitesTurn ? "white's turn" : "black's turn")}</h1>
        <Modal size="md" show={showUpgrade} onHide={() => setShowUpgrade(false)}>
            <Modal.Header closeButton style={{background: theme.backgroundColor}}>
                <button className="square" style={{background: theme.black}} onClick={() => makeMove(upgradeSquareSelected, destinationSquare, whitesTurn ? "WQueen" : "BQueen")}>
                    <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${whitesTurn ? "WQueen" : "BQueen"}.png`} width="75px" height="75px"/>
                </button>
                <button className="square" style={{background: theme.white}} onClick={() => makeMove(upgradeSquareSelected, destinationSquare, whitesTurn ? "WRook" : "BRook")}>
                    <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${whitesTurn ? "WRook" : "BRook"}.png`} width="75px" height="75px"/>
                </button>
                <button className="square" style={{background: theme.black}} onClick={() => makeMove(upgradeSquareSelected, destinationSquare, whitesTurn ? "WBishop" : "BBishop")}>
                    <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${whitesTurn ? "WBishop" : "BBishop"}.png`} width="75px" height="75px"/>
                </button>
                <button className="square" style={{background: theme.white}} onClick={() => makeMove(upgradeSquareSelected, destinationSquare, whitesTurn ? "WKnight" : "BKnight")}>
                    <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${whitesTurn ? "WKnight" : "BKnight"}.png`} width="75px" height="75px"/>
                </button>
            </Modal.Header>
        </Modal>
      </>
    );
} 

export { whitePiece, blackPiece, Board };