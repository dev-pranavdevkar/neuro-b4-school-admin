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
interface Blogs {

  title: string;
  sub_title: string;
  primary_text_field: string;
  primary_image: string;
  secondary_text_field: string;
  secondary_image: string;
}

interface AddCountryPopup {
  onSubmit: (data: Blogs) => void;
}

const schema = yup.object().shape({

  title: yup.string().required('Title is Required'),
  sub_title: yup.string().required('Sub Title is Required'),


});

export default function AddBlog() {
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
  const onSubmit = async (data: any) => {

    setLoading(true)
    try {
      const Blogs = await axiosInstance.post(
        `/admin/v1/blog/create`,
        { ...data }
      ).then((response) => {
        setLoading(false)
        const data = response.data
        console.log(data)
        if (data?.success) {

          toast.success(data.message, {
            position: 'top-center'
          })
        } else {
          toast.error(data.message, {
            position: 'top-center'
          })
        }
        router.back()

      }).catch((error) => {
        console.log(error)
        if (error.response.status == 403) {
          for (const key in error.response.data.data) {
            setError(key, { type: "manual", message: error.response.data.data[key].join(',') })
          }
        }
        setLoading(false)
      });


    }
    catch (error) {
      console.log(error)
      toast.error('Blog Could Not Added', {
        position: 'top-center',
      })
      setLoading(false)
    }

  }







  return (
    <Card>
      <CardHeader title='Add Blog' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} >
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Blog Title'
                  {...register('title')}

                  size='small'
                  placeholder='Blog Title'
                  error={Boolean(errors.name)}
                  aria-describedby='validation-async-name'
                />

                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-name'>
                    {errors.title.message}
                  </FormHelperText>
                )}

              </FormControl>

            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Sub-Title'
                  {...register('sub_title')}

                  size='small'
                  placeholder='Sub-Title'
                  error={Boolean(errors.sub_title)}
                  aria-describedby='validation-async-name'
                />

                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-name'>
                    {errors.sub_title.message}
                  </FormHelperText>
                )}

              </FormControl>

            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Primary Image'
                  {...register('primary_image')}
                  type='file'
                  size='small'
                  placeholder='Primary Image'
                  error={Boolean(errors.primary_image)}
                  aria-describedby='validation-async-name'
                  InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*' }}
                />


                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-name'>
                    {errors.primary_image.message}
                  </FormHelperText>
                )}

              </FormControl>

            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Secondary Image'
                  {...register('secondary_image')}
                  type='file'
                  size='small'
                  placeholder='Primery Image'
                  error={Boolean(errors.secondary_image)}
                  aria-describedby='validation-async-name'
                  InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*' }}
                />


                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-name'>
                    {errors.secondary_image.message}
                  </FormHelperText>
                )}

              </FormControl>

            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Primary Text'
                  {...register('primary_text_field')}

                  size='small'
                  placeholder='Primary Text'
                  error={Boolean(errors.primary_text_field)}
                  aria-describedby='validation-async-name'
                  multiline

                />


                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-name'>
                    {errors.primary_text_field.message}
                  </FormHelperText>
                )}

              </FormControl>

            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Secondary Text'
                  {...register('secondary_text_field')}

                  size='small'
                  placeholder='Secondary Text'
                  error={Boolean(errors.secondary_text_field)}
                  aria-describedby='validation-async-name'
                  multiline
                />

                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-name'>
                    {errors.secondary_text_field.message}
                  </FormHelperText>
                )}

              </FormControl>

            </Grid>
            <Grid item xs={12}>

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
