import {CircularProgress, Grid} from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";

export const Loading = () => <Box sx={{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}}>
    <CircularProgress disableShrink/>
</Box>