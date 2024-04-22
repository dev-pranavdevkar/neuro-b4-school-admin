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
import { useForm } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { Checkbox,FormControlLabel } from "@mui/material";

interface CountryAdmin {
  name: string;
  isShowOnHomePage: boolean;
}

interface EditTestimonialProps {
  show: boolean;
  handleclose: () => void;
  SelectedTestimonial: {
    id: string;
    name: string;
    role: string;
    // image: FileList;
    gender: string;
    comment: string;
  
    rating: string;
    
    isShowOnHomePage: boolean;
    region_id: string;
  };
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),

  // Add more validations as needed
});

export default function EditTestimonial({ show, handleclose, SelectedTestimonial }: EditTestimonialProps) {
  const [loading, setLoading] = useState(false);
  const [branch, setBranchData] = useState([]);
  const [isShowOnHomePage, setIsShowOnHomePage] = useState(SelectedTestimonial.isShowOnHomePage);
  const {
    control,
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    setValue('name', SelectedTestimonial.name);
    setValue('role', SelectedTestimonial.role);
    setValue('gender', SelectedTestimonial.gender);
    setValue('comment', SelectedTestimonial.comment);
    
    setValue('rating', SelectedTestimonial.rating);
    
    setValue('isShowOnHomePage', SelectedTestimonial.isShowOnHomePage);
    setValue('region_id', SelectedTestimonial.region_id);

    // Set other form values accordingly
  }, [SelectedTestimonial]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/v1/region/getAllWithoutLimit`);
      setBranchData(response.data?.data);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    const id = SelectedTestimonial.id;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('role', data.role);
      formData.append('rating', data.rating);
      formData.append('isShowOnHomePage', isShowOnHomePage); // Include isShowOnHomePage in the form data

      // if (data.image[0]) formData.append('image', data.image[0]);

      // Append other form data to formData as needed
      const response = await axiosInstance.post(`/admin/v1/testimonial/updateTestimonial/${id}`, formData);
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
      toast.error('Testimonial Could Not Be Edited', { position: 'top-center' });
      setLoading(false);
    }
  };
  // Handle checkbox change
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsShowOnHomePage(event.target.checked);
  };
  return (
    <Dialog
      scroll='body'
      open={show}
      onClose={handleclose}
      aria-labelledby='user-view-plans'
      aria-describedby='user-view-plans-comment'
      sx={{
        '& .MuiPaper-root': { width: '100%', maxWidth: '90%', maxHeight: '100vh' },
        '& .MuiDialogTitle-root ~ .MuiDialogContent-root': { pt: theme => `${theme.spacing(2)} !important` }
      }}
    >
      <DialogTitle id='user-view-plans' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        <Grid container item xs={12} justifyContent='space-between' alignItems='center'>
          Edit Testimonial
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
                  id='validation-basic-attribute_type'
                  error={Boolean(errors.country_code)}
                  htmlFor='validation-basic-country_code'
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

                  label='Member Name'
                  {...register('name')}

                  size='small'
                  placeholder='Member Name'
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

                  label='Parents Of'
                  {...register('role')}

                  size='small'
                  placeholder='Parents Of'
                  error={Boolean(errors.role)}
                  aria-describedby='validation-async-role'
                />

                {errors.role && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-role'>
                    {errors.role.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Gender'
                  {...register('gender')}

                  size='small'
                  placeholder='Gender'
                  error={Boolean(errors.gender)}
                  aria-describedby='validation-async-gender'
                />

                {errors.gender && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-gender'>
                    {errors.gender.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Rating'
                  {...register('rating')}

                  size='small'
                  placeholder='Rating'
                  error={Boolean(errors.rating)}
                  aria-describedby='validation-async-rating'
                />

                {errors.rating && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-rating'>
                    {errors.rating.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

     





            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Comment'
                  {...register('comment')}

                  size='small'
                  placeholder='Comment'
                  error={Boolean(errors.comment)}
                  aria-describedby='validation-async-comment'
                  multiline
                  minRows={5}
                />

                {errors.comment && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-comment'>
                    {errors.comment.message}
                  </FormHelperText>
                )}

              </FormControl>
            </Grid>

            

            {/* <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Image'
                  {...register('image')}
                  type='file'
                  size='small'
                  placeholder='Image'
                  error={Boolean(errors.image)}
                  aria-describedby='validation-async-image'
                  InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*' }}
                />
                {errors.image && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-image'>
                    {errors.image.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid> */}


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
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-isShowOnHomePage'>
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
