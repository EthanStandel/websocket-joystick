import React from 'react';
import Draggable, { DraggableBounds } from 'react-draggable';
import { merge, of, fromEvent, Subscription, Subject } from 'rxjs';

import './Joystick.scss';

export interface Props {
    // Takes in a subject and writes out the state changes to that subject
    joystickState$: Subject<JoystickState>;
    // The max power output, defaults to 100
    maxPower?: number;
    // if true locks the joystick in place
    disabled?: boolean;
};

export interface State {
    // Applies transition on reset
    handleStyle: any;
    // Bounds handle to the square containing
    // the largest available circle
    handleBounds: DraggableBounds;
    // Bounds contents to a square 
    containerStyle: any;
    // Resets the handle to the center
    // on reset
    dragState: {
        x: number;
        y: number;
    };
};

export interface JoystickState {
    direction: number;
    power: number;
};

export class Joystick extends React.Component<Props, State> {

    private readonly DEFAULT_MAX_POWER = 100;

    private readonly INITIAL_STATE: State = {
        handleStyle: {  },
        containerStyle: {  },
        handleBounds: { top: 0, right: 0, bottom: 0, left: 0 },
        dragState: { x: 0, y: 0 }
    };

    public readonly state = { ...this.INITIAL_STATE };

    public componentDidMount() {
        this.createBaseResizeSubscription();
    }

    public componentWillUnmount() {
        if(!!this.baseResizeSubscription) {
            this.baseResizeSubscription.unsubscribe();
        }
    }

    public render(): React.ReactNode {
        return (
            <div className={`${Joystick.name} ${this.props.disabled ? "disabled" : ""}`}>
                <div className="knobBase" style={this.state.containerStyle}>
                    <Draggable disabled={this.props.disabled}
                               position={this.state.dragState}
                               bounds={this.state.handleBounds}
                               onDrag={(_event, { x, y }) => this.updateJoystickState(x, y)}
                               onStop={() => this.onStop()}>
                        <div className="handle" style={this.state.handleStyle}>
                            { this.props.children }
                        </div>
                    </Draggable>
                </div>
            </div>
        );
    }

    // Time to move the joystick back on release
    private readonly TRANSITION_TIME = 200; //ms

    // Parent-most rendered div
    private get joystickContainerElement(): HTMLElement {
        return document.querySelector(".Joystick") as HTMLElement;
    }

    // Subscription for when the window resizes, unsubscribes on unmount
    private baseResizeSubscription: Subscription;
    private createBaseResizeSubscription() {
        this.baseResizeSubscription = merge(of(true), fromEvent(window, 'resize')).subscribe(() => {
            const joystickContainerElement = this.joystickContainerElement;
            const isPortrait = this.isPortraitView(joystickContainerElement);
            const maxDiameterValue = this.selectiveDiameter(joystickContainerElement);
            const maxRadiusValue = maxDiameterValue / 2;
            const maxDiameter = `${maxDiameterValue}px`;

            this.setState({ 
                ...this.state, 
                handleBounds: {
                    top: -maxRadiusValue,
                    bottom: maxRadiusValue,
                    left: -maxRadiusValue,
                    right: maxRadiusValue
                }, containerStyle: {
                    maxHeight: isPortrait ? maxDiameter : 'unset',
                    maxWidth: isPortrait ? 'unset' : maxDiameter
                }
            });
        });
    }

    // Manage the transition for the handle
    private updateTransition(transition: string) {
        this.setState({
            ...this.state,
            handleStyle: { transition },
            dragState: this.INITIAL_STATE.dragState
        });
    }

    // Set a transition, move the handle back to the center and remove the transition
    private onStop() {
        this.updateTransition(`${this.TRANSITION_TIME}ms ease-in-out`);
        setTimeout(() => this.updateTransition("initial"), this.TRANSITION_TIME);
        this.updateJoystickState(0, 0);
    }

    // Calculate the percentage of magnitude to the largest circle
    private calculatePower(x: number, y: number): number {
        const hypotenuse = Math.sqrt(x**2 + y**2);
        const maxPower = this.props.maxPower || this.DEFAULT_MAX_POWER;
        const powerPercentageMax = maxPower * (hypotenuse / (this.selectiveDiameter(this.joystickContainerElement) / 2));
        const powerPercentage = powerPercentageMax > maxPower ? maxPower : Math.round(powerPercentageMax);

        return powerPercentage;
    }

    // the direction that the joystick is pointed in degrees with respect to the original position
    private calculateDirection(x: number, y: number): number {
        const inverseTanResult = Math.round(Math.atan2(-y, x) * 180 / Math.PI);

        if (inverseTanResult > 0) {
            return inverseTanResult;
        } else {
            return 360 + inverseTanResult;
        }
    }

    // Write out to the joystickState$ prop
    private updateJoystickState(x: number, y: number) {
        this.props.joystickState$.next({
            direction: this.calculateDirection(x, y),
            power: this.calculatePower(x, y)
        });
    }

    // Determine if the parent div is portrait or landscape
    private isPortraitView({ clientWidth, clientHeight }: HTMLElement): boolean {
        return clientWidth / clientHeight < 1;
    }

    // The diameter to through which the handle can be dragged
    private selectiveDiameter(element: HTMLElement): number {
        return (this.isPortraitView(element) ? element.clientWidth : element.clientHeight);
    }
}
