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
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, } from 'react-hook-form'
import axiosInstance from "src/services/axios";
import { useRouter } from "next/router";




const schema = yup.object().shape({
    content: yup.string().required('content tag is required'),
    option_id: yup.string().required('This is required'),
});

export default function InsightForm() {
    const [loading, setLoading] = useState(false)
    const [optionTypes, setOptionTypes] = useState([]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema), })

    const router = useRouter()

    const onSubmit = async (data: any) => {

        setLoading(true)
        try {
            const staticPage = await axiosInstance.post(
                `/admin/insight/create`,
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
            toast.error('Static Could Not Added', {
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
        fetchData();
    }, []);

    return (
        <Card>
            <CardHeader title='Add Insight ' />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} >
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
                                    {optionTypes && optionTypes.map((item, index) => (<MenuItem value={item.id} key={index} >{item.option_tag}</MenuItem>))}


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
            </CardContent>
        </Card>
    )
}
