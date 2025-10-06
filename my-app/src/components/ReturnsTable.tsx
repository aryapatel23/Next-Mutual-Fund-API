// // components/ReturnsTable.tsx
// "use client";

// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   CircularProgress,
//   Box,
//   Typography,
// } from "@mui/material";
// import { formatPercent } from "@/lib/utils";

// type ReturnData = {
//   simpleReturn: number;
//   annualizedReturn?: number;
// };

// const PERIODS = ["1m", "3m", "6m", "1y"] as const;

// export default function ReturnsTable({ code }: { code: string }) {
//   const [returnsMap, setReturnsMap] = useState<Record<string, ReturnData | null>>({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!code) return;

//     const fetchReturnForPeriod = async (period: string): Promise<[string, ReturnData | null]> => {
//       try {
//         const res = await fetch(`/api/scheme/${code}/returns?period=${period}`);
//         if (!res.ok) {
//           console.warn(`Failed to fetch returns for period ${period}:`, res.status);
//           return [period, null];
//         }
//         const data = await res.json();
//         // Ensure the response has expected fields
//         return [period, { 
//           simpleReturn: data.simpleReturn ?? 0,
//           annualizedReturn: data.annualizedReturn 
//         }];
//       } catch (err) {
//         console.error(`Error fetching returns for ${period}:`, err);
//         return [period, null];
//       }
//     };

//     const fetchAll = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const results = await Promise.all(
//           PERIODS.map(period => fetchReturnForPeriod(period))
//         );
//         const resultMap = Object.fromEntries(results);
//         setReturnsMap(resultMap);
//       } catch (err) {
//         setError("Failed to load returns data.");
//         console.error("Unexpected error in fetchAll:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [code]);

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
//         <CircularProgress size={24} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Typography color="error" variant="body2">
//         {error}
//       </Typography>
//     );
//   }

//   return (
//     <Table size="small">
//       <TableHead>
//         <TableRow>
//           <TableCell sx={{ fontWeight: "600" }}>Period</TableCell>
//           <TableCell align="right" sx={{ fontWeight: "600" }}>
//             Simple Return
//           </TableCell>
//           <TableCell align="right" sx={{ fontWeight: "600" }}>
//             Annualized
//           </TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {PERIODS.map((period) => {
//           const data = returnsMap[period];
//           return (
//             <TableRow key={period}>
//               <TableCell>{period.toUpperCase()}</TableCell>
//               <TableCell align="right">
//                 {data ? formatPercent(data.simpleReturn) : "-"}
//               </TableCell>
//               <TableCell align="right">
//                 {data && data.annualizedReturn !== undefined
//                   ? formatPercent(data.annualizedReturn)
//                   : "-"}
//               </TableCell>
//             </TableRow>
//           );
//         })}
//       </TableBody>
//     </Table>
//   );
// }


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
  Paper,
  useTheme,
  Chip,
  TableContainer,
  Skeleton,
} from "@mui/material";
import { formatPercent } from "@/lib/utils";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AssessmentIcon from '@mui/icons-material/Assessment';

type ReturnData = {
  simpleReturn: number;
  annualizedReturn?: number;
};

const PERIODS = ["1m", "3m", "6m", "1y", "3y", "5y"] as const;

const PERIOD_LABELS: Record<string, string> = {
  "1m": "1 Month",
  "3m": "3 Months",
  "6m": "6 Months",
  "1y": "1 Year",
  "3y": "3 Years",
  "5y": "5 Years",
};

export default function ReturnsTable({ code }: { code: string }) {
  const [returnsMap, setReturnsMap] = useState<Record<string, ReturnData | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

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

  const ReturnCell = ({ value }: { value: number | undefined | null }) => {
    if (value === undefined || value === null) return <span>-</span>;
    
    const isPositive = value >= 0;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
        {isPositive ? (
          <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
        )}
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            color: isPositive ? 'success.main' : 'error.main',
          }}
        >
          {formatPercent(value)}
        </Typography>
      </Box>
    );
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
        }}
      >
        <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="text" width={300} height={20} sx={{ mt: 1 }} />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableCell><Skeleton width={80} /></TableCell>
                <TableCell align="right"><Skeleton width={100} /></TableCell>
                <TableCell align="right"><Skeleton width={100} /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PERIODS.map((period) => (
                <TableRow key={period}>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: `1px solid ${theme.palette.error.main}30`,
          background: `linear-gradient(135deg, ${theme.palette.error.light}15 0%, ${theme.palette.error.main}08 100%)`,
        }}
      >
        <Typography color="error" variant="body2" fontWeight={500}>
          {error}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
      }}
    >
      <Box sx={{ p: { xs: 2.5, sm: 3.5 }, pb: 2 }}>
        <Typography 
          variant="h6" 
          fontWeight={700} 
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <AssessmentIcon color="primary" />
          Returns Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Historical performance across different time periods
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: theme.palette.mode === 'light' 
                  ? theme.palette.grey[100] 
                  : theme.palette.grey[900],
              }}
            >
              <TableCell 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  py: 2,
                }}
              >
                Period
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  py: 2,
                }}
              >
                Simple Return
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'text.secondary',
                  py: 2,
                }}
              >
                Annualized
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {PERIODS.map((period) => {
              const data = returnsMap[period];
              return (
                <TableRow 
                  key={period}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    '&:last-child td': {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell sx={{ py: 2.5 }}>
                    <Chip
                      label={PERIOD_LABELS[period]}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        backgroundColor: theme.palette.primary.main + '15',
                        color: 'primary.main',
                        border: `1px solid ${theme.palette.primary.main}30`,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2.5 }}>
                    <ReturnCell value={data?.simpleReturn} />
                  </TableCell>
                  <TableCell align="right" sx={{ py: 2.5 }}>
                    <ReturnCell value={data?.annualizedReturn} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}