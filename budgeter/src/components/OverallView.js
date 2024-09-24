import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const OverallView = (props) => {
    const getOverallUtilization = () => {
        return Math.round(props.totalExpenses / props.totalIncome * 100);
    }

    const getOverallColor = () => getOverallUtilization() < 75 ? "green" : "red";

    return (
        <Paper elevation={3} sx={{
            minWidth: "33%", display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center", p: 2
        }}>
            <Box sx={{ width: "100%", display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-evenly", alignItems: "center" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h4">Overall</Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex', justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress
                            variant="determinate"
                            value={Math.min(getOverallUtilization(), 100)}
                            size="5rem"
                            sx={{ color: getOverallColor() }} />
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Typography
                                variant="caption"
                                component="div"
                                fontSize="1rem">{`${getOverallUtilization()}%`}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h6">Net Savings</Typography>
                    {props.totalIncome - props.totalExpenses > 0 && <Typography variant="p" color="green">+${props.totalIncome - props.totalExpenses}</Typography>}
                    {props.totalIncome - props.totalExpenses < 0 && <Typography variant="p" color="red">-${Math.abs(props.totalIncome - props.totalExpenses)}</Typography>}
                </Box>
                {getOverallUtilization() < 75 && <InsertEmoticonIcon sx={{ fontSize: "5rem", color: "green" }} />}
                {getOverallUtilization() >= 75 && <SentimentVeryDissatisfiedIcon sx={{ fontSize: "5rem", color: "red" }} />}
            </Box>
        </Paper>
    );
}

export default OverallView;