import React, { useState } from "react";
import {
  MantineProvider,
  Table,
  Button,
  Menu,
  Modal,
  Group,
  Text,
  Paper,
} from "@mantine/core";

import { DemoComponentsProps, LABEL_OPTIONS } from "../shared";

function FinancialTable({ data, onLabelChange }: DemoComponentsProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const LabelMenu = ({
    rowId,
    currentLabel,
  }: {
    rowId: number;
    currentLabel?: string;
  }) => (
    <Menu shadow="md" width={100}>
      <Menu.Target>
        <Button variant="outline" size="xs">
          {currentLabel || "NA"}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => onLabelChange(rowId, undefined)}>
          NA
        </Menu.Item>
        {LABEL_OPTIONS.map((label) => (
          <Menu.Item key={label} onClick={() => onLabelChange(rowId, label)}>
            {label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );

  const rows = data.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{new Date(row.timestamp).toLocaleTimeString()}</Table.Td>
      <Table.Td>{row.open.toFixed(2)}</Table.Td>
      <Table.Td>{row.high.toFixed(2)}</Table.Td>
      <Table.Td>{row.low.toFixed(2)}</Table.Td>
      <Table.Td>{row.close.toFixed(2)}</Table.Td>
      <Table.Td>
        <LabelMenu rowId={row.id} currentLabel={row.label} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Paper shadow="xs" p="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Timestamp</Table.Th>
              <Table.Th>Open</Table.Th>
              <Table.Th>High</Table.Th>
              <Table.Th>Low</Table.Th>
              <Table.Th>Close</Table.Th>
              <Table.Th>Label</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>

      <Button onClick={() => setModalOpen(true)} mt="md">
        Open Demo Modal
      </Button>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Financial Data Labeling"
      >
        <Text size="sm">
          This is a demo modal showing how dialogs work with Mantine. In a real
          application, this might contain additional labeling options or data
          visualization.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setModalOpen(false)}>Confirm</Button>
        </Group>
      </Modal>
    </>
  );
}

export default function MantineDemo({
  data,
  onLabelChange,
}: DemoComponentsProps) {
  return (
    <MantineProvider>
      <div style={{ padding: 16 }}>
        <h1>Mantine Component Demo</h1>
        <FinancialTable data={data} onLabelChange={onLabelChange} />
      </div>
    </MantineProvider>
  );
}
