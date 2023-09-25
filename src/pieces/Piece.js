import { computeHeadingLevel } from "@testing-library/react";

class Piece {
    constructor(row, col, whitePiece) {
        this.row = row;
        this.col = col;
        this.whitePiece = whitePiece;
    }
    
    currentSquare() {
        return [row, col];
    }

    /* (Helper function for getPossibleMovesSelect) In iterating through diagonal or orthogonal move possibilities for certain pieces, there are four directions to consider (up & left, up & right, down & left, down & right; up, down, right, left). 
        This helper function is meant to return the row of the square in consideration as a possible move for one of those pieces. */ 
    rowConsideration(direction, count, geometry) {
        switch (geometry) {
            case "diagonals":
                switch (direction) {
                    case 0:
                    case 1:
                        return row - count;
                    case 2:
                    case 3:
                        return row + count;
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
                }
        }
    }

    /* (Helper function for getPossibleMovesSelect) In iterating through diagonal or orthogonal move possibilities for certain pieces, there are four directions to consider (up & left, up & right, down & left, down & right; up, down, right, left). 
        This helper function is meant to return the column of the square in consideration as a possible move for one of those pieces. */ 
    colConsideration(direction, count, geometry) {
        switch (geometry) {
            case "diagonals":
                switch (direction) {
                    case 0:
                    case 3:
                        return col - count;
                    case 1:
                    case 2:
                        return col + count;
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
                }
        }
    }

    /* For a select few pieces (Rook, Bishop, Queen), this function considers squares in diagonal and/or orthogonal directions as possible moves for the piece.
        The geometry parameter ("diagonals"/"orthogonals") specifies which board squares we're considering from the piece this function is being called on. */
    getPossibleMovesSelect(board, geometry) {
        let pieceConsidered, rowConsidered, colConsidered, list = [];
        // Iterates through the four directions from the perspective of a given piece, given a geometry (diagonal or orthogonal)
        for (let direction = 0; direction < 4; direction++) {
            for (let count = 1; (rowConsidered = rowConsideration(direction, count, geometry)) >= 0 && rowConsidered <= 7 && (colConsidered = colConsideration(direction, count, geometry)) >= 0 && colConsidered <= 7; count++) {
                pieceConsidered = board.squares[rowConsidered][colConsidered].currentPiece;
                if (pieceConsidered === null) {
                    list.push([rowConsidered, colConsidered]);
                } else if (pieceConsidered.isWhitePiece != this.isWhitePiece) {
                    list.push([rowConsidered, colConsidered]);
                    break;
                } else {
                    break;
                }
            }
        }
		return list;
	}
}