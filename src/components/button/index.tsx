import { ReactNode } from "react";
import styled from "styled-components";

const ButtonStyled = styled.div`
    color: green;
    font-size: 20px;
    cursor: pointer;
`;

type Props = {
    children: ReactNode;
    onClick: () => void;
};

export default function Button({ children, onClick }: Props) {
    return <ButtonStyled onClick={onClick}>{children}</ButtonStyled>;
}
