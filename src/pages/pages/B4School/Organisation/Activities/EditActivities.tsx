import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
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
import { Grid, FormControlLabel, Checkbox } from '@mui/material';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useRouter } from "next/router";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { baseUrl } from 'src/configs/baseURL';
import RHFMultiselectDropZone from './components/RHFMultiselectDropZone';
import RHFSelect from './components/RHFSelect';
import RHFDropZone from './components/RHFDropZone';

interface ActivityPage {
  id: number;
  category: string;
  isShowOnHomePage: boolean;
  region_id: number;
}

interface UpdateActivityByIdProps {
  show: boolean;
  handleclose: () => void;
  selectedActivityPage: ActivityPage;
  isShowOnHomePage: boolean;
}

const schema = yup.object().shape({
  category: yup.string().required('Activity category is Required'),
});

export default function EditActivity({ show, handleclose, selectedActivityPage }: UpdateActivityByIdProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { control, register, handleSubmit, setValue, setError, formState: { errors },watch } = useForm({ resolver: yupResolver(schema) });
  const [branch, setBranch] = useState([]);
  const [isShowOnHomePage, setIsShowOnHomePage] = useState(selectedActivityPage?.isShowOnHomePage || false);
 const [multiImages, setMultiImages] = useState([]); // State for holding multiple images
 const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    // Update form values when selectedActivityPage changes
    setValue('category', selectedActivityPage?.category || '');
    setValue('region_id', selectedActivityPage.region_id || '');
    setValue('image', selectedActivityPage.image || '');
    setValue('isShowOnHomePage', selectedActivityPage.isShowOnHomePage || false);


    // Update isShowOnHomePage state
    setIsShowOnHomePage(selectedActivityPage.isShowOnHomePage);
  }, [setValue, selectedActivityPage]);

  const value = watch();
console.log(value,"watch", selectedActivityPage,show==false);
  const onMultiFileChange = (e) => {
    let files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(files[i]);

      fileReader.onload = (event) => {
        // console.log(event.target.result)
        // Push the base64 encoded image to multiImages state
        setMultiImages(prevState => [...prevState, event.target.result]);
      };
    }
  };
  const handleImagemultipleDrop = (image) => {
    const uploadedFiles = [];
    const invalidFiles = [];

    // Iterate through each dropped file
    image.forEach(file => {
        // Check if the file type is one of the accepted types
        if (
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'image/jpg' ||
            file.type === 'image/gif'
        ) {
            uploadedFiles.push({
                file: file,
                url: URL.createObjectURL(file),
                delete: false,
            });
        } else {
            // If the file type is invalid, add it to the list of invalid files
            invalidFiles.push(file);
        }
    });

    // If there are invalid files, handle them (e.g., show error message)
    if (invalidFiles.length > 0) {
        console.error('Invalid files:', invalidFiles);
        // Handle invalid files (e.g., show error message to the user)
    }

    // Update the state with only valid files
    setUploadedImages((prevImages) => [...prevImages, ...uploadedFiles]);
};
const handleDeleteImage = (index) => {
  setUploadedImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1); // Remove the image at the specified index
      return updatedImages;
  });
};
const Options = [
  { label: 'English', value: 'english' },
  { label: 'Math', value: 'math' },
  { label: 'Physical Education', value: 'physical-education' },
  { label: 'Art', value: 'art' },

]
const BranchOptions = branch.map((e) => ({
  label: e?.name,
  value: e.id
}));

