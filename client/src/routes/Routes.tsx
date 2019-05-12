import React from "react";
import { Route, BrowserRouter, Redirect, Switch } from "react-router-dom";
import { JoystickPage } from "../pages/joystick/JoystickPage";
import { ControllerPage } from "../pages/controller/ControllerPage";

export class Routes extends React.Component {

    public render(): React.ReactNode {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/joystick" component={JoystickPage} />
                    <Route path="/controller" component={ControllerPage} />
                    <Redirect from="/" to="/joystick" />
                </Switch>
            </BrowserRouter>
        );
    }

}
