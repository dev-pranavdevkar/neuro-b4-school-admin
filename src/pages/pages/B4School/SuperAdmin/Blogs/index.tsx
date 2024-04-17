import React from 'react'
import Link from 'next/link';

import Button from '@mui/material/Button'
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import PageHeader from 'src/@core/components/page-header';
import BlogList from './BlogList';

export default function index() {
  return (
    <div>
      <Grid container direction="row" justifyContent="space-between">
        <Grid item>
          <PageHeader
            title={
              <Typography variant='h5'>
               Blogs
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
          <Link href='/pages/B4School/SuperAdmin/News/AddBlog' passHref style={{ textDecoration: 'none' }}>
            <Button type='submit' variant='contained' style={{ marginBottom: '20px' }}>
              Add Blog
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={12}>
          <BlogList />
        </Grid>

      </Grid>
    </div>
  )
}
