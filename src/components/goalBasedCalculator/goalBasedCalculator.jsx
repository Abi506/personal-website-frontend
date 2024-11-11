import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Container, Slider } from '@mui/material';

const GoalBasedSIPCalculator = () => {
  // State variables for user input and result
  const [goalAmount, setGoalAmount] = useState(1000000); // Default value ₹10 Lakh
  const [rateOfReturn, setRateOfReturn] = useState(12); // Default value 12%
  const [numOfYears, setNumOfYears] = useState(10); // Default value 10 years
  const [monthlySIP, setMonthlySIP] = useState(null);

  // Handle input changes for goal amount
  const handleGoalAmountChange = (e) => setGoalAmount(e.target.value);

  // Handle input changes for rate of return
  const handleRateOfReturnChange = (e) => setRateOfReturn(e.target.value);

  // Handle input changes for number of years
  const handleNumOfYearsChange = (e) => setNumOfYears(e.target.value);

  // SIP calculation based on current values of goalAmount, rateOfReturn, and numOfYears
  useEffect(() => {
    const A = parseFloat(goalAmount); // Goal amount
    const r = parseFloat(rateOfReturn) / 100 / 12; // Monthly rate of return
    const n = parseInt(numOfYears) * 12; // Number of months (years * 12)

    if (isNaN(A) || isNaN(r) || isNaN(n) || A <= 0 || r <= 0 || n <= 0) {
      setMonthlySIP(null);
      return;
    }

    // SIP formula: P = A / (((1 + r) ** n - 1) / r)
    const P = A / (((1 + r) ** n - 1) / r);
    setMonthlySIP(P.toFixed(2)); // Set the calculated monthly SIP amount
  }, [goalAmount, rateOfReturn, numOfYears]); // Recalculate SIP when any of these values change

  // Slider logic to update goal amount input
  const handleSliderGoalAmountChange = (event, newValue) => setGoalAmount(newValue);

  // Slider logic to update rate of return input
  const handleSliderRateOfReturnChange = (event, newValue) => setRateOfReturn(newValue);

  // Slider logic to update number of years input
  const handleSliderNumOfYearsChange = (event, newValue) => setNumOfYears(newValue);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4">Goal-Based SIP Calculator</Typography>
      </Box>

      {/* Goal Amount with Slider */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Goal Amount (₹)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Slider
            value={goalAmount}
            onChange={handleSliderGoalAmountChange}
            aria-labelledby="goal-amount-slider"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `₹${value}`}
            min={100000} // minimum value for goal
            max={10000000} // maximum value for goal (10 million)
            step={100000} // step size (100k)
            sx={{ width: '80%' }}
          />
          <TextField
            value={goalAmount}
            onChange={handleGoalAmountChange}
            type="number"
            variant="outlined"
            sx={{ marginLeft: 2 }}
          />
        </Box>
      </Box>

      {/* Rate of Return with Slider */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Rate of Return (%)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Slider
            value={rateOfReturn}
            onChange={handleSliderRateOfReturnChange}
            aria-labelledby="rate-of-return-slider"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
            min={1} // minimum rate of return
            max={20} // maximum rate of return
            step={0.5} // step size for rate of return
            sx={{ width: '80%' }}
          />
          <TextField
            value={rateOfReturn}
            onChange={handleRateOfReturnChange}
            type="number"
            variant="outlined"
            sx={{ marginLeft: 2 }}
          />
        </Box>
      </Box>

      {/* Number of Years with Slider */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Number of Years
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Slider
            value={numOfYears}
            onChange={handleSliderNumOfYearsChange}
            aria-labelledby="num-of-years-slider"
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value} years`}
            min={1} // minimum number of years
            max={30} // maximum number of years
            step={1} // step size for years
            sx={{ width: '80%' }}
          />
          <TextField
            value={numOfYears}
            onChange={handleNumOfYearsChange}
            type="number"
            variant="outlined"
            sx={{ marginLeft: 2 }}
          />
        </Box>
      </Box>

      {/* Displaying the SIP result */}
      {monthlySIP && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">
            To achieve your goal of <strong>₹{goalAmount}</strong>, you need to invest{' '}
            <strong style={{ fontSize: '1.5rem', color: 'green' }}>₹{monthlySIP}</strong> every month for{' '}
            <strong>{numOfYears} years</strong> at an annual rate of return of <strong>{rateOfReturn}%</strong>.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default GoalBasedSIPCalculator;
