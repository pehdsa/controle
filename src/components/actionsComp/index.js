import React, { useState, useRef } from 'react';
import { FiSliders, FiPlus, FiSearch } from "react-icons/fi";
import { IconButton } from '@material-ui/core/';
import { existsOrError } from '../../utils';

function ActionsComp(props) {

    const inpuF = useRef(null);

    const [ search, setSearch ] = useState(false);
    const [ textSearch, setTextSearch ] = useState('')

    function handleAdd() {
        props.callbackAdd();
    }

    function handleFilter() {
        props.filter && props.callbackFilter();
    }

    function handleOpenSearch() {
        if(props.search) {            
            setSearch(true);
            inpuF.current.focus()
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleSearch()
        }
    }

    function handleSearch() {
        props.search && props.callbackSearch(textSearch);       
        closeSearch();
    }
    
    function closeSearch() {
        setSearch(false);
        setTextSearch('');
    }

    return (
        <>

        <div className={ `search-wrapper${ existsOrError(search) ? ' active' : '' }` }>
            <div className="search-container">
                <input 
                    ref={inpuF}
                    type="text" 
                    value={ textSearch }
                    onChange={event => setTextSearch(event.target.value)}
                    onKeyPress={ handleKeyPress }
                    placeholder="Buscar"
                />
                 <IconButton className="btn-pesquisar" color="inherit" onClick={handleSearch} >
                    <FiSearch size={ 25 } className="default-color-6" />
                </IconButton>
            </div>
            <button className="btn-fechar" onClick={closeSearch}></button>
        </div>

        <div className="actions-container d-flex flex-column p-3">

            { existsOrError(props.search) && (
                <IconButton className="filtrar my-1" color="inherit" onClick={handleOpenSearch} >
                    <FiSearch size={ 25 } color="#FFF" />
                </IconButton>
            ) } 

            { existsOrError(props.filter) && (
                <IconButton className="filtrar my-1" color="inherit" onClick={handleFilter} >
                    <FiSliders size={ 25 } color="#FFF" />
                </IconButton>
            ) }        
            
            <IconButton className="adicionar my-1" onClick={handleAdd} >
                <FiPlus size={ 25 } color="#FFF" />
            </IconButton>

        </div>
        </>
    );
}

export default ActionsComp;