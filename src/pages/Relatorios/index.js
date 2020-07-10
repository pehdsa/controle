import React from 'react';
import { FiShoppingBag, FiCheckCircle, FiClock } from "react-icons/fi";
import { MdLocalAtm } from "react-icons/md";
import HeaderComp from '../../components/headerComp';

function Revendedores() {
    return (
        <React.Fragment>
            
            <HeaderComp title="Relatorios" />

            <main className="conteudo container py-4">

                <div className="relatorios">

                    <div className="item d-flex align-items-center p-4">
                        <div>
                            <h2 className="font-28 line-height-100 primary-color">45</h2>
                            <small className="font-11 line-height-120 default-color-6"><b>Pedidos em Aberto</b></small>
                        </div>
                        <div className="icone primary-color">
                            <FiClock size={ 80 } />
                        </div>
                    </div>

                    <div className="item d-flex align-items-center p-4">
                        <div>
                            <h2 className="font-28 line-height-100 primary-color">45</h2>
                            <small className="font-11 line-height-120 default-color-6"><b>Pedidos Entregues</b></small>
                        </div>
                        <div className="icone primary-color">
                            <FiCheckCircle size={ 80 } />
                        </div>
                    </div>

                    <div className="item d-flex align-items-center p-4">
                        <div>
                            <h2 className="font-28 line-height-100 primary-color">45</h2>
                            <small className="font-11 line-height-120 default-color-6"><b>Máscaras</b></small>
                        </div>
                        <div className="icone primary-color">
                            <FiShoppingBag size={ 80 } />
                        </div>
                    </div>

                    <div className="item d-flex align-items-center p-4">
                        <div>
                            <h2 className="font-24 line-height-100 primary-color"><small>R$</small> 45.000,00</h2>
                            <small className="font-11 line-height-120 default-color-6"><b>Total Vendido</b></small>
                        </div>
                        <div className="icone primary-color">
                            <MdLocalAtm size={ 80 } />
                        </div>
                    </div>

                </div>

            </main>

        </React.Fragment>
    )
}

export default Revendedores;