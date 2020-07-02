import React, { useState } from 'react';
import { FiMenu, FiSearch, FiClipboard, FiUser, FiShoppingBag } from "react-icons/fi";
import { IconButton, Drawer } from '@material-ui/core/';
import { NavLink } from 'react-router-dom';

import { existsOrError } from '../../utils';

function HeaderComp(props) {

    const [ drawerOpen, setDrawerOpen ] = useState(false);

    function handleDrawerOpen() {
        setDrawerOpen(true);
    }

    function callbackClick() {
        existsOrError(props.search) && props.callbackSearch()
    }

    return (
        <React.Fragment>
            <header className="topo d-flex justify-content-between">
                
                <div className="topo-left d-flex align-items-center px-2">
                    <IconButton
                        color="inherit"
                        aria-label="abre menu"
                        onClick={handleDrawerOpen}
                    >
                        <FiMenu color="#FFF" />
                    </IconButton>
                </div>

                <h1 className="d-flex align-items-center justify-content-center font-16 white-color">{ props.title }</h1>

                <div className="topo-right d-flex align-items-center px-2">
                    { existsOrError(props.search) && (
                         <IconButton
                            color="inherit"
                            aria-label="abre menu"
                            onClick={callbackClick}
                        >
                            <FiSearch color="#FFF" />
                        </IconButton>
                    ) }
                </div>

            </header>

            <Drawer open={ drawerOpen } onClose={() => setDrawerOpen(false)} >
                <aside className="menu">

                    <NavLink to="/" className="d-flex align-items-center font-14" activeClassName="active" exact >
                        <FiClipboard size={ 20 } className="mr-2" />Pedidos
                    </NavLink>
                    <NavLink to="/produtos" className="d-flex align-items-center font-14" activeClassName="active" exact >
                        <FiShoppingBag size={ 20 } className="mr-2" />Produtos
                    </NavLink>
                    <NavLink to="/revendedores" className="d-flex align-items-center font-14" activeClassName="active" exact >
                        <FiUser size={ 20 } className="mr-2" />Revendedores
                    </NavLink>

                </aside>
            </Drawer>

        </React.Fragment>
    );
}

export default HeaderComp;