import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdRemoveRedEye, MdEdit, MdDelete } from "react-icons/md";
import { 
    IconButton, 
    Button,
    Table, 
    TableContainer, 
    TableBody, 
    TableHead, 
    TableRow, 
    TableCell,
    TextField 
} from '@material-ui/core/';
import NumberFormat from 'react-number-format';


import HeaderComp from '../../components/headerComp';
import ActionsComp from '../../components/actionsComp';
import Skeleton from '../../components/skeletonComp';
import { existsOrError, notify, apiRequest, moneyFormatter } from '../../utils';

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
            onChange({
            target: {
                name: props.name,
                value: values.value,
            },
            });
        }}
        thousandSeparator="." 
        decimalSeparator=","
        isNumericString
        prefix="R$ "
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

function Produtos() {

    const [ produtos, setProdutos ] = useState([]);
    

    const [ pageSkeleton, setPageSkeleton ] = useState(true);
    const [ edit, setEdit ] = useState(false);

    const [ formulario, setFormulario ] = useState({
        id: "",
        nome: "",
        valorpadrao: "",  
        valorrevendedor: "",
    });
    const [ validate, setValidate ] = useState({
        nome: true,
        valorpadrao: true,  
        valorrevendedor: true,
    });

    useEffect(() => {
        getData();
    },[]);

    async function getData() {
        const result = await apiRequest('obterprodutos');
        if (result) {
            setProdutos(result);
            setPageSkeleton(false);
        } else {
            setPageSkeleton(false);
        }
    }

    function handleForm(value) {
        setFormulario({ ...formulario, value });
    }

    function handleEdit() {
        setEdit(true);
    }

    function handleCancel() {
        setFormulario({ id: "", nome: "", valorpadrao: "", valorrevendedor: "", });
        setValidate({ nome: true, valorpadrao: true, valorrevendedor: true, });
        setEdit(false)
    }

    return (
        <React.Fragment>
            
            <HeaderComp title="Produtos" />

            {
                existsOrError(pageSkeleton) ? (
                    <div>
                        <Skeleton width={ 120 } height={ 10 } />
                    </div>
                ) : (
                    <>
                        { existsOrError(edit) ? (
                            <>
                                <main className="conteudo container py-5">

                                    <header class="d-flex justify-content-between align-items-center border-bottom mb-5 pb-3">
                                        <h2 className="font-18 default-color-8" >Adicionar produto</h2>
                                    </header>
                                    
                                    <TextField 
                                        autoFocus
                                        label="Nome do Produto" 
                                        variant="outlined" 
                                        fullWidth
                                        required
                                        error={ !validate.nome }
                                        onChange={event => setFormulario({ nome: event.target.value })}
                                        value={ formulario.nome }
                                        className="mb-3"
                                    />

                                    <TextField 
                                        label="Valor" 
                                        variant="outlined" 
                                        fullWidth
                                        required
                                        error={ !validate.valorpadrao }
                                        onChange={event => setFormulario({ valorpadrao: event.target.value })}
                                        value={ formulario.valorpadrao }
                                        className="mb-3"
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                    />

                                    
                                    <TextField  
                                        label="Valor para revendedor" 
                                        variant="outlined" 
                                        fullWidth
                                        required
                                        error={ !validate.valorrevendedor }
                                        onChange={event => setFormulario({ valorrevendedor: event.target.value })}
                                        value={ formulario.valorrevendedor }
                                        className="mb-3"
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                    />

                                    <div className="d-flex pt-3 justify-content-center align-items-center">
                                        <Button variant="outlined" size="large" className="mx-2" onClick={() => handleCancel()}>Cancelar</Button>
                                        <Button variant="contained" className="btn-primary mx-2" size="large">
                                            { existsOrError(formulario.id) ? 'Editar' : 'Cadastrar' }
                                        </Button>
                                    </div>

                                </main>
                            </>
                        ) : (
                            <>
                                { !existsOrError(produtos) ? (
                            
                                    <main className="conteudo d-flex flex-column justify-content-center align-items-center container py-3">
                                        <div className="default-color-4 mb-3">Nenhum item cadastrado</div>
                                        <Button className="font-12" variant="contained" onClick={handleEdit} >Adicionar item</Button>
                                    </main>
                                
                                ) : (

                                    <>
                                        <main className="conteudo container py-5">
                                            <TableContainer className="tabela">
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Nome</TableCell>
                                                            <TableCell width="30%" align="right">Ações</TableCell>                            
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        { produtos.map((item, index) => {
                                                            return (
                                                                <TableRow key={ index }>
                                                                    <TableCell className="font-16"><b>{ item.nome }</b></TableCell>
                                                                    <TableCell align="right">
                                                                        <IconButton onClick={() => {}}>
                                                                            <MdRemoveRedEye size={ 20 } className="black-color-30" />
                                                                        </IconButton>
                                                                        <IconButton onClick={() => {}}>
                                                                            <MdEdit size={ 20 } className="black-color-30" />
                                                                        </IconButton>
                                                                        <IconButton onClick={() => {}}>
                                                                            <MdDelete size={ 20 } className="black-color-30" />
                                                                        </IconButton>
                                                                    </TableCell>                            
                                                                </TableRow>
                                                            )
                                                        }) }
                                                        
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </main>

                                        <ActionsComp 
                                            search={ true }
                                            callbackSearch={() => alert('search')}
                                            filter={ true }
                                            callbackFilter={() => alert('filter')}
                                            callbackAdd={() => alert('add')}
                                        />
                                    </>
                                ) }
                            </>
                        ) }                        

                    </>
                )
            }
        </React.Fragment>
    )
}

export default Produtos;