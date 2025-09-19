import React from "react";
import TailwindOnlyDemo from "./demo";
import { useDemoData } from "../shared";

export default function App() {
  const { data, onLabelChange } = useDemoData();
  return <TailwindOnlyDemo data={data} onLabelChange={onLabelChange} />;
}
