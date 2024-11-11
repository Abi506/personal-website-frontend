import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Tabs,
  Tab,
  Slider
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

const formatNumber = (num) => num.toLocaleString("en-IN");
const numberToText = (num) => {
  const Crore = 10000000;
  const Lakh = 100000;
  const Thousand = 1000;

  if (num >= Crore) {
    return `${Math.floor(num / Crore)} Crore, ${Math.floor((num % Crore) / Lakh)} Lakh, ${Math.floor(
      (num % Lakh) / Thousand
    )} Thousand`;
  } else if (num >= Lakh) {
    return `${Math.floor(num / Lakh)} Lakh, ${Math.floor((num % Lakh) / Thousand)} Thousand`;
  } else if (num >= Thousand) {
    return `${Math.floor(num / Thousand)} Thousand`;
  } else {
    return num.toString();
  }
};

const calculateDoubleInvestmentYears = (rate) => {
  return Math.log(2) / Math.log(1 + rate / 100);
};

function InvestmentCalculator() {
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipYears, setSipYears] = useState(5);
  const [sipRate, setSipRate] = useState(12);
  const [lumpSumAmount, setLumpSumAmount] = useState(100000);
  const [lumpSumYears, setLumpSumYears] = useState(5);
  const [lumpSumRate, setLumpSumRate] = useState(12);
  const [inflationRate, setInflationRate] = useState(6);
  const [currentValue, setCurrentValue] = useState(100000);
  const [inflationYears, setInflationYears] = useState(5);
  const [tabIndex, setTabIndex] = useState(0);
  const [sipResult, setSipResult] = useState(null);
  const [lumpSumResult, setLumpSumResult] = useState(null);
  const [inflationAdjustedValue, setInflationAdjustedValue] = useState(null);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const calculateSip = () => {
    const monthlyRate = sipRate / 12 / 100;
    const months = sipYears * 12;
    const futureValue = sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    setSipResult(futureValue.toFixed(2));
  };

  const calculateLumpSum = () => {
    const futureValue = lumpSumAmount * Math.pow(1 + lumpSumRate / 100, lumpSumYears);
    setLumpSumResult(futureValue.toFixed(2));
  };

  const calculateInflation = () => {
    const adjustedValue = currentValue * Math.pow(1 + inflationRate / 100, inflationYears);
    setInflationAdjustedValue(adjustedValue.toFixed(2));
  };

  useEffect(() => {
    if (sipAmount && sipYears && sipRate) calculateSip();
  }, [sipAmount, sipYears, sipRate]);

  useEffect(() => {
    if (lumpSumAmount && lumpSumYears && lumpSumRate) calculateLumpSum();
  }, [lumpSumAmount, lumpSumYears, lumpSumRate]);

  useEffect(() => {
    if (currentValue && inflationRate && inflationYears) calculateInflation();
  }, [currentValue, inflationRate, inflationYears]);

  const sipDoubleYears = calculateDoubleInvestmentYears(sipRate).toFixed(1);
  const lumpSumDoubleYears = calculateDoubleInvestmentYears(lumpSumRate).toFixed(1);

  const sipPieData = {
    labels: ["Principal (SIP)", "Earnings"],
    datasets: [
      {
        data: [
          sipAmount * sipYears * 12,
          sipResult ? sipResult - sipAmount * sipYears * 12 : 0
        ],
        backgroundColor: ["#FF6384", "#36A2EB"]
      }
    ]
  };

  const lumpSumPieData = {
    labels: ["Principal", "Earnings"],
    datasets: [
      {
        data: [
          lumpSumAmount,
          lumpSumResult ? lumpSumResult - lumpSumAmount : 0
        ],
        backgroundColor: ["#42A5F5", "#66BB6A"]
      }
    ]
  };

  return (
    <Box sx={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Investment Calculator
      </Typography>

      <Tabs  value={tabIndex}
        onChange={handleTabChange}
        centered
        scrollButtons="auto"
        variant="scrollable"
        sx={{
          '& .MuiTabs-flexContainer': {
            flexWrap: 'nowrap', // Prevents wrapping of the tabs
          },
        }}>
        <Tab label="SIP Calculator" />
        <Tab label="Lumpsum Calculator" />
        <Tab label="Inflation Calculator" />
      </Tabs>

      {tabIndex === 0 && (
        <Card sx={{ mb: 3, padding: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              SIP Calculator
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography gutterBottom>Monthly Investment (₹)</Typography>
                <Slider
                  value={sipAmount}
                  onChange={(e, newValue) => setSipAmount(newValue)}
                  min={500}
                  max={50000}
                  step={500}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  type="number"
                  fullWidth
                />
              </Grid>

              <Grid item xs={8}>
                <Typography gutterBottom>Rate of Return (%)</Typography>
                <Slider
                  value={sipRate}
                  onChange={(e, newValue) => setSipRate(newValue)}
                  min={5}
                  max={20}
                  step={0.5}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={sipRate}
                  onChange={(e) => setSipRate(Number(e.target.value))}
                  type="number"
                  fullWidth
                />
              </Grid>

              <Grid item xs={8}>
                <Typography gutterBottom>Investment Duration (Years)</Typography>
                <Slider
                  value={sipYears}
                  onChange={(e, newValue) => setSipYears(newValue)}
                  min={1}
                  max={30}
                  step={1}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  type="number"
                  fullWidth
                />
              </Grid>

              {sipResult && (
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Future Value of SIP: ₹{formatNumber(sipResult)} ({numberToText(sipResult)})
                  </Typography>
                  <Typography>
                    Your investment will double in approximately {sipDoubleYears} years at the current rate.
                  </Typography>
                </Grid>
              )}
              {sipResult && (
                <Grid item xs={12}>
                  <Pie data={sipPieData} />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {tabIndex === 1 && (
        <Card sx={{ mb: 3, padding: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Lump Sum Calculator
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography gutterBottom>Investment Amount (₹)</Typography>
                <Slider
                  value={lumpSumAmount}
                  onChange={(e, newValue) => setLumpSumAmount(newValue)}
                  min={1000}
                  max={1000000}
                  step={5000}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={lumpSumAmount}
                  onChange={(e) => setLumpSumAmount(Number(e.target.value))}
                  type="number"
                  fullWidth
                />
              </Grid>

              <Grid item xs={8}>
                <Typography gutterBottom>Rate of Return (%)</Typography>
                <Slider
                  value={lumpSumRate}
                  onChange={(e, newValue) => setLumpSumRate(newValue)}
                  min={5}
                  max={20}
                  step={0.5}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={lumpSumRate}
                  onChange={(e) => setLumpSumRate(Number(e.target.value))}
                  type="number"
                  fullWidth
                />
              </Grid>

              <Grid item xs={8}>
                <Typography gutterBottom>Investment Duration (Years)</Typography>
                <Slider
                  value={lumpSumYears}
                  onChange={(e, newValue) => setLumpSumYears(newValue)}
                  min={1}
                  max={30}
                  step={1}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={lumpSumYears}
                  onChange={(e) => setLumpSumYears(Number(e.target.value))}
                  type="number"
                  fullWidth
                />
              </Grid>

              {lumpSumResult && (
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Future Value of Lump Sum Investment: ₹{formatNumber(lumpSumResult)} (
                    {numberToText(lumpSumResult)})
                  </Typography>
                  <Typography>
                    Your investment will double in approximately {lumpSumDoubleYears} years at the current rate.
                  </Typography>
                </Grid>
              )}
              {lumpSumResult && (
                <Grid item xs={12}>
                  <Pie data={lumpSumPieData} />
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      {tabIndex === 2 && (
        <Card sx={{ mb: 3, padding: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Inflation Adjusted Value
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography gutterBottom>Current Value (₹)</Typography>
                <Slider
                  value={currentValue}
                  onChange={(e, newValue) => setCurrentValue(newValue)}
                  min={1000}
                  max={1000000}
                  step={5000}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  type="number"
                  fullWidth
                />
              </Grid>

              <Grid item xs={8}>
                <Typography gutterBottom>Inflation Rate (%)</Typography>
                <Slider
                  value={inflationRate}
                  onChange={(e, newValue) => setInflationRate(newValue)}
                  min={1}
                  max={15}
                  step={0.5}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  type="number"
                  fullWidth
                />
              </Grid>

              <Grid item xs={8}>
                <Typography gutterBottom>Number of Years</Typography>
                <Slider
                  value={inflationYears}
                  onChange={(e, newValue) => setInflationYears(newValue)}
                  min={1}
                  max={50}
                  step={1}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  value={inflationYears}
                  onChange={(e) => setInflationYears(Number(e.target.value))}
                  type="number"
                  fullWidth
                />
              </Grid>

              {inflationAdjustedValue && (
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Inflation Adjusted Value: ₹{formatNumber(inflationAdjustedValue)} (
                    {numberToText(inflationAdjustedValue)})
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default InvestmentCalculator;
