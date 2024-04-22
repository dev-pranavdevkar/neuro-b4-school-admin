import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import axiosInstance from 'src/services/axios';
import { Checkbox, FormControlLabel } from "@mui/material";
import { useRouter } from "next/router";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

interface Program {
  category: string;
  isShowOnHomePage: boolean;
  // additional_images: { image: string }[];
}

const schema = yup.object().shape({
  category: yup.string().required('Category is Required'),
});

export default function AddProgram() {
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState([]);
  const [isShowOnHomePage, setIsShowOnHomePage] = useState(false);
  const[multiImages, setMultiImages]=useState([])
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<Program>({ resolver: yupResolver(schema) });
  const onMultiFileChange = (e) => {
    let files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(files[i]);

      fileReader.onload = (event) => {
        console.log(event.target.result)
        multiImages.push(event.target.result);
        const newImages = multiImages.map((index) => ({ image: index }));
        console.log(newImages)
        setValue('additional_images', newImages);

      };
    }
  }
  
  const onSubmit = async (data: Program) => {
    setLoading(true);
    try {
      const formData = new FormData();



      formData.append('category', data.category);
      formData.append('additional_images', data.additional_images);

      formData.append('region_id', data.region_id);
      formData.append('isShowOnHomePage', data.isShowOnHomePage); // Append as a boolean value directly
console.log(isShowOnHomePage);
      const response = await axiosInstance.post(
        `/admin/v1/gallery/create`,
        {...data, isShowOnHomePage:isShowOnHomePage}
      );

      setLoading(false);
      const responseData = response.data;
      if (responseData?.success) {
        toast.success(responseData.message, { position: 'top-center' });
      } else {
        toast.error(responseData.message, { position: 'top-center' });
      }
      router.back();
    } catch (error) {
      console.error(error);
      toast.error('Program could not be added', { position: 'top-center' });
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/v1/region/getAllWithoutLimit`)
      setBranch(response.data?.data)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsShowOnHomePage(event.target.checked);
  };

 

  return (
    <Card>
      <CardHeader title='Add Program' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  label='Select Branch'
                  {...register('region_id')}
                  error={Boolean(errors.region_id)}
                  labelId='validation-region_id'
                  aria-describedby='validation-region_id'
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
              <FormControl fullWidth size='small'>
                <InputLabel
                  id='validation-basic-attribute_type'
                  error={Boolean(errors.category)}
                  htmlFor='validation-basic-category'
                >
                  Select Category
                </InputLabel>
                <Select
                  label='Select Category'
                  {...register('category')}
                  error={Boolean(errors.category)}
                  labelId='validation-category'
                  aria-describedby='validation-category'
                >
                 
                   <MenuItem value="english">English</MenuItem>
                   <MenuItem value="art">Art</MenuItem>
                   <MenuItem value="math">Math</MenuItem>
                   <MenuItem value="physical-education">Physical Education</MenuItem>
                  
                </Select>
                {errors.category && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-category'>
                    {errors.category.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
{/* 
            <Grid item xs={4}>
              <FormControl fullWidth>
                <TextField
                  label='Category'
                  {...register('category')}
                  size='small'
                  placeholder='Category'
                  error={Boolean(errors.category)}
                  aria-describedby='validation-async-category'
                />
                {errors.category && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-category'>
                    {errors.category.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid> */}

            <Grid item xs={4}>
              <FormControl fullWidth size='small'>
                <TextField
                  label='Images'
                  type='file'
                  name="images"
                  onChange={onMultiFileChange}
                  size='small'
                  error={Boolean(errors.additional_images)}
                  aria-describedby='validation-async-images'
                  InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*', multiple: true }}
                />

                {errors.additional_images && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-images'>
                    {errors.additional_images.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth size='small'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isShowOnHomePage}
                      onChange={handleCheckboxChange}
                      id='validation-basic-isShowOnHomePage'
                    />
                  }
                  label='Show on Home Page'
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
      </CardContent>
    </Card>
  );
}
