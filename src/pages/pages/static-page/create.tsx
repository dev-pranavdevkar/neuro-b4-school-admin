import React, { useEffect, useState } from 'react'
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import PageHeader from "../../../@core/components/page-header";
import StaticPageForm from 'src/component/staticPage/StaticPageForm';


export default function CreteStaticPage() {


    return (
        <div>
            <Grid container direction="row" justifyContent="space-between">
                <Grid item>
                    <PageHeader
                        title={
                            <Typography variant='h5'>
                                Static Page
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
                    <StaticPageForm />
                </Grid>

            </Grid>
        </div>
    )
}
