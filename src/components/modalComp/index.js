import React from 'react';
import { FiX } from "react-icons/fi";
import { 
    IconButton, 
    Dialog,
    DialogTitle,
    DialogContent
} from '@material-ui/core/';

// import { Container } from './styles';

function productsModal(props) {

    function handleCloseModal() {
        props.callbackCloseModal()
    }

    return (

        <Dialog
            open={props.modalOpen}
            onClose={handleCloseModal}
            fullWidth
            maxWidth="sm"
            className="modal-produtos modal-default"
        >
            
            <header className="modal-header d-flex align-items-center border-bottom">
                <h2 className="font-14 default-color pl-2 py-2">{ props.title }</h2>
                <IconButton className="modal-close" onClick={handleCloseModal}>
                    <FiX size={ 20 } className="default-color-6" />
                </IconButton>
            </header>

            <div className="modal-body p-3">
                { props.children }
            </div>

            { /* }
            <div className="border-bottom d-flex justify-content-between align-items-center">
                <DialogTitle>
                    { props.title }
                </DialogTitle>
                <div className="px-2">
                    <IconButton onClick={handleCloseModal}>
                        <FiX size={ 20 } className="default-color-6" />
                    </IconButton>
                </div>
            </div>
            
            <DialogContent className="py-4">

                { props.children }
                
            </DialogContent>
            { */ }
            
        </Dialog>

    );
}

export default productsModal;