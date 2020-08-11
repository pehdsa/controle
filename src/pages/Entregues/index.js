import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiCheckCircle, FiX } from "react-icons/fi";
import { 
    IconButton, 
    Button,
    CircularProgress,
} from '@material-ui/core/';

import HeaderComp from '../../components/headerComp';
import ActionsComp from '../../components/actionsComp';
import ModalComp from '../../components/modalComp';
import ListProductComp from '../../components/listProductComp';

import { existsOrError, apiRequest, moneyFormatter } from '../../utils';

function Pedidos() {

    const [ pedidos, setPedidos ] = useState([]);

    const [ strSearch, setStrSearch ] = useState('');
    const [ pageSkeleton, setPageSkeleton ] = useState(true);
    const [ loadingEntregue, setLoadingEntregue ] = useState(false);

    const [ view, setView ] = useState(false)
    
    const [ formulario, setFormulario ] = useState({
        id: "",
        nome: "",
        revendedor: "0",
        valor: "",  
        produtos: []
    });

    useEffect(() => {
        getData();
    },[]);

    async function getData() {       

        const result = await apiRequest('obterpedidosentregue');
        if (result) {
            setPedidos(result);
            setPageSkeleton(false);
        } else {
            setPageSkeleton(false);
        }

    }

    function handleView(item) {
        setFormulario({ ...item });
        setView(true);
    }

    function handleCloseView() {
        //handleCancel(); 
        setView(false);
    }

    async function handleEntregue(item) {
        setLoadingEntregue(true);
        const result = await apiRequest('marcardesmarcarcomoentregue', { id: item.id});
        if (result) {
            const newArr = pedidos.map(pedido => pedido.id === item.id ? { ...pedido, entregue: result.entregue } : { ...pedido } ) 
            setLoadingEntregue(false);
            setPedidos(newArr);
        } else {
            setLoadingEntregue(false);
        }
    }

    async function handleSearch(text) {
        setPageSkeleton(true);
        const result = await apiRequest('pesquisarpedidoentregue', { string: text});
        if (result) {
            setPageSkeleton(false);
            setStrSearch(text);
            setPedidos(result);
        } else {
            setPageSkeleton(false); 
        }
    }

    function handleClearSearch() {
        setPageSkeleton(true);
        setStrSearch('');
        getData()
    }

    return (
        <React.Fragment>
            
            <HeaderComp title="Pedidos Entregues" />

            { existsOrError(pageSkeleton) ? (
                
                <main className="conteudo d-flex flex-column justify-content-center align-items-center container py-3">
                    
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div className="font-14 default-color-4 pb-3">Carregando</div>
                        <CircularProgress size={ 28 } />
                    </div>

                </main>

            ) : (
                <>
                    
                { (!existsOrError(pedidos) && !existsOrError(strSearch)) ? (
                    <main className="conteudo d-flex flex-column justify-content-center align-items-center container py-3">
                        <div className="default-color-4 mb-3">Nenhum item entregue</div>                        
                    </main>
                ) : (
                    <>
                    <main className="conteudo container py-4">

                        { existsOrError(strSearch) && (
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-1 mb-3">
                                <div className="font-12 default-color-8">Pesquisado por: <b>{ strSearch }</b></div>
                                <IconButton className="modal-close" onClick={handleClearSearch}>
                                    <FiX size={ 20 } className="default-color-6" />
                                </IconButton>
                            </div>
                        ) }                                    
                        
                        <ul className="lista">

                            { pedidos.map((item, index) => {
                                return ( 
                                    <li key={ index } className="itens-container" >
                                        <div className={ `item${(item.entregue !== "0") ? ' desativado' : ''}` }>
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
                                            
                                        </footer>
                                        </div>
                                    </li>
                                )
                            }) }

                        </ul>

                    </main>

                    <ModalComp
                        modalOpen={view}
                        callbackCloseModal={handleCloseView}
                        title={ `Produtos (${ formulario.nome })` }
                    >                                    
                        <ListProductComp produtos={ formulario.produtos } />                                   

                    </ModalComp>
    
                    <ActionsComp 
                        search={ true }
                        callbackSearch={(text) => handleSearch(text)}
                        noinsert
                    />
                    </>
                ) }
                </>

            ) }

            

            

            

        </React.Fragment>
    )
}

export default Pedidos;