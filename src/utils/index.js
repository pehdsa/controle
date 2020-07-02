//import React from 'react';
import axios from 'axios';

const apiUrl = "https://dev.empet.com.br/webservice/";
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
            alert('Oops...', resp.data.status);
            return false;
        } else {
            return resp.data;
        }            
    }).catch(e => {   
        alert('Oops...', 'Ocorreu um erro inesperado, tente novamente mais tarde.');         
        return false;
    });
    return result;
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
    apiRequest
}