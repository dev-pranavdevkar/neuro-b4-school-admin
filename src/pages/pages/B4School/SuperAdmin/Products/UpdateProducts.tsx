import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DialogContent from '@mui/material/DialogContent';
import axiosInstance from 'src/services/axios';
import Icon from 'src/@core/components/icon';
import { Grid } from '@mui/material';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';

interface Products {
  name: string;
  price: string;
  description: string;
  image: string;
  sold: string;
  rating: string;
  availability: string;
}

interface UpdateProducts {
  onSubmit: (data: Products) => void;
}

const schema = yup.object().shape({
  name: yup.string().required('Title is Required'),
  price: yup.string().required('Location is Required'),
  availability: yup.string().required('Date is Required'),
  image: yup.mixed().required('Primary Image is Required'),
  sold: yup.string().required('Secondary File is Required'),
  rating: yup.string().required('Rating File is Required'),
  description: yup.string().required('Description is Required'),
});

export default function UpdateProducts({ show, handleclose, selectedProducts }) {

  const [loading, setLoading] = useState(false);
  const { control, register, setValue, handleSubmit, setError, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const router = useRouter();

  useEffect(() => {
    if (selectedProducts) {
      setValue('name', selectedProducts['name'] || '');
      setValue('price', selectedProducts['price'] || '');
      setValue('availability', selectedProducts['availability'] || '');
      setValue('description', selectedProducts['description'] || '');
    }
  }, [selectedProducts, setValue]);

  const onSubmit = async (data: any) => {
    const id = selectedProducts.id;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price);
      formData.append('availability', data.availability);
      formData.append('description', data.description);
      formData.append('sold', data.sold);
      formData.append('rating', data.rating);
      if (data.image[0]) formData.append('image', data.image[0]);
     
      
      const response = await axiosInstance.post(`/admin/v1/product/updateProduct/${id}`, formData);
      setLoading(false);
      const responseData = response.data;
      if (responseData?.success) {
        toast.success(responseData.message, { position: 'top-center' });
        handleclose();
      } else {
        toast.error(responseData.message, { position: 'top-center' });
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        for (const key in error.response.data.data) {
          setError(key, { type: 'manual', message: error.response.data.data[key].join(',') });
        }
      }
      toast.error('Products Could Not Be Edited', { position: 'top-center' });
      setLoading(false);
    }
  };

  return (
    <Dialog
      scroll='body'
      open={show}
      onClose={handleclose}
      aria-labelledby='user-view-plans'
      aria-describedby='user-view-plans-description'
      sx={{
        '& .MuiPaper-root': { width: '100%', maxWidth: '90%', maxHeight: '100vh' },
        '& .MuiDialogTitle-root ~ .MuiDialogContent-root': { pt: theme => `${theme.spacing(2)} !important` }
      }}
    >
      <DialogTitle id='user-view-plans' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        <Grid container item xs={12} justifyContent='space-between' alignItems='center'>
          Edit Products
          <Icon icon='ic:baseline-close' style={{ cursor: 'pointer' }} onClick={handleclose} />
        </Grid>
      </DialogTitle>
      <Divider
        sx={{
          mt: theme => `${theme.spacing(0.5)} !important`,
          mb: theme => `${theme.spacing(7.5)} !important`
        }}
      />
      <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Products Title'
                  {...register('name')}
                  size='small'
                  placeholder='Products Title'
                  error={Boolean(errors.name)}
                />
                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.name.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Price'
                  {...register('price')}
                  size='small'
                  placeholder='Price'
                  error={Boolean(errors.price)}
                />
                {errors.price && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.price.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Availability'
                  {...register('availability')}
                  type='text'
                  size='small'
                  placeholder='Availability'
                  error={Boolean(errors.availability)}
                  InputLabelProps={{ shrink: true }}
                />
                {errors.availability && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.availability.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Primary Image'
                  {...register('image')}
                  type='file'
                  size='small'
                  error={Boolean(errors.image)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: 'image/*' }}
                />
                {errors.image && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.image.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Sold Upto'
                  {...register('sold')}
                  type='text'
                  size='small'
                  error={Boolean(errors.sold)}
                  InputLabelProps={{ shrink: true }}
                />
                {errors.sold && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.sold.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Rating'
                  {...register('rating')}
                  type='text'
                  size='small'
                  error={Boolean(errors.rating)}
                  InputLabelProps={{ shrink: true }}
                />
                {errors.rating && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.rating.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label='Description'
                  {...register('description')}
                  size='small'
                  placeholder='Description'
                  error={Boolean(errors.description)}
                  multiline
                />
                {errors.description && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.description.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button size='large' type='submit' variant='contained' disabled={loading}>
                {loading ? (
                  <CircularProgress
                    sx={{
                      color: 'common.white',
                      width: '20px !important',
                      height: '20px !important',
                      mr: theme => theme.spacing(2)
                    }}
                  />
                ) : null}
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}
