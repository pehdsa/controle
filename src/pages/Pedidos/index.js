import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdRemoveRedEye, MdEdit, MdDelete } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { 
    IconButton, 
    Button,
    Table, 
    TableContainer, 
    TableBody, 
    TableHead, 
    TableRow, 
    TableCell,
    CircularProgress,
    TextField,
    Switch,
    FormControlLabel
} from '@material-ui/core/';
import NumberFormat from 'react-number-format';

import HeaderComp from '../../components/headerComp';
import ActionsComp from '../../components/actionsComp';
import ModalComp from '../../components/modalComp';
import ModalFullComp from '../../components/modalFullComp';
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

function Pedidos() {

    const [ pedidos, setPedidos ] = useState([]);
    const [ tamanhos, setTamanhos ] = useState([]);
    const [ produtos, setProdutos ] = useState([]);

    const [ pageSkeleton, setPageSkeleton ] = useState(true);
    const [ edit, setEdit ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ loadingCancel, setLoadingCancel ] = useState(false);

    const [ view, setView ] = useState(false)
    const [ modalProduto, setModalProduto ] = useState(false);

    const [ deleteMessage, setDeleteMessage ] = useState(false);

    const [ formulario, setFormulario ] = useState({
        id: "",
        nome: "",
        revendedor: "0",
        valor: "",  
        desconto: "",
        produtos: []
    });
    const [ validate, setValidate ] = useState({
        nome: true,
        revendedor: true,
        valor: true,  
        desconto: true,
        produtos: true
    });

    const [ formularioProduto, setFormularioProduto ] = useState({
        produtoid: "",
        produtonome: "",
        tamanho: "",
        valor: "",
        estampa: "",
        quantidade: ""
    })

    useEffect(() => {
        getData();
    },[]);

    async function getData() {       

        const result = await apiRequest('obterpedidos');
        if (result) {
            setPedidos(result);
            setPageSkeleton(false);
        } else {
            setPageSkeleton(false);
        }

        const tamanhos = await apiRequest('obterpedidos');
        existsOrError(tamanhos) && setTamanhos(tamanhos);

        const produtos = await apiRequest('obterprodutos');
        existsOrError(produtos) && setProdutos(produtos);

    }

    function handleInsert() {
        setEdit(true);
    }

    function handleView(item) {
        setFormulario({ ...item });
        setView(true);
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
        setFormulario({ id: "",nome: "", revendedor: "0",valor: "",desconto: "",produtos: [] });
        setValidate({ nome: true, revendedor: true,valor: true,desconto: true,produtos: true });
        edit && setEdit(false);
    }

    function handleCloseView() {
        //handleCancel();
        setView(false);
    }

    function handleCloseModalProduto() {
        setModalProduto(false);
    }

    function handleClose() {
        if (!loadingCancel) {
            handleCancel();
            setDeleteMessage(false);
        }
    }
    /*
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
    */

    return (
        <React.Fragment>
            
            <HeaderComp title="Pedidos" />

            { existsOrError(pageSkeleton) ? (
                
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
                        <main className="conteudo container py-5">

                            <header class="d-flex justify-content-between align-items-center border-bottom mb-5 pb-3">
                                <h2 className="font-18 default-color-8" >Adicionar pedido</h2>
                            </header>

                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={ formulario.revendedor === "1" ? true : false} 
                                        onChange={() => setFormulario({ ...formulario, revendedor: formulario.revendedor === "1" ? "0" : "1" })} 
                                        name="revendedor" 
                                    />
                                }
                                label="para revendedor"
                                className="mb-3"
                            />

                            <TextField 
                                label="Nome do Pedido" 
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
                                error={ !validate.valor }
                                onChange={event => setFormulario({ ...formulario, valor: event.target.value })}
                                value={ formulario.valor }
                                className="mb-3"
                                InputProps={{
                                    inputComponent: NumberFormatCustom,
                                }}
                            />

                            <Button variant="contained" color="primary" onClick={() => setModalProduto(true)}>Adicionar Produto</Button>

                            <div className="border">

                            </div>

                            {/*}
                            <TextField                                
                                select
                                label="Produto"
                                variant="outlined" 
                                fullWidth
                                value={ formularioProduto.produtonome }
                                onChange={event => setFormularioProduto({ ...formularioProduto, produtonome: event.target.value })}
                                className="mb-3"
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value=""></option>
                                {produtos.map((option) => (
                                    <option key={option.id} value={option.nome}>
                                        {option.nome}
                                    </option>
                                ))}
                            </TextField>
                                {*/}

                            <div className="d-flex pt-3 justify-content-center align-items-center">
                                <Button variant="outlined" size="large" className="mx-2" onClick={() => !existsOrError(loading) && handleCancel()}>Cancelar</Button>
                                <Button onClick={() => {}} variant="contained" className="btn-primary mx-2" size="large">
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

                        <ModalFullComp
                                    modalOpen={modalProduto}
                                    callbackCloseModal={handleCloseModalProduto}
                                    title={ `Produtos para ${ formulario.nome }` }
                                >
                                    <Button onClick={handleCloseModalProduto}>Fechar</Button>

                                </ModalFullComp>

                        </>
                    ) : (
                        <>
                            { !existsOrError(pedidos) ? (
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
                                                    <TableCell width="45%">Nome</TableCell>
                                                    <TableCell width="20%" align="center">Data</TableCell>
                                                    <TableCell width="20%" align="center">Produtos</TableCell>
                                                    <TableCell width="15%" align="center">Ações</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                { pedidos.map((item, index) => {
                                                    return ( 
                                                        <TableRow key={ index } className={ (item.entregue !== "0") ? 'desativado' : '' }>
                                                            <TableCell className="font-16">
                                                                <b>{ item.nome }</b>
                                                                <Button className="ml-2 font-11">Marcar como entregue</Button>
                                                            </TableCell>
                                                            <TableCell align="center">{ item.data }</TableCell>
                                                            <TableCell align="center">
                                                                <Button color="primary" className="font-12" onClick={() => handleView(item)}>Ver Produtos</Button>
                                                            </TableCell>
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
        
                                <ModalComp
                                    modalOpen={view}
                                    callbackCloseModal={handleCloseView}
                                    title={ `Produtos para ${ formulario.nome }` }
                                >
        
                                    <div className="produtos">
                                            
                                        { existsOrError(formulario.produtos) && formulario.produtos.map(item => {
                                            return (
                                                
                                                <div className="d-flex p-2">
                                                    <div className="d-flex flex-grow-1 align-items-center font-14 pl-1">
                                                        <div>
                                                            <b>{ item.produtonome }</b><br />
                                                            <span className="font-12 default-color-6">{ item.estampa }</span>
                                                        </div>
                                                    </div>
                                                    <div className="qtde px-3 d-flex align-items-center justify-content-center font-12 default-color-6 border-left">
                                                        { `${item.quantidade} ${ (item.quantidade > 1) ? 'unidades' : 'unidade' }` }
                                                    </div>                                        
                                                </div>    
        
                                            )
                                        }) }
        
                                    </div>
        
                                </ModalComp>
                
                                <ActionsComp 
                                    //search={ true }
                                    //callbackSearch={() => alert('search')}
                                    //filter={ true }
                                    //callbackFilter={() => alert('filter')}
                                    callbackAdd={() => handleInsert()}
                                />
                                </>
                            ) }
                        </>
                    ) }
                    
                </>
            ) }

            

            

            

        </React.Fragment>
    )
}

export default Pedidos;