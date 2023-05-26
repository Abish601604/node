import './App.css';
import React from 'react';

import { Routes, Route } from 'react-router-dom';
import Mainbar from './main';
import BarcodeGenerator from './normalbarcode';
import Barcode from './custombarcode';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Mainbar/>}></Route>
        <Route path='/nbarcode' element={<BarcodeGenerator/>}></Route>
        <Route path='/BarCode' element={<Barcode/>}></Route>


      </Routes>
    </div>
  );
}

export default App;
