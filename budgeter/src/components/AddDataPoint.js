import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material"
import { useState } from "react";

const AddDataPoint = (props) => {

    const [type, setType] = useState("expenses");
    const [selectedDate, setSelectedDate] = useState(new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, "0") + "-" + new Date().getDate().toString().padStart(2, "0"));
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);

    const [error, setError] = useState("");

    const addDataPoint = () => {
        const data = {
            date: selectedDate,
            description: description,
            amount: Number.parseFloat(amount)
        };

        if (!data.date || !data.description || !data.amount) {
            setError("Please fill in all fields");
            return;
        }

        if (data.amount <= 0) {
            setError("Amount must be a non-zero positive number");
            return;
        }

        props.addDataPoint(data, type);
        props.onClose();
    }

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Add Data Point</DialogTitle>
            <DialogContent>
                {error && <DialogContentText sx={{ mb: 1, color: "#ff4444" }}>
                    {error}
                </DialogContentText>}
                <DialogContentText>
                    Please enter the data point you would like to add.
                </DialogContentText>
                <FormControl sx={{
                    "width": "100%", "display": "flex",
                    "justifyContent": "center", "alignItems": "center"
                }}>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="expenses"
                        name="radio-buttons-group"
                        sx={{
                            "display": "flex", "flexDirection": "row"
                        }}
                        onChange={e => setType(e.target.value)}
                    >
                        <FormControlLabel value="expenses" control={<Radio />} label="Expense" />
                        <FormControlLabel value="income" control={<Radio />} label="Income" />
                    </RadioGroup>
                </FormControl>
                <TextField sx={{ mt: 1, width: "100%" }} id="title" label="Date" variant="outlined" type="text" onChange={e => setSelectedDate(e.target.value)} value={selectedDate} />
                <TextField sx={{ mt: 1, width: "100%" }} id="title" label="Description" variant="outlined" type="text" onChange={e => setDescription(e.target.value)} value={description} />
                <TextField sx={{ mt: 1, width: "100%" }} id="title" label="Amount" variant="outlined" type="text" onChange={e => setAmount(e.target.value)} value={amount} />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={addDataPoint}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddDataPoint;