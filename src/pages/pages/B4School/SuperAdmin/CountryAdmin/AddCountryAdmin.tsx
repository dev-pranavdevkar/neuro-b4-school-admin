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
interface CountryAdmin {

  name: string;
  email: string;
  mobile_number: string;
  password: string;
  confirm_password: string;
  country_code: number;
}

interface AddCountryPopup {
  onSubmit: (data: CountryAdmin) => void;
}

const schema = yup.object().shape({
  name: yup.string().required('Admin Name is Required'),
  email: yup.string().required('Email ID is Required'),
  mobile_number: yup.string().required('Mobile Number is Required'),
  password: yup.string().required('Password is Required'),
  confirm_password: yup.string().required('Confirm Password is Required'),
  country_code: yup.string().required('Country Code is Required'),

});

export default function AddCountryAdmin() {
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
      const CountryAdmin = await axiosInstance.post(
        `/admin/v1/countryAdmin/create`,
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
      toast.error('Country Admin Could Not Added', {
        position: 'top-center',
      })
      setLoading(false)
    }

  }


  const fetchData = async () => {

    try {
      const response = await axiosInstance.get(`/admin/v1/country/getAllWithoutLimit`)
      setOptionTypes(response.data?.data)
    }
    catch (error) {
      return (error)
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader title='Add Country Admin' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} >
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Admin Name'
                  {...register('name')}

                  size='small'
                  placeholder='Admin Name'
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

                  label='Email ID'
                  {...register('email')}

                  size='small'
                  placeholder='Email ID'
                  error={Boolean(errors.name)}
                  aria-describedby='validation-async-name'
                />

                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-name'>
                    {errors.email.message}
                  </FormHelperText>
                )}

              </FormControl>

            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Mobile Number'
                  {...register('mobile_number')}

                  size='small'
                  placeholder='Mobile Number'
                  error={Boolean(errors.name)}
                  aria-describedby='validation-async-name'
                />

                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-name'>
                    {errors.mobile_number.message}
                  </FormHelperText>
                )}

              </FormControl>

            </Grid>
            <Grid item xs={4}>

              <FormControl fullWidth size='small'>
                <InputLabel
                  id='validation-basic-attribute_type'
                  error={Boolean(errors.country_code)}
                  htmlFor='validation-basic-country_code'
                >
                 Select Country
                </InputLabel>

                <Select

                  label=' Select Country'
                  {...register('country_code')}
                  error={Boolean(errors.attribute_type)}
                  labelId='validation-country_code'
                  aria-describedby='validation-country_code'
                >
                  {optionTypes && optionTypes.map((item, index) => (<MenuItem value={item.id} key={index} >{item.name}</MenuItem>))}


                </Select>

                {errors.country_code && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-country_code'>
                    {errors.country_code.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Password'
                  {...register('password')}

                  size='small'
                  placeholder='Password'
                  error={Boolean(errors.name)}
                  aria-describedby='validation-async-name'
                />

                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-name'>
                    {errors.password.message}
                  </FormHelperText>
                )}

              </FormControl>

            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Confirm Password'
                  {...register('confirm_password')}

                  size='small'
                  placeholder='Confirm Password'
                  error={Boolean(errors.name)}
                  aria-describedby='validation-async-name'
                />

                {errors.name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-name'>
                    {errors.confirm_password.message}
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
