import React, { Component } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import axiosInstance from 'src/services/axios';
import { Card, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import Button from '@mui/material/Button'
import Link from 'next/link'

import Icon from 'src/@core/components/icon'
import EditClass from './EditClass';
import DeleteClass from './DeleteClass';



interface staticPage {
  id: number;
  page_name: 'string';
  page_content: 'string';

}

interface ClassListState {
  rows: staticPage[];
  totalRows: number;
  loading: boolean;
  pageSize: number;
  page: number;
  openDelete: boolean,
  openView: boolean,
  openEdit: boolean,
  selectedCountryPage: {},
  selectedCountryId: {}

}

class ClassList extends Component<{}, ClassListState> {
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
      selectedCountryId: {}
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
    })
    axiosInstance.get(`/admin/v1/class/getAll?pageNo=${page}&limit=${pageSize}`)
      .then((response) => {
        this.setState({
          rows: response.data.data.classesData ? response.data.data.classesData : [],
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
    this.setState({ selectedCountryPage: params.row })
    this.setState({ openEdit: true });

  };

  handleDeleteClick = (params: GridCellParams) => {
    this.setState({ openDelete: true });
    this.setState({ selectedCountryId: params.row.id })

  };

  render() {
    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Admin Name',
        flex: 1,
      },
      {
        field: 'address',
        headerName: 'Address',
        flex: 1,
      },
      {
        field: 'region_name',
        headerName: 'Region',
        flex: 1,
      },
      {
        field: 'country_name',
        headerName: 'Country',
        flex: 1,
      },
  
      {
        field: 'city_name',
        headerName: 'City',
        flex: 1,
      },
          {
        field: 'state_name',
        headerName: 'State',
        flex: 1,
      },
 

      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: (params: GridCellParams) => (
          <>
            <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleViewClick(params)}><Icon icon='bx-show' /></Button>

            <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleEditClick(params)}><Icon icon='bx-edit' /></Button>

            <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleDeleteClick(params)}><Icon icon='ic:baseline-delete' /></Button>
          </>
        ),
      },
    ];

    const { rows, totalRows, loading, pageSize, page, openDelete, openView, openEdit, selectedCountryPage, selectedCountryId } = this.state;

    return (
      <Card >
        <CardHeader title='Class' />
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

        {/* {openDelete ? <DeleteClass selectedCountryId={selectedCountryId} show={openDelete} handleclose={() => this.setState({ openDelete: false }, this.fetchData())} /> : null}


        {openEdit ? <EditClass selectedCountryPage={selectedCountryPage} show={openEdit} handleclose={() => this.setState({ openEdit: false }, this.fetchData())} /> : null}

        {openView ? <ViewClass selectedCountryId={selectedCountryId} show={openView} handleclose={() => this.setState({ openView: false }, this.fetchData())} /> : null} */}

      </Card>

    );
  }
}

export default ClassList;
