import { useTheme } from "@emotion/react";
import { Box, Button, TextField, Typography, useMediaQuery } from "@mui/material";

const DateInput = (props) => {
    
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); 

    return (
        <Box sx={{
            minWidth: {xs: "40%", sm: "60%"}, maxWidth: "90%", border: "1px solid white", borderRadius: 5, p: 5,
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
        }}>
            <Typography variant={isSmallScreen ? "h3" : "h1"}>Budgeter</Typography>
            <Typography variant="p" sx={{ mb: 3 }}>Enter a month and year to lookup a budget</Typography>
            <TextField id="year" variant="outlined" label="Year" defaultValue={new Date().getFullYear()} />
            <TextField id="month" variant="outlined" label="Month" defaultValue={(new Date().getMonth() + 1).toString().padStart(2, "0")} sx={{ mt: 1 }} />
            <Button variant="contained" onClick={props.viewBudget} sx={{ mt: 3, fontSize: 24, fontWeight: "bold" }}>VIEW</Button>
            {props.error.length > 0 && <Typography variant="p" sx={{ mt: 1, color: "red" }}>{props.error}</Typography>}
        </Box>
    );
}

export default DateInput;