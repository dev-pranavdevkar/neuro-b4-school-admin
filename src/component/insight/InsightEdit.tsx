
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
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'


import Icon from 'src/@core/components/icon'
import { Grid } from '@mui/material'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, } from 'react-hook-form'
import { useRouter } from "next/router";

const schema = yup.object().shape({
    option_id: yup.string().required('Option Tage is required'),
    content: yup.string().required('Content is required'),

});

export default function InsightEditPopup({ show, handleclose, selectedInsight }) {

    const [loading, setLoading] = useState(false)
    const [optionTypes, setOptionTypes] = useState([]);


    const {
        control,
        register,
        setValue,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema), })



    const router = useRouter()

    const onSubmit = async (data: any) => {
        const id = selectedInsight.id

        setLoading(true)
        try {
            const staticPage = await axiosInstance.post(
                `/admin/insight/update/${id}`,
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
            toast.error('Option Type Could Not Eddited', {
                position: 'top-center',
            })
            setLoading(false)
        }

    }
    const fetchData = async () => {

        try {
            const response = await axiosInstance.get(`/admin/optionType/getAll`)
            setOptionTypes(response.data?.data)
        }
        catch (error) {
            return (error)
        }
    };

    useEffect(() => {
        setValue('content', selectedInsight['content'])
        setValue('option_id', selectedInsight['option_id'])
        fetchData()
    }, []);

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

                    Insight
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

                                    label='content '
                                    {...register('content')}

                                    size='small'
                                    placeholder=''
                                    error={Boolean(errors.content)}
                                    aria-describedby='validation-async-content'
                                />

                                {errors.content && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-content'>
                                        {errors.content.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>

                            <FormControl fullWidth size='small'>
                                <InputLabel
                                    id='validation-basic-attribute_type'
                                    error={Boolean(errors.option_id)}
                                    htmlFor='validation-basic-option_id'
                                >
                                    Option Type
                                </InputLabel>

                                <Select

                                    label=' Option Type'
                                    {...register('option_id')}
                                    error={Boolean(errors.attribute_type)}
                                    labelId='validation-option_id'
                                    aria-describedby='validation-option_id'

                                >

                                    {optionTypes && optionTypes.map((item, index) => (<MenuItem value={item.id} key={index} defaultValue={selectedInsight.option_tag}>{item.option_tag}</MenuItem>))}


                                </Select>

                                {errors.option_id && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-option_id'>
                                        {errors.option_id.message}
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

            </DialogContent>

        </Dialog>
    )
}

