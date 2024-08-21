import { useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import Papa from "papaparse";

import "./App.css";

function App() {
  const [statusMessage, setStatusMessage] = useState<string>("Drop a CSV File");
  const [gridColumns, setGridColumns] = useState<GridColDef[] | null>(null);
  const [gridRows, setGridRows] = useState<GridRowModel[] | null>(null);

  const drop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = [...e.dataTransfer.items]
      .map((i) => i.getAsFile())
      .filter((f) => f?.type == "text/csv");

    if (files.length > 0 && files[0] !== null) {
      const file = files[0];
      const csv = await file.text();

      const { data, errors, meta } = Papa.parse<object>(csv, {
        header: true,
        dynamicTyping: true,
      });

      const columns: GridColDef[] =
        meta.fields?.map((h: string) => ({ field: h })) || [];

      const rows = data.map((dataRow: object, id: number) => {
        const row: GridRowModel = { ...dataRow, id };

        return row;
      });

      setGridColumns(columns);
      setGridRows(rows);

      if (errors.length > 0) {
        setStatusMessage("There were errors parsing CSV file.");
        console.log("CSV Parse Errors:");
        console.dir(errors);
        console.log("----");
      } else {
        setStatusMessage(`CSV file: ${file.name}`);
      }
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
