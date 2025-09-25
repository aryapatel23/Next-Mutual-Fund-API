"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  Pagination,
} from "@mui/material";
import FundCard from "@/components/FundCard";
import { Scheme } from "@/types/scheme";

export default function FundsPage() {
  const [funds, setFunds] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 50;

  useEffect(() => {
    async function fetchFunds() {
      setLoading(true);
      try {
        const res = await fetch(`/api/mf?page=${page}&limit=${limit}`);
        const data = await res.json();
        setFunds(data.funds);
        setTotalPages(Math.ceil(data.total / limit));
      } catch (error) {
        console.error("Error fetching funds:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFunds();
  }, [page]);

  const filteredFunds = funds.filter((fund) =>
    fund.schemeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mutual Fund Explorer
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search Funds"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={2}>
            {filteredFunds.map((fund) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={fund.schemeCode}>
                <FundCard fund={fund} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            sx={{ mt: 4 }}
          />
        </>
      )}
    </Container>
  );
}
