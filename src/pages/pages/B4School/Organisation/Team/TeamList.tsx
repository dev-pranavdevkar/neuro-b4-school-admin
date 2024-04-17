import React, { Component } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import axiosInstance from 'src/services/axios';
import { Card, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import Button from '@mui/material/Button';
import Link from 'next/link';
import Icon from 'src/@core/components/icon';
import EditTeamMember from './EditTeamMember';
import DeleteTeamMember from './DeleteTeamMembers';
import { baseUrl } from 'src/configs/baseURL';

interface Team {
  id: string;
  name: string;
  country_name: string;
}

class TeamList extends Component<{}, Team> {
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
      selectedTeamPage: [],
      selectedTeamMemberId: '',
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
      selectedTeamPage: [],
    });
    axiosInstance
      .get(`/admin/v1/ourTeam/getAllTeam?pageNo=${page}&limit=${pageSize}`)
      .then((response) => {
        if (response.data.success) {
          const rows = response.data.data.rows.map((row) => ({
            ...row,
            region_id: row.region_id || 'B4-School', // Extract region_id from region object
          }));
          this.setState({
            rows: rows,
            totalRows: response.data.data.count,
            loading: false,
          });
        } else {
          console.error("Error fetching team data:", response.data.message);
        }
      })

      .catch((error) => {
        console.error("Error fetching team data:", error);
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
    this.setState({ selectedTeamPage: params.row, openView: true });
  };

  handleEditClick = (params: GridCellParams) => {
    console.log(params.row)
    this.setState({ selectedTeamPage: params.row, openEdit: true });
    this.setState({ openEdit: true });

  };

  handleDeleteClick = (params: GridCellParams) => {
    this.setState({ openDelete: true, selectedTeamMemberId: params.row.id });
  };

  render() {
    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'Member Name',
        flex: 1,
      },
      {
        field: 'position',
        headerName: 'Role',
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

    const { rows, totalRows, loading, pageSize, page, openDelete, openEdit, selectedTeamPage, selectedTeamMemberId } = this.state;

    return (
      <Card>
        <CardHeader title='Team' />
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
        {openDelete ? <DeleteTeamMember selectedTeamMemberId={selectedTeamMemberId} show={openDelete} handleclose={() => this.setState({ openDelete: false }, this.fetchData())} /> : null}
        {openEdit ? <EditTeamMember selectedTeamPage={selectedTeamPage} show={openEdit} handleclose={() => this.setState({ openEdit: false }, this.fetchData())} /> : null}
      </Card>
    );
  }
}

export default TeamList;
