import React from "react";
import Fab from "@material-ui/core/Fab";

import "./ButtonGroup.scss";

export enum Direction {
    North,
    East,
    South,
    West
}

export interface Props {
    onClick: (event: React.MouseEvent, direction: Direction) => void;

    northLabel?: string | React.ReactNode;
    eastLabel?: string | React.ReactNode;
    southLabel?: string | React.ReactNode;
    westLabel?: string | React.ReactNode;
}

const DEFAULT_LABELS = {
    northLabel: "N",
    eastLabel: "E",
    southLabel: "S",
    westLabel: "W"
};

export const ButtonGroup = (props: Props) => {
    return (
        <div className={ButtonGroup.name}>
            <div className="topGroup">
                <Fab onClick={event => props.onClick(event, Direction.North)}>
                    { props.northLabel || DEFAULT_LABELS.northLabel }
                </Fab>
            </div>
            <div className="middleGroup">
                <Fab onClick={event => props.onClick(event, Direction.West)}>
                    { props.westLabel || DEFAULT_LABELS.westLabel }
                </Fab>
                <Fab onClick={event => props.onClick(event, Direction.East)}>
                    { props.eastLabel || DEFAULT_LABELS.eastLabel }
                </Fab>
            </div>
            <div className="bottomGroup">
                <Fab onClick={event => props.onClick(event, Direction.South)}>
                    { props.southLabel || DEFAULT_LABELS.southLabel }
                </Fab>
            </div>
        </div>
    );
}
