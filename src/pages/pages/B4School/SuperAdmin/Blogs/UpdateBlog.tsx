
import React, { useEffect, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DialogContent from '@mui/material/DialogContent'
import axiosInstance from 'src/services/axios'


import Icon from 'src/@core/components/icon'
import { Grid } from '@mui/material'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from "next/router";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EditorState, convertToRaw, convertFromHTML, ContentState } from "draft-js";

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
  secondary_image: number;
}

interface UpdateBlogs {
  onSubmit: (data: Blogs) => void;
}

const schema = yup.object().shape({
  title: yup.string().required('Title is Required'),
  sub_title: yup.string().required('Sub Title is Required'),


});

export default function UpdateBlog({ show, handleclose, selectedBlog }) {

  const [loading, setLoading] = useState(false)
  const [editorData, setEditorData] = useState();
  const [pageContent, setPageContent] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [optionTypes, setOptionTypes] = useState([]);
  const {
    control,
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema), })

  const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false }
  )
  console.log(selectedBlog)
  useEffect(() => {
    setValue('country_code', selectedBlog['country_code'])

  }, [selectedBlog]);
  const wrapperStyle = {
    border: "1px solid #F1F1F1",
    padding: "5px",
  };
  const onEditorStateChange = (e) => {
    setEditorState(e);
  };


  const router = useRouter()

  const onSubmit = async (data: any) => {
    const id = selectedBlog.id
    const { title,
      sub_title,
      primary_image,
      primary_text_field,
      secondary_image,
      secondary_text_field,

    } = data;
    console.log(primary_image[0]);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('sub_title', sub_title);
    formData.append('primary_image', primary_image[0]);
    formData.append('primary_text_field', primary_text_field);
    formData.append('secondary_image', secondary_image[0]);
    formData.append('secondary_text_field', secondary_text_field);

    setLoading(true)
    try {
      const CountryAdmin = await axiosInstance.post(
        `/admin/v1/blog/update/${id}`,
        formData
      ).then((response) => {
        setLoading(false)
        const data = response.data
        console.log(data)
        if (data?.success) {

          toast.success(data.message, {
            position: 'top-center'
          })
          handleclose()
        } else {
          toast.error(data.message, {
            position: 'top-center'
          })
        }

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
      toast.error('Blog Could Not Eddited', {
        position: 'top-center',
      })
      setLoading(false)
    }

  }
  //

  useEffect(() => {
    setValue('title', selectedBlog['title'])
    setValue('sub_title', selectedBlog['sub_title'])
    setValue('primary_image', selectedBlog['mobile_number'])
    setValue('secondary_image', selectedBlog['secondary_image'])
    setValue('primary_text_field', selectedBlog['primary_text_field'])
    setValue('secondary_text_field', selectedBlog['secondary_text_field'])



  }, [selectedBlog]);





  return (
    <Dialog
      scroll='body'
      open={show}
      onClose={handleclose}

      // fullScreen='true'
      aria-labelledby='user-view-plans'
      aria-describedby='user-view-plans-description'
      sx={{
        '& .MuiPaper-root': { width: '100%', maxWidth: '90%', maxHeight: '100vh' },
        '& .MuiDialogTitle-root ~ .MuiDialogContent-root': { pt: theme => `${theme.spacing(2)} !important` }
      }}
    >
      <DialogTitle id='user-view-plans' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        <Grid container item xs={12} justifyContent='space-between' alignItems='center'>

          Edit Blog
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

        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)} >
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

                  label='Primery Image'
                  {...register('primary_image')}
                  type='file'
                  size='small'
                  placeholder='Primery Image'
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
            <div style={{ width: '100%', marginBottom: '5px', display: 'flex' }}>
              <p style={{ marginRight: '10px' }}>privious primary Photo</p>

              <img style={{ width: '100px', height: '100px' }} src={selectedBlog.secondary_image} alt='Primary Image' />
            </div>
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

      </DialogContent>

    </Dialog>
  )
}

