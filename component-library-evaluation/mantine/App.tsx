import React from "react";
import MantineDemo from "./demo";
import { useDemoData } from "../shared";

export default function App() {
  const { data, onLabelChange } = useDemoData();
  return <MantineDemo data={data} onLabelChange={onLabelChange} />;
}
