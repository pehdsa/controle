import React from 'react';
import { FiX } from "react-icons/fi";
import { 
    IconButton, 
    Dialog,
    Slide
} from '@material-ui/core/';

// import { Container } from './styles';

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
        >
            
            <div className="topo-modal-fullscreen bg-color">aaaa</div>

            <div className="p-4">
                { props.children }
            </div>
            
        </Dialog>

    );
}

export default ModalFull;