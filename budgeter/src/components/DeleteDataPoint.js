import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"


const DeleteDataPoint = (props) => {

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Add Data Point</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this data point?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={props.deleteDataPoint} sx={{ color: "red" }}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteDataPoint;