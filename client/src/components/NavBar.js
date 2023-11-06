import React, { useState } from 'react';
import { Button, Offcanvas, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Cookies from 'universal-cookie';
// Rule of thumb for themes: keep same white, set black, ridge is one tint lighter than black, background is five tints lighter than black
export const javaChipTheme = {name: "java chip", white: "#e0daca", black: "#8a6a57", ridge: "#967968", backgroundColor: "#c5b5ab"};
const matchaTheme = {name: "matcha", white: "#e0daca", black: "#5d7854", ridge: "#6d8665", backgroundColor: "#aebcaa"};
const taroTheme = {name: "taro", white: "#e0daca", black: "#7a677c", ridge: "#877689", backgroundColor: "#bdb3be"}
const mangoTheme = {name: "mango", white: "#e0daca", black: "#d69f47", ridge: "#daa959", backgroundColor: "#ebcfa3"};
const vanillaBeanTheme = {name: "vanilla bean", white: "#e0daca", black: "", ridge: "", backgroundColor: ""};
const strawberryMilkTheme = {name: "strawberry milk", white: "#e0daca", black: "#bb8484", ridge: "#c29090", backgroundColor: "#ddc2c2"};
const lavenderMilkTheme = {name: "lavender milk", white: "#e0daca", black: "#8c92ac", ridge: "#989db4", backgroundColor: "#c6c9d6"};

function NavBar({ theme, setTheme, game, pieceSet, setPieceSet, logout }) {
    const [showSettings, setShowSettings] = useState(false);
    const textButtonStyle = {background: theme.white, color: theme.black, border: "none"};
    const clearButtonStyle = {background: "none", border: "none"};
    const cookies = new Cookies();

    return (
        <>
            <Navbar expand="lg" style={{background: theme.black, height: "3.3rem"}}>
                <Container fluid>
                    <Button style={clearButtonStyle} onClick={console.log("hey")}><img style={{display: "block", marginLeft: "auto", marginRight: "auto", width: "40%"}} src={`${process.env.PUBLIC_URL}/${game}Logo.png`}/></Button>
                    <Navbar.Brand href="#" style={{color: theme.white}}>BobaShop</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" style={{color: theme.white}} />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                            <Button style={clearButtonStyle} onClick={() => setShowSettings(true)}><img src={`${process.env.PUBLIC_URL}/settingsIcon.png`} style={{width: "1.5em"}}/></Button>
                        </Nav>
                        <Navbar.Text style={{color: theme.backgroundColor}}>
                            Signed in as: <a style={{color: theme.white, textDecoration: "none"}} href="#">{cookies.get("firstName")} {cookies.get("lastName")}</a>
                        </Navbar.Text>
                        &nbsp;&nbsp;
                        <Button
                          style={textButtonStyle}
                          onClick={logout}
                        >
                            Log out
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Offcanvas show={showSettings} onHide={() => setShowSettings(false)} style={{background: theme.backgroundColor, color: theme.black}}>
                <Offcanvas.Header closeButton>
                <Offcanvas.Title>Settings</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <NavDropdown title={"flavor: " + theme.name}>
                        <NavDropdown.Item onClick={() => setTheme(matchaTheme)} active={theme === matchaTheme}>matcha</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setTheme(taroTheme)} active={theme === taroTheme}>taro</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setTheme(mangoTheme)} active={theme === mangoTheme}>mango</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setTheme(vanillaBeanTheme)} active={theme === vanillaBeanTheme}>vanilla bean</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setTheme(strawberryMilkTheme)} active={theme === strawberryMilkTheme}>strawberry milk</NavDropdown.Item>
                        <NavDropdown.Item onClick={() => setTheme(lavenderMilkTheme)} active={theme === lavenderMilkTheme}>lavender milk</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => setTheme(javaChipTheme)} active={theme === javaChipTheme}>java chip</NavDropdown.Item>
                    </NavDropdown>
                    {game === "chess" ? 
                        <NavDropdown title={"pieces: " + pieceSet}>
                            <NavDropdown.Item onClick={() => setPieceSet("evil princess")} active={pieceSet === "evil princess"}>evil princess</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => setPieceSet("original")} active={pieceSet === "original"}>original</NavDropdown.Item>
                        </NavDropdown>
                        :
                        <></>
                    }
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default NavBar;