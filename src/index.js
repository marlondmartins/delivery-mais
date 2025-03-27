import React from 'react';
import ReactDOM from 'react-dom';
import Rotas from './rotas';
import './styles/global.css';
import { CartProvider } from './contexts/cart';

ReactDOM.render(<CartProvider><Rotas /></CartProvider>,  
  document.getElementById('root')
);

