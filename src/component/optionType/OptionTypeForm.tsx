import React, { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, } from 'react-hook-form'
import axiosInstance from "src/services/axios";
import { useRouter } from "next/router";


interface optionType {
    id: number;
    option_tag: string;

}

interface optionTypeFormProps {
    onSubmit: (data: staticPage) => void;
}

const schema = yup.object().shape({
    option_tag: yup.string().required('option tag is required'),
});

export default function OptionTypeForm() {
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema), })

    const router = useRouter()

    const onSubmit = async (data: any) => {

        setLoading(true)
        try {
            const staticPage = await axiosInstance.post(
                `/admin/optionType/create`,
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


    useEffect(() => {
    }, []);

    return (
        <Card>
            <CardHeader title='Add Option ' />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Grid container spacing={5}>
                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField

                                    label='Option Tag '
                                    {...register('option_tag')}

                                    size='small'
                                    placeholder='skv'
                                    error={Boolean(errors.option_tag)}
                                    aria-describedby='validation-async-option_tag'
                                />

                                {errors.option_tag && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-option_tag'>
                                        {errors.option_tag.message}
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
