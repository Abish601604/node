/* eslint-disable no-plusplus */
/* eslint-disable no-loop-func */
/* eslint-disable no-inner-declarations */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-return-assign */
/* eslint-disable react/button-has-type */
/* eslint-disable no-lonely-if */

import React, { useState } from 'react';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import { Link } from 'react-router-dom';
import './bar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Barcode = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  // const [pageSize, setPageSize] = useState(10);
  const [fileError, setFileError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedRowData, setSelectedRowData] = useState(null);
  const [printAll, setPrintAll] = useState(false);
  // const [barcodeImages, setBarcodeImages] = useState([]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFileError('');
      const formData = new FormData();
      formData.append('file', file);

      try {
        setLoading(true);
        // const response = await axios.post('http://localhost:5000/upload', formData);
        // const response = await axios.post('http://192.168.1.112:7070/upload', formData);
        const response = await axios.post('/.netlify/functions/upload', formData);

        setData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setFileError('Please upload a valid Excel file.');
    }
  };

  const handleClearAll = () => {
    setData(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }

    setFileError('');
    setSearchTerm('');
    setCurrentPage(1);
    setPrintAll(false);
    setLoading(false);
  };

  const handlePrint = (rowIndex) => {
    if (!data) {
      return; // Exit early if data is not available
    }
    if (printAll) {
      // Generate barcode images for all rows
      if (!data) {
        return; // Exit early if data is not available
      }

      const barcodeImages = [];
      let loadedImagesCount = 0;

      for (let i = 0; i < data.length - 1; i++) {
        const rowData = data[i + 1];
        const ID = rowData[0];
        const SPH = rowData[1];
        const CYL = rowData[2];
        const AXIS = rowData[3];
        const ADD = rowData[4];
        const DIA = rowData[5];
        const side = rowData[6];
        const sph = rowData[7];
        const cyl = rowData[8];
        const axis = rowData[9];
        const add = rowData[10];
        const dia = rowData[11];
        const barcodeValue = `${ID}-${side}`;

        const barcodeImage = new Image();

        barcodeImage.onload = () => {
          loadedImagesCount++;

          if (loadedImagesCount === data.length - 1) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Barcode</title>');
            printWindow.document.write('<style>');
            printWindow.document.write(`
          table {
            margin-top: 10px;
            width: 85px;
            height: 30px;
            border-spacing: 0;
          }
          .barcode-heading {
            text-align: center;
          }
          .barcode-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
          }
          .barcode-container img {
            width: 133.4px; /* Set width to 85mm */
            height: 47.1px; /* Set height to 30mm */
            object-fit: contain;
            margin: auto; /* Center the image */         
          }
          table td {
            font-size: 7px;
            padding: 5px;
            margin: 5px;
            
  
          }
          .barcode-table tbody {
            // height: 30px;
            // width:85px;
            
          }
        `);

            printWindow.document.write('</style></head><body>');

            barcodeImages.forEach((barcodeImage, index) => {
              const rowData = data[index + 1];
              const ID = rowData[0];
              const SPH = rowData[1];
              const CYL = rowData[2];
              const AXIS = rowData[3];
              const ADD = rowData[4];
              const DIA = rowData[5];
              const side = rowData[6];
              const sph = rowData[7];
              const cyl = rowData[8];
              const axis = rowData[9];
              const add = rowData[10];
              const dia = rowData[11];

              printWindow.document.write('<table>');
              printWindow.document.write('<tr><td colspan="6" style="text-align: center;">');
              printWindow.document.write('<div class="barcode-container">');
              printWindow.document.write(`<img src="${barcodeImage.src}" alt="Barcode" />`);
              printWindow.document.write('</div>');
              printWindow.document.write('</td></tr>');
              printWindow.document.write('<tr><td>Category</td><td>SPH</td><td>CYL</td><td>AXIS</td><td>ADD</td><td>DIA</td></tr>');
              printWindow.document.write(`<tr><td>Ordered</td><td>${SPH}</td><td>${CYL}</td><td>${AXIS}</td><td>${ADD}</td><td>${DIA}</td></tr>`);
              printWindow.document.write(`<tr><td>Inspected</td><td>${sph}</td><td>${cyl}</td><td>${axis}</td><td>${add}</td><td>${dia}</td></tr>`);
              printWindow.document.write('</table>');
            });

            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
            printWindow.close();

            // Reset printAll state
            setPrintAll(false);
          }
        };

        JsBarcode(barcodeImage, barcodeValue, {
          format: 'CODE128',
          displayValue: true,
          fontSize: 14,
          textMargin: 10,

        });

        barcodeImages.push(barcodeImage);
      }
    } else {
      const filteredData = data.slice(1).filter((row) => row.some((cell) => cell.toString().toLowerCase().includes(searchTerm.toLowerCase())));
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      if (rowIndex >= 0 && rowIndex < paginatedData.length) {
        const rowData = paginatedData[rowIndex];
        const ID = rowData[0];
        const SPH = rowData[1];
        const CYL = rowData[2];
        const AXIS = rowData[3];
        const ADD = rowData[4];
        const DIA = rowData[5];
        const SIDE = rowData[6];
        const sph = rowData[7];
        const cyl = rowData[8];
        const axis = rowData[9];
        const add = rowData[10];
        const dia = rowData[11];

        const barcodeValue = `${ID}-${SIDE}`;

        const barcodeImage = new Image();

        barcodeImage.onload = () => {
          const printWindow = window.open('', '_blank');
          printWindow.document.write('<html><head><title>Barcode</title>');
          printWindow.document.write('<style>');
          printWindow.document.write(`
        table {
          margin-top: 10px;
          width: 85px;
          height: 30px;
          border-spacing: 0;
        }
        .barcode-heading {
          text-align: center;
        }
        .barcode-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .barcode-container img {
          width: 133.4px; /* Set width to 85mm */
          height: 47.1px; /* Set height to 30mm */
          object-fit: contain;
          margin: auto; /* Center the image */         
        }
        table td {
          font-size: 7px;
          padding: 5px;
          margin: 5px;
          

        }
        .barcode-table tbody {
          // height: 30px;
          // width:85px;
          
        }
      `);

          printWindow.document.write('</style></head><body>');
          // printWindow.document.write('<div class="barcode-container" style=" width: 85px; height: 30px;">');
          // printWindow.document.write(`<img src="${barcodeImage.src}" alt="Barcode" />`);
          // printWindow.document.write('</div>');
          printWindow.document.write('<table>');
          printWindow.document.write('<tr><td colspan="6" style="text-align: center;">');
          printWindow.document.write('<div class="barcode-container">');
          printWindow.document.write(`<img src="${barcodeImage.src}" alt="Barcode" />`);
          printWindow.document.write('</div>');
          printWindow.document.write('</td></tr>');
          printWindow.document.write('<tr><td>Category</td><td>SPH</td><td>CYL</td><td>AXIS</td><td>ADD</td><td>DIA</td></tr>');
          printWindow.document.write(`<tr><td>Ordered</td><td>${SPH}</td><td>${CYL}</td><td>${AXIS}</td><td>${ADD}</td><td>${DIA}</td></tr>`);
          printWindow.document.write(`<tr><td>Inspected</td><td>${sph}</td><td>${cyl}</td><td>${axis}</td><td>${add}</td><td>${dia}</td></tr>`);
          printWindow.document.write('</table>');
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.print();
          printWindow.close();
        };

        JsBarcode(barcodeImage, barcodeValue, {
          format: 'CODE128',
          displayValue: true,
          fontSize: 20,
          textMargin: 10,
        });
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  let tableContent = null;

  if (loading) {
    tableContent = <p>Loading...</p>;
  } else if (data) {
    if (data.length > 0) {
      const filteredData = data.slice(1).filter((row) => row.some((cell) => cell.toString().toLowerCase().includes(searchTerm.toLowerCase())));
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      tableContent = (
        <>
          <table className="table custom-table" style={{ borderCollapse: 'separate', borderSpacing: '0 20px' }}>
            <thead>
              <tr>
                {data[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ borderRadius: '50px' }}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                  <td>
                    <button
                      onClick={() => handlePrint(rowIndex)}
                      className="btn secprint"
                      style={{
                        backgroundColor: 'black',
                        borderRadius: 45,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        // Add hover styles
                        transition: 'background-color 0.3s',
                        outline:'none',
                        color:'white',
                      }}
                        // Add hover event handlers
                      // eslint-disable-next-line no-return-assign
                      onMouseEnter={(e) => (e.target.style.backgroundColor = 'black', e.target.style.color = 'white')}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = 'black')}
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={{
                  backgroundColor: 'black',
                  borderRadius: '45px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  border: 'none',
                  transition: 'background-color 0.3s',
                  color:'white'
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'black', e.target.style.color = 'white')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'black' ,  e.target.style.color = 'white')}

                onClick={() => { setPrintAll(true); handlePrint(); }}
                className="btn print"
              >
                Print All
              </button>

              <button
                style={{
                  backgroundColor: 'black',
                  borderRadius: '45px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  color:'white'
                }}
                onClick={handleClearAll}
                className="btn print"
              >
                Clear All
              </button>
            </div>

            {/* <tfoot>
              <tr>
                <td colSpan={data[0].length}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      style={{
                        backgroundColor: '#FF5C8E',
                        borderRadius: '45px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        marginRight: '10px',
                      }}
                      onClick={() => { setPrintAll(true); handlePrint(); }}
                      className="btn print"
                    >
                      Print All
                    </button>
                    <button
                      style={{
                        backgroundColor: '#FF5C8E',
                        borderRadius: '45px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                      }}
                      className="btn print"
                    >
                      Clear All
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot> */}

          </table>

          {data.length > pageSize && (
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{ marginRight: 10 }}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <ul className="page-list">
              {/* render only relevant page numbers */}
              {Array.from(Array(Math.ceil(data.length / pageSize)).keys())
                .slice(currentPage - 1, currentPage + 2)
                .map((page) => (
                  <li
                    key={page}
                    style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
                    className={currentPage === page + 1 ? 'active' : ''}
                    style={{ display: currentPage === page + 1 ? 'block' : 'none' }}
                  >
                    <button onClick={() => handlePageChange(page + 1)}>{page + 1}</button>
                  </li>
                ))}
            </ul>
            <button
              style={{ marginLeft: 10 }}
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(data.length / pageSize)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          )}
        </>
      );
    } else {
      tableContent = <p>No data available.</p>;
    }
  }

  return (
  // <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">

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
      <div className="table-responsive custom-table-responsive" style={{ background: 45 }}>
        <div className="row">
          <div className="col-12 col-lg-5">
            <input type="file" className="form-control" accept=".xlsx" style={{ width: '250px', height: 'auto', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', border: 'none' }} onChange={handleFileUpload} />
            {fileError && <p className="error">{fileError}</p>}
          </div>

          <div className="col-12 col-lg-5">
            <input
              type="text"
              placeholder="Search"
              className="form-control"
              // style={{ width: '300px', height: 'auto', marginLeft: '373px' }}
              style={{ width: '300px', height: 'auto', marginLeft: '373px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', border: 'none' }}

              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        {tableContent}
      </div>
    </div>
  // </div>
  );
};

export default Barcode;

