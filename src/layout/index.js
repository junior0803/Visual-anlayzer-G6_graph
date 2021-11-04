import React from 'react';
import { Link } from 'react-router-dom';
import {Navbar, Container, Nav } from 'react-bootstrap'

class Header extends React.Component {

    render () {
        return (
            <>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand as={Link} to="/"><h3>Visual Analyzing G6</h3></Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/home">Sample</Nav.Link>                 
                        </Nav>
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/degree">Degree</Nav.Link>                  
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </>
        )
    }
}

export default Header;