import React from 'react';
import { FiTrash2 } from "react-icons/fi";
import { IconButton } from '@material-ui/core/';
import { existsOrError, moneyFormatter } from '../../utils';

function listProductComp(props) {

    function handleClick(index) {
        existsOrError(props.remove) && props.callbackClick(index);
    }

    return (
        <div className={ `lista-produtos${ existsOrError(props.border) ? ' border rounded' : '' }${ existsOrError(props.classes) ? ' '+props.classes : '' }`}>
            { existsOrError(props.produtos.length) ? (
                <>
                    { props.produtos.map((item, index) => {
                        return (
                            <div key={ index } className="item d-flex p-2 line-height-120">
                                
                                <div>
                                    <div className="font-14 pb-1 text-uppercase"><b>{ item.produtonome }</b></div>
                                    <div className="font-12 default-color-6"><b>Estampa:</b> { item.estampa }</div>
                                    <div className="font-12 default-color-6"><b>Qtde:</b> { `${item.quantidade} ${ (item.quantidade > 1) ? 'unidades' : 'unidade' }` }</div>
                                    <div className="font-12 default-color-6"><b>Valor:</b> R$ { moneyFormatter(item.valor) }</div>
                                    { existsOrError(item.observacao) && (
                                        <div className="font-12 default-color-6"><b>Observação:</b> { item.observacao }</div>
                                    )}
                                </div>

                                { existsOrError(props.remove) && (
                                    <div className="action d-flex align-items-center justify-content-center px-3">                                                        
                                        <IconButton className="mx-1" onClick={() => handleClick(index)}>
                                            <FiTrash2 size={ 20 } className="black-color-30" />
                                        </IconButton>
                                    </div>
                                ) }                                
                                                                
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
    );
}

export default listProductComp;