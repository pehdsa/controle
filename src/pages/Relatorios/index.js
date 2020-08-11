import React, { useState, useEffect, useRef } from 'react';
import { FiShoppingBag, FiCheckCircle, FiClock } from "react-icons/fi";
import { MdLocalAtm } from "react-icons/md";
import { CircularProgress } from '@material-ui/core/';

import moment from 'moment';
import 'moment/locale/pt-br';

import HeaderComp from '../../components/headerComp';

import { existsOrError, apiRequest, moneyFormatter } from '../../utils';

const { innerWidth: width } = window;

function Relatorios() {

    const [ pageSkeleton, setPageSkeleton ] = useState(true);
    const [ pedidos, setPedidos ] = useState(false);
    const [ produtos, setProdutos ] = useState([]);

    const [ semanal, setSemanal ] = useState({});

    useEffect(() => {
        getData();
    },[]);

    const refWidth = useRef(true);
    useEffect(() => {        
        if (refWidth.current) { refWidth.current = false; return; }
        console.log(semanal);
    },[semanal]); 

    async function getData() {       

        const result = await apiRequest('obterrelatorios');
        if (result) { 
            console.log(result);
            
            let keysPedidos = [];
            let objPedidos  = {};

            result.entregues.forEach((el) => {
                const key = `${moment(el.dataFormat).day(0).format('YYYY-MM-DD')}|${moment(el.dataFormat).day(6).format('YYYY-MM-DD')}`;
                keysPedidos.filter(i => i === key).length == 0 && keysPedidos.push(key);
            });

            keysPedidos.forEach((el) => {
                let contador = 0;
                result.entregues.filter(item => `${moment(item.dataFormat).day(0).format('YYYY-MM-DD')}|${moment(item.dataFormat).day(6).format('YYYY-MM-DD')}` === el).forEach(item => { contador += parseInt(item.valor) });
                objPedidos = { 
                    ...objPedidos, 
                    [el] : contador
                }
            });

            setSemanal(objPedidos);
            
            existsOrError(result.pedidos) && setPedidos({ ...result.pedidos[0] });
            existsOrError(result.produtos) && setProdutos(result.produtos);
            setPageSkeleton(false);
        } else {
            setPageSkeleton(false);
        }

    }


    return (
        <React.Fragment>
            
            <HeaderComp title="Relatorios" />

            { existsOrError(pageSkeleton) ? (
                
                <main className="conteudo d-flex flex-column justify-content-center align-items-center container py-3">
                    
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div className="font-14 default-color-4 pb-3">Carregando</div>
                        <CircularProgress size={ 28 } />
                    </div>

                </main>

            ) : (
                <>
                { !existsOrError(pedidos) ? (
                    <main className="conteudo d-flex flex-column justify-content-center align-items-center container py-3">
                    
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <div className="font-14 default-color-4 pb-3">Nenhuma informação cadastrada</div>
                        </div>

                    </main>
                ) : (
                    <main className="conteudo container py-4">

                        <div className="relatorios">

                            <div className="row">
                                <div className="col-6 pr-2">
                                    <div className="item d-flex align-items-center p-4">
                                        <div>
                                            <h2 className="font-28 line-height-100 primary-color">{ pedidos.naoentregue }</h2>
                                            <small className="font-11 line-height-120 default-color-6"><b>Pedidos em Aberto</b></small>
                                        </div>
                                        <div className="icone primary-color">
                                            <FiClock size={ 80 } />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 pl-2">
                                    <div className="item d-flex align-items-center p-4">
                                        <div>
                                            <h2 className="font-28 line-height-100 primary-color">{ pedidos.entregue }</h2>
                                            <small className="font-11 line-height-120 default-color-6"><b>Pedidos Entregues</b></small>
                                        </div>
                                        <div className="icone primary-color">
                                            <FiCheckCircle size={ 80 } />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            { /* existsOrError(produtos) && produtos.map(produto => {
                                return (
                                    <div className="item d-flex align-items-center p-4">
                                        <div>
                                            <h2 className="font-28 line-height-100 primary-color">{ produto.total }</h2>
                                            <small className="font-11 line-height-120 default-color-6"><b>{ produto.nome }</b></small>
                                        </div>
                                        <div className="icone primary-color">
                                            <FiShoppingBag size={ 80 } />
                                        </div>
                                    </div>
                                )
                            })*/}

                            <div className="item d-flex align-items-center p-4">
                                <div>
                                    <h2 className="font-24 line-height-100 primary-color"><small>R$</small> { moneyFormatter(pedidos.total) }</h2>
                                    <small className="font-11 line-height-120 default-color-6"><b>Total Vendido</b></small>
                                </div>
                                <div className="icone primary-color">
                                    <MdLocalAtm size={ 80 } />
                                </div>
                            </div>

                        </div>

                        <hr style={{ marginBottom: 10 }} />

                        <div className="semanal">
                            <div>

                                <div className="item" style={{ width: width - 20 }}>
                                    <div>
                                        <div>                                        
                                            <h2 class="font-24 line-height-100 primary-color"><small>R$</small> 2.336,00</h2>
                                            <small class="font-11 line-height-120 default-color-6"><b>Total Vendido</b></small>
                                        </div>
                                    </div>
                                </div>

                                <div className="item" style={{ width: width - 20 }}>
                                    <div>aaa</div>
                                </div>

                                <div className="item" style={{ width: width - 20 }}>
                                    <div>aaa</div>
                                </div>

                            </div>
                        </div>

                    </main>
                ) }
                

                </>
            )}

        </React.Fragment>
    )
}

export default Relatorios;