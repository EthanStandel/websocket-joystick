import React from "react";

import { Joystick, JoystickState } from "../../components/joystick/Joystick";
import { Subject, fromEvent } from "rxjs";
import { switchMapTo, tap, map } from "rxjs/operators";
import "./JoystickPage.scss";

export class JoystickPage extends React.Component {

    private readonly SOCKET_URL = "ws://localhost:8000/";
    private readonly joystickState$ = new Subject<JoystickState>();

    public constructor(props: any) {
        super(props);

        const socket = new WebSocket(this.SOCKET_URL);

        fromEvent(socket, "open").pipe(
            tap(() => console.log("Socket open")),
            switchMapTo(this.joystickState$),
            map(state => JSON.stringify(state))
        ).subscribe(stateString => socket.send(stateString));
    }

    public render(): React.ReactNode {
        return (
            <div className="rootContainer">
                <Joystick joystickState$={this.joystickState$}>
                    Drag 🕹 me!
                </Joystick>
            </div>
        );
    }
}
