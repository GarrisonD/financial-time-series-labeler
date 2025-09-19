import React, { useState } from "react";
import { useDemoData } from "./shared";

// Import all demo components
import MUIDemo from "./mui/demo";
import HeadlessUIDemo from "./headless-ui/demo";
import TailwindOnlyDemo from "./tailwind-only/demo";
import MantineDemo from "./mantine/demo";
import ChakraUIDemo from "./chakra-ui/demo";

// Import styles
import "./styles.css";

const LIBRARIES = {
  mui: { name: "Material-UI", component: MUIDemo },
  "headless-ui": { name: "Headless UI + Tailwind", component: HeadlessUIDemo },
  "tailwind-only": {
    name: "Custom Tailwind Only",
    component: TailwindOnlyDemo,
  },
  mantine: { name: "Mantine", component: MantineDemo },
  "chakra-ui": { name: "Chakra UI", component: ChakraUIDemo },
};

export default function ComponentLibraryTest() {
  const [activeLibrary, setActiveLibrary] =
    useState<keyof typeof LIBRARIES>("mui");
  const { data, onLabelChange } = useDemoData();

  const ActiveComponent = LIBRARIES[activeLibrary].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Component Library Bundle Size Evaluation
          </h1>
          <p className="mt-2 text-gray-600">
            Testing different React component libraries for financial time
            series labeling
          </p>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {Object.entries(LIBRARIES).map(([key, { name }]) => (
              <button
                key={key}
                onClick={() => setActiveLibrary(key as keyof typeof LIBRARIES)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeLibrary === key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Currently showing: {LIBRARIES[activeLibrary].name}
            </h2>
            <ActiveComponent data={data} onLabelChange={onLabelChange} />
          </div>
        </div>
      </main>
    </div>
  );
}
