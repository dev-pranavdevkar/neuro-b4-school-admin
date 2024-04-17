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

interface News {
  title: string;
  location: string;
  description: string;
  image: string;
  secondary_file: string;
  date: string;
}

interface UpdateNews {
  onSubmit: (data: News) => void;
}

const schema = yup.object().shape({
  title: yup.string().required('Title is Required'),
  location: yup.string().required('Location is Required'),
  date: yup.date().required('Date is Required'),
  image: yup.mixed().required('Primary Image is Required'),
  secondary_file: yup.mixed().required('Secondary File is Required'),
  description: yup.string().required('Description is Required'),
});

export default function UpdateNews({ show, handleclose, selectedNews }) {

  const [loading, setLoading] = useState(false);
  const { control, register, setValue, handleSubmit, setError, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const router = useRouter();

  useEffect(() => {
    if (selectedNews) {
      setValue('title', selectedNews['title'] || '');
      setValue('location', selectedNews['location'] || '');
      setValue('date', selectedNews['date'] || '');
      setValue('description', selectedNews['description'] || '');
    }
  }, [selectedNews, setValue]);

  const onSubmit = async (data: any) => {
    const id = selectedNews.id;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('location', data.location);
      formData.append('date', data.date);
      formData.append('description', data.description);
      
      if (data.image[0]) formData.append('image', data.image[0]);
      if (data.secondary_file[0]) formData.append('secondary_file', data.secondary_file[0]);
      
      const response = await axiosInstance.post(`/admin/v1/news/updateNews/${id}`, formData);
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
      toast.error('News Could Not Be Edited', { position: 'top-center' });
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
          Edit News
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
                  label='News Title'
                  {...register('title')}
                  size='small'
                  placeholder='News Title'
                  error={Boolean(errors.title)}
                />
                {errors.title && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.title.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Location'
                  {...register('location')}
                  size='small'
                  placeholder='Location'
                  error={Boolean(errors.location)}
                />
                {errors.location && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.location.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Date'
                  {...register('date')}
                  type='date'
                  size='small'
                  placeholder='Date'
                  error={Boolean(errors.date)}
                  InputLabelProps={{ shrink: true }}
                />
                {errors.date && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.date.message}
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
                  label='Secondary File'
                  {...register('secondary_file')}
                  type='file'
                  size='small'
                  error={Boolean(errors.secondary_file)}
                  InputLabelProps={{ shrink: true }}
                />
                {errors.secondary_file && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.secondary_file.message}
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
