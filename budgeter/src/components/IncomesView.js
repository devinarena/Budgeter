import { Box, Typography } from "@mui/material";
import DataCard from "./DataCard";

const IncomesView = (props) => {
    return (
        <Box sx={{
            flex: 1, width: {xs: "100%", sm: "50%"}, display: "flex", flexDirection: "column",
            alignItems: "center", px: 1
        }}>
            <Typography variant="h3">Income</Typography>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Typography variant="h5">Total Income:&nbsp;</Typography>
                <Typography variant="h5" color="green">+${props.totalIncome}</Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
                {props.incomes.map((data, idx) => (
                    <DataCard key={idx} date={data.date} title={data.description} value={data.amount} />
                ))}
            </Box>
        </Box >
    );
}

export default IncomesView;