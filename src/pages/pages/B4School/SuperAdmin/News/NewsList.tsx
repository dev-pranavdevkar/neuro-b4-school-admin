import React, { Component } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import axiosInstance from 'src/services/axios';
import { Card, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import Button from '@mui/material/Button'
import Link from 'next/link'
import { baseUrl } from 'src/configs/baseURL';
import Icon from 'src/@core/components/icon'
import UpdateNews from './UpdateNews';
import DeleteNews from './DeleteNews';
import ViewNews from './ViewNews';


interface staticPage {
  id: number;
  page_name: 'string';
  page_content: 'string';

}

interface NewsListState {
  rows: staticPage[];
  totalRows: number;
  loading: boolean;
  pageSize: number;
  page: number;
  openDelete: boolean,
  openView: boolean,
  openEdit: boolean,
  selectedNews: {},
  selectedNewsId: {}

}

class NewsList extends Component<{}, NewsListState> {
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
      selectedNews: {},
      selectedNewsId: {}
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
    axiosInstance.get(`/admin/v1/news/getAllNews?pageNo=${page}&limit=${pageSize}`)
      .then((response) => {
        console.log('News Data',response.data.data.rows)
        this.setState({
          rows: response.data.data.rows ? response.data.data.rows : [],
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
    this.setState({ selectedNews: params.row })
    this.setState({ openView: true });

  };

  handleEditClick = (params: GridCellParams) => {
    this.setState({ selectedNews: params.row })
    this.setState({ openEdit: true });

  };

  handleDeleteClick = (params: GridCellParams) => {
    this.setState({ openDelete: true });
    this.setState({ selectedNews: params.row })
    console.log("params.row.id",params.row.id)

  };

    // Function to format the date
    formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

  render() {
    const columns: GridColDef[] = [
      {
        field: 'title',
        headerName: 'Title',
        flex: 1,
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
      },
      {
        field: 'date',
        headerName: 'Date',
        flex: 1,
        // Render the formatted date
        valueGetter: (params: GridCellParams) => this.formatDate(params.value as string),
      },
      {
        field: 'image',
        headerName: 'Image',
        flex: 1,
        renderCell: (params: GridCellParams) => (
          <img src={`${baseUrl}${params.value}`} alt={params.value} style={{ width: '25px', height: '25px', objectFit:'contain' }} />
        ),
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

    const { rows, totalRows, loading, pageSize, page, openDelete, openView, openEdit, selectedNews, selectedNewsId } = this.state;

    return (
      <Card >
        <CardHeader title='News' />
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
        {openDelete ? <DeleteNews selectedNews={selectedNews} show={openDelete} handleclose={() => this.setState({ openDelete: false }, this.fetchData())} /> : null}


        {openEdit ? <UpdateNews selectedNews={selectedNews} show={openEdit} handleclose={() => this.setState({ openEdit: false }, this.fetchData())} /> : null}

        {openView ? <ViewNews selectedNews={selectedNews} show={openView} handleclose={() => this.setState({ openView: false }, this.fetchData())} /> : null}
      </Card>

    );
  }
}

export default NewsList;
