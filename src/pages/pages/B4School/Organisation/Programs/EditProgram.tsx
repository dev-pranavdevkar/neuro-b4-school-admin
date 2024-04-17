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
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

interface ProgramPage {
  id: number;
  name: string;
}

interface UpdateProgramByIdProps {
  show: boolean;
  handleclose: () => void;
  selectedProgramPage: ProgramPage;
}

const schema = yup.object().shape({
  name: yup.string().required('Program Name is Required'),
  image: yup.mixed().required('Image is Required')
});

export default function EditProgram({ show, handleclose, selectedProgramPage }: UpdateProgramByIdProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { control, register, handleSubmit, setValue, setError, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const [branch, setBranch] = useState([]);
  useEffect(() => {
    // Update form values when selectedProgramPage changes
    setValue('name', selectedProgramPage?.name || '');
    setValue('description', selectedProgramPage?.description || '');
  }, [setValue, selectedProgramPage]);

  console.log("selectedProgramPage", selectedProgramPage);

  const onSubmit = async (data: any) => {
    const id = selectedProgramPage.id;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
       if (data.image[0]) formData.append('image', data.image[0]);
      formData.append('description', data.description)
      formData.append('region_id', data.region_id)
      const response = await axiosInstance.post(`/admin/v1/ourProgram/updateProgram/${id}`, formData);
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
      toast.error('Program Could Not Edited', { position: 'top-center' });
      setLoading(false);
    }
  }
  const fetchData = async () => {

    try {
      const response = await axiosInstance.get(`/admin/v1/region/getAllWithoutLimit`)
      setBranch(response.data?.data)
    }
    catch (error) {
      return (error)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
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
          Edit Program
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

              <FormControl fullWidth size='small'>
                <InputLabel
                  id='validation-basic-attribute_type'
                  error={Boolean(errors.region_id)}
                  htmlFor='validation-basic-region_id'
                >
                  Select Branch
                </InputLabel>

                <Select

                  label=' Select Branch'
                  {...register('region_id')}
                  error={Boolean(errors.attribute_type)}
                  labelId='validation-region_id'
                  aria-describedby='validation-region_id'
                >
                  {branch.map((item, index) => (<MenuItem value={item.id} key={index} >{item.name}</MenuItem>))}


                </Select>

                {errors.region_id && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-region_id'>
                    {errors.region_id.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Title'
                  {...register('name')}
                  size='small'
                  placeholder='Title'
                  error={Boolean(errors.name)}
                  aria-describedby='validation-async-name'
                />
                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-name'>
                    {errors.name.message}
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
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Description'
                  {...register('description')}

                  size='small'
                  placeholder='Description'
                  error={Boolean(errors.description)}
                  aria-describedby='validation-async-description'
                  multiline
                  minRows={5}
                />

                {errors.description && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-description'>
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
  )
}
