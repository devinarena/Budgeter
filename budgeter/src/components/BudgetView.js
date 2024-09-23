import { Box, IconButton, Typography } from "@mui/material";
import IncomesView from "./IncomesView";
import ExpensesView from "./ExpensesView";
import OverallView from "./OverallView";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddDataPoint from "./AddDataPoint";
import { useState } from "react";


const BudgetView = (props) => {
    
    const [addDataOpen, setAddDataOpen] = useState(false);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
                p: 2
            }}
        >
            <Typography variant="h2">Budget Report</Typography>
            <Typography variant="p">View your budget</Typography>
            <OverallView totalIncome={props.budget.totalIncome} totalExpenses={props.budget.totalExpenses} />
            <Box sx={{
                display: "flex", flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center", width: "100%", height: "100%"
            }}>
                <IncomesView incomes={props.budget.incomes} totalIncome={props.budget.totalIncome} />
                <ExpensesView expenses={props.budget.expenses} totalExpenses={props.budget.totalExpenses} />
            </Box>
            <IconButton onClick={() => setAddDataOpen(true)} sx={{
                position: "fixed",
                bottom: 20,
                right: 20
            }}>
                <AddCircleIcon sx={{ fontSize: 64, color: "blue" }} />
            </IconButton>
            <AddDataPoint open={addDataOpen} onClose={() => setAddDataOpen(false)}/>
        </Box>
    );
}

export default BudgetView;