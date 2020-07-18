import React from "react";

import ChartPane from "components/ChartPane";

const App = () => {
  return (
    <div style={{ display: "flex", flex: 1, padding: "10px" }}>
      <ChartPane />
      <ChartPane />
    </div>
  );
};

export default React.memo(App);
