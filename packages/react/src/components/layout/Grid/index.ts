import styled from "styled-components";
import { grid, GridProps } from "styled-system";

export interface Props extends GridProps {
  columns: number | string;
  rows?: number | string;
}

function getColumns(props: Props) {
  const { columns } = props;
  return columns === "none" ? columns : `repeat(${columns || 12}, minmax(0, 1fr));`;
}

function getRows(props: Props) {
  const { rows } = props;
  return !rows ? "initial" : rows === "none" ? rows : `repeat(${rows}, minmax(0, 1fr));`;
}

const Grid = styled.div<Props>`
  display: grid;
  grid-template-columns: ${getColumns};
  grid-template-rows: ${getRows};
  ${grid}
`;
export default Grid;