import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { FiShoppingBag, FiEdit, FiTrash2, FiCheckCircle } from "react-icons/fi";
import { 
    IconButton, 
    Button,
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

    const [ titlePage, setTitlePage ] = useState('Pedidos');
    const [ pedidos, setPedidos ] = useState([]);
    const [ tamanhos, setTamanhos ] = useState([]);
    const [ produtos, setProdutos ] = useState([]);

    const [ cmTamanho, setCmTamanho ] = useState(false);


    const [ pageSkeleton, setPageSkeleton ] = useState(true);
    const [ edit, setEdit ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ loadingCancel, setLoadingCancel ] = useState(false);
    const [ loadingEntregue, setLoadingEntregue ] = useState(false);

    const [ view, setView ] = useState(false)
    const [ modalProduto, setModalProduto ] = useState(false);

    const [ deleteMessage, setDeleteMessage ] = useState(false);

    const [ formulario, setFormulario ] = useState({
        id: "",
        nome: "",
        revendedor: "0",
        valor: "",  
        produtos: []
    });
    const [ validate, setValidate ] = useState({
        nome: true,
        revendedor: true,
        valor: true,  
        produtos: true
    });

    const [ formularioProduto, setFormularioProduto ] = useState({
        produtoid: "",
        produtonome: "",
        tamanho: "",
        valor: "",
        estampa: "",
        quantidade: ""
    });
    const [ validateProduto, setValidateProduto ] = useState({
        produtoid: true,
        produtonome: true,
        valor: true,
        estampa: true,
        quantidade: true
    });

    useEffect(() => {
        getData();
    },[]);
    
    /*
    const refTam = useRef(true);
    useEffect(() => {        
        if (refTam.current) { refTam.current = false; return; }
        console.log(tamanhos);
    },[tamanhos]);

    const refProdutos = useRef(true);
    useEffect(() => {        
        if (refProdutos.current) { refProdutos.current = false; return; }
        console.log(produtos);
    },[produtos]);   

    const refForm = useRef(true);
    useEffect(() => {        
        if (refForm.current) { refForm.current = false; return; }
        console.log(formularioProduto);
    },[formularioProduto]); 
    
   const refFormulario = useRef(true);
   useEffect(() => {        
       if (refFormulario.current) { refFormulario.current = false; return; }
       console.log(formulario);
   },[formulario]); 
   */

    async function getData() {       

        const result = await apiRequest('obterpedidos');
        if (result) {
            setPedidos(result);
            setPageSkeleton(false);
        } else {
            setPageSkeleton(false);
        }

        const tamanhos = await apiRequest('obtartamanhos');
        existsOrError(tamanhos) && setTamanhos(tamanhos);

        const produtos = await apiRequest('obterprodutos');
        existsOrError(produtos) && setProdutos(produtos);

    }

    function handleInsert() {
        setEdit(true);
        setTitlePage('Cadastrar Produto');
    }

    function handleView(item) {
        setFormulario({ ...item });
        setView(true);
    }

    function handleEdit(item) {
        setFormulario({ ...item });
        setEdit(true);
        setTitlePage('Editar Produto');
    }

    function handleDelete(item) {
        setFormulario({ ...item });
        setDeleteMessage(true);
    }

    function handleCancel() {
        setFormulario({ id: "",nome: "", revendedor: "0",valor: "",desconto: "",produtos: [] });
        setValidate({ nome: true, revendedor: true,valor: true,desconto: true,produtos: true });
        edit && setEdit(false);setTitlePage('Pedidos');
    }

    function handleCancelProduto() {
        setCmTamanho(false);
        setFormularioProduto({
            produtoid: "",
            produtonome: "",
            tamanho: "",
            valor: "",
            estampa: "",
            quantidade: ""
        });
        setValidateProduto({
            produtoid: true,
            produtonome: true,
            valor: true,
            quantidade: true,
            estampa: true
        });
    }

    function handleChangeProdutos(id) {
        const nome = existsOrError(id) ? produtos.filter(produto => produto.id === id)[0].nome : "";
        const valor = existsOrError(id) ? formulario.revendedor === "1" ? produtos.filter(produto => produto.id === id)[0].valorrevendedor : produtos.filter(produto => produto.id === id)[0].valorpadrao : "";
        existsOrError(id) ? produtos.filter(produto => produto.id === id)[0].comtamanho === "1" ? setCmTamanho(true) : setCmTamanho(false) : setCmTamanho(false) ;
        
        setFormularioProduto({
            ...formularioProduto, 
            produtoid: existsOrError(id) ? id : "", 
            produtonome: nome,
            valor
        });

    }

    function handleInsertProduto() {

        if (
            !existsOrError(formularioProduto.produtoid) || 
            !existsOrError(formularioProduto.estampa) || 
            !existsOrError(formularioProduto.valor) || 
            !existsOrError(formularioProduto.quantidade)
        ) {
            const camposinvalidos = {
                produtoid: existsOrError(formularioProduto.produtoid) ? true : false,
                estampa: existsOrError(formularioProduto.estampa) ? true : false,
                valor: existsOrError(formularioProduto.valor) ? true : false,
                quantidade: existsOrError(formularioProduto.quantidade) ? true : false,
            }
            setValidateProduto({...validateProduto, ...camposinvalidos});        
            notify('erro', 'Digite todos os campos');
            return false;        
        }

        const arrProdutos = [ ...formulario.produtos, formularioProduto ]
        setFormulario({ ...formulario, produtos: arrProdutos });
        handleCancelProduto();
    }

    function handleCloseView() {
        //handleCancel(); 
        setView(false);
    }

    function handleCloseModalProduto() {
        handleCancelProduto();
        handleValor();
        setModalProduto(false);
    }

    function handleValor() {
        let soma = 0;
        if (formulario.produtos.length > 0) {
            formulario.produtos.forEach(item => soma += item.quantidade * item.valor);
        } else {
            soma = "";
        }
        setFormulario({ ...formulario, valor: soma });
    }

    function handleRemoveProduto(index, calcula = false) {
        const newArr = formulario.produtos;
        newArr.splice(index, 1);
        setFormulario({ ...formulario, produtos: newArr.filter(item => item) });
        calcula && handleValor();
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
            !existsOrError(formulario.valor) || 
            !existsOrError(formulario.produtos)
        ) {
            const camposinvalidos = {
                nome: existsOrError(formulario.nome) ? true : false,
                valor: existsOrError(formulario.valor) ? true : false,
                produtos: existsOrError(formulario.produtos) ? true : false
            }
            setValidate({...validate, ...camposinvalidos});
            setLoading(false);            
            notify('erro', 'Digite todos os campos');
            return false;        
        }
        handleRegister();
    }
    
    async function handleRegister() {
        const result = existsOrError(formulario.id) ? await apiRequest('alterarpedido', formulario) : await apiRequest('inserirpedido', formulario);
        if (result) {            
            if(!existsOrError(formulario.id)) {
                setPedidos([ result, ...pedidos ])
            } else {
                const pedidosEditados = [];
                pedidos.forEach(item => {
                    if(item.id === formulario.id) {
                        pedidosEditados.push({ ...result })
                    } else {
                        pedidosEditados.push({ ...item });
                    }
                });
                setPedidos(pedidosEditados);
            }
            handleCancel();
            setLoading(false);
        } else {
            setLoading(false);
        }
    }
    
    async function handleConfirmDelete(){
        setLoadingCancel(true);
        const result = await apiRequest('deletarpedido', { id: formulario.id});
        if (result) {  
            const newPedidos = pedidos.filter(item => item.id !== formulario.id);          
            setPedidos(newPedidos);
            handleClose();
            handleCancel();
            setLoadingCancel(false);
        } else {
            handleClose();
            setLoadingCancel(false);
        }
    }

    async function handleEntregue(item) {
        setLoadingEntregue(true);
        const result = await apiRequest('marcardesmarcarcomoentregue', { id: item.id});
        console.log(result);
        if (result) {  
            const newArr = pedidos.map(pedido => pedido.id === result.id && { ...pedido, entregue: result.entregue } )
            setLoadingEntregue(false);
            setPedidos(newArr);
        } else {
            setLoadingEntregue(false);
        }
    }

    return (
        <React.Fragment>
            
            <HeaderComp title={ titlePage } />

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
                        <main className="conteudo container py-4">

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

                            <div className="pb-3">
                                <Button variant="contained" color="primary" onClick={() => setModalProduto(true)}>Adicionar Produto</Button>
                            </div>

                            <div className="lista-produtos border rounded p-2 mb-3">
                                { formulario.produtos.length > 0 ? (
                                    <>
                                        { formulario.produtos.map((item, index) => {
                                            return (
                                                <div key={ index } className="item d-flex align-items-center py-3 pl-3">

                                                    <div className="flex-grow-1">
                                                        <div>
                                                            <div className="font-16"><b>{ item.produtonome }</b></div>
                                                            <span className="font-14 default-color-6">{ item.estampa }</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="px-3 text-center">
                                                        <div className="default-color font-14 mb-1"><b>Valor</b></div>
                                                        <div className="default-color-6 font-12">R$ { moneyFormatter(item.valor) }</div>
                                                    </div>
                                                    
                                                    <div className="px-3 text-center">
                                                        <div className="default-color font-14 mb-1"><b>Qtde</b></div>
                                                        <div className="default-color-6 font-12">{ item.quantidade }</div>
                                                    </div>

                                                    <div className="action d-flex align-items-center justify-content-center px-3">                                                        
                                                        <IconButton className="mx-1" onClick={() => handleRemoveProduto(index, true) }>
                                                            <FiTrash2 size={ 20 } className="black-color-30" />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            )
                                        }) }
                                    </>
                                ) : (
                                    <div className="py-4 text-center default-color-4 text-italic font-12">
                                        Nenhum produto
                                    </div>
                                ) }
                            </div>

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

                            <div className="d-flex pt-3 justify-content-center align-items-center">
                                <Button variant="outlined" size="large" className="mx-2" onClick={() => !existsOrError(loading) && handleCancel()}>Cancelar</Button>
                                <Button onClick={() => handleSubmit()} variant="contained" className="btn-primary mx-2" size="large">
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
                            title="Adicionar Produto"
                        >
                            
                            <TextField                                
                                select
                                label="Produto"
                                variant="outlined" 
                                fullWidth
                                required
                                error={ !validateProduto.produtoid }                                
                                onChange={event => { handleChangeProdutos(event.target.value) }}
                                value={ formularioProduto.produtoid }
                                className="mb-3"
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value=""></option>
                                { existsOrError(produtos) && produtos.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.nome}
                                    </option>
                                ))}

                            </TextField>
                            
                            { existsOrError(cmTamanho) && (

                                <TextField                                
                                    select
                                    label="Tamanho"
                                    variant="outlined" 
                                    fullWidth
                                    onChange={event => { 
                                        setFormularioProduto({ 
                                            ...formularioProduto, 
                                            tamanho: event.target.value
                                        }); 
                                        
                                    }}
                                    value={ formularioProduto.tamanho }
                                    className="mb-3"
                                    SelectProps={{
                                        native: true,
                                    }}
                                    >

                                    { existsOrError(tamanhos) && tamanhos.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.nome}
                                        </option> 
                                    ))}

                                </TextField>  

                            )}

                            <TextField 
                                label="Estampa" 
                                variant="outlined" 
                                fullWidth
                                required
                                error={ !validateProduto.estampa }
                                onChange={event => setFormularioProduto({ ...formularioProduto, estampa: event.target.value })}
                                value={ formularioProduto.estampa }
                                className="mb-3"
                            />

                            <TextField 
                                label="Valor" 
                                variant="outlined" 
                                fullWidth
                                required
                                error={ !validateProduto.valor }
                                onChange={event => setFormularioProduto({ ...formularioProduto, valor: event.target.value })}
                                value={ formularioProduto.valor }
                                className="mb-3"
                                InputProps={{
                                    inputComponent: NumberFormatCustom,
                                }}
                            />

                            <TextField 
                                label="Quantidade" 
                                variant="outlined" 
                                fullWidth
                                required
                                error={ !validateProduto.quantidade }
                                onChange={event => setFormularioProduto({ ...formularioProduto, quantidade: event.target.value })}
                                value={ formularioProduto.quantidade }
                                className="mb-3"
                                type="number"
                            />

                            <div className="d-flex pt-3 justify-content-center align-items-center">                                
                                <Button onClick={() => { handleCloseModalProduto();setFormulario({ ...formulario, produtos: [], valor: "" }); } } variant="outlined" size="large" className="mx-2">{ formulario.produtos.length > 0 ? 'Limpar' : 'Cancelar' }</Button>
                                <Button onClick={() => handleInsertProduto() } variant="contained" className="btn-primary mx-2" size="large">Adicionar</Button>
                            </div>
                            
                            { formulario.produtos.length > 0 && (
                                <>
                                <div className="lista-produtos border rounded p-2 my-4">                                
                                    <>
                                        { formulario.produtos.map((item, index) => {
                                            return (
                                                <div key={ index } className="item d-flex align-items-center py-3 pl-3">

                                                    <div className="flex-grow-1">
                                                        <div>
                                                            <div className="font-16"><b>{ item.produtonome }</b></div>
                                                            <span className="font-14 default-color-6">{ item.estampa }</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="px-3 text-center">
                                                        <div className="default-color font-14 mb-1"><b>Valor</b></div>
                                                        <div className="default-color-6 font-12">R$ { moneyFormatter(item.valor) }</div>
                                                    </div>
                                                    
                                                    <div className="px-3 text-center">
                                                        <div className="default-color font-14 mb-1"><b>Qtde</b></div>
                                                        <div className="default-color-6 font-12">{ item.quantidade }</div>
                                                    </div>

                                                    <div className="action d-flex align-items-center justify-content-center px-3">                                                    
                                                        <IconButton className="mx-1" onClick={() => handleRemoveProduto(index) }>
                                                            <FiTrash2 size={ 20 } className="black-color-30" />
                                                        </IconButton>
                                                    </div>
                                                </div>
                                            )
                                        }) }                                
                                    </>                               
                                </div>
                                <div className="d-flex pt-3 justify-content-center align-items-center">
                                    <Button onClick={() => handleCloseModalProduto() } variant="contained" className="btn-primary mx-2" size="large">Finalizar</Button>
                                </div>
                                </>
                            ) }

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
                                <main className="conteudo container py-4">
                                    
                                    <ul className="lista">

                                        { pedidos.map((item, index) => {
                                            return ( 
                                                <li key={ index } className={ (item.entregue !== "0") ? 'desativado' : '' } >
                                                    
                                                    <header className="border-bottom d-flex lista-header justify-content-between align-items-center">
                                                        <h2 className="font-13 default-color pl-3">{ item.nome }</h2>
                                                        { existsOrError(loadingEntregue) ? (
                                                            <CircularProgress className="mr-3" size={16} />
                                                        ) : (
                                                            <IconButton className="ml-2 font-11 mr-2" onClick={() => handleEntregue(item)}>
                                                                <FiCheckCircle size={ 16 } />
                                                            </IconButton>
                                                        )  } 
                                                    </header>
                                                    
                                                    <div className="lista-body px-3 py-2 font-13 line-height-160 default-color">
                                                        <div className="d-flex justify-content-between align-items-center py-2 px-2">
                                                            <div><b>Data:</b></div>
                                                            <div><span className="default-color-6">{ item.data }</span></div>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center py-2 px-2">
                                                            <div><b>Valor:</b></div>
                                                            <div><span className="default-color-6">R$ { moneyFormatter(item.valor) }</span></div>
                                                        </div>
                                                    </div>
                                                    
                                                    <footer className="d-flex lista-footer border-top">
                                                        <div className="d-flex flex-fill">
                                                            <Button fullWidth className="font-10 default-color-8" onClick={() => handleView(item)}>
                                                                <FiShoppingBag size={ 14 } className="mr-1" />Produtos
                                                            </Button>
                                                        </div>
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
                                        }) }

                                    </ul>

                                </main>
        
                                <ModalComp
                                    modalOpen={view}
                                    callbackCloseModal={handleCloseView}
                                    title="Produtos"
                                >
        
                                    <div className="lista-produtos">
                                            
                                        { existsOrError(formulario.produtos) && formulario.produtos.map(item => {
                                            return (
                                                
                                                <div className="item d-flex p-2">
                                                    <div>
                                                        <div className="font-14 pb-1"><b>{ item.produtonome }</b></div>
                                                        <div className="font-12 default-color-4"><b>Estampa:</b> { item.estampa }</div>
                                                        <div className="font-12 default-color-4"><b>Qtde:</b> { `${item.quantidade} ${ (item.quantidade > 1) ? 'unidades' : 'unidade' }` }</div>
                                                        <div className="font-12 default-color-4"><b>Valor:</b> R$ { moneyFormatter(item.valor) }</div>
                                                    </div>
                                                                                    
                                                </div>    
        
                                            )
                                        }) }
        
                                    </div>
        
                                </ModalComp>

                                <ModalComp
                                    modalOpen={deleteMessage}
                                    callbackCloseModal={handleClose}
                                    title="Deletar Pedido"
                                >
        
                                    <div className="text-center pt-2 pb-3">Deseja realmente deletar este pedido?</div>

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