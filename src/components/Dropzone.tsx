import { memo } from "react";

import { useDropzone, DropzoneOptions } from "react-dropzone";

const Dropzone = ({
  onDropAccepted,
}: Pick<DropzoneOptions, "onDropAccepted">) => {
  const { getRootProps, getInputProps } = useDropzone({ onDropAccepted });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />

      <span>Drag 'n' drop some files here, or click to select files</span>
    </div>
  );
};

export default memo(Dropzone);
