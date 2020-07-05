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
    TextField,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormControlLabel,
    Switch
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

    function handleEdit(item) {
        setFormulario({ ...item });
        setEdit(true);
    }

    function handleDelete(item) {
        setFormulario({ ...item });
        setDeleteMessage(true);
    }

    function handleCancel() {
        setFormulario({ id: "", nome: "", valorpadrao: "", valorrevendedor: "", comtamanho: "0" });
        setValidate({ nome: true, valorpadrao: true, valorrevendedor: true, });
        edit && setEdit(false);
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
            const newProducts = produtos.filter(item => item.id != formulario.id);          
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
                    if(item.id == formulario.id) {
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
            
            <HeaderComp title="Produtos" />

            {
                existsOrError(pageSkeleton) ? (
                    <main className="conteudo d-flex flex-column justify-content-center align-items-center container py-3">
                        <Skeleton width={ 120 } height={ 10 } />
                    </main>
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

                                    <FormControlLabel
                                        control={
                                            <Switch 
                                                checked={ formulario.comtamanho === "1" ? true : false} 
                                                onChange={() => setFormulario({ ...formulario, comtamanho: formulario.comtamanho === "1" ? "0" : "1" })} 
                                                name="comtamanho" 
                                            />
                                        }
                                        label="Com Tamanho"
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
                                        <main className="conteudo container py-5">
                                            <TableContainer className="tabela">
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="left" width="40%">Nome</TableCell>
                                                            <TableCell align="center" width="20%">Preço</TableCell>
                                                            <TableCell align="center" width="20%">Preço Revendedor</TableCell>
                                                            <TableCell align="center" width="20%">Ações</TableCell>                            
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        { produtos.map((item, index) => {
                                                            return (
                                                                <TableRow key={ index }>
                                                                    <TableCell align="left" className="font-16"><b>{ item.nome }</b></TableCell>
                                                                    <TableCell align="center">R$ { moneyFormatter(item.valorpadrao) }</TableCell>
                                                                    <TableCell align="center">R$ { moneyFormatter(item.valorrevendedor) }</TableCell>
                                                                    <TableCell align="center">
                                                                        <IconButton onClick={() => handleEdit(item)}>
                                                                            <MdEdit size={ 20 } className="black-color-30" />
                                                                        </IconButton>
                                                                        <IconButton onClick={() => handleDelete(item)}>
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

                                        
                                        <Dialog
                                            open={deleteMessage}
                                            onClose={handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                Excluir produto
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Tem certeza que deseja excluir o produto?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                { loadingCancel ? (
                                                    <div className="p-2">
                                                        <CircularProgress size={ 16 } thickness={ 4 } color="primary" />
                                                    </div>
                                                ) : (
                                                    <> 
                                                        <Button onClick={handleClose} color="primary">
                                                            Não
                                                        </Button>
                                                        <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                                                            Sim
                                                        </Button>
                                                    </>
                                                ) }
                                                
                                            </DialogActions>
                                        </Dialog>

                                        <ActionsComp                                             
                                            callbackAdd={() => setEdit(true)}
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