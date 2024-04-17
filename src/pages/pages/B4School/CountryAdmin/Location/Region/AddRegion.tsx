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

interface Region {

  name: string;
  country_code: string;
  state_code: string;
  city_code: string;




}

interface AddRegion {
  onSubmit: (data: Region) => void;
}

const schema = yup.object().shape({
  name: yup.string().required('Branch Name is Required'),
  facebook_url: yup.string().nullable(),
  instagram_url: yup.string().nullable(),
  google_plus_url: yup.string().nullable(),
  linkedin_url: yup.string().nullable(),
  twitter_url: yup.string().nullable(),
  telegram_url: yup.string().nullable(),
  title: yup.string().nullable()

});

export default function AddRegion() {
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
  const [optionTypes, setOptionTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [StateOptionTypes, setStateOptionTypes] = useState([]);
  const [CityOptionTypes, setCityOptionTypes] = useState([]);
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
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
      const staticPage = await axiosInstance.post(
        `/admin/v1/region/create`,
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
      toast.error('City Could Not Added', {
        position: 'top-center',
      })
      setLoading(false)
    }

  }

  const fetchCountry = async () => {

    try {
      const response = await axiosInstance.get(`/admin/v1/country/getAllWithoutLimit`)
      setOptionTypes(response.data?.data)
    }
    catch (error) {
      return (error)
    }
  };
  useEffect(() => {
    fetchCountry();
  }, []);

  const handleCountrySelect = (id:any) => {
    setSelectedCountry(id);
    axiosInstance.get(`admin/v1/country/get/${id}`)
        .then((response) => {
            setStates(response.data.data.States ? response.data.data.States : []);
            console.log(states);
        })
        .catch((error) => {
            console.error('Error fetching states:', error);
        });
};


  const handleStateSelect = (id:any) => {
    setSelectedState(id);
    axiosInstance.get(`admin/v1/state/get/${id}`)
        .then((response) => {
            setCities(response.data.data.Cities ? response.data.data.Cities : []);
        })
        .catch((error) => {
            console.error('Error fetching cities:', error);
        });
};


  // const fetchState = async () => {

  //   try {
  //     const response = await axiosInstance.get(`/admin/v1/state/getAllWithoutLimit`)
  //     setStateOptionTypes(response.data?.data)
  //   }
  //   catch (error) {
  //     return (error)
  //   }
  // };
  // useEffect(() => {
  //   fetchState();
  // }, []);

  // const fetchCity = async () => {

  //   try {
  //     const response = await axiosInstance.get(`/admin/v1/city/getAllWithoutLimit`)
  //     setCityOptionTypes(response.data?.data)
  //   }
  //   catch (error) {
  //     return (error)
  //   }
  // };
  // useEffect(() => {
  //   fetchCity();
  // }, []);

  return (
    <Card>
      <CardHeader title='Add Branch' />
      <CardContent>
      
        <form onSubmit={handleSubmit(onSubmit)} >
          <Grid container spacing={5}>

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

                  label='  Select Country'
                  {...register('country_code')}
                  error={Boolean(errors.attribute_type)}
                  labelId='validation-country_code'
                  aria-describedby='validation-country_code'
                  value={selectedCountry}
                  onChange={(e) => handleCountrySelect(e.target.value)}
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

              <FormControl fullWidth size='small'>
                <InputLabel
                  id='validation-basic-attribute_type'
                  error={Boolean(errors.state_code)}
                  htmlFor='validation-basic-state_code'
                >
                  Select State
                </InputLabel>

                <Select

                  label=' Select State'
                  {...register('state_code')}
                  error={Boolean(errors.attribute_type)}
                  labelId='validation-state_code'
                  aria-describedby='validation-state_code'
                  value={selectedState}
                  onChange={(e) => handleStateSelect(e.target.value)}
                >
                  {states.map((item, index) => (<MenuItem value={item.id} key={index} >{item.name}</MenuItem>))}


                </Select>

                {errors.country_code && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-country_code'>
                    {errors.state_code.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>

              <FormControl fullWidth size='small'>
                <InputLabel
                  id='validation-basic-attribute_type'
                  error={Boolean(errors.city_code)}
                  htmlFor='validation-basic-city_code'
                >
                  Select City
                </InputLabel>

                <Select

                  label=' Select City'
                  {...register('city_code')}
                  error={Boolean(errors.attribute_type)}
                  labelId='validation-city_code'
                  aria-describedby='validation-city_code'
                >
                  {cities.map((item, index) => (<MenuItem value={item.id} key={index} >{item.name}</MenuItem>))}


                </Select>

                {errors.city_code && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-country_code'>
                    {errors.city_code.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Branch Name'
                  {...register('name')}

                  size='small'
                  placeholder='Branch Name'
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

                  label='Branch Email ID'
                  {...register('email')}

                  size='small'
                  placeholder='Branch Email ID'
                  error={Boolean(errors.email)}
                  aria-describedby='validation-async-email'
                />

                {errors.email && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-email'>
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
                  error={Boolean(errors.mobile_number)}
                  aria-describedby='validation-async-mobile_number'
                />

                {errors.mobile_number && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-mobile_number'>
                    {errors.mobile_number.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Address'
                  {...register('address')}

                  size='small'
                  placeholder='Address'
                  error={Boolean(errors.address)}
                  aria-describedby='validation-async-address'
                  multiline
                  maxRows={2}
                />

                {errors.address && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-address'>
                    {errors.address.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Google Map URL'
                  {...register('map')}

                  size='small'
                  placeholder='Google Map URL'
                  error={Boolean(errors.map)}
                  aria-describedby='validation-async-map'
               
                />

                {errors.address && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-map'>
                    {errors.map.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='Facebook Page URL'
                  {...register('facebook_url')}

                  size='small'
                  placeholder='Facebook Page URL'
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

                  label='Instagram Page URL'
                  {...register('instagram_url')}

                  size='small'
                  placeholder='Instagram Page URL'
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

                  label='Google Plus URL'
                  {...register('google_plus_url')}

                  size='small'
                  placeholder='Google Plus URL'
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

                  label='Telegram URL'
                  {...register('telegram_url')}

                  size='small'
                  placeholder='Telegram URL'
                  error={Boolean(errors.telegram_url)}
                  aria-describedby='validation-async-telegram_url'
                />

                {errors.telegram_url && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-telegram_url'>
                    {errors.telegram_url.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
         
            <Grid item xs={12}>
              <FormControl fullWidth>




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
