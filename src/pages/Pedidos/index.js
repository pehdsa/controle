import React, { useState } from 'react';
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
import { existsOrError } from '../../utils';

function Pedidos() {

    const [ pedidos, setPedidos ] = useState([
        { 
            id: 1, 
            revendedor: 0, 
            valor: 200.00, 
            desconto: 0,
            produtos: [
                { 
                    id: 1, 
                }
            ]
        }
    ]);

    const [ selecionado, setSelecionado ] = useState({});

    return (
        <React.Fragment>
            
            <HeaderComp title="Pedidos" />



            { !existsOrError(pedidos) ? (
                <main className="conteudo d-flex flex-column justify-content-center align-items-center container py-3">
                    <div className="default-color-4 mb-2">Nenhum item cadastrado</div>
                    <Button className="font-12" variant="contained" >Adicionar item</Button>
                </main>
            ) : (
                <>
                <main className="conteudo container py-3">
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

            

            

        </React.Fragment>
    )
}

export default Pedidos;