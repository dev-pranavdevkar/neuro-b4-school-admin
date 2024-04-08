import React from 'react'


import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import PageHeader from "../../../@core/components/page-header";
import TradeForm from 'src/component/Trade/TradeForm';


export default function CreateTrade() {
    return (
        <div>
            <Grid container direction="row" justifyContent="space-between">
                <Grid item>
                    <PageHeader
                        title={
                            <Typography variant='h5'>
                                Option Type
                            </Typography>
                        }
                        subtitle={
                            <Typography variant='body2'>
                                Create
                            </Typography>
                        }
                    />
                </Grid>
                <Grid item>

                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item xs={12}>
                    <TradeForm />
                </Grid>

            </Grid>
        </div>
    )
}
