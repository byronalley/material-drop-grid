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
import { Alert, Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Papa from "papaparse";

import "./App.css";

function App() {
  const [statusMessage, setStatusMessage] = useState<string | null>("");
  const [filename, setFilename] = useState<string>("");
  const [gridColumns, setGridColumns] = useState<GridColDef[]>([]);
  const [showGrid, setShowGrid] = useState(false);

  const apiRef = useGridApiRef<GridApi>();

  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setShowGrid(true);
    setStatusMessage("Loading file...");

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
            setFilename((file as File)?.name);
            setStatusMessage(null);
          }
        },
      });
    } else {
      setStatusMessage("No CSV files found.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      width="100%"
    >
      <Typography variant="h2" component="h1" sx={{ py: 3 }}>
        Material Drop Grid
      </Typography>
      {showGrid ? (
        <>
          <Box sx={{ p: 2, background: "white", width: "100%" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-end"
              sx={{ p: 2, background: "white" }}
            >
              {filename && (
                <Typography variant="subtitle2">{filename}</Typography>
              )}
              {statusMessage && <Alert severity="info">{statusMessage}</Alert>}
              <Button
                variant="contained"
                color="primary"
                sx={{ height: 40 }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowGrid(false);
                  setStatusMessage("");
                }}
              >
                <ArrowBackIcon />
                Back
              </Button>
            </Box>
            <DataGrid
              sx={{ color: "#223355", background: "white", width: "100%" }}
              columns={gridColumns || []}
              apiRef={apiRef}
            />
          </Box>
        </>
      ) : (
        <>
          <Typography variant="subtitle1" sx={{ py: 3 }}>
            Drop a CSV File Below
          </Typography>
          <Box
            id="fileDrop"
            onDrop={drop}
            onDragOver={(e) => e.preventDefault()}
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="flex-middle"
            sx={{
              width: "100%",
              background: "#33cccc",
              minHeight: "7em",
              padding: "5em",
            }}
          >
            <Box>
              <p>Drop File Here</p>
              <CloudDownloadIcon />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default App;
