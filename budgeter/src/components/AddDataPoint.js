import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";

const AddDataPoint = (props) => {

    const [selectedDate, setSelectedDate] = useState(new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, "0") + "-" + new Date().getDate().toString().padStart(2, "0"));
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Add Data Point</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the data point you would like to add.
                    <TextField sx={{ mt: 1, width: "100%" }} id="title" label="Date" variant="outlined" type="text" onChange={e => setSelectedDate(e.target.value)} value={selectedDate} />
                    <TextField sx={{ mt: 1, width: "100%" }} id="title" label="Description" variant="outlined" type="text" onChange={e => setDescription(e.target.value)} value={description} />
                    <TextField sx={{ mt: 1, width: "100%" }} id="title" label="Amount" variant="outlined" type="number" onChange={e => setAmount(e.target.value)} value={amount} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={props.onClose}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddDataPoint;