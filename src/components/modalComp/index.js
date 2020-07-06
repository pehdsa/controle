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
            fullWidth={ true }
            maxWidth="sm"
            className="modal-produtos"
        >
            
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
            
        </Dialog>

    );
}

export default productsModal;