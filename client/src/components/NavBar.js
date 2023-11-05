import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
// Rule of thumb for themes: keep same white, set black, ridge is one tint lighter than black, background is five tints lighter than black
export const javaChipTheme = {white: "#e0daca", black: "#8a6a57", ridge: "#967968", backgroundColor: "#c5b5ab"};
const matchaTheme = {white: "#e0daca", black: "#5d7854", ridge: "#6d8665", backgroundColor: "#aebcaa"};
const taroTheme = {white: "#e0daca", black: "#7a677c", ridge: "#877689", backgroundColor: "#bdb3be"}
const mangoTheme = {white: "#e0daca", black: "#d69f47", ridge: "#daa959", backgroundColor: "#ebcfa3"};
const vanillaBeanTheme = {white: "#e0daca", black: "", ridge: "", backgroundColor: ""};
const strawberryMilkTheme = {white: "#e0daca", black: "#bb8484", ridge: "#c29090", backgroundColor: "#ddc2c2"};
const lavenderMilkTheme = {white: "#e0daca", black: "#8c92ac", ridge: "#989db4", backgroundColor: "#c6c9d6"};

function NavBar({ theme, setTheme, game, pieceSet, setPieceSet }) {
    const [show, setShow] = useState(false);
    
    return (
        <>
            <Navbar expand="lg" style={{background: theme.black}}>
                <Container fluid>
                    <Button style={{background: "none", border: "none"}} onClick={() => setShow(true)}><img src={`${process.env.PUBLIC_URL}/settingsIcon.png`} style={{width: "1.5em"}}/></Button>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                        >
                        <NavDropdown title="Link" id="navbarScrollingNavDropdown">
                            <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action4">
                            Another action
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action5">
                            Something else here
                            </NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#" disabled>
                            Link
                        </Nav.Link>
                        </Nav>
                        <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Offcanvas show={show} onHide={() => setShow(false)} style={{background: theme.backgroundColor, color: theme.black}}>
                <Offcanvas.Header closeButton>
                <Offcanvas.Title>Settings</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <NavDropdown title={"flavor: " + theme.name}>
                        <NavDropdown.Item onClick={() => setTheme(matchaTheme)} active={theme.name === "matcha"}>matcha</NavDropdown.Item>
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