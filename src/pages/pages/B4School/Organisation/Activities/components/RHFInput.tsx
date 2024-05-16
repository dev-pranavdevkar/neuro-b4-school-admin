import { TextField, InputAdornment, IconButton, Button, Typography } from '@mui/material';
import { useController } from 'react-hook-form';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

interface RHFInputProps {
  control: Control; // Assuming you're using react-hook-form
  name: string;
  type?: string;
  disabled?: boolean;
  handleResend?: () => void; // If handleResend is optional and of type void
  handleRefferalCode?: () => void; // If handleRefferalCode is optional and of type void
  resendvalue?: any; // If resendvalue is optional and of any type
}


const RHFInput: React.FC<RHFInputProps> = ({ control, name, type = "text", disabled = false, handleResend, handleRefferalCode, resendvalue, ...rest }) => {
  const initialShowPassword = type !== 'password';
  const [showPassword, setShowPassword] = React.useState(true);
  const [expiryTime, setExpiryTime] = React.useState(new Date().getTime() + 2 * 60 * 1000); // Initial expiry time: 2 minutes

  const calculateTimeLeft = () => {
    const difference = expiryTime - new Date().getTime();
    if (difference <= 0) {
      return { minutes: 0, seconds: 0 };

    }
    return {
      minutes: Math.floor((difference / 1000) / 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  const [resetTimer, setResendTimer] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const {
    field: { value, onChange },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    defaultValue: '',
  });

  const handleSendButton = () => {
    handleResend();
  }

  React.useEffect(() => {
    setResendTimer(true)
    setExpiryTime(new Date().getTime() + 2 * 60 * 1000);
  }, [resendvalue])

  return (
    <TextField
      value={value}
      type={showPassword ? type : 'text'}
      onChange={onChange}
      error={invalid}
      autoComplete='off'
      defaultValue=""
      disabled={disabled}
      helperText={error ? error.message : ''}
      {...rest}
      inputProps={{ autoComplete: 'off' }}
      InputProps={{
        sx: {
          borderRadius: type === 'newsletter' ? '40px' : '8px',
          border: '1px solid rgba(230, 234, 239, 0.1)',
          paddingRight:type === 'newsletter' ? '0px' : 'Inherit'
        },
        endAdornment: type === 'password' ? (
          <InputAdornment position="start">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword} >
              {showPassword ? <VisibilityOff />  : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : type === 'otp' ? (
          <InputAdornment position="start">
            {timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
              <Button onClick={handleSendButton} sx={{ color: '#2B6FF2', fontSize: "14px" }}>Resend OTP</Button> // Update expiryTime on click
            ) : (
              <>
                <Typography variant="body1" sx={{ color: '#657488', fontSize: "14px" }} >
                  Resend OTP in {timeLeft.minutes}:{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
                </Typography></>
            )}
          </InputAdornment>
        ) : (type === 'refferal' && !disabled) ? (
          <InputAdornment position="start">
            <Button onClick={handleRefferalCode} sx={{ color: '#2B6FF2', fontSize: "14px" }}>Apply</Button>
          </InputAdornment>
        ) : type === 'newsletter' ? (
          <InputAdornment position="start" sx={{paddingRight:'0px'}}>
            <Button variant="contained" type='submit' sx={{ borderRadius: '40px!important', textTransform: 'inherit', boxShadow: 'none', padding: { sx: '5px 20px 5px 20px', md: '10px 38px' }, backgroundColor: "#2B6FF2" }}>
              Submit
            </Button>
          </InputAdornment>
        ) : null,
        startAdornment: type === 'newsletter' ?  (
          <InputAdornment position="start">
                <EmailOutlinedIcon />
          </InputAdornment>
        ) : null
      }}
    />
  );
};
export default RHFInput;
