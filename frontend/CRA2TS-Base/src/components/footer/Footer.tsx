import React from 'react';
import { XHR } from '../../services/xhr/XHR';
import Button from 'react-bootstrap/Button';

export const xhr = XHR.getInstance();

const Footer: React.FC = () => {
    const update = () => {
        alert(`${window.location}`);
    }
  return (
      <nav className="navbar fixed-bottom navbar-light bg-light">
          <a className="navbar-brand" href="/">Fixed Footer</a>
          <Button variant="outline-success" onClick={update}>Update</Button>
      </nav>
  );
};

export default Footer;
