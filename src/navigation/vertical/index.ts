// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useEffect, useState } from 'react'

const Navigation: React.FC = () => {
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Retrieve user data from local storage
    const userData = localStorage.getItem('userData');
    console.log("Pranav Devkar",userData)
    if (userData) {
      const { role } = JSON.parse(userData);
      setUserRole(role);
    }
  }, []);

  if (userRole === 'super-admin') {
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
        icon: 'bx:current-location',
        title: 'Location',
        children: [
          {
            title: 'Country',
            path: '/pages/B4School/SuperAdmin/Country'
          },
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
        icon: 'bx:building',
        title: 'Organization',
        children: [
          {
            title: 'Banner Image',
            path: '/pages/B4School/Organisation/Banner'
          },
          {
            title: 'Programs',
            path: '/pages/B4School/Organisation/Programs'
          },
          {
            title: 'Team',
            path: '/pages/B4School/Organisation/Team'
          },
          {
            title: 'Activities',
            path: '/pages/B4School/Organisation/Activities'
          },
          {
            title: 'Testimonial',
            path: '/pages/B4School/Organisation/Testimonials'
          }
        ]
      },
      {
        icon: 'eos-icons:admin-outlined',
        title: 'Admin',
        children: [
          {
            title: 'Reginal Admin',
            path: '/pages/B4School/CountryAdmin/RegionalAdmin'
          }
        ]
      },
      {
        icon: 'bx:news',
        title: 'News',
        path: '/pages/B4School/SuperAdmin/News'
      },
      {
        icon: 'bx:cart',
        title: 'Products',
        path: '/pages/B4School/SuperAdmin/Products'
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
      }
    ]
  } else if (userRole === 'country-admin') {
    return [
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
      }
    ]
  } else {
    return [
      {
        sectionTitle: 'Branch Admin'
      },
      {
        title: 'Dashboards',
        icon: 'bx:home-circle',
        path: '/pages/B4School/ReginalAdmin/Dashboard'
      },
      {
        icon: 'bx:current-location',
        title: 'Location',
        children: [
     
          {
            title: 'Branch',
            path: '/pages/B4School/CountryAdmin/Location/Region'
          }
        ]
      },
      {
        icon: 'bx:building',
        title: 'Organization',
        children: [
          {
            title: 'Banner Image',
            path: '/pages/B4School/Organisation/Banner'
          },
          {
            title: 'Programs',
            path: '/pages/B4School/Organisation/Programs'
          },
          {
            title: 'Team',
            path: '/pages/B4School/Organisation/Team'
          },
          {
            title: 'Activities',
            path: '/pages/B4School/Organisation/Activities'
          },
          {
            title: 'Testimonial',
            path: '/pages/B4School/Organisation/Testimonials'
          }
        ]
      },
      {
        icon: 'eos-icons:admin-outlined',
        title: 'Admin',
        children: [
          {
            title: 'Reginal Admin',
            path: '/pages/B4School/CountryAdmin/RegionalAdmin'
          }
        ]
      },
      {
        icon: 'bx:news',
        title: 'News',
        path: '/pages/B4School/SuperAdmin/News'
      },
      {
        icon: 'bx:cart',
        title: 'Products',
        path: '/pages/B4School/SuperAdmin/Products'
      },
      {
        icon: 'bx:support',
        title: 'Enquiries',
        path: '/pages/B4School/ReginalAdmin/Enquiries'
      }
    ]
  }
}

export default Navigation;
