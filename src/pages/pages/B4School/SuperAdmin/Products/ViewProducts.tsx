import React from 'react'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import renderHTML from 'react-render-html';

import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

import Icon from 'src/@core/components/icon'
import { Grid } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { baseUrl } from 'src/configs/baseURL'
export default function ViewProducts({ show, handleclose, selectedProducts }) {

  const html = selectedProducts.id


  return (
    <Dialog
      scroll='body'
      open={show}
      onClose={handleclose}
      aria-labelledby='user-view-plans'
      aria-describedby='user-view-plans-description'
      sx={{
        '& .MuiPaper-root': { width: '100%', maxWidth: 760, },
        '& .MuiDialogTitle-root ~ .MuiDialogContent-root': { pt: theme => `${theme.spacing(2)} !important` }
      }}
    >
      <DialogTitle id='user-view-plans' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        <Grid container item xs={12} justifyContent='space-between' alignItems='center'>

          Product Details
          <Icon icon='ic:baseline-close' style={{ cursor: 'pointer' }} onClick={handleclose} />
        </Grid>
      </DialogTitle>
      <Divider
        sx={{
          mt: theme => `${theme.spacing(0.5)} !important`,
          mb: theme => `${theme.spacing(7.5)} !important`
        }}
      />

      <DialogContent>
        <Box>
          <div className='...'>

            <Grid container spacing={5}>
              <Grid item xs={6}>
                Product Name: <br />{selectedProducts.name}

              </Grid>
              <Grid item xs={6}>
              Availability:<br /> {selectedProducts.availability}

              </Grid>
              <Grid item xs={4}>
                Price:<br /> ${selectedProducts.price}

              </Grid>
              <Grid item xs={4}>
                Sold Upto:<br /> {selectedProducts.sold}

              </Grid>
              <Grid item xs={4}>
               Rating:<br /> {selectedProducts.rating}

              </Grid>
              <Grid item xs={12}>
                Description:<br />
                <p>
                {selectedProducts.description}
                </p>

              </Grid>
              <Grid item xs={6}>
                Primary Image:<br />
                <img src={`${baseUrl}${selectedProducts.image}`} alt="{baseUrl}{selectedProducts.image}" style={{maxHeight:'300px', objectFit:'contain'}} />

              </Grid>
            
         
    
              <Grid item xs={12}>

              </Grid>

            </Grid>
          </div>

        </Box>




      </DialogContent>

    </Dialog>
  )
}
