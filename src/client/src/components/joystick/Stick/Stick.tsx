import React from 'react';
import Fab from '@material-ui/core/Fab';
import './Stick.scss';

export const Stick: React.FC = () => {
    return (
        <Fab className={Stick.name} size="large" color="secondary">
            <span className="emoji">🕹</span>
        </Fab>
    );
}
