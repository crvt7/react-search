import React, { useState } from "react";
import { GridRow } from "./GridRow";

const size = {
  x: 45,
  y: 15,
};

const getNewBoard = (size) => {
  let newGrid = [];
  for (let i = 0; i < size.y; i++) {
    let newRow = [];
    for (let j = 0; j < size.x; j++) {
      newRow.push(0);
    }
    newGrid.push(newRow);
  }
  return newGrid;
};

const clearBoard = (board) => {
  let newGrid = [];
  board.forEach((row) => {
    let newRow = [];
    row.forEach((cell) => {
      if (cell >= 4) {
        newRow.push(0);
      } else {
        newRow.push(cell);
      }
    });
    newGrid.push(newRow);
  });
  return newGrid;
};

const heuristic = (a, b) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

const compare = (a, b) => {
  if (a[1] < b[1]) {
    return -1;
  }
  if (a[1] > b[1]) {
    return 1;
  }
  return 0;
};

const info = [
  "Choose the starting point",
  "Choose the ending point",
  "Place walls and click Search",
];

export const Grid = () => {
  const [{ grid }, setGrid] = useState({ grid: getNewBoard(size) });
  const [action, setAction] = useState(1);
  const [points, setPoints] = useState({ startPoint: null, endPoint: null });
  const [disabled, setDisabled] = useState(false);
  const [alg, setAlg] = useState("BFS");
  const [{pathInfo}, setPathInfo] = useState({pathInfo:null})

  const search = async (alg) => {
    let newGrid = JSON.parse(JSON.stringify(grid));
    newGrid = clearBoard(newGrid);
    setGrid((previousGrid) => ({ ...previousGrid, grid: newGrid }));
    setDisabled(true);
    let start = [points.startPoint.row, points.startPoint.col];
    let end = [points.endPoint.row, points.endPoint.col];
    let cameFrom = {};
    let path = [];
    let frontier = [[start, 0]];
    let current = [-1, -1];
    let costSoFar = {};
    let startString = start[0].toString() + "-" + start[1].toString();
    costSoFar[startString] = 0;

    while (frontier.length > 0) {
      if (alg === "GBFS" || alg === "aStar") {
        frontier.sort(compare);
      }
      current = frontier.shift();
      let currentString =
        current[0][0].toString() + "-" + current[0][1].toString();

      if (current[0].toString() === end.toString()) {
        let currentParent = cameFrom[currentString];
        while (currentParent[0].toString() !== start.toString()) {
          path.push(currentParent);
          currentString =
            currentParent[0][0].toString() +
            "-" +
            currentParent[0][1].toString();
          currentParent = cameFrom[currentString];
        }
        path.forEach((e) => {
          newGrid[e[0][0]][e[0][1]] = 5;
        });
        setGrid((previousGrid) => ({ ...previousGrid, grid: newGrid }));
        setDisabled(false);
        setPathInfo((prevPath) => ({...prevPath, pathInfo:"Path found, length: "+path.length.toString()}))
        return;
      }
      if (current[0].toString() !== start.toString()) {
        newGrid[current[0][0]][current[0][1]] = 4;
        await new Promise((r) => setTimeout(r, 10));
        document.getElementById(currentString).style.backgroundColor = "green";
      }

      let neighbors = [];
      neighbors.push(
        [current[0][0], current[0][1] + 1],
        [current[0][0] + 1, current[0][1]],
        [current[0][0], current[0][1] - 1],
        [current[0][0] - 1, current[0][1]]
      );
      // eslint-disable-next-line
      neighbors.forEach((neighbor) => {
        if (
          neighbor[0] >= 0 &&
          neighbor[0] <= size.y - 1 &&
          neighbor[1] >= 0 &&
          neighbor[1] <= size.x - 1
        ) {
          let neighborString =
            neighbor[0].toString() + "-" + neighbor[1].toString();
          if (alg === "aStar") {
            let newCost = costSoFar[currentString] + 1;
            if (
              (!(neighborString in cameFrom) ||
                newCost < costSoFar[neighborString]) &&
              grid[neighbor[0]][neighbor[1]] !== 3
            ) {
              let priority = heuristic(neighbor, end) + newCost;
              frontier.push([neighbor, priority]);
              costSoFar[neighborString] = newCost;
              cameFrom[neighborString] = current;
            }
          } else if (
            !(neighborString in cameFrom) &&
            grid[neighbor[0]][neighbor[1]] !== 3
          ) {
            let priority = heuristic(neighbor, end);
            frontier.push([neighbor, priority]);
            cameFrom[neighborString] = current;
          }
        }
      });
    }
    setPathInfo((prevPath) => ({...prevPath, pathInfo:"Path not found"}))
    setGrid((previousGrid) => ({ ...previousGrid, grid: newGrid }));
    setDisabled(false);
  };

  const reset = () => {
    let newGrid = getNewBoard(size);
    setGrid((previousGrid) => ({ ...previousGrid, grid: newGrid }));
    setAction(1);
    setPoints({ startPoint: null, endPoint: null });
  };

  const randomize = () => {
    let newGrid = clearBoard(grid);

    newGrid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          let roll = Math.ceil(Math.random() * 20);
          if (roll >= 16) {
            newGrid[i][j] = 3;
          }
        }
      });
    });
    setGrid((previousGrid) => ({ ...previousGrid, grid: newGrid }));
  };

  const gridRows = [...Array(size.y)].map((e, i) => (
    <GridRow
      size={size}
      points={points}
      setPoints={setPoints}
      action={action}
      setAction={setAction}
      grid={grid}
      setGrid={setGrid}
      key={i}
      idx={i}
    />
  ));

  // const readableGrid = grid.map((el, index) => (
  //   <p key={index}>{JSON.stringify(el).replaceAll(",", " ")}</p>
  // ));

  return (
    <div className="main">
      <div className="navigation">
        <div
          style={{ backgroundColor: alg === "BFS" ? "#16a96f" : "#0B5437" }}
          className="algButton"
          onClick={() => setAlg("BFS")}
        >
          Breadth First Search
        </div>
        <div
          style={{ backgroundColor: alg === "GBFS" ? "#16a96f" : "#0B5437" }}
          className="algButton"
          onClick={() => setAlg("GBFS")}
        >
          Greedy Best First Search
        </div>
        <div
          style={{ backgroundColor: alg === "aStar" ? "#16a96f" : "#0B5437" }}
          className="algButton"
          onClick={() => setAlg("aStar")}
        >
          A*
        </div>
      </div>
      <div className="infoText">{info[action - 1]}</div>
      <div className="actionBar">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "0.8em",
            paddingBottom: "2em",
          }}
        >
          <button disabled={disabled} id="reset" onClick={() => reset()}>
            Reset the board
          </button>
          <button disabled={disabled} onClick={() => randomize()}>
            Place randomly generated walls
          </button>
        </div>

        <button
          disabled={disabled || action !== 3}
          onClick={() => {
            search(alg);
          }}
        >
          Search
        </button>
      </div>
      <div className="pathInfo">{pathInfo}</div>
      <div className="grid">{gridRows}</div>
    </div>
  );
};
