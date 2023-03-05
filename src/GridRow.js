import React from "react";
import { GridCell } from "./GridCell";

export const GridRow = ({
  points,
  setPoints,
  grid,
  setGrid,
  idx,
  action,
  setAction,
  size
}) => {
  const gridCells = [...Array(size.x)].map((e, i) => (
    <GridCell
      points={points}
      setPoints={setPoints}
      action={action}
      setAction={setAction}
      grid={grid}
      setGrid={setGrid}
      key={i}
      row={idx}
      col={i}
    />
  ));
  return <div className="gridRow">{gridCells}</div>;
};
