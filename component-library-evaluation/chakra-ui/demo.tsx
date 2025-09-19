import React, { useState } from "react";
import {
  ChakraProvider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Heading,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { DemoComponentsProps, LABEL_OPTIONS } from "../shared";

function FinancialTable({ data, onLabelChange }: DemoComponentsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const LabelMenu = ({
    rowId,
    currentLabel,
  }: {
    rowId: number;
    currentLabel?: string;
  }) => (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        size="sm"
        variant="outline"
      >
        {currentLabel || "NA"}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => onLabelChange(rowId, undefined)}>NA</MenuItem>
        {LABEL_OPTIONS.map((label) => (
          <MenuItem key={label} onClick={() => onLabelChange(rowId, label)}>
            {label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );

  return (
    <>
      <TableContainer>
        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead>
            <Tr>
              <Th>Timestamp</Th>
              <Th isNumeric>Open</Th>
              <Th isNumeric>High</Th>
              <Th isNumeric>Low</Th>
              <Th isNumeric>Close</Th>
              <Th>Label</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row) => (
              <Tr key={row.id}>
                <Td>{new Date(row.timestamp).toLocaleTimeString()}</Td>
                <Td isNumeric>{row.open.toFixed(2)}</Td>
                <Td isNumeric>{row.high.toFixed(2)}</Td>
                <Td isNumeric>{row.low.toFixed(2)}</Td>
                <Td isNumeric>{row.close.toFixed(2)}</Td>
                <Td>
                  <LabelMenu rowId={row.id} currentLabel={row.label} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Button colorScheme="blue" onClick={onOpen} mt={4}>
        Open Demo Modal
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Financial Data Labeling</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            This is a demo modal showing how dialogs work with Chakra UI. In a
            real application, this might contain additional labeling options or
            data visualization.
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function ChakraUIDemo({
  data,
  onLabelChange,
}: DemoComponentsProps) {
  return (
    <ChakraProvider>
      <Box p={4}>
        <Heading as="h1" size="lg" mb={4}>
          Chakra UI Component Demo
        </Heading>
        <FinancialTable data={data} onLabelChange={onLabelChange} />
      </Box>
    </ChakraProvider>
  );
}
