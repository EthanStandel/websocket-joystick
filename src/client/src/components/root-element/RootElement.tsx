import React from 'react';

import { Joystick, JoystickState } from '../joystick';
import './RootElement.scss';

export class RootElement extends React.Component {

    public socket: WebSocket;
    public readonly socketUrl = 'ws://localhost:8000/';

    public constructor(props: any) {
        super(props);

        this.openSocket();
    }

    public sendUpdates(state: JoystickState) {
        this.socket.send(JSON.stringify(state));
    }
    
    public render(): React.ReactNode {
        return (
            <div className="rootContainer">
                <Joystick onUpdateJoystickState={state => this.sendUpdates(state)} />
            </div>
        );
    }

    private openSocket() {
        this.socket = new WebSocket(this.socketUrl);
        this.socket.onopen = () => console.log("Open");
        this.socket.onmessage = message => console.log("Message: ", message);
        this.socket.onerror = error => {
            console.log("Error: ", error);
            this.socket.close();
            this.socket.onclose = () => this.openSocket();
        }
    }
}
