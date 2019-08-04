import React from "react";
import { Joystick } from "../../components/joystick";
import "./ControllerPage.scss";
import { ButtonGroup } from "../../components/button-group/ButtonGroup";

export const ControllerPage = () => {
    return (
        <div className={ControllerPage.name}>
            <div className="topRow">
                <ButtonGroup onClick={() => undefined} 
                             northLabel="⬆️"
                             eastLabel="➡️"
                             southLabel="⬇️"
                             westLabel="⬅️" />
                <ButtonGroup onClick={() => undefined} />
            </div>
            <div className="bottomRow">
                <div>
                    <Joystick joystickState={_state => {  }} />
                </div>
                <div>
                    <Joystick joystickState={_state => {  }} />
                </div>
            </div>
        </div>
    );
}