console.log(BranchOptions,"BranchOptions")
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('category', data.category);
      formData.append('region_id', data.region_id);
      
      // Append each image from multiImages state to formData
      multiImages.forEach((image, index) => {
        formData.append(`additional_images[${index}]`, image);
      });

      formData.append('isShowOnHomePage', data.isShowOnHomePage);


      const response = await axiosInstance.post(
        `/admin/v1/gallery/updateImage/${selectedActivityPage.id}`,
        formData
      );

      setLoading(false);
      const responseData = response.data;
      if (responseData?.success) {
        toast.success(responseData.message, { position: 'top-center' }); 
        handleclose()  
      } else {
        toast.error(responseData.message, { position: 'top-center' });
      }
      // router.back();
    } catch (error) {
      // console.error(error);
      toast.error('Program could not be added', { position: 'top-center' });
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/v1/region/getAllWithoutLimit`);
      setBranch(response.data?.data);
    } catch (error) {
      // console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsShowOnHomePage(event.target.checked);
  };
  const handleImageDrop = (name, acceptedFiles) => {
    setValue(name, acceptedFiles[0]);
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
          Edit Activity
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
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Grid container spacing={5}>
          <Grid item xs={4}>
  {/* <FormControl fullWidth size='small'>
    <InputLabel
      id='validation-basic-attribute_type'
      error={Boolean(errors.region_id)}
      htmlFor='validation-basic-region_id'
    >
      Select Branch
    </InputLabel>
    <Select
      label='Select Branch'
      {...register('region_id')}
      error={Boolean(errors.region_id)}
      labelId='validation-region_id'
      aria-describedby='validation-region_id'
    >
      {branch.map((item, index) => (
        <MenuItem value={item.id} key={index}>{item.name}</MenuItem>
      ))}
    </Select>
    {errors.region_id && (
      <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-region_id'>
        {errors.region_id.message}
      </FormHelperText>
    )}
  </FormControl> */}
  <RHFSelect control={control} options={BranchOptions} fullWidth name="region_id"  label={"Select Branch" } />

</Grid>


            <Grid item xs={4}>
              {/* <FormControl fullWidth size='small'>
                <InputLabel
                  id='validation-basic-attribute_type'
                  error={Boolean(errors.category)}
                  htmlFor='validation-basic-category'
                >
                  Select Category
                </InputLabel>
                <Select
                  label='Select Category'
                  {...register('category')}
                  error={Boolean(errors.category)}
                  labelId='validation-category'
                  aria-describedby='validation-category'
                >
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="art">Art</MenuItem>
                  <MenuItem value="math">Math</MenuItem>
                  <MenuItem value="physical-education">Physical Education</MenuItem>
                </Select>
                {errors.category && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-category'>
                    {errors.category.message}
                  </FormHelperText>
                )}
              </FormControl> */}
                          <RHFSelect control={control} options={Options} fullWidth name="category"  label={"Select Category" } />

            </Grid>

            <Grid item xs={4}>
  {/* <FormControl fullWidth size='small'>
    <TextField
      label='Images'
      type='file'
      name="images"
      onChange={onMultiFileChange}
      size='small'
      error={Boolean(errors.additional_images)}
      aria-describedby='validation-async-images'
      InputLabelProps={{ shrink: true }} inputProps={{ accept: 'image/*', multiple: true }}
    />
   {selectedActivityPage && selectedActivityPage.image && (
  <div>
    <img src={`${baseUrl}${selectedActivityPage.image}`} alt="Selected Image" style={{ width: '100%', marginTop: '8px' }} />
  </div>
)}

    {errors.additional_images && (
      <FormHelperText sx={{ color: 'error.main' }} id='validation-async-images'>
        {errors.additional_images.message}
      </FormHelperText>
    )}
  </FormControl> */}
            <RHFDropZone control={control} name="image" onImageDrop={handleImageDrop} imgUrl={`${baseUrl}${selectedActivityPage.image}`}/>

</Grid>


            <Grid item xs={4}>
              <FormControl fullWidth size='small'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isShowOnHomePage}
                      onChange={handleCheckboxChange}
                      id='validation-basic-isShowOnHomePage'
                    />
                  }
                  label='Show Branch Select'
                />
                {isShowOnHomePage && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-isShowOnHomePage'>
                    {/* Additional content to show when checkbox is checked */}
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
