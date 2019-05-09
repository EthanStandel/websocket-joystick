import React from 'react';
import Draggable from 'react-draggable';
import { merge, of, fromEvent, Subscription } from 'rxjs';

import './Joystick.scss';

export interface Props {
    onUpdateJoystickState: (state: JoystickState) => any;
};
export interface State {
    handleStyle: any;
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

    private readonly DEFAULT_DRAG_STATE = { x: 0, y: 0 };
    private readonly TRANSITION_TIME = 200; //ms

    private readonly isPortraitView = window.innerWidth / window.innerHeight < 1;
    private readonly selectiveRadius = (this.isPortraitView ? window.innerWidth : window.innerHeight) / 2;

    private baseResizeSubscription: Subscription;

    public state = {
        handleStyle: {  },
        dragState: this.DEFAULT_DRAG_STATE
    };

    public componentDidMount() {
        this.createBaseResizeSubscription();
    }

    public componentWillUnmount() {
        this.baseResizeSubscription.unsubscribe();
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
                <div className="knobBase">
                    <Draggable position={this.state.dragState}
                               onDrag={event => this.onDrag(event as MouseEvent)}
                               onStop={() => this.onStop()}>
                        <div className="handle" style={this.state.handleStyle}>
                            Drag 🕹 me!
                        </div>
                    </Draggable>
                </div>

            </div>
        );
    }

    private createBaseResizeSubscription() {
        this.baseResizeSubscription = merge(of(true), fromEvent(window, 'resize')).subscribe(() => {
            const joystickContainer = document.querySelector(".Joystick") as HTMLElement;
            const joystickBase = document.querySelector(".knobBase") as HTMLElement;
            const isPortrait = joystickContainer.clientHeight > joystickContainer.clientWidth;
            const maxDiameter = `${isPortrait ? joystickBase.clientWidth : joystickBase.clientHeight}px`;

            if (isPortrait) {
                joystickBase.style.maxHeight = maxDiameter;
                joystickBase.style.maxWidth = 'unset';
            } else {
                joystickBase.style.maxHeight = 'unset';
                joystickBase.style.maxWidth = maxDiameter;
            }
        });
    }

    private updateTransition(transition: string) {
        this.setState({
            handleStyle: { transition },
            dragState: this.DEFAULT_DRAG_STATE
        });
    }

    private onStop() {
        this.updateTransition(`${this.TRANSITION_TIME}ms ease-in-out`);
        setTimeout(() => this.updateTransition("initial"), this.TRANSITION_TIME);

        this.updateJoystickState(0, 0);
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
        this.props.onUpdateJoystickState({
            directionalDegree: this.calculateDirectionalDegree(x, y),
            powerPercentage: this.calculatePowerPercentage(x, y)
        });
    }
}
