// components/SIPCalculator.tsx
"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  Box,
  useTheme,
  Paper,
} from "@mui/material";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: "background.paper",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1.5,
          p: 2,
          boxShadow: (theme) => `0 4px 12px ${theme.palette.grey[200]}`,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          Value: {formatCurrency(payload[0].value)}
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function SIPCalculator({ code }: { code: string }) {
  const [amount, setAmount] = useState<number>(5000);
  const [from, setFrom] = useState<string>("2020-01-01");
  const [to, setTo] = useState<string>("2023-12-31");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCalculate = async () => {
    if (!amount || !from || !to) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/scheme/${code}/sip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, frequency: "monthly", from, to }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("SIP calculation error:", error);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        SIP Calculator
      </Typography>

      <Stack spacing={2.5} sx={{ mb: 3 }}>
        <TextField
          label="Monthly SIP Amount"
          type="number"
          fullWidth
          value={amount || ""}
          onChange={(e) => setAmount(e.target.value ? parseInt(e.target.value) : 0)}
          slotProps={{
            input: {
              startAdornment: (
                <Box sx={{ mr: 1, color: "text.secondary", fontWeight: 600 }}>
                  ₹
                </Box>
              ),
            },
          }}
          InputLabelProps={{ shrink: true }}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={to}
            onChange={(e) => setTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleCalculate}
          disabled={loading || !amount || !from || !to}
          sx={{ py: 1.5, fontWeight: 600, fontSize: "1rem" }}
        >
          {loading ? "Calculating Returns..." : "Calculate SIP Returns"}
        </Button>
      </Stack>

      {/* Results */}
      {result && (
        <>
          <Divider sx={{ my: 2.5 }} />

          {/* Metrics Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <MetricItem
              label="Total Invested"
              value={formatCurrency(result.totalInvested)}
              color="info"
            />
            <MetricItem
              label="Current Value"
              value={formatCurrency(result.currentValue)}
              color="success"
            />
            <MetricItem
              label="Absolute Return"
              value={formatPercent(result.absoluteReturn)}
              color="primary"
            />
            <MetricItem
              label="Annualized Return"
              value={formatPercent(result.annualizedReturn)}
              color="secondary"
            />
          </Box>

          {/* Chart */}
          {result.growthOverTime?.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                SIP Growth Over Time
              </Typography>
              <Box sx={{ height: { xs: 260, sm: 300, md: 340 }, mt: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.growthOverTime}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f5f5f5" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickMargin={10}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval="preserveEnd"
                    />
                    <YAxis
                      tickFormatter={(val) =>
                        val >= 1e7
                          ? `₹${(val / 1e7).toFixed(1)}Cr`
                          : val >= 1e5
                          ? `₹${(val / 1e5).toFixed(1)}L`
                          : `₹${(val / 1000).toFixed(0)}k`
                      }
                      tick={{ fontSize: 11 }}
                      width={70}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2e7d32"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 6, fill: "#2e7d32" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}

// Reusable Metric Item (no card borders — cleaner for full-width)
function MetricItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "primary" | "secondary" | "success" | "info";
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 1.8,
        borderRadius: 2,
        backgroundColor: `${theme.palette[color].main}08`,
        border: `1px solid ${theme.palette[color].main}20`,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight={500}
        sx={{ mb: 0.6 }}
      >
        {label}
      </Typography>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          color: theme.palette[color].main,
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}