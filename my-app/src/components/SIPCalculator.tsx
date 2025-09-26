// "use client";

// import { useState } from "react";
// import { TextField, Button, Typography, Stack } from "@mui/material";
// import { formatCurrency, formatPercent } from "@/lib/utils";

// export default function SIPCalculator({ code }: { code: string }) {
//   const [amount, setAmount] = useState(5000);
//   const [from, setFrom] = useState("2020-01-01");
//   const [to, setTo] = useState("2023-12-31");
//   const [result, setResult] = useState<any>(null);

//   const handleCalculate = async () => {
//     const res = await fetch(`/api/scheme/${code}/sip`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount, frequency: "monthly", from, to }),
//     });
//     const data = await res.json();
//     setResult(data);
//   };

//   return (
//     <Stack spacing={2}>
//       <TextField
//         label="SIP Amount"
//         type="number"
//         value={amount}
//         onChange={(e) => setAmount(parseInt(e.target.value))}
//       />
//       <TextField label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
//       <TextField label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />

//       <Button variant="contained" onClick={handleCalculate}>
//         Calculate Returns
//       </Button>

//       {result && (
//         <Stack spacing={1}>
//           <Typography>Total Invested: {formatCurrency(result.totalInvested)}</Typography>
//           <Typography>Current Value: {formatCurrency(result.currentValue)}</Typography>
//           <Typography>Absolute Return: {formatPercent(result.absoluteReturn)}</Typography>
//           <Typography>Annualized Return: {formatPercent(result.annualizedReturn)}</Typography>
//         </Stack>
//       )}
//     </Stack>
//   );
// }




"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { formatCurrency, formatPercent } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SIPCalculator({ code }: { code: string }) {
  const [amount, setAmount] = useState(5000);
  const [from, setFrom] = useState("2020-01-01");
  const [to, setTo] = useState("2023-12-31");
  const [result, setResult] = useState<any>(null);

  const handleCalculate = async () => {
    const res = await fetch(`/api/scheme/${code}/sip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, frequency: "monthly", from, to }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <Stack spacing={2}>
      {/* Input Fields */}
      <TextField
        label="SIP Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseInt(e.target.value))}
      />
      <TextField
        label="From"
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="To"
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />

      <Button variant="contained" onClick={handleCalculate}>
        Calculate Returns
      </Button>

      {/* Results Section */}
      {result && (
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography variant="h6">SIP Results</Typography>
              <Typography>
                Total Invested: {formatCurrency(result.totalInvested)}
              </Typography>
              <Typography>
                Current Value: {formatCurrency(result.currentValue)}
              </Typography>
              <Typography>
                Absolute Return: {formatPercent(result.absoluteReturn)}
              </Typography>
              <Typography>
                Annualized Return: {formatPercent(result.annualizedReturn)}
              </Typography>
            </CardContent>
          </Card>

          {/* Growth Over Time Chart */}
          {result.growthOverTime && result.growthOverTime.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h2">SIP Growth Over Time</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={result.growthOverTime}>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(val) => `₹${val}`} />
                    <Tooltip formatter={(val: number) => formatCurrency(val)} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#1976d2"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </Stack>
      )}
    </Stack>
  );
}

