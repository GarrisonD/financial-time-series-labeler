import { useState } from "react";

// Shared demo data for consistent testing
export const SAMPLE_DATA = [
  {
    id: 1,
    timestamp: "2024-01-01T10:00:00Z",
    open: 100.5,
    high: 102.3,
    low: 99.8,
    close: 101.2,
    label: "RL",
  },
  {
    id: 2,
    timestamp: "2024-01-01T11:00:00Z",
    open: 101.2,
    high: 103.1,
    low: 100.9,
    close: 102.5,
    label: "RH",
  },
  {
    id: 3,
    timestamp: "2024-01-01T12:00:00Z",
    open: 102.5,
    high: 104.0,
    low: 101.8,
    close: 103.2,
    label: undefined,
  },
  {
    id: 4,
    timestamp: "2024-01-01T13:00:00Z",
    open: 103.2,
    high: 105.1,
    low: 102.5,
    close: 104.8,
    label: "RL",
  },
  {
    id: 5,
    timestamp: "2024-01-01T14:00:00Z",
    open: 104.8,
    high: 106.2,
    low: 103.9,
    close: 105.5,
    label: undefined,
  },
];

export const LABEL_OPTIONS = ["RL", "RH"];

// Common demo component interface that each library will implement
export interface DemoComponentsProps {
  data: typeof SAMPLE_DATA;
  onLabelChange: (id: number, label?: string) => void;
}

export function useDemoData() {
  const [data, setData] = useState(SAMPLE_DATA);

  const handleLabelChange = (id: number, label?: string) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label } : item)),
    );
  };

  return { data, onLabelChange: handleLabelChange };
}
