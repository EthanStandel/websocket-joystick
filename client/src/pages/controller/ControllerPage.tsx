import React from "react";
import { Joystick } from "../../components/joystick";
import { Subject } from "rxjs";

import "./ControllerPage.scss";
import { ButtonGroup } from "../../components/button-group/ButtonGroup";

export class ControllerPage extends React.Component {
    
    public render(): React.ReactNode {
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
                        <Joystick joystickState$={new Subject()} />
                    </div>
                    <div>
                        <Joystick joystickState$={new Subject()} />
                    </div>
                </div>
            </div>
        );
    }

}
