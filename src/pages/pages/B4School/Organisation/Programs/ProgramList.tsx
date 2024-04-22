import React, { Component } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import axiosInstance from 'src/services/axios';
import { Card, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import Button from '@mui/material/Button';
import Link from 'next/link';
import Icon from 'src/@core/components/icon';
import EditProgram from './EditProgram';
import DeleteProgram from './DeleteProgram';
import ViewProgram from './ViewProgram';
import { baseUrl } from 'src/configs/baseURL';

interface Program {
  id: string;
  name: string;
  image: string; // Assuming image is part of the Program interface
}

class ProgramList extends Component<{}, { rows: Program[], loading: boolean, pageSize: number, page: number, openDelete: boolean, openView: boolean, openEdit: boolean, selectedProgramPage: Program | null, selectedProgram: string | null }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      rows: [],
      loading: true,
      pageSize: 10,
      page: 0,
      openDelete: false,
      openView: false,
      openEdit: false,
      selectedProgramPage: null,
      selectedProgram: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { pageSize, page } = this.state;
    axiosInstance
      .get(`/admin/v1/ourProgram/getAllProgram?pageNo=${page}&limit=${pageSize}`)
      .then((response) => {
        if (response.data.success) {
          this.setState({
            rows: response.data.data.rows || [], // Update to access data under data.rows
            totalRows: response.data.data.count || 0, // Assuming count is available in data
            loading: false,
          });
        } else {
          console.error("Error fetching Program data:", response.data.message);
          this.setState({
            loading: false,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching Program data:", error);
        this.setState({
          loading: false,
        });
      });
  };


  handleViewClick = (params: GridCellParams) => {
    this.setState({ selectedProgramPage: params.row, openView: true });
  };

  handleEditClick = (params: GridCellParams) => {
    this.setState({ selectedProgramPage: params.row, openEdit: true });
  };

  handleDeleteClick = (params: GridCellParams) => {
    this.setState({ selectedProgram: params.row.id, openDelete: true });
  };
  render() {
    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Program Name',
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
        field: 'region',
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

    const { rows, loading, pageSize, page, openDelete, openView, openEdit, selectedProgramPage, selectedProgram } = this.state;

    return (
      <Card>
        <CardHeader title='Program' />
        <Box sx={{ height: '70vh', width: "100%" }}>
          <DataGrid
            columns={columns}
            rows={rows}
            pagination
            pageSize={pageSize}
            page={page}
            paginationMode="server"
            onPageChange={this.handlePageChange}
            loading={loading}
            rowsPerPageOptions={[5, 10, 20]}
            onPageSizeChange={this.handlePageSizeChange}
          />
        </Box>
        {openDelete ? <DeleteProgram selectedProgram={selectedProgram} show={openDelete} handleclose={() => this.setState({ openDelete: false }, this.fetchData)} /> : null}
        {openEdit ? <EditProgram selectedProgramPage={selectedProgramPage} show={openEdit} handleclose={() => this.setState({ openEdit: false }, this.fetchData)} /> : null}
        {openView ? <ViewProgram selectedProgramPage={selectedProgramPage} show={openView} handleclose={() => this.setState({ openView: false }, this.fetchData)} /> : null}

      </Card>
    );
  }
}

export default ProgramList;
