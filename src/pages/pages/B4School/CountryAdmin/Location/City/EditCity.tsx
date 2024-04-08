
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


interface State {

  name: string;
  country_code: string;
  state_code: string;

}

interface UpdateState {
  onSubmit: (data: State) => void;
}

const schema = yup.object().shape({
  name: yup.string().required('City Name is Required'),

});

export default function EditCity({ show, handleclose, selectedCountryPage }) {

  const [loading, setLoading] = useState(false)
  const [editorData, setEditorData] = useState();
  const [selectedCountry, setSelectedCountry] = useState(selectedCountryPage.country_code);
  const [selectedState, setSelectedState] = useState(selectedCountryPage.state_code);
  const [states, setStates] = useState([]);
  const [statesData, setStatesData] = useState([]);
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
  console.log("selectedCountryPage,selectedCountryPage", selectedCountryPage)
  useEffect(() => {
    setValue('country_code', selectedCountryPage['country_code'])

  }, [selectedCountryPage]);

  useEffect(() => {
    if (selectedCountryPage?.country_code){
      handleCountrySelect(selectedCountryPage?.country_code)
    }
  },[selectedCountryPage?.country_code])

  const wrapperStyle = {
    border: "1px solid #F1F1F1",
    padding: "5px",
  };
  const onEditorStateChange = (e) => {
    setEditorState(e);
  };


  const [StateOptionTypes, setStateOptionTypes] = useState([]);
  const router = useRouter()

  const onSubmit = async (data: any) => {
    const id = selectedCountryPage.id


    setLoading(true)
    try {
      const CountryAdmin = await axiosInstance.post(
        `/admin/v1/city/update/${id}`,
        { ...data }
      ).then((response) => {
        setLoading(false)
        const data = response.data
        console.log("data,data")
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
    setValue('name', selectedCountryPage['name'])
    setValue('country_code', selectedCountryPage['country_code'])
    setValue('state_code', selectedCountryPage['state_code'])
    


  }, [selectedCountryPage]);

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

          Edit State
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
                  {...register('state_code')}
                  error={Boolean(errors.attribute_type)}
                  labelId='validation-state_code'
                  aria-describedby='validation-state_code'
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
                  defaultValue={selectedState}
                >
                  {states.map((item, index) => (<MenuItem value={item.id} key={index} >{item.name}</MenuItem>))}


                </Select>

                {errors.state_code && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-state_code'>
                    {errors.state_code.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>

                <TextField

                  label='State Name'
                  {...register('name')}

                  size='small'
                  placeholder='State'
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

