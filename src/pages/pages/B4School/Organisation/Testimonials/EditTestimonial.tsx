
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

interface CountryAdmin {
  name: string;
  country_code: string;

}

interface UpdateCountryAdmin {
  onSubmit: (data: CountryAdmin) => void;
}

const schema = yup.object().shape({
  name: yup.string().required(' Name is required'),
  country_code: yup.string().required(' Country is required'),

});

export default function EditTestimonial({ show, handleclose, selectedTestimonialPage }) {
console.log("Index selectedTestimonialPage",selectedTestimonialPage)
  const [loading, setLoading] = useState(false)
  const [editorData, setEditorData] = useState();
  const [pageContent, setPageContent] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [branch, setBranchData] = useState([]);

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
  console.log(selectedTestimonialPage)
  useEffect(() => {
    setValue('country_code', selectedTestimonialPage['country_code'])

  }, [selectedTestimonialPage]);
  const wrapperStyle = {
    border: "1px solid #F1F1F1",
    padding: "5px",
  };
  const onEditorStateChange = (e) => {
    setEditorState(e);
  };


  const router = useRouter()

  const onSubmit = async (data: any) => {
    const id = selectedTestimonialPage.id
    console.log("selectedTestimonialPage.id", selectedTestimonialPage)
    setLoading(true)
    try {
      const CountryAdmin = await axiosInstance.post(
        `admin/v1/ourTestimonial/updateTestimonial/${id}`,
        { ...data }
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
      toast.error('Testimonial  Could Not Eddited', {
        position: 'top-center',
      })
      setLoading(false)
    }

  }

  useEffect(() => {
    setValue('name', selectedTestimonialPage['name'])
    setValue('position', selectedTestimonialPage['position'])
    setValue('image', selectedTestimonialPage['image'])
    setValue('subject', selectedTestimonialPage['subject'])
    setValue('comment', selectedTestimonialPage['comment'])
    setValue('skills', selectedTestimonialPage['skills'])
    setValue('facebook_url', selectedTestimonialPage['facebook_url'])
    setValue('instagram_url', selectedTestimonialPage['instagram_url'])
    setValue('google_plus_url', selectedTestimonialPage['google_plus_url'])
    setValue('twitter_url', selectedTestimonialPage['twitter_url'])
    setValue('linkedin_url', selectedTestimonialPage['linkedin_url'])
    setValue('isSuperAdmin', selectedTestimonialPage['isSuperAdmin'])
    setValue('region_id', selectedTestimonialPage['region_id'])
   
  }, [selectedTestimonialPage]);

  const fetchData = async () => {

    try {
      const response = await axiosInstance.get(`/admin/v1/region/getAllWithoutLimit`)
      setBranchData(response.data?.data)
    }
    catch (error) {
      return (error)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // ====================================


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Dialog
      scroll='body'
      open={show}
      onClose={handleclose}

      // fullScreen='true'
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

        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)} >
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

                  label=' Select Country'
                  {...register('branch_id')}
                  error={Boolean(errors.attribute_type)}
                  labelId='validation-country_code'
                  aria-describedby='validation-branch_id'
                  defaultValue={selectedTestimonialPage.id}

                >
                  {branch.map((item, index) => (<MenuItem value={item.id} key={index} >{item.name}</MenuItem>))}

                </Select>

                {errors.branch_id && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-branch_id'>
                    {errors.branch_id.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Name'
                  {...register('name')}

                  size='small'
                  placeholder='Name'
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

                  label='Job Role'
                  {...register('position')}

                  size='small'
                  placeholder='Job Role'
                  error={Boolean(errors.position)}
                  aria-describedby='validation-async-position'
                />

                {errors.position && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-position'>
                    {errors.position.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Subject'
                  {...register('subject')}

                  size='small'
                  placeholder='Subject'
                  error={Boolean(errors.subject)}
                  aria-describedby='validation-async-subject'
                />

                {errors.subject && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-subject'>
                    {errors.subject.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Facebook URL'
                  {...register('facebook_url')}

                  size='small'
                  placeholder='Facebook URL'
                  error={Boolean(errors.facebook_url)}
                  aria-describedby='validation-async-facebook_url'
                />

                {errors.facebook_url && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-facebook_url'>
                    {errors.facebook_url.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Instagram URL'
                  {...register('instagram_url')}

                  size='small'
                  placeholder='Instagram URL'
                  error={Boolean(errors.instagram_url)}
                  aria-describedby='validation-async-instagram_url'
                />

                {errors.instagram_url && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-instagram_url'>
                    {errors.instagram_url.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Google/G-Mail Id'
                  {...register('google_plus_url')}

                  size='small'
                  placeholder='Google/G-Mail Id'
                  error={Boolean(errors.google_plus_url)}
                  aria-describedby='validation-async-google_plus_url'
                />

                {errors.google_plus_url && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-google_plus_url'>
                    {errors.google_plus_url.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Twitter URL'
                  {...register('twitter_url')}

                  size='small'
                  placeholder='Twitter URL'
                  error={Boolean(errors.twitter_url)}
                  aria-describedby='validation-async-twitter_url'
                />

                {errors.twitter_url && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-twitter_url'>
                    {errors.twitter_url.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Linkedin URL'
                  {...register('linkedin_url')}

                  size='small'
                  placeholder='Linkedin URL'
                  error={Boolean(errors.linkedin_url)}
                  aria-describedby='validation-async-linkedin_url'
                />

                {errors.linkedin_url && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-linkedin_url'>
                    {errors.linkedin_url.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Description'
                  {...register('comment')}

                  size='small'
                  placeholder='Description'
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

            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Skills'
                  {...register('skills')}

                  size='small'
                  placeholder='Skills'
                  error={Boolean(errors.skills)}
                  aria-describedby='validation-async-skills'
                  multiline
                  minRows={5}
                />

                {errors.skills && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-skills'>
                    {errors.skills.message}
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

