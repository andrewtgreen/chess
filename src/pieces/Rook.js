class Rook extends Piece {
    constructor(row, col, whitePiece) {
        super(row, col, whitePiece);
    }

    getPossibleMoves(board) {
        return getPossibleMovesSelect(board, "orthogonals");
    }
}