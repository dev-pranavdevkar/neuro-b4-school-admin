import React from 'react'
import Link from 'next/link';

import Button from '@mui/material/Button'
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import PageHeader from 'src/@core/components/page-header';
import GalleryList from './GalleryList'

export default function index() {
  return (
    <div>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item>
          <PageHeader
            title={
              <Typography variant='h5'>
                Gallery
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
          <Link href='/pages/B4School/SuperAdmin/Gallery/AddImage' passHref style={{ textDecoration: 'none' }}>
            <Button type='submit' variant='contained' style={{ marginBottom: '20px' }}>
              Add Image
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12}>
          <GalleryList />
        </Grid>

      </Grid>
    </div>
  )
}
