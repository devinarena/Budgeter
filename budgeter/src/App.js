import { Box } from "@mui/material";
import { useState } from "react";
import DateInput from "./components/DateInput";
import BudgetView from "./components/BudgetView";



const App = () => {

  const [budget, setBudget] = useState({});
  const [error, setError] = useState("");

  const viewBudget = async (providedYear, providedMonth) => {
    const year = providedYear || document.getElementById("year").value;
    const month = providedMonth || document.getElementById("month").value;

    if (!year) year = new Date().getFullYear();
    if (!month) month = (new Date().getMonth() + 1).toString().padStart(2, "0");

    const budget = { year, month };

    const lookup = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/lookup?year=${year}&month=${month}`)
      .then(response => response.json())
      .catch(error => setError(error));

    if (!lookup || lookup.error) {
      setError(lookup.error);
      return;
    }

    budget.incomes = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/income?year=${year}&month=${month}`)
      .then(response => response.json())
      .then(response => response.incomes)
      .catch(error => setError(error));
    budget.totalIncome = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/totalIncome?year=${year}&month=${month}`)
      .then(response => response.json())
      .then(response => response.total)
      .catch(error => setError(error));

    budget.expenses = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/expenses?year=${year}&month=${month}`)
      .then(response => response.json())
      .then(response => response.expenses)
      .catch(error => setError(error));
    budget.totalExpenses = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/totalExpenses?year=${year}&month=${month}`)
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
      {Object.keys(budget).length === 0 && <DateInput viewBudget={() => viewBudget(undefined, undefined)} error={error} />}
      {Object.keys(budget).length > 0 && <BudgetView budget={budget} viewBudget={viewBudget} />}
    </Box>
  );
}

export default App;
