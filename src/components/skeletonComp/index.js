import React from 'react';

import { existsOrError } from '../../utils';

export default props => {    
    return (
        <div className={`skeleton-root ${ props.className && props.className }`} style={{ width: existsOrError(props.width) ? props.width : '100%' , height: existsOrError(props.height) ? props.height : '100%' }}></div>        
    );    
}