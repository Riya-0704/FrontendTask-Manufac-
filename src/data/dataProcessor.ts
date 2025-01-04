type CropData = {
  Country: string;
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": string | number;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": string | number;
  "Area Under Cultivation (UOM:Ha(Hectares))": string | number;
};

// Parse Year to extract the numeric year (e.g., "1950")
const parseYear = (yearString: string): number => {
  const match = yearString.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : NaN;
};

// Function to calculate total production per crop
export const calculateTotalProductionPerCrop = (data: CropData[]) => {
  const totals: Record<string, number> = {};

  data.forEach(({ "Crop Name": crop, "Crop Production (UOM:t(Tonnes))": production }) => {
    if (production) {
      const productionValue = typeof production === "string" ? parseFloat(production) : production;
      totals[crop] = (totals[crop] || 0) + productionValue;
    }
  });

  return totals;
};

// Function to calculate average yield for each crop
export const calculateAverageYield = (data: CropData[]) => {
  const totals: Record<string, { sum: number; count: number }> = {};

  data.forEach(({ "Crop Name": crop, "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": yieldValue }) => {
    if (yieldValue) {
      const yieldNum = typeof yieldValue === "string" ? parseFloat(yieldValue) : yieldValue;
      if (!totals[crop]) totals[crop] = { sum: 0, count: 0 };
      totals[crop].sum += yieldNum;
      totals[crop].count += 1;
    }
  });

  return Object.fromEntries(
    Object.entries(totals).map(([crop, { sum, count }]) => [crop, sum / count])
  );
};

// Function to filter data by year
export const filterDataByYear = (data: CropData[], year: number) => {
  return data.filter((item) => parseYear(item.Year) === year);
};
