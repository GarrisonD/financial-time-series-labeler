import React from "react";
import MUIDemo from "./demo";
import { useDemoData } from "../shared";

export default function App() {
  const { data, onLabelChange } = useDemoData();
  return <MUIDemo data={data} onLabelChange={onLabelChange} />;
}
