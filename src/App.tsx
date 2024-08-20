import { useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./App.css";

function DataTable({ data: { header, rows } }) {
  return (
    <table>
      <tbody>
        <tr>
          {header.map((h, i) => (
            <td
              style={{ key: { i }, padding: "3px", border: "1px solid white" }}
            >
              <strong>{h}</strong>
            </td>
          ))}
        </tr>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((c, j) => (
              <td
                style={{
                  key: { j },
                  padding: "3px",
                  border: "1px solid white",
                }}
              >
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  const [statusMessage, setStatusMessage] = useState(<em>Drop a CSV File</em>);
  const [data, setData] = useState(null);

  const drop = async (e) => {
    e.preventDefault();
    const files = [...e.dataTransfer.items]
      .map((i) => i.getAsFile())
      .filter((f) => f?.type == "text/csv");
    if (files.length > 0) {
      const file = files[0];
      const text = await file.text();

      const [header, ...rows] = text
        .split("\n")
        .filter((line) => line != "")
        .map((line) => line.split(","));

      const obj = { header, rows };

      setData(obj);

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
      {data && data.header && data.rows ? (
        <DataTable data={{ header: data.header, rows: data.rows }} />
      ) : (
        ""
      )}
    </>
  );
}

export default App;
