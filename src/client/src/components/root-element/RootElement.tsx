import React from 'react';

import { Joystick } from '../joystick';
import "./RootElement.scss";

export const RootElement: React.FC = () => {
    return (
        <div className="rootContainer">
            <Joystick onUpdateJoystickState={state => console.log(state)} />
        </div>
    );
}
