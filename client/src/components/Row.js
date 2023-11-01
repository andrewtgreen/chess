import React from 'react';
import Square from './Square';

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

export default Row;