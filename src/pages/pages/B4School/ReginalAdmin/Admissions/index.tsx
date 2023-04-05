import React from 'react'
import Link from 'next/link';

import Button from '@mui/material/Button'
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import PageHeader from 'src/@core/components/page-header';
import AdmissionList from './AdmissionList'

export default function index() {
  return (
    <div>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item style={{ marginBottom: '20px' }}>
          <PageHeader
            title={
              <Typography variant='h5' >
                Admission Forms
              </Typography>
            }
          // subtitle={
          //     <Typography variant='body2'>
          //         List
          //     </Typography>
          // }
          />
        </Grid>
       
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12}>
          <AdmissionList />
        </Grid>

      </Grid>
    </div>
  )
}
