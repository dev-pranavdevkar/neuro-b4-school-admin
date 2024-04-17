import React from 'react'
import Link from 'next/link';

import Button from '@mui/material/Button'
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import PageHeader from 'src/@core/components/page-header';
import BannerList from './BannerList';
import UserData from 'src/navigation/vertical/userData';
export default function index() {
  const userRole = UserData();
  return (
    <div>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item>
          <PageHeader
            title={
              <Typography variant='h5'>
               Banner
              </Typography>
            }
            
   
          />
        </Grid>

        <Grid item>
          <Link href='/pages/B4School/Organisation/Banner/AddBanner' passHref style={{ textDecoration: 'none' }}>
          {userRole === 'super-admin' && (
                <Button type='submit' variant='contained' style={{ marginBottom: '20px' }}>
                    Add Banner {userRole}
                </Button>
            )}
           
          </Link>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12}>
          <BannerList />
        </Grid>

      </Grid>
    </div>
  )
}
