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
  Alert,
  CircularProgress,
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
  Area,
  AreaChart,
} from "recharts";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PercentIcon from '@mui/icons-material/Percent';

// Custom Tooltip with enhanced styling
const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useTheme();
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          minWidth: 180,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={700} color="success.main">
          {formatCurrency(payload[0].value)}
        </Typography>
      </Paper>
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
  const [error, setError] = useState<string>("");

  const handleCalculate = async () => {
    if (!amount || !from || !to) return;
    
    // Validation
    if (amount < 100) {
      setError("Minimum SIP amount should be ₹100");
      return;
    }
    if (new Date(from) >= new Date(to)) {
      setError("End date must be after start date");
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/scheme/${code}/sip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, frequency: "monthly", from, to }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to calculate SIP returns");
      }
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("SIP calculation error:", error);
      setError("Unable to calculate returns. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        p: { xs: 3, sm: 4 },
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShowChartIcon color="primary" />
          SIP Calculator
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Calculate your systematic investment plan returns over time
        </Typography>
      </Box>

      {/* Input Section */}
      <Stack spacing={3} sx={{ mb: 4 }}>
        <TextField
          label="Monthly SIP Amount"
          type="number"
          fullWidth
          value={amount || ""}
          onChange={(e) => setAmount(e.target.value ? parseInt(e.target.value) : 0)}
          slotProps={{
            input: {
              startAdornment: (
                <Box sx={{ mr: 1.5, color: "text.secondary", fontWeight: 700, fontSize: '1.1rem' }}>
                  ₹
                </Box>
              ),
            },
          }}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'background.paper',
              },
            },
          }}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              },
            }}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={to}
            onChange={(e) => setTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              },
            }}
          />
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleCalculate}
          disabled={loading || !amount || !from || !to}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TrendingUpIcon />}
          sx={{ 
            py: 1.8, 
            fontWeight: 700, 
            fontSize: "1rem",
            borderRadius: 2.5,
            textTransform: 'none',
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
            },
          }}
        >
          {loading ? "Calculating..." : "Calculate SIP Returns"}
        </Button>
      </Stack>

      {/* Results Section */}
      {result && (
        <>
          <Divider sx={{ my: 4 }} />

          {/* Metrics Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2.5,
              mb: 4,
            }}
          >
            <MetricItem
              label="Total Invested"
              value={formatCurrency(result.totalInvested)}
              color="info"
              icon={<AccountBalanceWalletIcon />}
            />
            <MetricItem
              label="Current Value"
              value={formatCurrency(result.currentValue)}
              color="success"
              icon={<TrendingUpIcon />}
            />
            <MetricItem
              label="Absolute Return"
              value={formatPercent(result.absoluteReturn)}
              color="primary"
              icon={<ShowChartIcon />}
            />
            <MetricItem
              label="Annualized Return"
              value={formatPercent(result.annualizedReturn)}
              color="secondary"
              icon={<PercentIcon />}
            />
          </Box>

          {/* Profit/Loss Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              background: result.currentValue > result.totalInvested
                ? `linear-gradient(135deg, ${theme.palette.success.light}15 0%, ${theme.palette.success.main}08 100%)`
                : `linear-gradient(135deg, ${theme.palette.error.light}15 0%, ${theme.palette.error.main}08 100%)`,
              border: `1px solid ${result.currentValue > result.totalInvested ? theme.palette.success.main : theme.palette.error.main}30`,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {result.currentValue > result.totalInvested ? 'Total Profit' : 'Total Loss'}
                </Typography>
                <Typography variant="h4" fontWeight={800} color={result.currentValue > result.totalInvested ? 'success.main' : 'error.main'}>
                  {formatCurrency(Math.abs(result.currentValue - result.totalInvested))}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: 60, opacity: 0.15, color: result.currentValue > result.totalInvested ? 'success.main' : 'error.main' }} />
            </Stack>
          </Paper>

          {/* Chart */}
          {result.growthOverTime?.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
                Growth Over Time
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: 'background.paper',
                }}
              >
                <Box sx={{ height: { xs: 300, sm: 350, md: 400 } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.growthOverTime}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                        tickMargin={12}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        interval="preserveEnd"
                        stroke={theme.palette.divider}
                      />
                      <YAxis
                        tickFormatter={(val) =>
                          val >= 1e7
                            ? `₹${(val / 1e7).toFixed(1)}Cr`
                            : val >= 1e5
                            ? `₹${(val / 1e5).toFixed(1)}L`
                            : `₹${(val / 1000).toFixed(0)}k`
                        }
                        tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                        width={80}
                        domain={['auto', 'auto']}
                        stroke={theme.palette.divider}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={theme.palette.success.main}
                        strokeWidth={3}
                        fill="url(#colorValue)"
                        activeDot={{ r: 7, fill: theme.palette.success.main }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}

// Enhanced Metric Item with icons
function MetricItem({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color: "primary" | "secondary" | "success" | "info";
  icon: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${theme.palette[color].main}08 0%, ${theme.palette[color].main}03 100%)`,
        border: `1px solid ${theme.palette[color].main}25`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          border: `1px solid ${theme.palette[color].main}40`,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 1.5,
          color: theme.palette[color].main,
        }}>
          {icon}
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
            sx={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5 }}
          >
            {label}
          </Typography>
        </Box>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            color: theme.palette[color].main,
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
      </Box>
      
      {/* Decorative background element */}
      <Box
        sx={{
          position: 'absolute',
          right: -10,
          bottom: -10,
          opacity: 0.04,
          fontSize: '5rem',
          color: theme.palette[color].main,
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}