// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Super Admin'
    },
    {
      title: 'Dashboards',
      icon: 'bx:home-circle',
      path: '/pages/B4School/SuperAdmin/Dashboard'
    },
    {
      icon: 'carbon:earth',
      title: 'Country',
      path: '/pages/B4School/SuperAdmin/Country'
    },
    {
      icon: 'eos-icons:admin-outlined',
      title: 'Country Admin',
      path: '/pages/B4School/SuperAdmin/CountryAdmin'
    },
    {
      icon: 'grommet-icons:gallery',
      title: 'Gallery',
      path: '/pages/B4School/SuperAdmin/Gallery'
    },
    {
      icon: 'uil:blogger-alt',
      title: 'Blogs',
      path: '/pages/B4School/SuperAdmin/Blogs'
    },
    {
      icon: 'fluent:form-28-regular',
      title: 'Admissions',
      path: '/pages/B4School/SuperAdmin/Admissions'
    },
    {
      icon: 'bx:support',
      title: 'Enquiries',
      children: [
        {
          title: 'Franchies Enquiries',
          path: '/pages/B4School/SuperAdmin/Enquiries/FranchiesEnquiries'
        },
        {
          title: 'General Enquiries',
          path: '/pages/B4School/SuperAdmin/Enquiries/GeneralEnquiries'
        }
      ]
    },

    /*===================================Country Admin======================================*/
    {
      sectionTitle: 'Country Admin'
    },
    {
      title: 'Dashboards',
      icon: 'bx:home-circle',
      path: '/pages/B4School/CountryAdmin/Dashboard'
    },
    {
      icon: 'carbon:earth',
      title: 'Location',
      children: [
        {
          title: 'State',
          path: '/pages/B4School/CountryAdmin/Location/State'
        },
        {
          title: 'City',
          path: '/pages/B4School/CountryAdmin/Location/City'
        },
        {
          title: 'Region',
          path: '/pages/B4School/CountryAdmin/Location/Region'
        }
      ]
    },
    {
      icon: 'eos-icons:admin-outlined',
      title: 'Regional Admin',
      path: '/pages/B4School/CountryAdmin/RegionalAdmin'
    },
    {
      icon: 'grommet-icons:gallery',
      title: 'Gallery',
      path: '/pages/B4School/CountryAdmin/Gallery'
    },
    {
      icon: 'fluent:form-28-regular',
      title: 'Admissions',
      path: '/pages/B4School/CountryAdmin/Admissions'
    },

    {
      icon: 'bx:support',
      title: 'Enquiries',
      path: '/pages/B4School/CountryAdmin/Enquiries'
    },

    /*===================================Reginal Admin======================================*/
    {
      sectionTitle: 'Reginal Admin'
    },
    {
      title: 'Dashboards',
      icon: 'bx:home-circle',
      path: '/pages/B4School/ReginalAdmin/Dashboard'
    },

    {
      icon: 'healthicons:i-training-class',
      title: 'Class',
      path: '/pages/B4School/ReginalAdmin/Classes'
    },
    {
      icon: 'fluent:form-28-regular',
      title: 'Admissions',
      path: '/pages/B4School/ReginalAdmin/Admissions'
    },
    {
      icon: 'bx:support',
      title: 'Enquiries',
      path: '/pages/B4School/ReginalAdmin/Enquiries'
    }
  ]

}

export default navigation
