import React, { Component } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import axiosInstance from 'src/services/axios';
import { Card, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import Button from '@mui/material/Button';
import Link from 'next/link';
import Icon from 'src/@core/components/icon';
import EditActivity from './EditActivities';
import DeleteActivity from './DeleteActivities';
import ViewActivity from './ViewActivities';
import { baseUrl } from 'src/configs/baseURL';

interface Activity {
  id: string;
  name: string;
  image: string; // Assuming image is part of the Activity interface
}

class ActivityList extends Component<{}, { rows: Activity[], loading: boolean, pageSize: number, page: number, openDelete: boolean, openView: boolean, openEdit: boolean, selectedActivityPage: Activity | null, selectedActivity: string | null }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      rows: [],
      loading: true,
      pageSize: 10,
      page: 0,
      totalRows: 0,
      openDelete: false,
      openView: false,
      openEdit: false,
      selectedActivityPage: null,
      selectedActivity: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { pageSize, page } = this.state;
    axiosInstance
      .get(`/admin/v1/gallery/getAllImages?sort=DESC&pageNo=${page}&limit=${pageSize}`)
      .then((response) => {
        if (response.data.success) {
          this.setState({
            rows: response.data.data.rows.reverse() || [], // Update to access data under data.rows
            totalRows: response.data.data.count,
            loading: false,
          });
        } else {
          console.error("Error fetching Activity data:", response.data.message);
          this.setState({
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching Activity data:", error);
        this.setState({
          loading: false,
        });
      });
  };


  handleViewClick = (params: GridCellParams) => {
    this.setState({ selectedActivityPage: params.row, openView: true });
  };

  handleEditClick = (params: GridCellParams) => {
    this.setState({ selectedActivityPage: params.row, openEdit: true });
  };

  handleDeleteClick = (params: GridCellParams) => {
    this.setState({ selectedActivity: params.row.id, openDelete: true });
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
  render() {
    const columns: GridColDef[] = [
      {
        field: 'category',
        headerName: 'Category',
        flex: 1,
      },
      {
        field: 'image',
        headerName: 'Image',
        flex: 1,
        renderCell: (params: GridCellParams) => (
          <img src={`${baseUrl}${params.value}`} alt={params.value} style={{ width: '25px', height: '25px', objectFit: 'contain' }} />
        ),
      },
      
      {
        field: 'region_id',
        headerName: 'Region',
        flex: 1,
        valueGetter: (params: GridCellParams) => params.row.region?.name || 'B4-School', // Extract region name or default to 'B4-School'
      },
      {
        field: 'isShowOnHomePage',
        headerName: 'Show On HomePage',
        flex: 1,
      },

      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: (params: GridCellParams) => (
          <>
            <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleViewClick(params)}><Icon icon='bx-show' /></Button>
            <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleEditClick(params)}>
              <Icon icon='bx-edit' />
            </Button>
            <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleDeleteClick(params)}>
              <Icon icon='ic:baseline-delete' />
            </Button>
          </>
        ),
      },
    ];

    const {      totalRows,rows, loading, pageSize, page, openDelete, openView, openEdit, selectedActivityPage, selectedActivity } = this.state;
   
    return (
      <Card>
        <CardHeader title='Activity' />
        <Box sx={{ height: '70vh', width: "100%" }}>
          <DataGrid
            columns={columns}
            rows={rows}
            pagination
            pageSize={pageSize}
            page={page}
            rowCount={totalRows}

            paginationMode="server"
            onPageChange={this.handlePageChange}
            loading={loading}
            rowsPerPageOptions={[5, 10, 20]}
            onPageSizeChange={this.handlePageSizeChange}
          />
        </Box>
        {openDelete ? <DeleteActivity selectedActivity={selectedActivity} show={openDelete} handleclose={() => this.setState({ openDelete: false }, this.fetchData)} /> : null}
        {openEdit ? <EditActivity  selectedActivityPage={selectedActivityPage} show={openEdit} handleclose={() => this.setState({ openEdit: false }, this.fetchData)} /> : null}
        {openView ? <ViewActivity selectedActivityPage={selectedActivityPage} show={openView} handleclose={() => this.setState({ openView: false }, this.fetchData)} /> : null}

      </Card>
    );
  }
}

export default ActivityList;
