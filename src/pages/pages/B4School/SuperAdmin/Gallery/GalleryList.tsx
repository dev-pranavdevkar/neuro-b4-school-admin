import React, { Component } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import axiosInstance from 'src/services/axios';
import { Card, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import Button from '@mui/material/Button'
import Link from 'next/link'
import DeleteImage from './DeleteImage';
import Icon from 'src/@core/components/icon'
// import UpdateCountryById from './UpdateCountryById';
// import CountryDeletePopup from './DeleteCountryById';



interface Gallery {
  id: number;
  image: 'string';


}

interface GalleryListState {
  rows: Gallery[];
  totalRows: number;
  loading: boolean;
  pageSize: number;
  page: number;
  openDelete: boolean,
  openView: boolean,
  openEdit: boolean,
  selectedImage: {}

}

class GalleryList extends Component<{}, GalleryListState> {
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

      selectedImage: {}
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
    axiosInstance.get(`/admin/v1/gallery/getAll?pageNo=${page}&limit=${pageSize}`)
      .then((response) => {
        this.setState({
          rows: response.data.data ? response.data.data : [],
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
    this.setState({ selectedImage: params.row })
    this.setState({ openView: true });

  };

  handleEditClick = (params: GridCellParams) => {
    this.setState({ selectedImage: params.row })
    this.setState({ openEdit: true });

  };

  handleDeleteClick = (params: GridCellParams) => {
    this.setState({ openDelete: true });
    this.setState({ selectedImage: params.row.id })

  };

  render() {
    const columns: GridColDef[] = [
      {
        field: 'image',
        headerName: ' Images',
        flex: 1,
        renderCell: (params: GridCellParams) => (
          <img src={params.value as string} alt={(params.row as image).name} style={{ width: 50, height: 50 }} />
        ),
      },
      // {
      //     field: 'page_content',
      //     headerName: 'Page Content',
      //     flex: 1,
      // },

      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        renderCell: (params: GridCellParams) => (
          <>
            {/* <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleViewClick(params)}><Icon icon='bx-show' /></Button> */}

            {/* <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleEditClick(params)}><Icon icon='bx-edit' /></Button> */}

            <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleDeleteClick(params)}><Icon icon='ic:baseline-delete' /></Button>
          </>
        ),
      },
    ];

    const { rows, totalRows, loading, pageSize, page, openDelete, openView, openEdit, selectedImage } = this.state;

    return (
      <Card >
        <CardHeader title='Gallery Images' />
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
        {openDelete ? <DeleteImage selectedImage={selectedImage} show={openDelete} handleclose={() => this.setState({ openDelete: false }, this.fetchData())} /> : null}


        {/* {openEdit ? <UpdateCountryById selectedImage={selectedImage} show={openEdit} handleclose={() => this.setState({ openEdit: false }, this.fetchData())} /> : null} */}

      </Card>

    );
  }
}

export default GalleryList;
