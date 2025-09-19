import React, { useState, useRef, useEffect } from "react";
import { DemoComponentsProps, LABEL_OPTIONS } from "../shared";

function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}

function FinancialTable({ data, onLabelChange }: DemoComponentsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setDropdownOpen(null));

  const LabelDropdown = ({
    rowId,
    currentLabel,
  }: {
    rowId: number;
    currentLabel?: string;
  }) => {
    const isOpen = dropdownOpen === rowId;

    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(isOpen ? null : rowId)}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currentLabel || "NA"}
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                onClick={() => {
                  onLabelChange(rowId, undefined);
                  setDropdownOpen(null);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                NA
              </button>
              {LABEL_OPTIONS.map((label) => (
                <button
                  key={label}
                  onClick={() => {
                    onLabelChange(rowId, label);
                    setDropdownOpen(null);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const Modal = () => {
    if (!modalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Financial Data Labeling
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                This is a demo modal showing how dialogs work with custom
                Tailwind CSS components. In a real application, this might
                contain additional labeling options or data visualization.
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setModalOpen(false)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Open
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      High
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Low
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Close
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Label
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.map((row) => (
                    <tr key={row.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {new Date(row.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {row.open.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {row.high.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {row.low.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {row.close.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        <LabelDropdown
                          rowId={row.id}
                          currentLabel={row.label}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Open Demo Modal
      </button>

      <Modal />
    </>
  );
}

export default function TailwindOnlyDemo({
  data,
  onLabelChange,
}: DemoComponentsProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Tailwind CSS Only Demo
      </h1>
      <FinancialTable data={data} onLabelChange={onLabelChange} />
    </div>
  );
}
