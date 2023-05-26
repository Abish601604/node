/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import JsBarcode from 'jsbarcode';
// import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Link } from 'react-router-dom';

const BarcodeGenerator = () => {
  const [inputData, setInputData] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');

  const generateBarcode = () => {
    if (inputData.trim() !== '') {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, inputData, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 20,
      });

      const generatedBarcodeData = canvas.toDataURL(); // Get the base64-encoded image data

      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Print Barcode</title></head><body style="height: 100vh; margin: 0;">');
      printWindow.document.write(`<div style=" width: ${width}px; height: ${height}px;">`);
      printWindow.document.write(`<img src="${generatedBarcodeData}" alt="Barcode" style="width: 100%; height: 100%;" />`);
      //   printWindow.document.write(`<p>${inputData}</p>`);
      printWindow.document.write('</div></body></html>');
      printWindow.document.close();

      // Wait for the image to load before printing
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  const handleInputChange = (event) => {
    setInputData(event.target.value);
  };

  const handleHeightChange = (event) => {
    setHeight(event.target.value);
  };

  const handleWidthChange = (event) => {
    setWidth(event.target.value);
  };
  const clearFields = () => {
    setInputData('');
    setHeight('');
    setWidth('');
  };
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Link
          style={{
            padding: '5px 10px',
            backgroundColor: 'black',
            borderRadius: '45px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            marginLeft: 30,
            marginBottom: 50,
            marginTop: 50,
            color:'white',

          }}
          to="/"
        >
          Back
        </Link>
      </div>
      <div>
        <div className="row">
          <div className="col-12 col-lg-4">
            <input
              type="text"
              value={inputData}
              onChange={handleInputChange}
              placeholder="Description"
              className="form-control"
              style={{ width: '300px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', border: 'none', marginLeft: 20 }}
            />
          </div>
          <div className="col-12 col-lg-2">
            <input
              type="text"
              value={height}
              onChange={handleHeightChange}
              placeholder="Height (mm)"
              className="form-control"
              style={{ width: '150px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', border: 'none', marginLeft: 10 }}
            />
          </div>
          <div className="col-12 col-lg-2">
            <input
              type="text"
              value={width}
              onChange={handleWidthChange}
              placeholder="Width (mm)"
              className="form-control"
              style={{ width: '150px', height: '40px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', border: 'none', marginLeft: 10 }}
            />
          </div>
          <div className="col-12 col-lg-2">
            <button
              onClick={generateBarcode}
              style={{
                backgroundColor: 'black',
                borderRadius: '45px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                marginLeft: 100,
                marginTop: 0,
                color:'white',
              }}
              className="btn print"
            >
              Print
            </button>
          </div>
          <div className="col-12 col-lg-2">
            <button
              onClick={clearFields}
              style={{
                backgroundColor: 'black',
                borderRadius: '45px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                marginLeft: 5,
                marginTop: 0,
                color:'white',
              }}
              className="btn clear"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerator;
