import React from "react";
import ChakraUIDemo from "./demo";
import { useDemoData } from "../shared";

export default function App() {
  const { data, onLabelChange } = useDemoData();
  return <ChakraUIDemo data={data} onLabelChange={onLabelChange} />;
}
