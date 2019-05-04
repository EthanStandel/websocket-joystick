import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { ReplaySubject } from "rxjs";

import "./Joystick.scss";

export interface Props {
    onUpdateJoystickState: (state: JoystickState) => any;
};
export interface State {
    knobBaseStyle: any;
    knobStyle: any;
    dragState: {
        x: number;
        y: number;
    };
};

export interface JoystickState {
    directionalDegree: number;
    powerPercentage: number;
};

export class Joystick extends React.Component<Props, State> {

    public readonly joystickState$ = new ReplaySubject<JoystickState>();

    private readonly DEFAULT_DRAG_STATE = { x: 0, y: 0 };
    private readonly TRANSITION_TIME = 200; //ms

    private readonly isPortraitView = window.innerWidth / window.innerHeight < 1;
    private readonly selectiveRadius = (this.isPortraitView ? window.innerWidth : window.innerHeight) / 2;

    private joystickElement: HTMLElement;

    public state = {
        knobBaseStyle: {  },
        knobStyle: {  },
        dragState: this.DEFAULT_DRAG_STATE
    };

    public constructor(props: Props, state: State) {
        super(props, state);

        this.joystickState$.subscribe(this.props.onUpdateJoystickState);
    }

    public componentWillUnmount() {
        this.joystickState$.complete();
    }

    public componentDidMount() {
        this.joystickElement = ReactDOM.findDOMNode(this) as HTMLElement;
        this.centerAndSizeAbsoluteElements();
    }

    public onDrag(event: MouseEvent | TouchEvent) {
        const clientX = "changedTouches" in event ? event.changedTouches[0].clientX : event.clientX;
        const clientY = "changedTouches" in event ? event.changedTouches[0].clientY : event.clientY;

        const x = (clientX - window.innerWidth / 2);
        const y = (window.innerHeight / 2 - clientY);

        this.updateJoystickState(x, y);
    }

    public render(): React.ReactNode {
        return (
            <div className={Joystick.name}>

                <div className="knobBase" style={this.state.knobBaseStyle} />

                <Draggable position={this.state.dragState}
                           onDrag={event => this.onDrag(event as MouseEvent)}
                           onStop={() => this.onStop()}>
                    <div className="draggableElement" style={this.state.knobStyle} />
                </Draggable>

            </div>
        );
    }


    private updateTransition(transition: string) {
        this.setState({
            knobStyle: { ...this.state.knobStyle, transition },
            dragState: this.DEFAULT_DRAG_STATE
        });
    }

    private onStop() {
        this.updateTransition(`${this.TRANSITION_TIME}ms ease-in-out`);
        setTimeout(() => this.updateTransition("initial"), this.TRANSITION_TIME);

        this.updateJoystickState(0, 0);
    }

    private centerElementStyles(joystick: HTMLElement, centerableElementWidth: number): any {
        const knobTop = (joystick.clientHeight / 2) - (centerableElementWidth / 2);
        const knobLeft = (joystick.clientWidth / 2) - (centerableElementWidth / 2);

        return { top: `${knobTop}px`, left: `${knobLeft}px` };
    }

    private centerAndSizeAbsoluteElements() {
        const widthBase = this.isPortraitView ? window.innerWidth : window.innerHeight;
        
        const knobDiameter = widthBase * .5;
        const knobStyle = {
            width: `${knobDiameter}px`, height: `${knobDiameter}px`,
            ...this.centerElementStyles(this.joystickElement, knobDiameter)
        };

        const knobBaseDiameter = widthBase * .8;
        const knobBaseStyle = {
            width: `${knobBaseDiameter}px`, height: `${knobBaseDiameter}px`,
            ...this.centerElementStyles(this.joystickElement, knobBaseDiameter)
        };

        this.setState({ ...this.state, knobStyle, knobBaseStyle });
    }

    private calculatePowerPercentage(x: number, y: number) {
        const hypotenuse = Math.sqrt(x**2 + y**2);

        const powerPercentageMax = 100 * (hypotenuse / this.selectiveRadius);
        const powerPercentage = powerPercentageMax > 100 ? 100 : Math.round(powerPercentageMax);

        return powerPercentage;
    }

    private calculateDirectionalDegree(x: number, y: number) {
        const inverseTanResult = Math.round(Math.atan2(y, x) * 180 / Math.PI);

        if (inverseTanResult > 0) {
            return inverseTanResult;
        } else {
            return 360 + inverseTanResult;
        }
    }

    private updateJoystickState(x: number, y: number) {
        this.joystickState$.next({
            directionalDegree: this.calculateDirectionalDegree(x, y),
            powerPercentage: this.calculatePowerPercentage(x, y)
        });
    }
}
