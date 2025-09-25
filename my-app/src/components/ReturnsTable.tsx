"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { formatPercent } from "@/lib/utils";

export default function ReturnsTable({ code }: { code: string }) {
  const [returns, setReturns] = useState<any[]>([]);

  useEffect(() => {
    async function fetchReturns(period: string) {
      const res = await fetch(`/api/scheme/${code}/returns?period=${period}`);
      return res.json();
    }
    Promise.all(["1m", "3m", "6m", "1y"].map(fetchReturns)).then(setReturns);
  }, [code]);

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Period</TableCell>
          <TableCell align="right">Simple Return</TableCell>
          <TableCell align="right">Annualized</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {["1m", "3m", "6m", "1y"].map((p, i) => (
          <TableRow key={p}>
            <TableCell>{p.toUpperCase()}</TableCell>
            <TableCell align="right">{formatPercent(returns[i]?.simpleReturn || 0)}</TableCell>
            <TableCell align="right">
              {returns[i]?.annualizedReturn
                ? formatPercent(returns[i].annualizedReturn)
                : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
