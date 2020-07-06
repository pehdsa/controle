import React from 'react';
import { FiX } from "react-icons/fi";
import { 
    IconButton, 
    Dialog,
    Slide
} from '@material-ui/core/';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ModalFull(props) {

    function handleCloseModal() {
        props.callbackCloseModal()
    }

    return (

        <Dialog
            fullScreen
            open={props.modalOpen}
            onClose={handleCloseModal}            
            TransitionComponent={Transition}
            className="modal"
        >
            
            <header className="modal-header d-flex justify-content-between align-items-center px-4">
                <h2 className="white-color font-14">{ props.title }</h2>
                <IconButton onClick={handleCloseModal}>
                    <FiX size={ 26 } className="white-color" />
                </IconButton>
            </header>

            <div className="flex-grow-1 modal-body p-4">
                { props.children }
            </div>
            
        </Dialog>

    );
}

export default ModalFull;