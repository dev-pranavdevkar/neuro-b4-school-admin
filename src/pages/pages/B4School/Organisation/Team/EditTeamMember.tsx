import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DialogContent from '@mui/material/DialogContent';
import axiosInstance from 'src/services/axios';
import Icon from 'src/@core/components/icon';
import { Grid } from '@mui/material';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

interface CountryAdmin {
  name: string;
  country_code: string;
}

interface EditTeamMemberProps {
  show: boolean;
  handleclose: () => void;
  selectedTeamPage: {
    id: string;
    name: string;
    position: string;
    image: FileList;
    subject: string;
    description: string;
    skills: string;
    facebook_url: string;
    instagram_url: string;
    google_plus_url: string;
    twitter_url: string;
    linkedin_url: string;
    isSuperAdmin: boolean;
    region_id: string;
  };
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  position: yup.string().required('Position is required'),
  // Add more validations as needed
});

export default function EditTeamMember({ show, handleclose, selectedTeamPage }: EditTeamMemberProps) {
  const [loading, setLoading] = useState(false);
  const [branch, setBranchData] = useState([]);

  const {
    control,
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    setValue('name', selectedTeamPage.name);
    setValue('position', selectedTeamPage.position);
    setValue('subject', selectedTeamPage.subject);
    setValue('description', selectedTeamPage.description);
    setValue('skills', selectedTeamPage.skills);
    setValue('facebook_url', selectedTeamPage.facebook_url);
    setValue('instagram_url', selectedTeamPage.instagram_url);
    setValue('google_plus_url', selectedTeamPage.google_plus_url);
    setValue('twitter_url', selectedTeamPage.twitter_url);
    setValue('linkedin_url', selectedTeamPage.linkedin_url);
    // setValue('isSuperAdmin', selectedTeamPage.isSuperAdmin);
    setValue('region_id', selectedTeamPage.region_id);
    
    // Set other form values accordingly
  }, [selectedTeamPage]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/v1/region/getAllWithoutLimit`);
      setBranchData(response.data?.data);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data: any) => {
    const id = selectedTeamPage.id;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('position', data.position);
      // formData.append('region_id', data.region_id);
      // formData.append('subject', data.subject);
      // formData.append('description', data.description);
      // formData.append('skills', data.skills);
      // formData.append('facebook_url', data.facebook_url);
      // formData.append('instagram_url', data.instagram_url);
      // formData.append('google_plus_url', data.google_plus_url);
      // formData.append('twitter_url', data.twitter_url);
      // formData.append('linkedin_url', data.facebook_url);
      formData.append('image', data.image[0]); 
      
      // Append other form data to formData as needed
      const response = await axiosInstance.post(`/admin/v1/ourTeam/updateTeam/${id}`, formData);
      setLoading(false);
      const responseData = response.data;

      if (responseData?.success) {
        toast.success(responseData.message, { position: 'top-center' });
        handleclose();
      } else {
        toast.error(responseData.message, { position: 'top-center' });
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        for (const key in error.response.data.data) {
          setError(key, { type: 'manual', message: error.response.data.data[key].join(',') });
        }
      }
      toast.error('Team Member Could Not Be Edited', { position: 'top-center' });
      setLoading(false);
    }
  };

  return (
    <Dialog
      scroll='body'
      open={show}
      onClose={handleclose}
      aria-labelledby='user-view-plans'
      aria-describedby='user-view-plans-description'
      sx={{
        '& .MuiPaper-root': { width: '100%', maxWidth: '90%', maxHeight: '100vh' },
        '& .MuiDialogTitle-root ~ .MuiDialogContent-root': { pt: theme => `${theme.spacing(2)} !important` }
      }}
    >
      <DialogTitle id='user-view-plans' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        <Grid container item xs={12} justifyContent='space-between' alignItems='center'>
          Edit Team Member
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
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
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
            {/* Add other form fields similarly */}
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
  );
}
