import React, { useEffect, useRef } from "react";

// Headless Menu component following gluestack-ui v3 principles
interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  children: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, position, children }) => {
  const menuRef = useRef<HTMLDivElement>(null);

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

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        ref={menuRef}
        role="menu"
        aria-orientation="vertical"
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          backgroundColor: "#ffffff",
          borderRadius: "4px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0e0e0",
          padding: "4px 0",
          zIndex: 1000,
          minWidth: "120px",
        }}
      >
        {children}
      </div>
    </>
  );
};

interface MenuItemProps {
  onPress: () => void;
  children: React.ReactNode;
  selected?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ onPress, children, selected }) => {
  return (
    <div
      role="menuitem"
      tabIndex={0}
      onClick={onPress}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPress();
        }
      }}
      style={{
        padding: "8px 16px",
        cursor: "pointer",
        fontSize: "14px",
        backgroundColor: selected ? "#e0e0e0" : "transparent",
        color: "#333",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.backgroundColor = "#f5f5f5";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {children}
    </div>
  );
};

const MenuItemLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <span style={{ display: "block", width: "100%" }}>{children}</span>;
};

export { Menu, MenuItem, MenuItemLabel };
