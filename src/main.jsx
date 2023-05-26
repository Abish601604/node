import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Mainbar = () => (
  <div className="container-fluid">
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        background: 'white',
        padding: 0,
        margin: 0,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: 'black', fontSize: '36px', marginBottom: '50px' }}>Barcode Creation</h1>
        <Link
          to="/nbarcode"
          style={{
            backgroundColor: 'black',
            borderRadius: '45px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            border: 'none',
            padding: '15px 30px',
            margin: '10px',
            textDecoration: 'none',
            fontSize: '18px',
            color: 'white',
          }}
          className="btn"
        >
          Description Barcode
        </Link>
        <Link
          to="/BarCode"
          style={{
            backgroundColor: 'black',
            borderRadius: '45px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            border: 'none',
            padding: '15px 30px',
            margin: '10px',
            textDecoration: 'none',
            fontSize: '18px',
            color: 'white',
            transition: 'background-color 0.3s ease',
          }}
          className="btn"
          // onMouseEnter={(e) => {
          //   e.target.style.backgroundColor = 'gray';
          // }}
          // onMouseLeave={(e) => {
          //   e.target.style.backgroundColor = 'black';
          // }}
        >
          Upload Files
        </Link>
      </div>
    </div>
  </div>
);

export default Mainbar;
