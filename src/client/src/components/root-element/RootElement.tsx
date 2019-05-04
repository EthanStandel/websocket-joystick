import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { DefaultTheme } from '../../theme';
import { Joystick } from '../joystick';
import "./RootElement.scss";

export const RootElement: React.FC = () => {
    return (
        <MuiThemeProvider theme={DefaultTheme}>
            <div className="rootContainer">
                <Joystick />
            </div>
        </MuiThemeProvider>
    );
}
