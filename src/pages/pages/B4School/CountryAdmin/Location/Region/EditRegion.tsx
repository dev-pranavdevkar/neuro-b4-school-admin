
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


interface Region {

  name: string;
  country_code: string;
  state_code: string;

}

interface UpdateRegion {
  onSubmit: (data: Region) => void;
}

const schema = yup.object().shape({
  name: yup.string().required('Region Name is Required'),

});

export default function EditRegion({ show, handleclose, selectedRegion }) {

  const [loading, setLoading] = useState(false)
  const [editorData, setEditorData] = useState();
  const [pageContent, setPageContent] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
console.log("selectedRegion",selectedRegion)
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
  console.log(selectedRegion)
  useEffect(() => {
    setValue('country_code', selectedRegion['country_code'])

  }, [selectedRegion]);

  useEffect(() => {
    fetchCountry();
  }, []);
  const wrapperStyle = {
    border: "1px solid #F1F1F1",
    padding: "5px",
  };
  const onEditorStateChange = (e) => {
    setEditorState(e);
  };

  const [optionTypes, setOptionTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [CityOptionTypes, setCityOptionTypes] = useState([]);
  const [StateOptionTypes, setStateOptionTypes] = useState([]);
  // const [selectedCountry, setSelectedCountry] = useState('');
  // const [selectedState, setSelectedState] = useState('');


  const [selectedCountry, setSelectedCountry] = useState(selectedRegion.country_code);
  const [selectedState, setSelectedState] = useState(selectedRegion.state_code);
  const [selectedCity, setSelectedCity] = useState(selectedRegion.city_code);
  const router = useRouter()

  const onSubmit = async (data: any) => {
    const id = selectedRegion.id

    setLoading(true)
    try {
      const CountryAdmin = await axiosInstance.post(
        `/admin/v1/region/update/${id}`,
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
      toast.error('City Could Not Eddited', {
        position: 'top-center',
      })
      setLoading(false)
    }

  }

  useEffect(() => {
    if (selectedRegion) {
      setValue('name', selectedRegion.name);
      setValue('country_code', selectedRegion.country_code);
      setValue('state_code', selectedRegion.state_code);
      setValue('city_code', selectedRegion.city_code);
      setValue('email', selectedRegion.email);
      setValue('mobile_number', selectedRegion.mobile_number);
      setValue('address', selectedRegion.address);
      setValue('map', selectedRegion.map);
      setValue('facebook_url', selectedRegion.facebook_url);
      setValue('instagram_url', selectedRegion.instagram_url);
      setValue('google_plus_url', selectedRegion.google_plus_url);
      setValue('linkedin_url', selectedRegion.linkedin_url);
      setValue('twitter_url', selectedRegion.twitter_url);
      setValue('telegram_url', selectedRegion.telegram_url);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion?.country_code){
      handleCountrySelect(selectedRegion?.country_code)
      
    }
  },[selectedRegion?.country_code])

  useEffect(() => {
    if (selectedRegion?.state_code){
      handleStateSelect(selectedRegion?.state_code)
      
    }
  },[selectedRegion?.state_code])

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

          Edit Region
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
                  Select Country
                </InputLabel>

                <Select

                  label='  Select Country'
                  {...register('country_code')}
                  error={Boolean(errors.attribute_type)}
                  labelId='validation-country_code'
                  aria-describedby='validation-country_code'
                  value={selectedCountry}
                  defaultValue=''
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
                  defaultValue=''
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
                  value={selectedCity}
                  defaultValue=''
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
                  placeholder='Branch Namety'
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

