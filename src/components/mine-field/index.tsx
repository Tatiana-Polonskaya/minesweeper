import { Game } from "../../model/game";
import { Mine } from "../../model/mine";
import { MineSquare } from "../mine-square";

export interface MineFieldProps {
    game: Game;
    onLeftClick: (field: Mine) => void;
}

export const MineField = (props: MineFieldProps) => (
    <div className="game-board">
        {props.game.squares.map((row, i) => (
            <div key={i} className="board-row">
                {row.map((field, j) => (
                    <MineSquare
                        key={`${i}-${j}`}
                        index={j + row.length}
                        field={field}
                        onLeftClick={(field) => props.onLeftClick(field)}
                    />
                ))}
            </div>
        ))}
    </div>
);
