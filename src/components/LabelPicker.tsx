import { memo, useEffect, useRef } from "react";

import { createPortal } from "react-dom";

// TODO: configurable on UI
const LABELS = ["RL", "RH"];

type LabelPickerPosition = { top: number; left: number };

const LabelPicker = (props: {
  value?: string;
  onChange: (label?: string) => void;
  //
  onClose: () => void;
  position: LabelPickerPosition;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { onClose } = props;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const menuStyles: React.CSSProperties = {
    position: "fixed",
    top: props.position.top,
    left: props.position.left,
    zIndex: 50,
    minWidth: "8rem",
    overflow: "hidden",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    padding: "4px",
    color: "#111827",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  };

  const itemStyles: React.CSSProperties = {
    position: "relative",
    display: "flex",
    cursor: "pointer",
    userSelect: "none",
    alignItems: "center",
    borderRadius: "4px",
    padding: "6px 8px",
    fontSize: "14px",
    outline: "none",
    transition: "background-color 0.15s ease-in-out, color 0.15s ease-in-out",
  };

  const selectedItemStyles: React.CSSProperties = {
    ...itemStyles,
    backgroundColor: "#f3f4f6",
  };

  const handleItemClick = (label?: string) => {
    props.onChange(label);
    props.onClose();
  };

  const handleItemKeyDown = (event: React.KeyboardEvent, label?: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleItemClick(label);
    }
  };

  return createPortal(
    <div ref={menuRef} style={menuStyles}>
      <div
        role="menuitem"
        tabIndex={0}
        style={!props.value ? selectedItemStyles : itemStyles}
        onClick={() => handleItemClick()}
        onKeyDown={(e) => handleItemKeyDown(e)}
        onMouseEnter={(e) => {
          if (!props.value) return;
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "#f3f4f6";
          (e.currentTarget as HTMLDivElement).style.color = "#111827";
        }}
        onMouseLeave={(e) => {
          if (!props.value) return;
          (e.currentTarget as HTMLDivElement).style.backgroundColor =
            "transparent";
        }}
      >
        NA
      </div>

      {LABELS.map((label) => (
        <div
          key={label}
          role="menuitem"
          tabIndex={0}
          style={props.value === label ? selectedItemStyles : itemStyles}
          onClick={() => handleItemClick(label)}
          onKeyDown={(e) => handleItemKeyDown(e, label)}
          onMouseEnter={(e) => {
            if (props.value === label) return;
            (e.currentTarget as HTMLDivElement).style.backgroundColor =
              "#f3f4f6";
            (e.currentTarget as HTMLDivElement).style.color = "#111827";
          }}
          onMouseLeave={(e) => {
            if (props.value === label) return;
            (e.currentTarget as HTMLDivElement).style.backgroundColor =
              "transparent";
          }}
        >
          {label}
        </div>
      ))}
    </div>,
    document.body,
  );
};

export default memo(LabelPicker);

export type { LabelPickerPosition };
