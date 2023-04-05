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

interface CountryPage {
    id: number;
    name: string;

}

interface AddCountryPopup {
    onSubmit: (data: CountryPage) => void;
}

const schema = yup.object().shape({
    name: yup.string().required('Country Name is Required'),

});

export default function StaticPageForm() {
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


    const onSubmit = async (data: any) => {

        setLoading(true)
        try {
            const staticPage = await axiosInstance.post(
                `/admin/v1/country/create`,
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
            toast.error('Static Page Could Not Added', {
                position: 'top-center',
            })
            setLoading(false)
        }

    }




    return (
        <Card>
            <CardHeader title='Add Country' />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Grid container spacing={5}>
                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField

                                    label='Country Name'
                                    {...register('name')}

                                    size='small'
                                    placeholder='Country'
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