import React from "react";

import Dropzone from "./Dropzone";

const ChartPane = () => {
  const handleDrop = React.useCallback(
    (files: File[]) => console.log(files),
    []
  );

  return (
    <div style={{ display: "flex", flex: 1, margin: "10px" }}>
      <Dropzone onDropAccepted={handleDrop} />
    </div>
  );
};

export default ChartPane;
