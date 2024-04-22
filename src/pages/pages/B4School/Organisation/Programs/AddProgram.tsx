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
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import dynamic from 'next/dynamic';


interface Program {
  name: string;
  isShowOnHomePage: boolean;
}

interface AddCountryPopup {
  onSubmit: (data: Program) => void;
}

const schema = yup.object().shape({
  name: yup.string().required('Program  Name is Required'),

});

export default function AddProgram() {
  const [loading, setLoading] = useState(false)
  const [editorData, setEditorData] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isShowOnHomePage, setIsShowOnHomePage] = useState(false);
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
  const [branch, setBranch] = useState([]);
  const router = useRouter()
  const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false }
  )
  const wrapperStyle = {
    border: "1px solid #F1F1F1",
    padding: "5px",
  };


  const onSubmit = async (data: any) => {

    setLoading(true)
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      const formData = new FormData();
      formData.append('image', data.image[0])
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('region_id', data.region_id)
      formData.append('isShowOnHomePage', isShowOnHomePage);
console.log(data);

      const staticPage = await axiosInstance.post(
        `/admin/v1/ourProgram/create`,
        formData,
        config
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
      toast.error('Program Could Not Added', {
        position: 'top-center',
      })
      setLoading(false)
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

  // ====================================

    // Handle checkbox change
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // Update isShowOnHomePage based on the checkbox state
      setIsShowOnHomePage(event.target.checked);

  };
  console.log("isShowOnHomePage", isShowOnHomePage);
  return (
    <Card>
      <CardHeader title='Add Program' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} >
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
                  InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*' }}

                />
                <p></p>
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
      </CardContent>
    </Card>
  )
}
