"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import NavChart from "@/components/NavChart";
import ReturnsTable from "@/components/ReturnsTable";
import SIPCalculator from "@/components/SIPCalculator";

export default function SchemeDetailPage() {
  const { code } = useParams();
  const [scheme, setScheme] = useState<any | null>(null);

  useEffect(() => {
    if (code) {
      fetch(`/api/scheme/${code}`)
        .then((res) => res.json())
        .then((data) => setScheme(data));
    }
  }, [code]);

  if (!scheme) return <div>Loading...</div>;

  const { meta, navHistory } = scheme;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {meta.schemeName}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {meta.fundHouse} • {meta.category}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        {/* NAV Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">NAV History (1 Year)</Typography>
              <NavChart data={navHistory.slice(0, 365).reverse()} />
            </CardContent>
          </Card>
        </Grid>

        {/* Returns Table */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Returns</Typography>
              <ReturnsTable code={meta.schemeCode} />
            </CardContent>
          </Card>
        </Grid>

        {/* SIP Calculator */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">SIP Calculator</Typography>
              <SIPCalculator code={meta.schemeCode} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
