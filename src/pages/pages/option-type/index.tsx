import React from 'react'
import Link from 'next/link';

import Button from '@mui/material/Button'
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import PageHeader from "../../../@core/components/page-header";

import OptionTypeList from 'src/component/optionType/OptionTypeList';

export default function OptionPage() {
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
                    // subtitle={
                    //     <Typography variant='body2'>
                    //         List
                    //     </Typography>
                    // }
                    />
                </Grid>
                <Grid item>
                    <Link href='/pages/option-type/create' passHref style={{ textDecoration: 'none' }}>
                        <Button type='submit' variant='contained' style={{ marginBottom: '20px' }}>
                            Add Option Type
                        </Button>
                    </Link>
                </Grid>
            </Grid>
            <Grid container direction="row">
                <Grid item xs={12}>
                    <OptionTypeList />
                </Grid>

            </Grid>
        </div>
    )
}
