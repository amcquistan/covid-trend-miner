import React from 'react';
import { XHR } from '../../services/xhr/XHR';
import Button from 'react-bootstrap/Button';

export const xhr = XHR.getInstance();

const Footer = () => {
    const update = () => {
        alert(`${window.location}`);
    }
  return (
      <nav className="navbar fixed-bottom navbar-light bg-light">
          <a className="navbar-brand" href="/">Simple Footer Example</a>
          <Button variant="outline-success" onClick={update}>Update</Button>
      </nav>
  );
};

export default Footer;
