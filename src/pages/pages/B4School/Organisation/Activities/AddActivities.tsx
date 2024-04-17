import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import { useForm } from 'react-hook-form';
import axiosInstance from 'src/services/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    category: yup.string().required('Activity category is Required'),
    image: yup.mixed().required('Image is Required')
});

export default function StaticPageForm() {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: yupResolver(schema) });
    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('category', data.category);
            formData.append('image', data.image[0]); // Assuming you want to upload only one image
            const staticPage = await axiosInstance.post(
                `/admin/v1/gallery/create`,
                formData
            );
            setLoading(false);
            const responseData = staticPage.data;
            if (responseData.success) {
                toast.success(responseData.message, {
                    position: 'top-center'
                });
            } else {
                toast.error(responseData.message, {
                    position: 'top-center'
                });
            }
            router.back();
        } catch (error) {
            console.error(error);
            toast.error('Static Page Could Not Be Added', {
                position: 'top-center'
            });
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader title="Add Activity" />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={5}>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Selected Category"
                                    {...register('category')}
                                    size="small"
                                    placeholder="Category"
                                    error={Boolean(errors.category)}
                                    helperText={errors.category && errors.category.message}
                                />
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
                                {errors.image && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-image'>
                                        {errors.image.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                size="large"
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading && (
                                    <CircularProgress
                                        sx={{
                                            color: 'common.white',
                                            width: '20px !important',
                                            height: '20px !important',
                                            mr: theme => theme.spacing(2)
                                        }}
                                    />
                                )}
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
}
