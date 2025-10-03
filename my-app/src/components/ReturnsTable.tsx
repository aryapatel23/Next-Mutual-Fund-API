// components/ReturnsTable.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { formatPercent } from "@/lib/utils";

type ReturnData = {
  simpleReturn: number;
  annualizedReturn?: number;
};

const PERIODS = ["1m", "3m", "6m", "1y"] as const;

export default function ReturnsTable({ code }: { code: string }) {
  const [returnsMap, setReturnsMap] = useState<Record<string, ReturnData | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;

    const fetchReturnForPeriod = async (period: string): Promise<[string, ReturnData | null]> => {
      try {
        const res = await fetch(`/api/scheme/${code}/returns?period=${period}`);
        if (!res.ok) {
          console.warn(`Failed to fetch returns for period ${period}:`, res.status);
          return [period, null];
        }
        const data = await res.json();
        // Ensure the response has expected fields
        return [period, { 
          simpleReturn: data.simpleReturn ?? 0,
          annualizedReturn: data.annualizedReturn 
        }];
      } catch (err) {
        console.error(`Error fetching returns for ${period}:`, err);
        return [period, null];
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          PERIODS.map(period => fetchReturnForPeriod(period))
        );
        const resultMap = Object.fromEntries(results);
        setReturnsMap(resultMap);
      } catch (err) {
        setError("Failed to load returns data.");
        console.error("Unexpected error in fetchAll:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [code]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="body2">
        {error}
      </Typography>
    );
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "600" }}>Period</TableCell>
          <TableCell align="right" sx={{ fontWeight: "600" }}>
            Simple Return
          </TableCell>
          <TableCell align="right" sx={{ fontWeight: "600" }}>
            Annualized
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {PERIODS.map((period) => {
          const data = returnsMap[period];
          return (
            <TableRow key={period}>
              <TableCell>{period.toUpperCase()}</TableCell>
              <TableCell align="right">
                {data ? formatPercent(data.simpleReturn) : "-"}
              </TableCell>
              <TableCell align="right">
                {data && data.annualizedReturn !== undefined
                  ? formatPercent(data.annualizedReturn)
                  : "-"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}