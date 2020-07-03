import React from 'react';
import './styles/global.css';
import Routes from './routes';
import { ToastContainer } from 'react-toastify';

function App() {
    return (
        <>
            <Routes />
            <ToastContainer />
        </>
    );
}

export default App;
