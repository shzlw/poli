import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import './i18n';
import './index.css';

ReactDOM.render(
  <BrowserRouter basename="/poli">
    <App />
  </BrowserRouter>, 
  document.getElementById('root')
);

