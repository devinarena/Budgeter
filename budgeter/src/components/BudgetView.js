import { Box, IconButton, Typography } from "@mui/material";
import IncomesView from "./IncomesView";
import ExpensesView from "./ExpensesView";
import OverallView from "./OverallView";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddDataPoint from "./AddDataPoint";
import { useState } from "react";
import DeleteDataPoint from "./DeleteDataPoint";


const BudgetView = (props) => {

    const [addDataOpen, setAddDataOpen] = useState(false);
    const [deletingDataPoint, setDeletingDataPoint] = useState({});

    const addDataPoint = (data, type) => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/${type}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': btoa(sessionStorage.getItem("pin"))
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => {
                console.error('Error:', error);
            });

        props.viewBudget(props.budget.year, props.budget.month, null);
    }

    const deleteDataPoint = () => {
        const type = deletingDataPoint.income ? "income" : "expenses";
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/${type}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': btoa(sessionStorage.getItem("pin"))
            },
            body: JSON.stringify({
                date: deletingDataPoint.date,
                index: deletingDataPoint.index
            }),
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => {
                console.error('Error:', error);
            });

        props.viewBudget(props.budget.year, props.budget.month);
        setDeletingDataPoint({});
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                width: "100vw",
                mt: {xs: 40, sm: 0},
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
                <IncomesView incomes={props.budget.incomes} totalIncome={props.budget.totalIncome} setDeletingDataPoint={setDeletingDataPoint} />
                <ExpensesView expenses={props.budget.expenses} totalExpenses={props.budget.totalExpenses} setDeletingDataPoint={setDeletingDataPoint} />
            </Box>
            <IconButton onClick={() => setAddDataOpen(true)} sx={{
                position: "fixed",
                bottom: 20,
                right: 20
            }}>
                <AddCircleIcon sx={{ fontSize: 64, color: "gray" }} />
            </IconButton>
            <AddDataPoint open={addDataOpen} onClose={() => setAddDataOpen(false)} addDataPoint={addDataPoint} />
            <DeleteDataPoint open={Object.keys(deletingDataPoint).length > 0} onClose={() => setDeletingDataPoint({})} deleteDataPoint={deleteDataPoint} deletingDataPoint={deletingDataPoint} />
        </Box>
    );
}

export default BudgetView;