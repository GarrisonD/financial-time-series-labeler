import { memo, useEffect, useRef } from "react";

import { createPortal } from "react-dom";

import { cn } from "lib/utils";

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

  return createPortal(
    <div
      ref={menuRef}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      )}
      style={{
        position: "fixed",
        top: props.position.top,
        left: props.position.left,
      }}
    >
      <div
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
          !props.value && "bg-accent text-accent-foreground",
        )}
        onClick={() => {
          props.onChange();
          props.onClose();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            props.onChange();
            props.onClose();
          }
        }}
        tabIndex={0}
        role="menuitem"
      >
        NA
      </div>

      {LABELS.map((label) => (
        <div
          key={label}
          className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
            props.value === label && "bg-accent text-accent-foreground",
          )}
          onClick={() => {
            props.onChange(label);
            props.onClose();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              props.onChange(label);
              props.onClose();
            }
          }}
          tabIndex={0}
          role="menuitem"
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
