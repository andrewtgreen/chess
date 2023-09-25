class Bishop extends Piece {
    constructor(row, col, whitePiece) {
        super(row, col, whitePiece);
    }

    filePath() {
		return isWhitePiece? "images/whitebishop.png" : "images/blackbishop.png";
	}

    getPossibleMoves(board) {
        return getPossibleMovesSelect(board, "diagonals");
    }
}