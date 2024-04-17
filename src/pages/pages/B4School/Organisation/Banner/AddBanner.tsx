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
interface Banner {

  title: string;
  description: string;
  image: string;

}

interface AddBannerPopup {
  onSubmit: (data: Banner) => void;
}

const schema = yup.object().shape({

  title: yup.string().required('Title is Required'),



});

export default function AddBanner() {
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
      formData.append('description', data.description);
      formData.append('image', data.image[0]); // Assuming you want to upload only one image

      const Banner = await axiosInstance.post(
        `/admin/v1/banner/createBanner`,
        formData
      );

      setLoading(false);
      const responseData = Banner.data;

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
      toast.error('Banner Could Not Be Added', {
        position: 'top-center'
      });
      setLoading(false);
    }
  };


  return (
    <Card>
      <CardHeader title='Add Banner' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} >
          <Grid container spacing={5}>
            <Grid item xs={8}>
              <FormControl fullWidth>

                <TextField

                  label='Banner Title'
                  {...register('title')}

                  size='small'
                  placeholder='Banner Title'
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

                  label='Image'
                  {...register('image')}
                  type='file'
                  size='small'
                  placeholder='Image'
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


            <Grid item xs={12}>
              <FormControl fullWidth>

                <TextField

                  label='Short Description'
                  {...register('description')}

                  size='small'
                  placeholder='Short Description'
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
