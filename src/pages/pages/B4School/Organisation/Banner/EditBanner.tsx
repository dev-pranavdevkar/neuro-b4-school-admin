import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, TextField, Checkbox, FormControlLabel, Button, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosInstance from 'src/services/axios';
import toast from 'react-hot-toast';
import Icon from 'src/@core/components/icon';
import DialogContent from '@mui/material/DialogContent'; // Add this import
interface EditBannerProps {
  show: boolean;
  handleclose: () => void;
  selectedBanner: {
    id: string;
    title: string;
    image: FileList;
    description: string;
    isShowOnHomePage: boolean;
    region_id: string;
  };
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  region_id: yup.string().required('Region is required'),
});

export default function EditBanner({ show, handleclose, selectedBanner }: EditBannerProps) {
  const [loading, setLoading] = useState(false);
  const [branch, setBranchData] = useState([]);
  const [isShowOnHomePage, setIsShowOnHomePage] = useState(selectedBanner.isShowOnHomePage);
  const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBanner) {
      setValue('title', selectedBanner.title || '');
      setValue('description', selectedBanner.description || '');
      setValue('isShowOnHomePage', selectedBanner.isShowOnHomePage || false);
      setValue('region_id', selectedBanner.region_id || '');
      // Set other form values accordingly
    }
  }, [selectedBanner, setValue]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/v1/region/getAllWithoutLimit`);
      setBranchData(response.data?.data);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('isShowOnHomePage', isShowOnHomePage.toString()); // Convert boolean to string
      if (data.image[0]) formData.append('image', data.image[0]);
      formData.append('region_id', data.region_id);

      const response = await axiosInstance.post(`/admin/v1/banner/updateBanner/${selectedBanner.id}`, formData);
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
          // Handle errors and set form errors if needed
        }
      }
      toast.error('Banner Could Not Be Edited', { position: 'top-center' });
      setLoading(false);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsShowOnHomePage(event.target.checked);
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
          Edit Banner
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
              <FormControl fullWidth size='small'>
                <InputLabel
                  id='validation-basic-region_id'
                  error={Boolean(errors.region_id)}
                  htmlFor='validation-basic-region_id'
                >
                  Select Branch
                </InputLabel>
                <Select
                  label='Select Branch'
                  {...register('region_id')}
                  error={Boolean(errors.region_id)}
                  labelId='validation-region_id'
                  aria-describedby='validation-region_id'
                  defaultValue={selectedBanner.region_id}
                >
                  {branch.map((item, index) => (
                    <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
                  ))}
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
                  {...register('title')}
                  size='small'
                  placeholder='Title'
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
                  label='Description'
                  {...register('description')}
                  size='small'
                  placeholder='Description'
                  error={Boolean(errors.description)}
                  multiline
                  minRows={5}
                />
                {errors.description && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.description.message}
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isShowOnHomePage}
                      onChange={handleCheckboxChange}
                      id='validation-basic-isShowOnHomePage'
                    />
                  }
                  label='Show Branch Select'
                />
                {isShowOnHomePage && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {/* Additional content to show when checkbox is checked */}
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
