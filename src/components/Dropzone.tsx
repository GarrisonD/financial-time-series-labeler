import { memo } from "react";

import { useDropzone, DropzoneOptions } from "react-dropzone";

const Dropzone = (
  props: Pick<DropzoneOptions, "accept" | "onDropAccepted">
) => {
  const { getRootProps, getInputProps } = useDropzone(props);

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />

      <span>Drag 'n' drop some files here, or click to select files</span>
    </div>
  );
};

export default memo(Dropzone);
