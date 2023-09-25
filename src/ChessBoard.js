import './pieces';
class ChessBoard {
    numRows = 8;
    numCols = 8;
    squares;
    whitePossibleMoves;
    blackPossibleMoves;

    constructor() {
        // this.numRows = 8;
        // this.numCols = 8;
        whiteSquare = false;
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numCols; j++) {
                this.squares[i][j] = new BoardSquare(whiteSquare, i, j, null);
				whiteSquare = !whiteSquare;
			}
			whiteSquare = !whiteSquare;
        }
        squares[0][0].currentPiece = new Rook(0, 0, false);
		squares[0][1].currentPiece = new Knight(0, 1, false);
		squares[0][2].currentPiece = new Bishop(0, 2, false);
		squares[0][3].currentPiece = new Queen(0, 3, false);
		squares[0][4].currentPiece = new King(0, 4, false);
		squares[0][5].currentPiece = new Bishop(0, 5, false);
		squares[0][6].currentPiece = new Knight(0, 6, false);
		squares[0][7].currentPiece = new Rook(0, 7, false);

        for (let j = 0; j < numCols; j++) {
			squares[1][j].currentPiece = new Pawn(1, j, false);
		}
        
        for (let j = 0; j < numCols; j++) {
			squares[6][j].currentPiece = new Pawn(6, j, true);
		}

		squares[7][0].currentPiece = new Rook(7, 0, true);
		squares[7][1].currentPiece = new Knight(7, 1, true);
		squares[7][2].currentPiece = new Bishop(7, 2, true);
		squares[7][3].currentPiece = new Queen(7, 3, true);
		squares[7][4].currentPiece = new King(7, 4, true);
		squares[7][5].currentPiece = new Bishop(7, 5, true);
		squares[7][6].currentPiece = new Knight(7, 6, true);
		squares[7][7].currentPiece = new Rook(7, 7, true);
    }
}