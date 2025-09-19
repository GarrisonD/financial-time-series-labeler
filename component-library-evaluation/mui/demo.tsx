import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import { DemoComponentsProps, LABEL_OPTIONS } from "../shared";

const theme = createTheme();

function FinancialTable({ data, onLabelChange }: DemoComponentsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLabelClick = (
    event: React.MouseEvent<HTMLElement>,
    rowId: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleLabelSelect = (label?: string) => {
    if (selectedRowId !== null) {
      onLabelChange(selectedRowId, label);
    }
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell align="right">Open</TableCell>
              <TableCell align="right">High</TableCell>
              <TableCell align="right">Low</TableCell>
              <TableCell align="right">Close</TableCell>
              <TableCell align="center">Label</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {new Date(row.timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell align="right">{row.open.toFixed(2)}</TableCell>
                <TableCell align="right">{row.high.toFixed(2)}</TableCell>
                <TableCell align="right">{row.low.toFixed(2)}</TableCell>
                <TableCell align="right">{row.close.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => handleLabelClick(e, row.id)}
                  >
                    {row.label || "NA"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleLabelSelect(undefined)}>NA</MenuItem>
        {LABEL_OPTIONS.map((label) => (
          <MenuItem key={label} onClick={() => handleLabelSelect(label)}>
            {label}
          </MenuItem>
        ))}
      </Menu>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
        style={{ marginTop: 16 }}
      >
        Open Demo Modal
      </Button>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Financial Data Labeling</DialogTitle>
        <DialogContent>
          This is a demo modal showing how dialogs work with Material-UI. In a
          real application, this might contain additional labeling options or
          data visualization.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setModalOpen(false)} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function MUIDemo({ data, onLabelChange }: DemoComponentsProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: 16 }}>
        <h1>Material-UI Component Demo</h1>
        <FinancialTable data={data} onLabelChange={onLabelChange} />
      </div>
    </ThemeProvider>
  );
}
