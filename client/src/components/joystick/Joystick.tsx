import React, { useEffect, useState } from "react";
import Draggable, { DraggableBounds } from "react-draggable";
import { merge, of, fromEvent, Subscription } from "rxjs";

import "./Joystick.scss";

export type Props = React.PropsWithChildren<{
    // Takes in a subject and writes out the state changes to that subject
    joystickState: (state: JoystickState) => any;
    // The max power output, defaults to 100
    maxPower?: number;
    // if true locks the joystick in place
    disabled?: boolean;
    // handle width in pixels, defaults to 75
    handleDiameter?: number;
}>;

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

const DEFAULT_MAX_POWER = 100;

// Time to move the joystick back on release
const TRANSITION_TIME = 200; //ms

// 75 as default to fit on small mobile screens
const DEFAULT_HANDLE_DIAMETER = 75;

const INITIAL_HANDLE_STYLE: State["handleStyle"] = {  };
const INITIAL_CONTAINER_STYLE: State["containerStyle"] = {  };
const INITIAL_HANDLE_BOUNDS: State["handleBounds"] = { top: 0, right: 0, bottom: 0, left: 0 };
const INITIAL_DRAG_STATE: State["dragState"] = { x: 0, y: 0 };

// Determine if the parent div is portrait or landscape
const isPortraitView = ({ clientWidth, clientHeight }: HTMLElement): boolean => {
    return clientWidth / clientHeight < 1;
}

// The diameter to through which the handle can be dragged
const selectiveDiameter = (element: HTMLElement): number => {
    return (isPortraitView(element) ? element.clientWidth : element.clientHeight);
}

// Calculate the percentage of magnitude to the largest circle
const calculatePower = (x: number, y: number, joystickContainerElement: HTMLElement, maxPower?: number): number => {
    maxPower = maxPower || DEFAULT_MAX_POWER;

    const hypotenuse = Math.sqrt(x**2 + y**2);
    const powerPercentageMax = maxPower * (hypotenuse / (selectiveDiameter(joystickContainerElement) / 2));
    const powerPercentage = powerPercentageMax > maxPower ? maxPower : Math.round(powerPercentageMax);

    return powerPercentage;
}

// Parent-most rendered div
const getJoystickContainerElement = (): HTMLElement => {
    return document.querySelector(".Joystick") as HTMLElement;
}

// Subscription for when the window resizes, unsubscribes on unmount
let baseResizeSubscription: Subscription;
const createBaseResizeSubscription = (
    setHandleBounds: (handleBounds: State["handleBounds"]) => void,
    setContainerStyle: (containerStyle: State["containerStyle"]) => void
): void => {
    baseResizeSubscription = merge(of(true), fromEvent(window, "resize")).subscribe(() => {
        const joystickContainerElement = getJoystickContainerElement();
        const isPortrait = isPortraitView(joystickContainerElement);
        const maxDiameterValue = selectiveDiameter(joystickContainerElement);
        const maxRadiusValue = maxDiameterValue / 2;
        const maxDiameter = `${maxDiameterValue}px`;

        setHandleBounds({
            top: -maxRadiusValue,
            bottom: maxRadiusValue,
            left: -maxRadiusValue,
            right: maxRadiusValue
        });

        setContainerStyle({
                maxHeight: isPortrait ? maxDiameter : "unset",
                maxWidth: isPortrait ? "unset" : maxDiameter
        });
    });
}

// Manage the transition for the handle
const updateTransition = (
    transition: string,
    setHandleStyle: (handleStyle: State["handleStyle"]) => void,
    setDragState: (dragState: State["dragState"]) => void
): void => {
        setHandleStyle({ transition });
        setDragState(INITIAL_DRAG_STATE);
}

// Set a transition, move the handle back to the center and remove the transition
const onStop = (
    setHandleStyle: (handleStyle: State["handleStyle"]) => void,
    setDragState: (dragState: State["dragState"]) => void,
    setJoystickState: (joystickState: JoystickState) => void
): void => {
    updateTransition(`${TRANSITION_TIME}ms ease-in-out`, setHandleStyle, setDragState);
    setTimeout(() => updateTransition("initial", setHandleStyle, setDragState), TRANSITION_TIME);
    updateJoystickState(0, 0, setJoystickState);
}

// Write out to the joystickState$ prop
const updateJoystickState = (
    x: number,
    y: number,
    setJoystickState: (joystickState: JoystickState) => void,
    maxPower?: number
): void => {
    setJoystickState({
        direction: calculateDirection(x, y),
        power: calculatePower(x, y, getJoystickContainerElement(), maxPower)
    });
}

// the direction that the joystick is pointed in degrees with respect to the original position
const calculateDirection = (x: number, y: number): number => {
    const inverseTanResult = Math.round(Math.atan2(-y, x) * 180 / Math.PI);

    if (inverseTanResult > 0) {
        return inverseTanResult;
    } else {
        return 360 + inverseTanResult;
    }
}

export function Joystick(props: Props) {
    const handleDiameter = props.handleDiameter ? 
        `${props.handleDiameter}px` : 
        `${DEFAULT_HANDLE_DIAMETER}px`;

    const [ handleStyleState, setHandleStyle ] = useState(INITIAL_HANDLE_STYLE);
    const handleStyle = { ...handleStyleState, height: handleDiameter, width: handleDiameter };
    const [ containerStyle, setContainerStyle ] = useState(INITIAL_CONTAINER_STYLE);
    const [ handleBounds, setHandleBounds ] = useState(INITIAL_HANDLE_BOUNDS);
    const [ dragState, setDragState ] = useState(INITIAL_DRAG_STATE);

    useEffect(
        () => {
            createBaseResizeSubscription(setHandleBounds, setContainerStyle);

            return () => {
                if (!!baseResizeSubscription) {
                    baseResizeSubscription.unsubscribe();
                }
            }
        }, 
        // never update
        [  ]
    );

    return (
        <div className={`${Joystick.name} ${props.disabled ? "disabled" : ""}`}>
            <div className="knobBase" style={containerStyle}>
                <Draggable disabled={props.disabled}
                            position={dragState}
                            bounds={handleBounds}
                            onDrag={(_event, { x, y }) => updateJoystickState(x, y, props.joystickState)}
                            onStop={() => onStop(setHandleStyle, setDragState, props.joystickState)}>
                    <div className="handle" style={handleStyle}>
                        { props.children }
                    </div>
                </Draggable>
            </div>
        </div>
    );
}
