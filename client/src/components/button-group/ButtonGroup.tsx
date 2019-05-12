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

export class ButtonGroup extends React.Component<Props> {

    private readonly DEFAULT_LABELS = {
        northLabel: "N",
        eastLabel: "E",
        southLabel: "S",
        westLabel: "W"
    };

    public render(): React.ReactNode {
        return (
            <div className={ButtonGroup.name}>
                <div className="topGroup">
                    <Fab onClick={event => this.props.onClick(event, Direction.North)}>
                        { this.props.northLabel || this.DEFAULT_LABELS.northLabel }
                    </Fab>
                </div>
                <div className="middleGroup">
                    <Fab onClick={event => this.props.onClick(event, Direction.West)}>
                        { this.props.westLabel || this.DEFAULT_LABELS.westLabel }
                    </Fab>
                    <Fab onClick={event => this.props.onClick(event, Direction.East)}>
                        { this.props.eastLabel || this.DEFAULT_LABELS.eastLabel }
                    </Fab>
                </div>
                <div className="bottomGroup">
                    <Fab onClick={event => this.props.onClick(event, Direction.South)}>
                        { this.props.southLabel || this.DEFAULT_LABELS.southLabel }
                    </Fab>
                </div>
            </div>
        );
    }

}
