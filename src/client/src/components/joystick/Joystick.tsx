import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import Fab from '@material-ui/core/Fab';

import "./Joystick.scss";

export interface Props {  };
export interface State {
    draggableStyle: any; // styles
    dragState: {
        x: number;
        y: number;
    };
};

export class Joystick extends React.Component<Props, State> {

    private readonly DEFAULT_DRAG_STATE = { x: 0, y: 0 };
    private readonly TRANSITION_TIME = 200; //ms

    public state = {
        draggableStyle: {  },
        dragState: this.DEFAULT_DRAG_STATE
    };

    private updateTransition(transition: string) {
        this.setState({
            draggableStyle: { ...this.state.draggableStyle, transition },
            dragState: this.DEFAULT_DRAG_STATE
        });
    }

    private resetDragState() {
        this.updateTransition(`${this.TRANSITION_TIME}ms ease-in-out`);
        setTimeout(() => this.updateTransition("initial"), this.TRANSITION_TIME);
    }

    public componentDidMount() {
        const joystickElement = ReactDOM.findDOMNode(this) as HTMLElement;
        const handleElement = joystickElement.querySelector(".handle") as HTMLElement;

        const top = (joystickElement.clientHeight / 2) - (handleElement.clientHeight / 2);
        const left = (joystickElement.clientWidth / 2) - (handleElement.clientWidth / 2);

        const draggableStyle = { top: `${top}px`, left: `${left}px` };

        this.setState({ draggableStyle });
    }

    public render(): React.ReactNode {
        return (
            <div className={Joystick.name}>
                <Draggable position={this.state.dragState} onStop={() => this.resetDragState()}>
                    <div className="draggableElement" style={this.state.draggableStyle}>
                        <Fab className="handle"
                             variant="round"
                             size="large"
                             color="secondary">
                            <span className="emoji">
                                🕹
                            </span>
                        </Fab>
                    </div>
                </Draggable>
            </div>
        );
    }
}
