import { Box, Button, TextField, Typography } from "@mui/material";

const DateInput = (props) => {
    return (
        <Box sx={{
            minWidth: "60%", border: "1px solid white", borderRadius: 5, p: 5,
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
        }}>
            <Typography variant="h1">Budgeter</Typography>
            <Typography variant="p" sx={{ mb: 3 }}>Enter a month and year to lookup a budget</Typography>
            <TextField id="year" variant="outlined" label="Year" defaultValue={new Date().getFullYear()} />
            <TextField id="month" variant="outlined" label="Month" defaultValue={(new Date().getMonth() + 1).toString().padStart(2, "0")} sx={{ mt: 1 }} />
            <Button variant="contained" onClick={props.viewBudget} sx={{ mt: 3, fontSize: 24, fontWeight: "bold" }}>VIEW</Button>
            {props.error.length > 0 && <Typography variant="p" sx={{ mt: 1, color: "red" }}>{props.error}</Typography>}
        </Box>
    );
}

export default DateInput;