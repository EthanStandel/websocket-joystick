import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import Fab from '@material-ui/core/Fab';

import "./Joystick.scss";

export interface Props {  };
export interface State {
    handleBaseStyle: any;
    handleStyle: any;
    dragState: {
        x: number;
        y: number;
    };
};

export class Joystick extends React.Component<Props, State> {

    private readonly DEFAULT_DRAG_STATE = { x: 0, y: 0 };
    private readonly TRANSITION_TIME = 200; //ms

    public state = {
        handleBaseStyle: {  },
        handleStyle: {  },
        dragState: this.DEFAULT_DRAG_STATE
    };

    private updateTransition(transition: string) {
        this.setState({
            handleStyle: { ...this.state.handleStyle, transition },
            dragState: this.DEFAULT_DRAG_STATE
        });
    }

    private resetDragState() {
        this.updateTransition(`${this.TRANSITION_TIME}ms ease-in-out`);
        setTimeout(() => this.updateTransition("initial"), this.TRANSITION_TIME);
    }

    private centerElementStyles(joystick: HTMLElement, elementToCenter: HTMLElement): any {
        const handleTop = (joystick.clientHeight / 2) - (elementToCenter.clientHeight / 2);
        const handleLeft = (joystick.clientWidth / 2) - (elementToCenter.clientWidth / 2);

        return { top: `${handleTop}px`, left: `${handleLeft}px` };
    }

    public componentDidMount() {
        const joystickElement = ReactDOM.findDOMNode(this) as HTMLElement;
        const handleElement = joystickElement.querySelector(".handle") as HTMLElement;
        const handleBaseElement = joystickElement.querySelector(".handleBase") as HTMLElement;

        const handleStyle = this.centerElementStyles(joystickElement, handleElement);
        const handleBaseStyle = this.centerElementStyles(joystickElement, handleBaseElement);

        this.setState({ ...this.state, handleStyle, handleBaseStyle });
    }

    public render(): React.ReactNode {
        return (
            <div className={Joystick.name}>

                <div className="handleBase" style={this.state.handleBaseStyle}></div>

                <Draggable position={this.state.dragState} onStop={() => this.resetDragState()}>
                    <div className="draggableElement" style={this.state.handleStyle}>
                        <Fab className="handle"
                             variant="round"
                             size="large"
                             color="secondary">
                            <div></div>
                        </Fab>
                    </div>
                </Draggable>

            </div>
        );
    }
}
