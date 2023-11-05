import React, { useLayoutEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { whitePiece, blackPiece, Board } from './Board';

const emptyRow = () => {return [{piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}, {piece: null, highlight: null}];};

const initBoard = [ // TODO: turn this into a generative function, highlight default value?
    [{piece: "BRook", highlight: null}, {piece: "BKnight", highlight: null}, {piece: "BBishop", highlight: null}, {piece: "BQueen", highlight: null}, {piece: "BKing", highlight: null}, {piece: "BBishop", highlight: null}, {piece: "BKnight", highlight: null}, {piece: "BRook", highlight: null}],
    [{piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}, {piece: "BPawn", highlight: null}],
    emptyRow(), emptyRow(), emptyRow(), emptyRow(),
    [{piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}, {piece: "WPawn", highlight: null}],
    [{piece: "WRook", highlight: null}, {piece: "WKnight", highlight: null}, {piece: "WBishop", highlight: null}, {piece: "WQueen", highlight: null}, {piece: "WKing", highlight: null}, {piece: "WBishop", highlight: null}, {piece: "WKnight", highlight: null}, {piece: "WRook", highlight: null}],
];

function Game({ theme, pieceSet }) {
    const [history, setHistory] = useState([initBoard]); // TODO: add history
    const [currentMove, setCurrentMove] = useState(0);
    const whitesTurn = currentMove % 2 === 0;
    const currentSquares = history[0];
    const [whiteCapturedPieces, setWhiteCapturedPieces] = useState([]);
    const [blackCapturedPieces, setBlackCapturedPieces] = useState([]);
 
    // JS run when page renders and "Game" component mounts: (TODO: set this to a variable listened to for theme)
    useLayoutEffect(() => {document.body.style = `background: ${theme.backgroundColor}`;}, [theme]);

    function handlePlay(captured) {
        if (whitePiece(captured)) {
            setWhiteCapturedPieces([captured, ...whiteCapturedPieces]);
        } else if (blackPiece(captured)) {
            setBlackCapturedPieces([captured, ...blackCapturedPieces]);
        }
        setCurrentMove(currentMove + 1);
    }

    return (
        <div style={{color: theme.black}}>
            <div className="column1">
                <Board theme={theme} pieceSet={pieceSet} whitesTurn={whitesTurn} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="column2">
                <h2>White Captured Pieces:</h2>
                {whiteCapturedPieces.map(elt => <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${elt}.png`} width="60px" height="60px"/>)}
                <div style={{position:"absolute", top:"140px"}}>
                    <h2>Black Captured Pieces:</h2>
                    {blackCapturedPieces.map(elt => <img src={`${process.env.PUBLIC_URL}/pieces/${pieceSet}/${elt}.png`} width="60px" height="60px"/>)}
                </div>
                <div style={{position:"absolute", top:"280px"}}>
                    <h2>Options:</h2>
                    {/*make dropdown button linked to 'BLACK' variable at top of page, make theme button (themes using https://maketintsandshades.com/)*/}
                    {/* <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle id="dropdown-custom-1">{"Pieces: " + pieces}</Dropdown.Toggle>
                        <Dropdown.Menu bsPrefix="super-colors" style={{background: BLACK}} className="super-colors">
                        <Dropdown.Item /*func={() => setSelectedTheme("evil princess")} active={pieces === "evil princess"}>evil princess</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item /*func={() => setSelectedTheme("evil princess")} active={pieces === "original"}>original</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown> */}

                    {/* <DropdownButton variant="default" className="dropdown-button" title={"pieces: " + pieceSet}>
                        <Dropdown.Menu variant="default" style={{background: theme.black}} className="super-colors">
                            <Dropdown.Item onClick={() => setPieceSet("evil princess")} active={pieceSet === "evil princess"}>evil princess</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => setPieceSet("original")} active={pieceSet === "original"}>original</Dropdown.Item>
                        </Dropdown.Menu>
                    </DropdownButton> */}
                    {/* <DropdownButton variant="default" className="dropdown-button" title={"flavor: " + theme.name}>
                        <Dropdown.Menu variant="default" style={{background: theme.black}}>
                            <Dropdown.Item onClick={() => setTheme(matchaTheme)} active={theme.name === "matcha"}>matcha</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTheme(taroTheme)} active={theme.name === "taro"}>taro</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTheme(mangoTheme)} active={theme.name === "mango"}>mango</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTheme(vanillaBeanTheme)} active={theme.name === "vanilla bean"}>vanilla bean</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTheme(strawberryMilkTheme)} active={theme.name === "strawberry milk"}>strawberry milk</Dropdown.Item>
                            <Dropdown.Item onClick={() => setTheme(lavenderMilkTheme)} active={theme.name === "lavender milk"}>lavender milk</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => setTheme(javaChipTheme)} active={theme.name === "javaChipTheme"}>java chip</Dropdown.Item>
                        </Dropdown.Menu>
                    </DropdownButton> */}
                </div>
            </div>
        </div>
    );
}

export default Game;