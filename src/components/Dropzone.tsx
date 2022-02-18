import { memo } from "react";

import { useDropzone, DropzoneOptions } from "react-dropzone";

const Dropzone = (
  props: Pick<DropzoneOptions, "accept" | "maxFiles" | "onDropAccepted">
) => {
  const { getRootProps, getInputProps } = useDropzone(props);

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />

      <span>Drag 'n' drop the file here, or click to select the file</span>
    </div>
  );
};

export default memo(Dropzone);
