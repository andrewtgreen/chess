import java.util.ArrayList;

public class BishopPiece extends ChessPiece {

	public BishopPiece(int row, int col, boolean whitePiece) {
		super(row, col, whitePiece);
	}
	
	public String filePath() {
		return isWhitePiece? "C:\\Users\\Andrew\\Documents\\Chess Pieces\\whitebishop.png" : "C:\\Users\\Andrew\\Documents\\Chess Pieces\\blackbishop.png";
	}
	
	public ArrayList<Node> getPossibleMoves(ChessBoard board) {
		ArrayList<Node> list= new ArrayList<>();
		for (int count = 1; (row - count) >= 0 && (row - count) <= 7 && (col - count) >= 0 && (col - count) <= 7; count++) {
			ChessPiece pieceConsidered = board.squares[row - count][col - count].currentPiece;
			if (pieceConsidered == null) {
				list.add(new Node(row - count, col - count));
			} else if (pieceConsidered.isWhitePiece != this.isWhitePiece) {
				list.add(new Node(row - count, col - count));
				break;
			} else {
				break;
			}
		}
		for (int count = 1; (row + count) >= 0 && (row + count) <= 7 && (col - count) >= 0 && (col - count) <= 7; count++) {
			ChessPiece pieceConsidered = board.squares[row + count][col - count].currentPiece;
			if (pieceConsidered == null) {
				list.add(new Node(row + count, col - count));
			} else if (pieceConsidered.isWhitePiece != this.isWhitePiece) {
				list.add(new Node(row + count, col - count));
				break;
			} else {
				break;
			}
		}
		for (int count = 1; (row - count) >= 0 && (row - count) <= 7 && (col + count) >= 0 && (col + count) <= 7; count++) {
			ChessPiece pieceConsidered = board.squares[row - count][col + count].currentPiece;
			if (pieceConsidered == null) {
				list.add(new Node(row - count, col + count));
			} else if (pieceConsidered.isWhitePiece != this.isWhitePiece) {
				list.add(new Node(row - count, col + count));
				break;
			} else {
				break;
			}
		}
		for (int count = 1; (row + count) >= 0 && (row + count) <= 7 && (col + count) >= 0 && (col + count) <= 7; count++) {
			ChessPiece pieceConsidered = board.squares[row + count][col + count].currentPiece;
			if (pieceConsidered == null) {
				list.add(new Node(row + count, col + count));
			} else if (pieceConsidered.isWhitePiece != this.isWhitePiece) {
				list.add(new Node(row + count, col + count));
				break;
			} else {
				break;
			}
		}
		return list;
	}
	
	public String toString() {
		return isWhitePiece? "WBishop" : "BBishop";
	}
	
}
