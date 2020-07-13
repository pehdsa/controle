//import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const apiUrl = "https://srtabrauner.com.br/controle/webservice/";
const baseSite = "https://www.srtabrauner.com.br/controle";

const api = axios.create({    
    baseURL: apiUrl,        
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },    
});

const apiRequest = async (type, params) => {
    const result = await api.post('',{
        request: [{ acao: type , params }]
    }).then(resp => {  
        if (Object.keys(resp.data).includes('erro')) {            
            toast.error(resp.data.status, {
                position: toast.POSITION.BOTTOM_RIGHT,
                //className: 'foo-bar',
                autoClose: 5000
            });
            return false;
        } else {
            return resp.data;
        }            
    }).catch(e => {   
        toast.error('Ocorreu um erro inesperado, tente novamente mais tarde', {
            position: toast.POSITION.BOTTOM_RIGHT,
            //className: 'foo-bar',
            autoClose: 5000
        });       
        return false;
    });
    return result; 
}

const notify = (tipo, mensagem) => {

    if (tipo === 'sucesso') {
        toast.success(mensagem, {
            position: toast.POSITION.BOTTOM_RIGHT,
            //className: 'foo-bar',
            autoClose: 5000
        });            
    } else if (tipo === 'erro') {
        toast.error(mensagem, {
            position: toast.POSITION.BOTTOM_RIGHT,
            //className: 'foo-bar',
            autoClose: 5000
        });
    } else if (tipo === 'aviso') {
        toast.warn(mensagem, {
            position: toast.POSITION.BOTTOM_RIGHT,
            //className: 'foo-bar' ,
            autoClose: 5000
        });
    }

}


const moneyFormatter = (valor) => { 
    // eslint-disable-next-line
    return parseFloat(valor).toFixed(2).replace('.',',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
}

const existsOrError = (value) => {
    if(!value) return false;
    if(Array.isArray(value) && value.length === 0) return false;
    if(typeof value === 'string' && !value.trim()) return false;

    return true;
}

const getDiffDate = (date) => {
    const now = new Date(); // Data de hoje
    const past = new Date( date.split('/').reverse().join('-') );
    const diff = Math.abs(now.getTime() - past.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return days;
}


export { 
    //api,     
    moneyFormatter,     
    existsOrError, 
    baseSite,
    apiRequest,
    notify,
    getDiffDate
}