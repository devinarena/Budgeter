import { Box, Typography } from "@mui/material";
import DataCard from "./DataCard";


const ExpensesView = (props) => {
    return (
        <Box sx={{
            flex: 1, width: { xs: "100%", sm: "50%" }, display: "flex", flexDirection: "column",
            alignItems: "center", px: 1
        }}>
            <Typography variant="h3">Expenses</Typography>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography variant="h5">Total Expenses:&nbsp;</Typography>
                <Typography variant="h5" color="red">-${props.totalExpenses}</Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
                {props.expenses.map((data, idx) => (
                    <DataCard key={idx} date={data.date} title={data.description} value={-data.amount} setDeletingDataPoint={props.setDeletingDataPoint} index={idx} />
                ))}
            </Box>
        </Box >
    );
}

export default ExpensesView;