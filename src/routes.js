import React from 'react'
import { Route, BrowserRouter } from 'react-router-dom';

import Pedidos from './pages/Pedidos';
import Produtos from './pages/Produtos';
import Revendedores from './pages/Revendedores';

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={ Pedidos } path="/" exact />
            <Route component={ Produtos } path="/produtos" />
            <Route component={ Revendedores } path="/revendedores" />
        </BrowserRouter>
    )    
}

export default Routes;