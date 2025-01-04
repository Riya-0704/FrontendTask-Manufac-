import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

type CropData = {
  Country: string;
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": string | number;
};

export function CropBarChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<CropData[]>([]);

  // Fetch dataset from the public directory when the component mounts
  useEffect(() => {
    fetch("/dataset.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData: CropData[]) => {
        setData(jsonData); // Set the fetched data
      })
      .catch((error) => {
        console.error("Error loading dataset:", error);
      });
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Update the chart whenever the `data` changes
  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      const chartInstance = echarts.init(chartRef.current);

      // Calculate total crop production for each crop
      const totals = data.reduce((acc: Record<string, number>, row) => {
        if (row["Crop Production (UOM:t(Tonnes))"]) {
          const production = typeof row["Crop Production (UOM:t(Tonnes))"] === "string"
            ? parseFloat(row["Crop Production (UOM:t(Tonnes))"])
            : row["Crop Production (UOM:t(Tonnes))"];
          acc[row["Crop Name"]] = (acc[row["Crop Name"]] || 0) + production;
        }
        return acc;
      }, {});

      // ECharts option configuration
      const option = {
        title: {
          text: "Total Crop Production (Tonnes)",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        xAxis: {
          type: "category",
          data: Object.keys(totals),
          axisLabel: { rotate: 45 },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Production (Tonnes)",
            type: "bar",
            data: Object.values(totals),
            itemStyle: {
              color: "#4CAF50",
            },
          },
        ],
      };

      chartInstance.setOption(option);

      // Cleanup chart instance when component unmounts or data changes
      return () => {
        chartInstance.dispose();
      };
    }
  }, [data]); // Add `data` as a dependency to trigger re-render when data changes

  return <div ref={chartRef} style={{ height: 600, width: "100%" }} />;
}
