import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom';

import Pedidos from './pages/Pedidos';
import Produtos from './pages/Produtos';
import Relatorios from './pages/Relatorios';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={ Pedidos } path="/" exact />
            <Route component={ Produtos } path="/produtos" />
            <Route component={ Relatorios } path="/relatorios" />
        </BrowserRouter>
    )    
}

export default Routes;