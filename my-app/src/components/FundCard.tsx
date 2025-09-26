// components/FundCard.tsx
"use client";

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { AccountBalance as FundIcon } from "@mui/icons-material";
import Link from "next/link";

export default function FundCard({ fund }: { fund: any }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: 2,
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <Link href={`/scheme/${fund.schemeCode}`} passHref legacyBehavior>
        <CardActionArea
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 2,
          }}
        >
          <CardContent sx={{ flex: "1 0 auto", p: 0, textAlign: "center" }}>
            <Avatar
              sx={{
                bgcolor: "primary.light",
                color: "primary.main",
                width: 48,
                height: 48,
                mb: 1.5,
                mx: "auto",
              }}
            >
              <FundIcon />
            </Avatar>
            <Typography
              variant="h6"
              fontWeight="600"
              component="div"
              sx={{
                lineHeight: 1.3,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {fund.schemeName}
            </Typography>
            <Box
              sx={{
                display: "inline-block",
                backgroundColor: "rgba(0, 0, 0, 0.06)",
                px: 1.2,
                py: 0.4,
                borderRadius: 1,
                mt: 1,
              }}
            >
              <Typography variant="caption" fontWeight="500" color="text.secondary">
                {fund.schemeCode}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}