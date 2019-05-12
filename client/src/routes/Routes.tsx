import React from "react";
import { Route, BrowserRouter, Redirect, Switch } from "react-router-dom";
import { JoystickPage } from "../pages/joystick/JoystickPage";

export class Routes extends React.Component {

    public render(): React.ReactNode {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/joystick" component={JoystickPage} />
                    <Redirect from="/" to="/joystick" />
                </Switch>
            </BrowserRouter>
        );
    }

}
