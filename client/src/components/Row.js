import React from 'react';
import Square from './Square';

function Row({ theme, pieceSet, playerIsWhite, row, firstSquareIsWhite, onRowClick }) {
    return (
        <div className="board-row">
            {[...Array(8).keys()].map((i) => {
                return (
                    <Square key={i} theme={theme} pieceSet={pieceSet} square={row[playerIsWhite ? i : 7 - i]} whiteSquare={i%2 === 0 ? firstSquareIsWhite : !firstSquareIsWhite} onSquareClick={() => onRowClick(playerIsWhite ? i : 7 - i)} />
                )
            })}
        </div>
    )
}

export default Row;