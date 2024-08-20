import { useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import "./App.css";

interface GridRow {
  id: number;
  [key: string]: string | number;
}

function App() {
  const [statusMessage, setStatusMessage] = useState<string>("Drop a CSV File");
  const [gridColumns, setGridColumns] = useState<GridColDef[] | null>(null);
  const [gridRows, setGridRows] = useState<GridRow[] | null>(null);

  const drop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = [...e.dataTransfer.items]
      .map((i) => i.getAsFile())
      .filter((f) => f?.type == "text/csv");

    if (files.length > 0 && files[0] !== null) {
      const file = files[0];
      const text = await file.text();

      const [csvHeaders, ...csvRows] = text
        .split("\n")
        .filter((line: string) => line != "")
        .map((line: string) => line.split(","));

      const columns: GridColDef[] = csvHeaders.map((h: string) => {
        return { field: h };
      });

      const rows = csvRows.map((csvRow: string[], id: number) => {
        const row: GridRow = { id };

        csvRow.forEach((c: string, j: number) => {
          const h: string = csvHeaders[j];
          row[h] = c;
        });
        return row;
      });

      setGridColumns(columns);
      setGridRows(rows);

      setStatusMessage(`Dropped CSV file: ${file.name}`);
    } else {
      setStatusMessage("No CSV files found.");
    }
  };

  return (
    <>
      <h1>Material Drop Grid</h1>
      <p>{statusMessage}</p>
      <div
        id="fileDrop"
        onDrop={drop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          width: "100%",
          backgroundColor: "#33cccc",
          height: "5em",
          paddingTop: "2.5em",
        }}
      >
        Drop File Here
      </div>
      {gridColumns && gridRows ? (
        <DataGrid
          sx={{ color: "#223355", backgroundColor: "white" }}
          columns={gridColumns}
          rows={gridRows}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default App;
