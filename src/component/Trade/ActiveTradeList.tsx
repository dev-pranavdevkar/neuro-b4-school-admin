import React, { Component } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import axiosInstance from "../../services/axios";
import { Card, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack';

import toast from 'react-hot-toast'



interface Trade {
  id: number;
  option_tag: 'string';

}

interface TradeListState {
  rows: Trade[];
  totalRows: number;
  loading: boolean;
  pageSize: number;
  page: number;
  openDelete: boolean,
  openView: boolean,
  openEdit: boolean,
  selectedTrade: {},
  selectedTradeId: {},
  isButtonClicked: number | null,

}

class TradeList extends Component<{}, TradeListState> {
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
      selectedTrade: {},
      selectedTradeId: {},
      isButtonClicked: null,
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
    axiosInstance.get(`/admin/tradeCall/getAllActiveTrades?pageNo=${page}&limit=${pageSize}`)
      .then((response) => {
        this.setState({
          rows: response.data.data.data ? response.data.data.data : [],
          totalRows: response.data.data.totalCount,
          loading: false,
        });
        console.log(response.data.data.data)
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
  handleSLClick = async (params: GridCellParams) => {
    const id = params.row.id
    const achieved_flag = 0

    // const data = params.row
    try {
      await axiosInstance.post(
        `/admin/tradeCall/update/${id}`,
        { achieved_flag: achieved_flag }
      ).then((response) => {

        const data = response.data
        console.log(data)
        if (data?.success) {

          // toast.success(data.message, 
          toast.success('Stop Loss Hit',
            {
              position: 'top-center'
            })
          this.fetchData();
        } else {
          toast.error(data.message, {
            position: 'top-center'
          })
        }

      }).catch((error) => {
        console.log(error)



      });


    }
    catch (error) {
      console.log(error)
      toast.error(' Could Not Eddited', {
        position: 'top-center',
      })

    }

  };

  handleT1Click = async (params: GridCellParams) => {
    const id = params.row.id
    const achieved_flag = 1

    // const data = params.row
    try {
      await axiosInstance.post(
        `/admin/tradeCall/update/${id}`,
        { achieved_flag: achieved_flag }
      ).then((response) => {

        const data = response.data
        console.log(data)
        if (data?.success) {

          toast.success(data.message, {
            position: 'top-center'
          })
          this.fetchData();
        } else {
          toast.error(data.message, {
            position: 'top-center'
          })
        }

      }).catch((error) => {
        console.log(error)

      });

    }
    catch (error) {
      console.log(error)
      toast.error(' Could Not Eddited', {
        position: 'top-center',
      })

    }

  };

  handleT2Click = async (params: GridCellParams) => {
    const id = params.row.id
    const achieved_flag = 2

    // const data = params.row
    try {
      await axiosInstance.post(
        `/admin/tradeCall/update/${id}`,
        { achieved_flag: achieved_flag }
      ).then((response) => {

        const data = response.data
        console.log(data)
        if (data?.success) {

          toast.success(data.message, {
            position: 'top-center'
          })
          this.fetchData();
        } else {
          toast.error(data.message, {
            position: 'top-center'
          })
        }

      }).catch((error) => {
        console.log(error)

      });

    }
    catch (error) {
      console.log(error)
      toast.error(' Could Not Eddited', {
        position: 'top-center',
      })

    }

  };
  handleT3Click = async (params: GridCellParams) => {
    const id = params.row.id
    const achieved_flag = 3

    // const data = params.row
    try {
      await axiosInstance.post(
        `/admin/tradeCall/update/${id}`,
        { achieved_flag: achieved_flag }
      ).then((response) => {

        const data = response.data
        console.log(data)
        if (data?.success) {

          toast.success(data.message, {
            position: 'top-center'
          })
          this.fetchData();
        } else {
          toast.error(data.message, {
            position: 'top-center'
          })
        }

      }).catch((error) => {
        console.log(error)

      });

    }
    catch (error) {
      console.log(error)
      toast.error(' Could Not Eddited', {
        position: 'top-center',
      })

    }

  };


  render() {
    const columns: GridColDef[] = [
      {
        field: 'option_tag',
        headerName: 'Option Type ',
        flex: 1,
      },
      {
        field: 'strike_price',
        headerName: 'Strike Price ',
        flex: 1,
      },

      {
        field: 'targets',
        headerName: 'Targets ',
        flex: 1,
        renderCell: (params: GridCellParams) => (
          <>
            <Stack direction='row' spacing={5}>

              <div>
                <p>SL: {params.row.SL}</p>

                <p>T1: {params.row.T1}</p>
              </div>
              <div>
                <p>T2: {params.row.T2}</p>

                <p>T3: {params.row.T3}</p>
              </div>

            </Stack>
          </>
        )
      },


      {
        field: 'actions',
        headerName: 'Target Actions',
        flex: 1,
        renderCell: (params: GridCellParams) => (
          <>
            <Stack direction='column' spacing={2}>

              <div>

                <Button variant='contained' style={{ marginRight: '10px', backgroundColor: params.row.achieved_flag == 0 ? 'green' : 'default' }} onClick={() => this.handleSLClick(params)}>SL</Button>

                <Button variant='contained' style={{ marginLeft: '10px', backgroundColor: params.row.achieved_flag == 1 ? 'green' : 'default' }} onClick={() => this.handleT1Click(params)}>T1</Button>
              </div>
              <div>

                <Button variant='contained' style={{ marginRight: '10px', backgroundColor: params.row.achieved_flag == 2 ? 'green' : 'default' }} onClick={() => this.handleT2Click(params)}>T2</Button>

                <Button variant='contained' style={{ marginLeft: '10px', backgroundColor: params.row.achieved_flag == 3 ? 'green' : 'default' }} onClick={() => this.handleT3Click(params)}>T3</Button>
              </div>
            </Stack>
          </>
        ),
      },
    ];

    const { rows, totalRows, loading, pageSize, page, openDelete, openView, openEdit, isButtonClicked } = this.state;

    return (
      <Card >
        <CardHeader title='Trade' />
        <Box sx={{ height: '70vh', width: "100%" }}>
          <DataGrid
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            pagination
            pageSize={pageSize}
            rowCount={totalRows}
            rowHeight={100}
            page={page}
            paginationMode="server"
            onPageChange={this.handlePageChange}
            loading={loading}
            rowsPerPageOptions={[5, 10, 20]}
            onPageSizeChange={this.handlePageSizeChange}
          />
        </Box>


      </Card>

    );
  }
}

export default TradeList;
