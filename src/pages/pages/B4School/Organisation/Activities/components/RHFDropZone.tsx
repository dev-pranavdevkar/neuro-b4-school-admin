import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ReactPlayer from 'react-player';


interface RHFDropZoneProps {
    control: any;
    name: string;
    onImageDrop: (files: File[]) => void;
    imgUrl?: string;
    videoUrl?: string;
    pdfUrl: string;
    disabled?: boolean;
    multiple?: boolean;
    type?: string
  }

  // Define the RHFDropZone component with the RHFDropZoneProps interface
  const RHFDropZone: React.FC<RHFDropZoneProps> = ({
    control,
    name,
    onImageDrop,
    imgUrl,
    videoUrl,
    pdfUrl,
    disabled: propDisabled,
    multiple = false,
    type = 'image',
    ...rest
  }) => {
  const [disabled, setDisabled] = useState(propDisabled);
    const [dropzoneError, setDropzoneError] = useState(null);
    const [types, setTypes] = useState( {
        'image/jpeg': [],
        'image/png': [],
        'image/webp': [],
        'image/heic': [],
    });

    React.useEffect(() => {
        setDisabled(propDisabled);
    }, [propDisabled]);

    useEffect(() => {
        if (type === 'video') {
            setTypes({
                'video/mp4': ['.mp4', '.MP4'],
            })
        } else if (type === 'pdf') {
            setTypes({
                'application/pdf': ['.pdf', '.PDF'],
            })
        }else {
            setTypes({
                'image/jpeg': [],
                'image/png': [],
                'image/webp': [],
                'image/heic': [],
            });
        }
    },[type])

    
    const {
        field: { value, onChange },
        fieldState: { invalid, error },
    } = useController({
        name,
        control,
        defaultValue: '',
    });


    const onDrop = useCallback((acceptedFiles) => {
        onChange(acceptedFiles);
        // Check if the dropzone is disabled
        if (disabled) {
            // If disabled, do nothing
            return;
        }
    
        // Separate image files, video files, and PDF files
        const imageFiles = acceptedFiles.filter(file => file.type === 'image/jpeg' || file.type === 'image/png');
        const videoFiles = acceptedFiles.filter(file => file.type === 'video/mp4' || file.type === 'video/quicktime');
        const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');

        // Check if there are any invalid files
        const hasInvalidFiles = acceptedFiles.some(file => !imageFiles.includes(file) && !videoFiles.includes(file) && !pdfFiles.includes(file));
    
        // If there are invalid files, set an error message
        if (hasInvalidFiles) {
            setDropzoneError('Only JPG, PNG, MP4, QuickTime video, and PDF files are accepted.');
            return;
        }
    
        // Clear any existing error message if all dropped files are valid
        setDropzoneError(null);
    
        // Handle image files
        if (onImageDrop && imageFiles.length > 0) {
            onImageDrop(name, imageFiles);
            
        }
    
        // Handle video files
        if (onImageDrop && videoFiles.length > 0) {
            onImageDrop(name, videoFiles);
        }
    
        // Handle PDF files
        if (onImageDrop && pdfFiles.length > 0) {
            onImageDrop(name, pdfFiles);
        }
    }, [disabled, onImageDrop]);
    

    

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept:types,
        multiple: multiple,
        disabled: disabled
    });

    const imageUrl = (() => {
        if (typeof value !== 'string' && value) {
            return URL.createObjectURL(value);
        } else if (imgUrl) {
            return `${imgUrl}`;
        } else if (videoUrl) {
            return `${videoUrl}`;
        }else if (pdfUrl) {
            return `${pdfUrl}`;
        }        
        else {
            return '';
        }
    })();

    return (
        <Box {...getRootProps()} className={`image-drop ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()}  />
            {isDragActive ? (
                <p>Drop the image here...</p>
            ) : (
                <>
                    <Box sx={{ height: '200px', width: '100%', border: '1px solid #E6EAEF', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        {((type === 'image' ?  (imgUrl?.length === 0 || imgUrl === undefined || imgUrl === null) : type === 'pdf' ?  (pdfUrl?.length === 0 || pdfUrl === undefined || pdfUrl === null) : (videoUrl?.length === 0 || videoUrl === undefined || videoUrl === null)) && (!value || value.length === 0)) ? (
                            <>
                                <ImageOutlinedIcon sx={{ fontSize: '50px', color: '#2B6FF2' }} />

                                <Box sx={{ display: 'block' }}>

                                    <Controller
                                        name={name}
                                        control={control}
                                        {...rest} disabled={disabled}
                                        render={({ field }) => (
                                            <>
                                                <Button variant='contained'  sx={{ textTransform: 'inherit !important', mt: 2, background: '#2B6FF2' }} startIcon={<FileUploadOutlinedIcon />}>
                                                    Choose an {type}
                                                </Button>
                                            </>
                                        )}
                                    />
                                </Box>
                            </>
                        ) : <>
                        {type === 'image' &&
                        <img
                            src={imageUrl}
                            alt="Uploaded File"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                        />}
                        {type === 'video' && <ReactPlayer url={imageUrl} playing  width='100%'  height='100%' />}
                        {type === 'pdf' && <iframe src={imageUrl} height={'80%'} width={'80%'} />}

                        </>}

                    </Box>
                    {invalid && <span style={{ fontSize: '0.75rem', color: '#d32f2f', marginRight: '14px', marginLeft: '14px', fontWeight: 400, marginTop: '3px' }}>{error?.message}</span>}
                    {dropzoneError && (
    <span style={{ fontSize: '0.75rem', color: '#d32f2f', marginRight: '14px', marginLeft: '14px', fontWeight: 400, marginTop: '3px' }}>
        {dropzoneError}
    </span>
)}
                </>
            )}

        </Box>
    );
};

export default RHFDropZone;
