// This is for how to graudate a pawn

//Right under handleClick(row, col):

// // Move piece in squareSelected to square clicked ([row, col])
        // const makeMove = () => {
        //     // TODO: record points/pieces captured, add captured pieces as icons on the side
        //     // remove piece from original square and set other squares piece to piece considered
        //     const selectedRow = squareSelected[0];
        //     const selectedCol = squareSelected[1];
        //     const pieceToMove = squares[selectedRow][selectedCol].piece;
        //     let captured = squares[row][col].piece;
        //     // upgrade pawn or en passant check
        //     if (pieceToMove === (whitesTurn ? "WPawn" : "BPawn")) {
        //         // upgrade pawn
        //         if (row === (whitesTurn ? 0 : 7)) {
        //             // store destination square
        //             setDestinationSquare([row, col]);
        //             setCapturedOnUpgrade(captured);                 
        //             setShowUpgrade(true);
        //             setUpgradeSquareSelected([selectedRow, selectedCol]);
        //             return;
        //         } 
        //         // en passant
        //           else if (selectedCol !== col && squares[row][col].piece === null) {
        //             captured = squares[highlightsToSave[1][0]][highlightsToSave[1][1]].piece;
        //             squares[highlightsToSave[1][0]][highlightsToSave[1][1]].piece = null;
        //         }
        //     }

        //     continueMakeMove(row, col, selectedRow, selectedCol, pieceToMove, captured);

        //     // // clear highlights from previous move now that move is definitively being made
        //     // highlightsToSave.forEach(elt => squares[elt[0]][elt[1]].highlight = null);
        //     // // set highlights for this move
        //     // squares[selectedRow][selectedCol] = {piece: null, highlight: "full"};
        //     // squares[row][col] = {piece: /*upgradeSelection ||*/ pieceToMove, highlight: "full"};
        //     // setHighlightsToSave([[selectedRow, selectedCol], [row, col]]);
        //     // const castleIfApplicable = () => {
        //     //     let colDiff = selectedCol - col;
        //     //         if (colDiff === 2) {
        //     //             squares[row][3].piece = (whitesTurn ? "WRook" : "BRook");
        //     //             squares[row][0].piece = null;
        //     //         } else if (colDiff === -2) {
        //     //             squares[row][5].piece = (whitesTurn ? "WRook" : "BRook");
        //     //             squares[row][7].piece = null;
        //     //         }
        //     // }
        //     // // castle if applicable and break castle possibility if applicable
        //     // switch (pieceToMove) {
        //     //     case "WKing":
        //     //         castleIfApplicable();
        //     //         setWhiteOOPossible(false);
        //     //         setWhiteOOOPossible(false);
        //     //         break;
        //     //     case "BKing":
        //     //         castleIfApplicable();
        //     //         setBlackOOPossible(false);
        //     //         setBlackOOOPossible(false);
        //     //         break;
        //     //     case "WRook":
        //     //         if (selectedRow === 7 && selectedCol === 0) {
        //     //             setWhiteOOOPossible(false);
        //     //         } else if (selectedRow === 7 && selectedCol === 7) {
        //     //             setWhiteOOPossible(false);
        //     //         }
        //     //         break;
        //     //     case "BRook":
        //     //         if (selectedRow === 0 && selectedCol === 0) {
        //     //             setBlackOOOPossible(false);
        //     //         } else if (selectedRow === 0 && selectedCol === 7) {
        //     //             setBlackOOPossible(false);
        //     //         }
        //     //         break;
        //     //     default:
        //     // }
        //     // // set to opponents move
        //     // onPlay(captured);
        // };



        //at top level scope of Board:

        // // make parameters into object and deconstruct / refactor in general, kinda messy
    // const continueMakeMove = (row, col, fromRow, selectedCol, pieceToMove, captured) => {
    //     // clear highlights from previous move now that move is definitively being made
    //     highlightsToSave.forEach(elt => squares[elt[0]][elt[1]].highlight = null);
    //     // set highlights for this move
    //     squares[selectedRow][selectedCol] = {piece: null, highlight: "full"};
    //     squares[row][col] = {piece: pieceToMove, highlight: "full"};
    //     setHighlightsToSave([[selectedRow, selectedCol], [row, col]]);
    //     const castleIfApplicable = () => {
    //         let colDiff = selectedCol - col;
    //             if (colDiff === 2) {
    //                 squares[row][3].piece = (whitesTurn ? "WRook" : "BRook");
    //                 squares[row][0].piece = null;
    //             } else if (colDiff === -2) {
    //                 squares[row][5].piece = (whitesTurn ? "WRook" : "BRook");
    //                 squares[row][7].piece = null;
    //             }
    //     }
    //     // castle if applicable and break castle possibility if applicable
    //     switch (pieceToMove) {
    //         case "WKing":
    //             castleIfApplicable();
    //             setWhiteOOPossible(false);
    //             setWhiteOOOPossible(false);
    //             break;
    //         case "BKing":
    //             castleIfApplicable();
    //             setBlackOOPossible(false);
    //             setBlackOOOPossible(false);
    //             break;
    //         case "WRook":
    //             if (selectedRow === 7 && selectedCol === 0) {
    //                 setWhiteOOOPossible(false);
    //             } else if (selectedRow === 7 && selectedCol === 7) {
    //                 setWhiteOOPossible(false);
    //             }
    //             break;
    //         case "BRook":
    //             if (selectedRow === 0 && selectedCol === 0) {
    //                 setBlackOOOPossible(false);
    //             } else if (selectedRow === 0 && selectedCol === 7) {
    //                 setBlackOOPossible(false);
    //             }
    //             break;
    //         default:
    //     }
    //     // set to opponents move
    //     onPlay(captured);
    //     // cleanup for upgrade calling this function
    //     setShowUpgrade(false);
    //     setDestinationSquare(null);
    //     setUpgradeSquareSelected(null);
    //     setCapturedOnUpgrade(null);
    // };