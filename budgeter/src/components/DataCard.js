import { Box, IconButton, Paper, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const DataCard = (props) => {

    const getColor = () => {
        return props.value < 0 ? "red" : "green";
    }

    return (
        <Paper elevation={3} sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", p: 2, my: 1 }}>
            <IconButton sx={{ flex: 0, mx: 1, color: "red" }}  ><DeleteIcon /></IconButton>
            <Typography variant="p" textAlign="start" sx={{ flex: 2, color: "gray", fontStyle: "italic" }}>{props.date}</Typography>
            <Typography variant="p" textAlign="center" sx={{ flex: 2, color: "white" }}>{props.title}</Typography>
            <Typography variant="p" textAlign="end" sx={{ flex: 2, color: getColor() }}>{props.value > 0 ? "+" : "-"}${Math.abs(props.value)}</Typography>
        </Paper>
    )
}

export default DataCard;