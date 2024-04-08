import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
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
import { useForm } from 'react-hook-form';
import { useRouter } from "next/router";

interface ActivityPage {
  id: number;
  name: string;
}

interface UpdateActivityByIdProps {
  show: boolean;
  handleclose: () => void;
  selectedActivityPage: ActivityPage;
}

const schema = yup.object().shape({
  name: yup.string().required('Activity Name is Required'),
  image: yup.mixed().required('Image is Required')
});

export default function UpdateActivityById({ show, handleclose, selectedActivityPage }: UpdateActivityByIdProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { control, register, handleSubmit, setValue, setError, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    // Update form values when selectedActivityPage changes
    setValue('name', selectedActivityPage?.name || '');
  }, [setValue, selectedActivityPage]);

  const onSubmit = async (data: any) => {
    const id = selectedActivityPage.id;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('image', data.image[0]); // Assuming you're uploading a single image
      const response = await axiosInstance.post(`/admin/v1/gallery/updateImage/${id}`, formData);
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
      if (error.response && error.response.status == 403) {
        for (const key in error.response.data.data) {
          setError(key, { type: "manual", message: error.response.data.data[key].join(',') });
        }
      }
      toast.error('Activity Could Not Edited', { position: 'top-center' });
      setLoading(false);
    }
  }

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
          Edit Activity
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
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Category Name'
                  {...register('category')}
                  size='small'
                  placeholder='Activity'
                  error={Boolean(errors.category)}
                  aria-describedby='validation-async-category'
                />
                {errors.category && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-category'>
                    {errors.category.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Image'
                  {...register('image')}
                  type='file'
                  size='small'
                  placeholder='Image'
                  error={Boolean(errors.image)}
                  aria-describedby='validation-async-image'
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: 'image/*' }}
                />
                {errors.image && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-image'>
                    {errors.image.message}
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
  )
}
