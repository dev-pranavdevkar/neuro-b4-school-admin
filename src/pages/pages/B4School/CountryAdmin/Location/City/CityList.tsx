import React, { Component } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import axiosInstance from 'src/services/axios';
import { Card, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import Button from '@mui/material/Button'
import Link from 'next/link'

import Icon from 'src/@core/components/icon'
import EditCity from './EditCity';
import DeleteCity from './DeleteCity';



interface staticPage {

  name: 'string';
  country_name: 'string';

}

interface CityList {
  rows: staticPage[];
  totalRows: number;
  loading: boolean;
  pageSize: number;
  page: number;
  openDelete: boolean,
  openView: boolean,
  openEdit: boolean,
  selectedCountryPage: {},
  selectedStateId: {},
  SelectedCityId: {}

}

class CityList extends Component<{}, CityList> {
  constructor(props: {}) {
    super(props);
    this.state = {
      rows: [],
      totalRows: 0,
      loading: true,
      pageSize: 10,
      page: 0,
      openDelete: false,
      openView: false,
      openEdit: false,
      selectedCountryPage: {},
      selectedStateId: {},
      SelectedCityId: {}
    };
  }

  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    const { pageSize, page } = this.state;
    this.setState({
      rows: [],
      loading: true,
    });
  
    axiosInstance.get(`/admin/v1/city/getAll?pageNo=${page}&limit=${pageSize}`)
      .then((response) => {
        console.log('API Response:', response.data); // Log the response data
        const cities = response.data.data.cities || [];
        const formattedCities = cities.map(city => ({
          ...city,
          id: city.id,
          name: city.name,
          state_name: city.State.name, // Access the name field of the nested State object
          country_name: city.Country.name,
        }));
        this.setState({
          rows: formattedCities,
          totalRows: response.data.data.totalCount,
          loading: false,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  

  handlePageChange = (page: number, e: any) => {
    console.log("page", page)
    this.setState({ page, loading: true }, () => {
      this.fetchData();
    });
  };

  handlePageSizeChange = (newPageSize: number, e: any) => {

    this.setState({ pageSize: newPageSize }, () => {
      this.fetchData();
    });
  };

  handleViewClick = (params: GridCellParams) => {
    this.setState({ selectedCountryPage: params.row })
    this.setState({ openView: true });

  };

  handleEditClick = (params: GridCellParams) => {
    console.log(params)
    this.setState({ selectedCountryPage: params.row })
    this.setState({ openEdit: true });

  };

  handleDeleteClick = (params: GridCellParams) => {
    this.setState({ openDelete: true });
    this.setState({ SelectedCityId: params.row.id })

  };

  render() {
    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'City Name',
        flex: 1,
      },
      {
        field: 'state_name',
        headerName: 'State',
        flex: 1,
      },
      {
        field: 'country_name',
        headerName: 'Country',
        flex: 1,
      },

      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: (params: GridCellParams) => (
          <>
            {/* <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleViewClick(params)}><Icon icon='bx-show' /></Button> */}

            <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleEditClick(params)}><Icon icon='bx-edit' /></Button>

            <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleDeleteClick(params)}><Icon icon='ic:baseline-delete' /></Button>
          </>
        ),
      },
    ];

    const { rows, totalRows, loading, pageSize, page, openDelete, openView, openEdit, selectedCountryPage, SelectedCityId } = this.state;

    return (
      <Card >
        <CardHeader title='City' />
        <Box sx={{ height: '70vh', width: "100%" }}>
          <DataGrid
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            pagination
            pageSize={pageSize}
            rowCount={totalRows}
            page={page}
            paginationMode="server"
            onPageChange={this.handlePageChange}
            loading={loading}
            rowsPerPageOptions={[5, 10, 20]}
            onPageSizeChange={this.handlePageSizeChange}
          />
        </Box>
        {openDelete ? <DeleteCity SelectedCityId={SelectedCityId} show={openDelete} handleclose={() => this.setState({ openDelete: false }, this.fetchData())} /> : null}


        {openEdit ? <EditCity selectedCountryPage={selectedCountryPage} show={openEdit} handleclose={() => this.setState({ openEdit: false }, this.fetchData())} /> : null}

      </Card>

    );
  }
}

export default CityList;
