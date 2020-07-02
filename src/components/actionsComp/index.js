import React from 'react';
import { FiSliders, FiPlus, FiSearch } from "react-icons/fi";

import { IconButton } from '@material-ui/core/';
import { existsOrError } from '../../utils';

function ActionsComp(props) {

    function handleAdd() {
        props.callbackAdd();
    }

    function handleFilter() {
        props.filter && props.callbackFilter();
    }

    function handleSearch() {
        props.search && props.callbackSearch();
    }

    return (
        <div className="actions-container d-flex flex-column p-3">

            { existsOrError(props.search) && (
                <IconButton className="filtrar my-1" color="inherit" onClick={handleSearch} >
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
    );
}

export default ActionsComp;