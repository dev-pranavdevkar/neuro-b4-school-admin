import React, { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, } from 'react-hook-form'
import axiosInstance from 'src/services/axios'
import { Checkbox, FormControlLabel } from "@mui/material";
import { useRouter } from "next/router";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EditorState, convertToRaw } from "draft-js";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import dynamic from 'next/dynamic';
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
interface Products {

  name: string;
  image: string;
  description: string;
  price: string;
  availability: string;
  sold: string;
  rating: string;
}

interface AddCountryPopup {
  onSubmit: (data: Products) => void;
}

const schema = yup.object().shape({

  name: yup.string().required('Name is Required'),



});

export default function AddProducts() {
  const [loading, setLoading] = useState(false)
  const [editorData, setEditorData] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (e) => {
    setEditorState(e);
  };

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema), })

  const router = useRouter()
  const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false }
  )
  const wrapperStyle = {
    border: "1px solid #F1F1F1",
    padding: "5px",
  };

  const [optionTypes, setOptionTypes] = useState([]);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('image', data.image[0]); // Assuming you want to upload only one image
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('availability', data.availability);
      formData.append('sold', data.sold);
      formData.append('rating', data.rating);
      
     

      const Products = await axiosInstance.post(
        `/admin/v1/product/createProduct`,
        formData
      );

      setLoading(false);
      const responseData = Products.data;

      if (responseData.success) {
        toast.success(responseData.message, {
          position: 'top-center'
        });
      } else {
        toast.error(responseData.message, {
          position: 'top-center'
        });
      }

      router.back();
    } catch (error) {
      console.error(error);
      toast.error('Products Could Not Be Added', {
        position: 'top-center'
      });
      setLoading(false);
    }
  };


  return (
    <Card>
      <CardHeader title='Add Products' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} >
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Products Name'
                  {...register('name')}

                  size='small'
                  placeholder='Products Name'
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

                  label='Primary Image'
                  {...register('image')}
                  type='file'
                  size='small'
                  placeholder='Primary Image'
                  error={Boolean(errors.image)}
                  aria-describedby='validation-async-name'
                  InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*' }}
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

                  label='Price'
                  {...register('price')}

                  size='small'
                  placeholder='Price'
                  error={Boolean(errors.price)}
                  aria-describedby='validation-async-price'
                />

                {errors.price && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-price'>
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
                  aria-describedby='validation-async-availability'
                  InputLabelProps={{ shrink: true }}
                />


                {errors.availability && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-availability'>
                    {errors.availability.message}
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
                  placeholder='Sold Upto'
                  error={Boolean(errors.sold)}
                  aria-describedby='validation-async-sold'
                  InputLabelProps={{ shrink: true }}
                />


                {errors.sold && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-sold'>
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

            <Grid item xs={12}>
              <FormControl fullWidth>

                <TextField

                  label='Primary Text'
                  {...register('description')}

                  size='small'
                  placeholder='Primary Text'
                  error={Boolean(errors.description)}
                  aria-describedby='validation-async-description'
                  multiline
                  minRows={4}

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
      </CardContent>
    </Card>
  )
}
