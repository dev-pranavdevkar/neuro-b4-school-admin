import React from 'react'
import Link from 'next/link';

import Button from '@mui/material/Button'
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import PageHeader from 'src/@core/components/page-header';
import FranchiesList from './FranchiesList'

export default function index() {
  return (
    <div>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item style={{ marginBottom: '20px' }}>
          <PageHeader
            title={
              <Typography variant='h5' >
                Franchies Enquiry
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
          <FranchiesList />
        </Grid>

      </Grid>
    </div>
  )
}
