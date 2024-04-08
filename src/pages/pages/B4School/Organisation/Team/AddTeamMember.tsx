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


interface TeamMember {
    name: string;
}

interface AddCountryPopup {
    onSubmit: (data: TeamMember) => void;
}

const schema = yup.object().shape({
    name: yup.string().required('Team Member Name is Required'),

});

export default function AddTeamMember() {
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
    const [branch, setBranch] = useState([]);
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
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('image', data.image[0]); // Assuming you want to upload only one image
            const staticPage = await axiosInstance.post(
                `/admin/v1/ourTeam/create`,
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
            if (error.response && error.response.status === 403) {
                for (const key in error.response.data.data) {
                    setError(key, { type: "manual", message: error.response.data.data[key].join(',') });
                }
            } else {
                toast.error('TeamMember Could Not Be Added', {
                    position: 'top-center',
                });
            }
            setLoading(false);
        }
    };
    


    const fetchData = async () => {

        try {
            const response = await axiosInstance.get(`/admin/v1/region/getAllWithoutLimit`)
            setBranch(response.data?.data)
        }
        catch (error) {
            return (error)
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

// ====================================


    return (
        <Card>
            <CardHeader title='Add Add Team Member' />
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
                                    Select Branch
                                </InputLabel>

                                <Select

                                    label=' Select Branch'
                                    {...register('region_id')}
                                    error={Boolean(errors.attribute_type)}
                                    labelId='validation-region_id'
                                    aria-describedby='validation-region_id'
                                >
                                    {branch.map((item, index) => (<MenuItem value={item.id} key={index} >{item.name}</MenuItem>))}


                                </Select>

                                {errors.region_id && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-region_id'>
                                        {errors.region_id.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField

                                    label='Member Name'
                                    {...register('name')}

                                    size='small'
                                    placeholder='Member Name'
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

                                    label='Job Role'
                                    {...register('position')}

                                    size='small'
                                    placeholder='Job Role'
                                    error={Boolean(errors.position)}
                                    aria-describedby='validation-async-position'
                                />

                                {errors.position && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-position'>
                                        {errors.position.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField

                                    label='Subject'
                                    {...register('subject')}

                                    size='small'
                                    placeholder='Subject'
                                    error={Boolean(errors.subject)}
                                    aria-describedby='validation-async-subject'
                                />

                                {errors.subject && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-subject'>
                                        {errors.subject.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField

                                    label='Facebook URL'
                                    {...register('facebook_url')}

                                    size='small'
                                    placeholder='Facebook URL'
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

                                    label='Instagram URL'
                                    {...register('instagram_url')}

                                    size='small'
                                    placeholder='Instagram URL'
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

                                    label='Google/G-Mail Id'
                                    {...register('google_plus_url')}

                                    size='small'
                                    placeholder='Google/G-Mail Id'
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

                                    label='Description'
                                    {...register('description')}

                                    size='small'
                                    placeholder='Description'
                                    error={Boolean(errors.description)}
                                    aria-describedby='validation-async-description'
                                    multiline
                                    minRows={5}
                                />

                                {errors.description && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-description'>
                                        {errors.description.message}
                                    </FormHelperText>
                                )}

                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth>

                                <TextField

                                    label='Skills'
                                    {...register('skills')}

                                    size='small'
                                    placeholder='Skills'
                                    error={Boolean(errors.skills)}
                                    aria-describedby='validation-async-skills'
                                    multiline
                                    minRows={5}
                                />

                                {errors.skills && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-skills'>
                                        {errors.skills.message}
                                    </FormHelperText>
                                )}

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
