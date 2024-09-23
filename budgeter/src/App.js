import { Box, Button, Input, TextField, Typography } from "@mui/material";
import { useState } from "react";
import DateInput from "./components/DateInput";
import BudgetView from "./components/BudgetView";



const App = () => {

  const [budget, setBudget] = useState({});
  const [error, setError] = useState("");

  const viewBudget = async () => {
    const year = document.getElementById("year").value;
    const month = document.getElementById("month").value;

    if (year && month) {
      console.log(year, month);
    }

    if (!year) year = new Date().getFullYear();
    if (!month) month = (new Date().getMonth() + 1).toString().padStart(2, "0");

    const budget = {};

    const lookup = await fetch(`http://127.0.0.1:5000/lookup?year=${year}&month=${month}`)
      .then(response => response.json())
      .catch(error => setError(error));

    if (!lookup || lookup.error) {
      setError(lookup.error);
      return;
    }

    budget.incomes = await fetch(`http://127.0.0.1:5000/income?year=${year}&month=${month}`)
      .then(response => response.json())
      .catch(error => setError(error));
    budget.totalIncome = await fetch(`http://127.0.0.1:5000/totalIncome?year=${year}&month=${month}`)
      .then(response => response.json())
      .then(response => response.total)
      .catch(error => setError(error));

    budget.expenses = await fetch(`http://127.0.0.1:5000/expenses?year=${year}&month=${month}`)
      .then(response => response.json())
      .catch(error => setError(error));
    budget.totalExpenses = await fetch(`http://127.0.0.1:5000/totalExpenses?year=${year}&month=${month}`)
      .then(response => response.json())
      .then(response => response.total)
      .catch(error => setError(error));

    setBudget(budget);

    console.log(budget);
  }

  return (
    <Box sx={{
      width: "100vw", height: "100vh", display: "flex",
      justifyContent: "center", alignItems: "center"
    }}>
      {Object.keys(budget).length === 0 && <DateInput viewBudget={viewBudget} error={error} />}
      {Object.keys(budget).length > 0 && <BudgetView budget={budget} />}
    </Box>
  );
}

export default App;
