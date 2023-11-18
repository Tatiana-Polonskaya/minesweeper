import { Mine } from "../../model/mine";
import styled from "styled-components";

export interface MineProps {
    index: number;
    field: Mine;
    onLeftClick: (field: Mine) => void;
}

const BombSquare = styled.div`
    background: red;
`;

const FlagSquare = styled.div`
    background: blue;
`;

export const MineSquare = (props: MineProps) => {
    const field = props.field;
    return (
        <button
            className={"mine-button" + (field.isOpened ? "" : " mine-opened")}
            tabIndex={props.index}
            onClick={() => props.onLeftClick(field)}>
            {renderField(field)}
        </button>
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
            return <FlagSquare >Flag</FlagSquare>;
        } else {
            return "";
        }
    }
}
