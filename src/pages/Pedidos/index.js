import React, { useState } from 'react';
import { MdRemoveRedEye, MdEdit, MdDelete } from "react-icons/md";
import { IconButton } from '@material-ui/core/';
import { Table, TableContainer, TableBody, TableHead, TableRow, TableCell } from '@material-ui/core/';

import HeaderComp from '../../components/headerComp';

function Pedidos() {

    const [ pedidos, setPedidos ] = useState([
        { id: 1, nome: 'Pedro' },
        { id: 1, nome: 'Pedro' },
        { id: 1, nome: 'Pedro' },
        { id: 1, nome: 'Pedro' },
        { id: 1, nome: 'Pedro' },
        { id: 1, nome: 'Pedro' },
        { id: 1, nome: 'Pedro' },
        { id: 1, nome: 'Pedro' },
        { id: 1, nome: 'Pedro' }
    ]);

    const [ selecionado, setSelecionado ] = useState({});

    return (
        <React.Fragment>
            
            <HeaderComp title="Pedidos" />

            <main className="conteudo container py-3">
                <TableContainer className="tabela">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell width="30%" align="center">Ações</TableCell>                            
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { pedidos.map((item, index) => {
                                return (
                                    <TableRow key={ index }>
                                        <TableCell className="font-16"><b>{ item.nome }</b></TableCell>
                                        <TableCell align="center">
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

        </React.Fragment>
    )
}

export default Pedidos;