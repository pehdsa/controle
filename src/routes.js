import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom';

import Pedidos from './pages/Pedidos';
import Entregues from './pages/Entregues';
import Produtos from './pages/Produtos';
import Relatorios from './pages/Relatorios';

const Routes = () => {
    return (
        <BrowserRouter basename="/controle">
            <Route component={ Pedidos } path="/" exact />
            <Route component={ Entregues } path="/entregues" />
            <Route component={ Produtos } path="/produtos" />
            <Route component={ Relatorios } path="/relatorios" />
        </BrowserRouter>
    )    
}

export default Routes;