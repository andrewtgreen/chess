class Bishop extends Piece {
    constructor(row, col, whitePiece) {
        super(row, col, whitePiece);
    }

    filePath() {
		return isWhitePiece? "images/whitebishop.png" : "images/blackbishop.png";
	}

    getPossibleMoves(board) {
		list = [];
        let pieceConsidered;
        let rowConsidered, colConsidered;
        for (let i = 0; i < 4; i++) {
            let count = 1;
            while (rowConsidered >= 0 && rowConsidered <= 7 && (col - count) >= 0 && (col - count) <= 7) {
                switch (i) {
                    case 0:
                        rowConsidered = row - count;
                        colConsidered = col - count;
                        break;
                    case 1:
                        rowConsidered = row - count;
                        colConsidered = col + count;
                        break;
                    case 2:
                        rowConsidered = row + count;
                        colConsidered = col + count;
                        break;
                    case 3:
                        rowConsidered = row + count;
                        colConsidered = row - count;
                }
                pieceConsidered = board.squares[rowConsidered][colConsidered].currentPiece;
                if (pieceConsidered === null) {
                    list.push([rowConsidered, colConsidered]);
                } else if (pieceConsidered.isWhitePiece != this.isWhitePiece) {
                    list.push([rowConsidered, colConsidered]);
                    break;
                } else {
                    break;
                }
                count++;
            }
        }
		return list;
	}
}