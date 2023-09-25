class Piece {
    constructor(row, col, whitePiece) {
        this.row = row;
        this.col = col;
        this.whitePiece = whitePiece;
    }
    currentSquare() {
        return [row, col];
    }
}