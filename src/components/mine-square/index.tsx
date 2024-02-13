import { Mine } from "../../@types/mine";
import styled from "styled-components";

export interface MineProps {
    index: number;
    field: Mine;
    onLeftClick: (field: Mine) => void;
}

const Square = styled.div`
    width: 20px;
    height: 20px;
    border: 1px solid black;
    display: inline-block;
`;

const BombSquare = styled.div`
    font-size: 15px;
    background: red;
`;

const FlagSquare = styled.div`
    font-size: 15px;
    background: blue;
`;

export const MineSquare = (props: MineProps) => {
    const field = props.field;
    return (
        <Square
            className={"mine-button" + (field.isOpened ? "" : " mine-opened")}
            tabIndex={props.index}
            onClick={() => props.onLeftClick(field)}>
            {renderField(field)}
        </Square>
    );
};

function renderField(field: Mine) {
    if (field.isOpened) {
        if (field.bombs > 0) {
            return (
                <span className={`bombs-${field.bombs}`}>{field.bombs}</span>
            );
        } else if (field.bombs == 0) {
            return "";
        } else {
            return <BombSquare>Bomb</BombSquare>;
        }
    } else {
        if (field.isFlagged) {
            return <FlagSquare>Flag</FlagSquare>;
        } else {
            return "";
        }
    }
}
