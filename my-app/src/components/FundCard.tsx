"use client";

import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import Link from "next/link";

export default function FundCard({ fund }: { fund: any }) {
  return (
    <Card>
      <Link href={`/scheme/${fund.schemeCode}`} passHref>
        <CardActionArea>
          <CardContent>
            <Typography variant="h6">{fund.schemeName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {fund.schemeCode}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
