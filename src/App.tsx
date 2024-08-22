import { useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import {
  DataGrid,
  GridApi,
  GridColDef,
  GridRowModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Papa from "papaparse";

import "./App.css";

function App() {
  const [statusMessage, setStatusMessage] = useState<string>("Drop a CSV File");
  const [gridColumns, setGridColumns] = useState<GridColDef[]>([]);
  const [showGrid, setShowGrid] = useState(false);

  const apiRef = useGridApiRef<GridApi>();

  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowGrid(true);

    const files = [...e.dataTransfer.items]
      .map((i) => i.getAsFile())
      .filter((f) => f?.type == "text/csv");

    if (files.length > 0 && files[0] !== null) {
      const file = files[0];

      let id = 0;

      Papa.parse<object>(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        step: (results) => {
          if (id === 0) {
            const columns: GridColDef[] =
              results.meta.fields?.map((h: string) => ({ field: h })) || [];
            setGridColumns(columns);
          }

          const row: GridRowModel = { id, ...results.data };

          apiRef.current.updateRows([row]);
          id++;
        },
        complete: (results, file) => {
          if (results.errors.length > 0) {
            setStatusMessage("There were errors parsing CSV file.");
            console.log("CSV Parse Errors:");
            console.dir(results.errors);
            console.log("----");
          } else {
            setStatusMessage(`CSV file: ${(file as File)?.name}`);
          }
        },
      });
    } else {
      setStatusMessage("No CSV files found.");
    }
  };

  return (
    <>
      <h1>Material Drop Grid</h1>
      <p>{statusMessage}</p>
      {showGrid ? (
        <>
          <Box backgroundColor="white" sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="flex-end"
              backgroundColor="white"
              sx={{ p: 2 }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ height: 40 }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowGrid(false);
                }}
              >
                <ArrowBackIcon />
                Back
              </Button>
            </Box>
            <DataGrid
              sx={{ color: "#223355", backgroundColor: "white" }}
              columns={gridColumns || []}
              apiRef={apiRef}
            />
          </Box>
        </>
      ) : (
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
      )}
    </>
  );
}

export default App;
