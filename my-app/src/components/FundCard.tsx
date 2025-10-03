"use client";

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
import { TrendingUp as GrowthIcon, AccountBalance as FundIcon } from "@mui/icons-material";
import Link from "next/link";

// Optional: Map scheme categories to colors (if your fund data includes category)
const getCategoryColor = (category: string) => {
  const theme = useTheme();
  const map: Record<string, string> = {
    equity: theme.palette.success.main,
    debt: theme.palette.info.main,
    hybrid: theme.palette.warning.main,
    "elss": theme.palette.primary.main,
  };
  return map[category?.toLowerCase()] || theme.palette.grey[500];
};

export default function FundCard({ fund }: { fund: any }) {
  // Optional: Extract category from fund name or add it in your data
  const category = fund.category || "equity"; // fallback

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2.5,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) => `0 8px 20px ${theme.palette.grey[200]}`,
          borderColor: (theme) => theme.palette.primary.main,
        },
        overflow: "visible",
      }}
    >
         <Link href={`/scheme/${fund.schemeCode}`} passHref legacyBehavior>
        <CardActionArea
          sx={{
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            height: "100%",
          }}
        >
          

          {/* Fund Icon */}
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              bgcolor: (theme) => `${theme.palette.primary.main}08`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.5,
            }}
          >
            <FundIcon sx={{ color: "primary.main", fontSize: 24 }} />
          </Box>

          {/* Fund Name */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              lineHeight: 1.4,
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: 44, // ensures consistent height
            }}
          >
            {fund.schemeName}
          </Typography>

          {/* Scheme Code */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              mt: "auto",
              pt: 1,
              borderTop: (theme) => `1px dashed ${theme.palette.divider}`,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: "text.secondary",
                fontSize: "0.8125rem",
              }}
            >
              <GrowthIcon sx={{ fontSize: 16, color: "success.main" }} />
              <Typography component="span" variant="caption">
                {fund.schemeCode}
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Link>
    </Card>
  );
}