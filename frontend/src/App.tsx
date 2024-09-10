import React, { useState } from 'react';
import { Container, Paper, Grid, Button, Typography, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    backend.clear();
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      performCalculation(operator, inputValue);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = async (op: string, secondOperand: number) => {
    if (firstOperand === null) return;

    setLoading(true);
    try {
      const result = await backend.calculate(firstOperand, secondOperand, op);
      if (result && result.length > 0) {
        setDisplay(result[0].toString());
        setFirstOperand(result[0]);
      } else {
        setDisplay('Error');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setDisplay('Error');
    } finally {
      setLoading(false);
    }
    setWaitingForSecondOperand(true);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h4" align="right" gutterBottom>
          {loading ? <CircularProgress size={24} /> : display}
        </Typography>
        <Grid container spacing={1}>
          {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
            <Grid item xs={3} key={btn}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  if (btn === '=') {
                    if (operator && firstOperand !== null) {
                      performCalculation(operator, parseFloat(display));
                    }
                  } else if (['+', '-', '*', '/'].includes(btn)) {
                    handleOperator(btn);
                  } else if (btn === '.') {
                    inputDecimal();
                  } else {
                    inputDigit(btn);
                  }
                }}
              >
                {btn}
              </Button>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" fullWidth onClick={clear}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default App;
