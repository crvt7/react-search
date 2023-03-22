import React from "react";

export const GridCell = ({
  col,
  row,
  grid,
  setGrid,
  action,
  setAction,
  points,
  setPoints,
}) => {
  const handleClick = () => {
    let newGrid = [];
    grid.forEach((gridRow, i) => {
      let newRow = gridRow;
      if (i === row) {
        if (newRow[col] === action) {
          newRow[col] = 0;
        } else {
          newRow[col] = action;
        }
      }
      newGrid.push(newRow);
    });
    setGrid(previousGrid => ({...previousGrid, grid:newGrid}));

    if (action === 1) {
      setPoints({ ...points, startPoint: { col: col, row: row } });
    } else if (action === 2) {
      setPoints({ ...points, endPoint: { col: col, row: row } });
    }

    if (action !== 3) {
      setAction(action + 1);
    }
  };

  const colors = ["#aaaaaa", "blue", "orange", "black", "green", "#822c83"];

  return (
    <div
      id={row.toString() +"-"+ col.toString()}
      className="gridCell"
      style={{ backgroundColor: colors[grid[row][col]] }}
      onClick={() => handleClick()}
    ></div>
  );
};
