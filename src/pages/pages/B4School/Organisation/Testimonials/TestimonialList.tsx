import React, { Component } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import axiosInstance from 'src/services/axios';
import { Card, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import Button from '@mui/material/Button';
import Link from 'next/link';
import Icon from 'src/@core/components/icon';
import EditTestimonial from './EditTestimonial';
import DeleteTestimonial from './DeleteTestimonial';

interface Program {
  id: string;
  name: string;
  country_name: string;
}

class TestimonialList extends Component<{}, Testimonial> {
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
      selectedTestimonialPage: [],
      selectedTestimonialId: '',
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
      selectedTestimonialPage: [],
    });
    axiosInstance
      .get(`/admin/v1/testimonial/getAllTestimonial?pageNo=${page}&limit=${pageSize}`)
      .then((response) => {
        if (response.data.success) {
          // Check if response.data.data is an array before accessing its properties
          if (Array.isArray(response.data.data.rows)) {
            console.log("response.data.data is", response.data.data.rows)
            this.setState({
              rows: response.data.data.rows,
              totalRows: response.data.data.length, // Assuming you want the length of the data array
              loading: false,
            });
          } else {
            console.error("Error fetching Testimonial data: Response data is not an array");
          }
        } else {
          console.error("Error fetching Testimonial data:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching Testimonial data:", error);
      });
  };
  


  handlePageChange = (page: number, e: any) => {
    console.log("page", page);
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
    this.setState({ selectedTestimonialPage: params.row, openView: true });
  };

  handleEditClick = (params: GridCellParams) => {
    console.log(params.row)
    this.setState({ selectedTestimonialPage: params.row, openEdit: true });
    this.setState({ openEdit: true });

  };

  handleDeleteClick = (params: GridCellParams) => {
    this.setState({ openDelete: true, selectedTestimonial: params.row.id });
  };

  render() {
    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
      },
      {
        field: 'role',
        headerName: 'Role',
        
        flex: 1,
      },
      {
        field: 'rating',
        headerName: 'Rating',
        
        flex: 1,
      },
      {
        field: 'gender',
        headerName: 'Gender',
        
        flex: 1,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: (params: GridCellParams) => (
          <>
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

    const { rows, totalRows, loading, pageSize, page, openDelete, openEdit, selectedTestimonialPage, selectedTestimonial } = this.state;

    return (
      <Card>
        <CardHeader title='Program' />
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
        {openDelete ? <DeleteTestimonial selectedTestimonial={selectedTestimonial} show={openDelete} handleclose={() => this.setState({ openDelete: false }, this.fetchData())} /> : null}
        {openEdit ? <EditTestimonial selectedTestimonialPage={selectedTestimonialPage} show={openEdit} handleclose={() => this.setState({ openEdit: false }, this.fetchData())} /> : null}
      </Card>
    );
  }
}

export default TestimonialList;
