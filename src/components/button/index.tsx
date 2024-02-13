import { PropsWithChildren } from "react";
import "./style.scss";

type Props = {
    onClick: () => void;
    className?: string;
};

export default function Button(props: PropsWithChildren<Props>) {
    return (
        <button className={`default-btn ${props.className}`} onClick={props.onClick}>
            {props.children}
        </button>
    );
}
