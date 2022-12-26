import {Grid, Typography} from "@mui/material";
import React from "react";

export const Home = () => {
    return <Grid container justifyContent={'center'} alignContent={'center'} style={{height: '100vh'}}>
        <Grid item>
            <Typography variant={'h1'}>Харків для Людей</Typography>
        </Grid>
    </Grid>
}