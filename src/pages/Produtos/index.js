import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { 
    Button,
    TextField,
    CircularProgress,
    FormControlLabel,
    Switch,
} from '@material-ui/core/';
import NumberFormat from 'react-number-format';
import { existsOrError, notify, apiRequest, moneyFormatter } from '../../utils';

import HeaderComp from '../../components/headerComp';
import ActionsComp from '../../components/actionsComp';
import ModalComp from '../../components/modalComp';


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
        //prefix="R$ "
        />
    );
}

NumberFormatCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

function Produtos() {

    const [ titlePage, setTitlePage ] = useState('Produtos');

    const [ produtos, setProdutos ] = useState([]);
    const [ pageSkeleton, setPageSkeleton ] = useState(true);
    const [ edit, setEdit ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ loadingCancel, setLoadingCancel ] = useState(false);

    const [ deleteMessage, setDeleteMessage ] = useState(false);

    const [ formulario, setFormulario ] = useState({
        id: "",
        nome: "",
        valorpadrao: "",  
        valorrevendedor: "",
        comtamanho: "0"
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

    function handleInsert() {
        setEdit(true);
    }

    function handleAdd() {
        setEdit(true);
        setTitlePage('Cadastrar Produtos');
    }

    function handleEdit(item) {
        setFormulario({ ...item });
        setEdit(true);
        setTitlePage('Editar Produtos');
    }

    function handleDelete(item) {
        setFormulario({ ...item });
        setDeleteMessage(true);
    }

    function handleCancel() {
        setFormulario({ id: "", nome: "", valorpadrao: "", valorrevendedor: "", comtamanho: "0" });
        setValidate({ nome: true, valorpadrao: true, valorrevendedor: true, });
        edit && setEdit(false);setTitlePage('Produtos');
    }

    function handleClose() {
        if (!loadingCancel) {
            handleCancel();
            setDeleteMessage(false);
        }
    }

    function handleSubmit() {
        setLoading(true);
        if (
            !existsOrError(formulario.nome) || 
            !existsOrError(formulario.valorpadrao) || 
            !existsOrError(formulario.valorrevendedor)
        ) {
            const camposinvalidos = {
                nome: existsOrError(formulario.nome) ? true : false,
                valorpadrao: existsOrError(formulario.valorpadrao) ? true : false,
                valorrevendedor: existsOrError(formulario.valorrevendedor) ? true : false
            }
            setValidate({...validate, ...camposinvalidos});
            setLoading(false);            
            notify('erro', 'Digite todos os campos');
            return false;        
        }
        handleRegister();
    }

    async function handleConfirmDelete(){
        setLoadingCancel(true);
        const result = await apiRequest('deletarproduto', { id: formulario.id});
        if (result) {  
            const newProducts = produtos.filter(item => item.id !== formulario.id);          
            setProdutos(newProducts);
            handleClose();
            handleCancel();
            setLoadingCancel(false);
        } else {
            handleClose();
            setLoadingCancel(false);
        }
    }

    async function handleRegister() {
        const result = existsOrError(formulario.id) ? await apiRequest('alterarproduto', formulario) : await apiRequest('inserirproduto', formulario);
        if (result) {            
            if(!existsOrError(formulario.id)) {
                setProdutos([ result, ...produtos ])
            } else {
                const produtosEditados = [];
                produtos.forEach(item => {
                    if(item.id === formulario.id) {
                        produtosEditados.push({ ...result })
                    } else {
                        produtosEditados.push({ ...item });
                    }
                });
                setProdutos(produtosEditados);
            }
            handleCancel();
            setLoading(false);
        } else {
            setLoading(false);
        }
    }

    return (
        <React.Fragment>
            
            <HeaderComp title={ titlePage } />

            {
                existsOrError(pageSkeleton) ? (
                    <main className="conteudo d-flex flex-column justify-content-center align-items-center container py-3">
                    
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <div className="font-14 default-color-4 pb-3">Carregando</div>
                            <CircularProgress size={ 28 } />
                        </div>

                    </main>
                ) : (
                    <>
                        { existsOrError(edit) ? (
                            <>
                                <main className="conteudo container py-4">

                                    <FormControlLabel
                                        control={
                                            <Switch 
                                                checked={ formulario.comtamanho === "1" ? true : false} 
                                                onChange={() => setFormulario({ ...formulario, comtamanho: formulario.comtamanho === "1" ? "0" : "1" })} 
                                                name="comtamanho" 
                                            />
                                        }
                                        label="Com Tamanho"
                                        className="mb-3"
                                    />
                                    
                                    <TextField 
                                        autoFocus
                                        label="Nome do Produto" 
                                        variant="outlined" 
                                        fullWidth
                                        required
                                        error={ !validate.nome }
                                        onChange={event => setFormulario({ ...formulario, nome: event.target.value })}
                                        value={ formulario.nome }
                                        className="mb-3"
                                    />

                                    <TextField 
                                        label="Valor" 
                                        variant="outlined" 
                                        fullWidth
                                        required
                                        error={ !validate.valorpadrao }
                                        onChange={event => setFormulario({ ...formulario, valorpadrao: event.target.value })}
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
                                        onChange={event => setFormulario({ ...formulario, valorrevendedor: event.target.value })}
                                        value={ formulario.valorrevendedor }
                                        className="mb-3"
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                        }}
                                    />                                    

                                    <div className="d-flex pt-3 justify-content-center align-items-center">
                                        <Button variant="outlined" size="large" className="mx-2" onClick={() => !existsOrError(loading) && handleCancel()}>Cancelar</Button>
                                        <Button onClick={() => !existsOrError(loading) && handleSubmit()} variant="contained" className="btn-primary mx-2" size="large">
                                            { existsOrError(loading) ? (
                                                <CircularProgress size={ 22 } thickness={ 4 } color="white" />
                                            ) : (
                                                <>
                                                     { existsOrError(formulario.id) ? 'Editar' : 'Cadastrar' }
                                                </>
                                            ) }
                                           
                                        </Button>
                                    </div>

                                </main>
                            </>
                        ) : (
                            <>
                                { !existsOrError(produtos) ? (
                            
                                    <main className="conteudo d-flex flex-column justify-content-center align-items-center container py-3">
                                        <div className="default-color-4 mb-3">Nenhum item cadastrado</div>
                                        <Button className="font-12" variant="contained" onClick={handleInsert} >Adicionar item</Button>
                                    </main>
                                
                                ) : (

                                    <>
                                        <main className="conteudo container py-4">

                                            <ul className="lista">
                                                { produtos.map((item, index) => {
                                                    return (
                                                        <li key={ index }>
                                                    
                                                            <header className="border-bottom d-flex lista-header justify-content-between align-items-center">
                                                                <h2 className="font-13 default-color pl-3">{ item.nome }</h2>                                                               
                                                            </header>
                                                            
                                                            <div className="lista-body px-3 py-2 font-13 line-height-160 default-color">
                                                                
                                                                <div className="d-flex justify-content-between align-items-center py-2 px-2">
                                                                    <div><b>Preço:</b></div>
                                                                    <div><span className="default-color-6">R$ {  moneyFormatter(item.valorpadrao) }</span></div>
                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center py-2 px-2">
                                                                    <div><b>Preço revendedor:</b></div>
                                                                    <div><span className="default-color-6">R$ { moneyFormatter(item.valorrevendedor) }</span></div>
                                                                </div>

                                                            </div>
                                                            
                                                            <footer className="d-flex lista-footer border-top">                                                               
                                                                <div className="d-flex flex-fill">
                                                                    <Button fullWidth className="font-10 default-color-8" onClick={() => handleEdit(item)}>
                                                                        <FiEdit size={ 14 } className="mr-1" />Editar
                                                                    </Button>
                                                                </div>
                                                                <div className="d-flex flex-fill">
                                                                    <Button fullWidth className="font-10 default-color-8" onClick={() => handleDelete(item)}>
                                                                        <FiTrash2 size={ 14 } className="mr-1" />Excluir
                                                                    </Button>
                                                                </div>
                                                            </footer>

                                                        </li>
                                                    )
                                                })}
                                            </ul>

                                        </main>

                                        <ModalComp
                                            modalOpen={deleteMessage}
                                            callbackCloseModal={handleClose}
                                            title="Deletar Produto"
                                        >
                
                                            <div className="text-center pt-2 pb-3">Deseja realmente deletar este produto?</div>

                                            <div className="d-flex pt-3 justify-content-center align-items-center pb-3">
                                                { existsOrError(loadingCancel) ? (
                                                    <CircularProgress size={ 22 } thickness={ 4 } />
                                                ) : (
                                                    <>
                                                    <Button onClick={handleClose} variant="outlined" size="large" className="mx-2">Não</Button>
                                                    <Button onClick={() => handleConfirmDelete() } variant="contained" color="secondary" className="mx-2" size="large">Sim</Button>
                                                    </>
                                                ) }                            
                                                
                                            </div>
                
                                        </ModalComp>                                        

                                        <ActionsComp                                             
                                            callbackAdd={() => handleAdd()}
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