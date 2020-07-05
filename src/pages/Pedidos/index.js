import React, { useState, useEffect } from 'react';
import { MdRemoveRedEye, MdEdit, MdDelete } from "react-icons/md";
import { 
    IconButton, 
    Button,
    Table, 
    TableContainer, 
    TableBody, 
    TableHead, 
    TableRow, 
    TableCell
} from '@material-ui/core/';

import HeaderComp from '../../components/headerComp';
import ActionsComp from '../../components/actionsComp';
import Skeleton from '../../components/skeletonComp';
import { existsOrError, notify, apiRequest, moneyFormatter } from '../../utils';

function Pedidos() {

    const [ pedidos, setPedidos ] = useState([]);
    

    const [ pageSkeleton, setPageSkeleton ] = useState(true);
    const [ edit, setEdit ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ loadingCancel, setLoadingCancel ] = useState(false);

    const [ deleteMessage, setDeleteMessage ] = useState(false);

    const [ formulario, setFormulario ] = useState({
        id: "",
        revendedor: "0",
        valor: "",  
        desconto: "",
        produtos: []
    });
    const [ validate, setValidate ] = useState({
        revendedor: true,
        valor: true,  
        desconto: true,
        produtos: true
    });

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
                    <Skeleton width={ 120 } height={ 10 } />
                </main>
            ) : (
                <>
                    { !existsOrError(pedidos) ? (
                        <main className="conteudo d-flex flex-column justify-content-center align-items-center container py-3">
                            <div className="default-color-4 mb-2">Nenhum item cadastrado</div>
                            <Button className="font-12" variant="contained" >Adicionar item</Button>
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
                                        { pedidos.map((item, index) => {
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

            

            

            

        </React.Fragment>
    )
}

export default Pedidos;