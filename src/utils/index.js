//import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const apiUrl = "https://controle.empet.com.br/webservice/";
const baseSite = "https://www.empet.com.br/";

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


export { 
    //api,     
    moneyFormatter,     
    existsOrError, 
    baseSite,
    apiRequest,
    notify
}