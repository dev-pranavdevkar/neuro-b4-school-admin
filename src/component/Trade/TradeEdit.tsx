
import React, { useEffect, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DialogContent from '@mui/material/DialogContent'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'

import axiosInstance from 'src/services/axios'


import Icon from 'src/@core/components/icon'
import { Grid } from '@mui/material'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from "next/router";


const schema = yup.object().shape({
    option_id: yup.string().required('This is required'),
    CE_PE: yup.string().required('This is required'),
    strike_price: yup.string().required('This is required'),
    buy_between_start: yup.string().required('This is required'),
    buy_between_end: yup.string().required('This is required'),
    SL: yup.string().required('This is required'),
    T1: yup.string().required('This is required'),
    T2: yup.string().required('This is required'),
    T3: yup.string().required('This is required'),
});

export default function TradeEditPopup({ show, handleclose, selectedTrade }) {

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
        const id = selectedTrade.id

        setLoading(true)
        try {
            const TradeEdit = await axiosInstance.post(
                `/admin/tradeCall/update/${id}`,
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
            toast.error(' Could Not Eddited', {
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
        setValue('CE_PE', selectedTrade['CE_PE'])
        setValue('option_id', selectedTrade['option_id'])
        setValue('strike_price', selectedTrade['strike_price'])
        setValue('buy_between_start', selectedTrade['buy_between_start'])
        setValue('buy_between_end', selectedTrade['buy_between_end'])
        setValue('SL', selectedTrade['SL'])
        setValue('T2', selectedTrade['T2'])
        setValue('T1', selectedTrade['T1'])
        setValue('T3', selectedTrade['T3'])
        fetchData();


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

                    Static Page
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
                        <Grid item xs={4}>
                            <FormControl fullWidth size='small'>
                                <InputLabel
                                    id='validation-basic-attribute_type'
                                    error={Boolean(errors.attribute_type)}
                                    htmlFor='validation-basic-attribute_type'
                                >
                                    CE PE
                                </InputLabel>

                                <Select

                                    label=' CE/PE'
                                    {...register('CE_PE')}
                                    error={Boolean(errors.CE_PE)}
                                    labelId='validation-CE_PE'
                                    aria-describedby='validation-CE_PE'
                                    defaultValue={selectedTrade.CE_PE}
                                >
                                    <MenuItem value='CE'>CE</MenuItem>
                                    <MenuItem value='PE'>PE</MenuItem>

                                </Select>

                                {errors.CE_PE && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-CE_PE'>
                                        {errors.CE_PE.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField

                                    label='Strike Price '
                                    {...register('strike_price')}
                                    type='number'
                                    size='small'
                                    placeholder=''
                                    error={Boolean(errors.strike_price)}
                                    aria-describedby='validation-async-strike_price'
                                />

                                {errors.strike_price && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-strike_price'>
                                        {errors.strike_price.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField

                                    label='Buy Between Start Price '
                                    {...register('buy_between_start')}
                                    type='number'
                                    size='small'
                                    placeholder=''
                                    error={Boolean(errors.buy_between_start)}
                                    aria-describedby='validation-async-buy_between_start'
                                />

                                {errors.buy_between_start && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-buy_between_start'>
                                        {errors.buy_between_start.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField
                                    type='number'
                                    label='Buy Between end price'
                                    {...register('buy_between_end')}

                                    size='small'
                                    placeholder=''
                                    error={Boolean(errors.buy_between_end)}
                                    aria-describedby='validation-async-buy_between_end'
                                />

                                {errors.buy_between_end && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-buy_between_end'>
                                        {errors.buy_between_end.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField

                                    label='Stop Loss '
                                    {...register('SL')}
                                    type='number'
                                    size='small'
                                    placeholder=''
                                    error={Boolean(errors.SL)}
                                    aria-describedby='validation-async-SL'
                                />

                                {errors.SL && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-SL'>
                                        {errors.SL.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField

                                    label='Target 1'
                                    {...register('T1')}
                                    type='number'
                                    size='small'
                                    placeholder=''
                                    error={Boolean(errors.T1)}
                                    aria-describedby='validation-async-T1'
                                />

                                {errors.T1 && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-T1'>
                                        {errors.T1.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    type='number'

                                    label='Target 2 '
                                    {...register('T2')}

                                    size='small'
                                    placeholder=''
                                    error={Boolean(errors.T2)}
                                    aria-describedby='validation-async-T2'
                                />

                                {errors.T2 && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-T2'>
                                        {errors.T2.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField
                                    type='number'
                                    label='Target 3'
                                    {...register('T3')}

                                    size='small'
                                    placeholder=''
                                    error={Boolean(errors.T3)}
                                    aria-describedby='validation-async-T3'
                                />

                                {errors.T3 && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-T3'>
                                        {errors.T3.message}
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

