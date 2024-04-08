import React from 'react'
import Link from 'next/link';

import Button from '@mui/material/Button'
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import PageHeader from "../../../../@core/components/page-header";

import TradeList from 'src/component/Trade/TradeList';

export default function AllTrade() {
    return (
        <div>
            <Grid container direction="row" justifyContent="space-between">
                <Grid item>
                    <PageHeader
                        title={
                            <Typography variant='h5'>
                                Trade
                            </Typography>
                        }
                    // subtitle={
                    //     <Typography variant='body2'>
                    //         List
                    //     </Typography>
                    // }
                    />
                </Grid>
                <Grid item>
                    <Link href='/pages/trade/tradeAll/create' passHref style={{ textDecoration: 'none' }}>
                        <Button type='submit' variant='contained' style={{ marginBottom: '20px' }}>
                            Add Trade
                        </Button>
                    </Link>
                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item xs={12}>
                    <TradeList />
                </Grid>

            </Grid>
        </div>
    )
}
