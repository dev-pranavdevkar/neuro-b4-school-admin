// ** MUI Imports
import Box from '@mui/material/Box'
import MuiLink from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Developed By `}
        <Box component='span' sx={{ color: 'error.main' }}>
       
        </Box>
        {` by `}
        <MuiLink target='_blank' href='https://neuromonk.com/'>
          Neuromonk Infotech Pvt. Ltd
        </MuiLink>
      </Typography>
      {/* {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <MuiLink target='_blank' href='https://neuromonk.com/'>
            License
          </MuiLink>
          <MuiLink target='_blank' href='https://neuromonk.com/'>
            More Themes
          </MuiLink>
          <MuiLink
            target='_blank'
            href='https://demos.themeselection.com/sneat-mui-react-nextjs-admin-template/documentation/'
          >
            Documentation
          </MuiLink>
          <MuiLink target='_blank' href='https://neuromonk.com/support/'>
            Support
          </MuiLink>
        </Box>
      )} */}
    </Box>
  )
}

export default FooterContent
