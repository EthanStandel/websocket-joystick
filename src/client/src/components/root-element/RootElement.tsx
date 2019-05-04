import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { Stick } from '../joystick/stick';
import { DefaultTheme } from '../../theme';

export const RootElement: React.FC = () => {
    return (
        <MuiThemeProvider theme={DefaultTheme}>
            <Stick />
        </MuiThemeProvider>
    );
}
