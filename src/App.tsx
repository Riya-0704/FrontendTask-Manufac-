import { CropTable } from "./components/YearlyTable";
import { CropBarChart } from "./components/BarChart";
import "./style.css";

const App = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Agriculture Data</h1>
      <CropTable />
      <div style={{ marginTop: "40px" }}>
        <CropBarChart />
      </div>
    </div>
  );
};

export default App;