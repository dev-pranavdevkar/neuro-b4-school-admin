
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


interface staticPage {
    id: number;
    page_name: string;
    page_content: string;
}

interface staticPageFormProps {
    onSubmit: (data: staticPage) => void;
}

const schema = yup.object().shape({
    page_name: yup.string().required('page Name is required'),

    page_content: yup.string().required('Content is required'),
});

export default function StaticPageEditPopup({ show, handleclose, selectedStaticPage }) {

    const [loading, setLoading] = useState(false)
    const [editorData, setEditorData] = useState();
    const [pageContent, setPageContent] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

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

    useEffect(() => {
        setValue('page_name', selectedStaticPage['page_name'])
        setValue('page_content', selectedStaticPage['page_content'])
        // setEditorData(selectedStaticPage['page_content'])
        setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(selectedStaticPage.page_content))));


    }, [selectedStaticPage]);
    const wrapperStyle = {
        border: "1px solid #F1F1F1",
        padding: "5px",
    };
    const onEditorStateChange = (e) => {
        setEditorState(e);
    };


    const router = useRouter()

    const onSubmit = async (data: any) => {
        const id = selectedStaticPage.id

        setLoading(true)
        try {
            const staticPage = await axiosInstance.post(
                `/admin/staticPages/update/${id}`,
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
            toast.error('Static Page Could Not Eddited', {
                position: 'top-center',
            })
            setLoading(false)
        }

    }

    useEffect(() => {
        setValue('page_name', selectedStaticPage['page_name'])
        setValue('page_content', selectedStaticPage['page_content'])
        setEditorData(selectedStaticPage['page_content'])

    }, [selectedStaticPage]);

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
                            <FormControl fullWidth>

                                <TextField

                                    label='Page Name'
                                    {...register('page_name')}

                                    size='small'
                                    placeholder='skv'
                                    error={Boolean(errors.page_name)}
                                    aria-describedby='validation-async-page_name'
                                />

                                {errors.page_name && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-page_name'>
                                        {errors.page_name.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                {/* 
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={editorData}
                                    value={editorData}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setPageContent(data);
                                        setValue('page_content', data);
                                    }}
                                /> */}
                                <div style={wrapperStyle}>

                                    <Editor
                                        editorState={editorState}
                                        toolbarClassName="toolbarClassName"
                                        wrapperClassName="wrapperClassName"
                                        editorClassName="editorClassName"
                                        onEditorStateChange={onEditorStateChange}
                                    />


                                </div>

                                {errors.family_code && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-family_code'>
                                        {errors.family_code.message}
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

