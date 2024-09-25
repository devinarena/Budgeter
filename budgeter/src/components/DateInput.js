import { useTheme } from "@emotion/react";
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";

const DateInput = (props) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, "0"));
    const [pin, setPin] = useState(localStorage.getItem("pin") || "");
    const [savePin, setSavePin] = useState(false);
    const [error, setError] = useState("");

    const submitDate = () => {
        if (year.length === 0 || month.length === 0) {
            setError("Please fill in month and year");
            return;
        }
        if (pin.length === 0) {
            setError("Please enter your pin");
            return;
        }
        if (savePin) {
            localStorage.setItem("pin", pin);
        }

        sessionStorage.setItem("pin", pin);

        props.viewBudget(year, month, pin);
    }

    return (
        <Box sx={{
            minWidth: { xs: "40%", sm: "60%" }, maxWidth: "90%", border: "1px solid white", borderRadius: 5, p: 5,
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
        }}>
            <Typography variant={isSmallScreen ? "h3" : "h1"}>Budgeter</Typography>
            <Typography variant="p">Enter a month and year to lookup a budget</Typography>
            <Typography variant="p" sx={{ mb: 3, color: "red" }}>{error}</Typography>
            <TextField id="year" variant="outlined" label="Year" value={year} onChange={e => setYear(e.target.value)} autoComplete="new-password" />
            <TextField id="month" variant="outlined" label="Month" value={month} onChange={e => setMonth(e.target.value)} sx={{ my: 1 }} autoComplete="new-password" />
            <TextField id="pin" type="password" variant="outlined" label="PIN" value={pin} onChange={e => setPin(e.target.value)} autoComplete="new-password" />
            <FormControlLabel control={<Checkbox checked={savePin} onChange={e => setSavePin(e.target.checked)} />} label="Save PIN to local storage" />
            <Button variant="contained" onClick={submitDate} sx={{ mt: 3, fontSize: 24, fontWeight: "bold" }}>VIEW</Button>
            {props.error.length > 0 && <Typography variant="p" sx={{ mt: 1, color: "red" }}>{props.error}</Typography>}
        </Box>
    );
}

export default DateInput;