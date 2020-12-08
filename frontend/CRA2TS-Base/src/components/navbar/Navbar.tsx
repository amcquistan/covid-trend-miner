import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import './Navbar.css';

const NavBar: React.FC = () => {
    var home = "/countries";
    var countries = '/countries';
  return (
      <Navbar bg="light" expand="lg" className="sticky-top">
          <Navbar.Brand href={home}>Simple Navbar Example</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                  <Nav.Link href={home}>Home</Nav.Link>
                  <NavDropdown title="Actions" id="basic-nav-dropdown">
                      <NavDropdown.Item href={countries}>Countries</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href={home}>Home</NavDropdown.Item>
                  </NavDropdown>
              </Nav>
              <Form inline>
                  <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                  <Button variant="outline-success" onClick={() => alert(`not implemented ${window.location}`)}>Search</Button>
              </Form>
          </Navbar.Collapse>
      </Navbar>
  );
};

export default NavBar;
