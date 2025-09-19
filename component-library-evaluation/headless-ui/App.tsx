import React from "react";
import HeadlessUIDemo from "./demo";
import { useDemoData } from "../shared";

export default function App() {
  const { data, onLabelChange } = useDemoData();
  return <HeadlessUIDemo data={data} onLabelChange={onLabelChange} />;
}
