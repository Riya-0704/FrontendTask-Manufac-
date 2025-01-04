import { useEffect, useState } from "react";
import {  Table } from "@mantine/core";

type CropData = {
  Country: string;
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": string | number;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": string | number;
  "Area Under Cultivation (UOM:Ha(Hectares))": string | number;
};

export function CropTable() {
  const [data, setData] = useState<CropData[]>([]);
  const [visibleData, setVisibleData] = useState<CropData[]>([]);

  useEffect(() => {
    fetch("/dataset.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData: CropData[]) => {
        setData(jsonData);
        setVisibleData(jsonData); // Show the first 20 rows initially
      })
      .catch((error) => {
        console.error("Error loading dataset:", error);
      });
  }, []);

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    const scrollHeight = event.currentTarget.scrollHeight;
    const clientHeight = event.currentTarget.clientHeight;

    if (scrollHeight - scrollTop === clientHeight) {
      // If we've reached the bottom, load more data
      const nextRows = data.slice(visibleData.length, visibleData.length); // Load next 20 rows
      setVisibleData((prevData) => [...prevData, ...nextRows]); // Add new rows to the visible data
    }
  };

  const rows = visibleData.map((row, index) => (
    <tr key={index}>
      <td>{row.Country}</td>
      <td>{row.Year}</td>
      <td>{row["Crop Name"]}</td>
      <td>{row["Crop Production (UOM:t(Tonnes))"] || "N/A"}</td>
      <td>{row["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] || "N/A"}</td>
      <td>{row["Area Under Cultivation (UOM:Ha(Hectares))"] || "N/A"}</td>
    </tr>
  ));

  return (
    <div style={{ maxWidth: "100%", height: "400px", overflow: "auto" }} onScroll={handleScroll}>
      <Table striped highlightOnHover withColumnBorders>
        <thead>
          <tr>
            <th>Country</th>
            <th>Year</th>
            <th>Crop Name</th>
            <th>Crop Production (Tonnes)</th>
            <th>Yield (Kg/Ha)</th>
            <th>Area Under Cultivation (Ha)</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
}