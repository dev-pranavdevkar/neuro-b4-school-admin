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
interface News {

  title: string;
  location: string;
  description: string;
  image: string;
  secondary_text_field: string;
  secondary_image: string;
}

interface AddCountryPopup {
  onSubmit: (data: News) => void;
}

const schema = yup.object().shape({

  title: yup.string().required('Title is Required'),
 


});

export default function AddNews() {
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
        formData.append('title', data.title);
        formData.append('location', data.location);
        formData.append('date', data.date);
        formData.append('description', data.description);
        formData.append('image', data.image[0]); // Assuming you want to upload only one image

        const News = await axiosInstance.post(
            `/admin/v1/news/createNews`,
            formData
        );

        setLoading(false);
        const responseData = News.data;

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
        toast.error('News Could Not Be Added', {
            position: 'top-center'
        });
        setLoading(false);
    }
};


  return (
    <Card>
      <CardHeader title='Add News' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} >
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='News Title'
                  {...register('title')}

                  size='small'
                  placeholder='News Title'
                  error={Boolean(errors.title)}
                  aria-describedby='validation-async-name'
                />

                {errors.title && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-title'>
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
                  aria-describedby='validation-async-location'
                />

                {errors.location && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-location'>
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
                  aria-describedby='validation-async-date'
                  InputLabelProps={{ shrink: true }} 
                />


                {errors.date && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-date'>
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

                  label='Secondary File'
                  {...register('secondary_file')}
                  type='file'
                  size='small'
                  placeholder='Secondary File'
                  error={Boolean(errors.secondary_file)}
                  aria-describedby='validation-async-secondary_file'
                  InputLabelProps={{ shrink: true }} 
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
