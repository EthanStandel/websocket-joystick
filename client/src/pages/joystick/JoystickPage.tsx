import React from "react";

import { Joystick, JoystickState } from "../../components/joystick/Joystick";
import { Subject, fromEvent } from "rxjs";
import { switchMapTo, tap, map } from "rxjs/operators";
import "./JoystickPage.scss";

const SOCKET_URL = "ws://localhost:8000/";
const joystickState$ = new Subject<JoystickState>();
const socket = new WebSocket(SOCKET_URL);

fromEvent(socket, "open").pipe(
    tap(() => console.log("Socket open")),
    switchMapTo(joystickState$),
    map(state => JSON.stringify(state))
).subscribe(stateString => socket.send(stateString));

export const JoystickPage = () => {
    return (
        <div className="rootContainer">
            <Joystick joystickState={state => joystickState$.next(state)}
                        handleDiameter={150}>
                Drag 🕹 me!
            </Joystick>
        </div>
    );
}
