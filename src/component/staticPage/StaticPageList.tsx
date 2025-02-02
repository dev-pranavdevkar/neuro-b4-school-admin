import React, { Component } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import axiosInstance from "../../services/axios";
import { Card, CardHeader } from "@mui/material";
import { Box } from "@mui/system";
import Button from '@mui/material/Button'
import Link from 'next/link'

import Icon from 'src/@core/components/icon'

import StaticPageDeletePopup from './staticPageDelete';
import StaticPageEditPopup from './StaticPageEdit';
import StaticViewPopup from './staticPageView';


interface staticPage {
    id: number;
    page_name: 'string';
    page_content: 'string';

}

interface staticPageListState {
    rows: staticPage[];
    totalRows: number;
    loading: boolean;
    pageSize: number;
    page: number;
    openDelete: boolean,
    openView: boolean,
    openEdit: boolean,
    selectedStaticPage: {},
    selectedStaticPageId: {}

}

class StaticPageList extends Component<{}, staticPageListState> {
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
            selectedStaticPage: {},
            selectedStaticPageId: {}
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
        axiosInstance.get(`/admin/staticPages/getWithParams?pageNo=${page}&limit=${pageSize}`)
            .then((response) => {
                this.setState({
                    rows: response.data.data.data ? response.data.data.data : [],
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
        this.setState({ selectedStaticPage: params.row })
        this.setState({ openView: true });

    };

    handleEditClick = (params: GridCellParams) => {
        this.setState({ selectedStaticPage: params.row })
        this.setState({ openEdit: true });

    };

    handleDeleteClick = (params: GridCellParams) => {
        this.setState({ openDelete: true });
        this.setState({ selectedStaticPageId: params.row.id })

    };

    render() {
        const columns: GridColDef[] = [
            {
                field: 'page_name',
                headerName: 'Page Name',
                flex: 1,
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
                        <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleViewClick(params)}><Icon icon='bx-show' /></Button>

                        <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleEditClick(params)}><Icon icon='bx-edit' /></Button>

                        <Button style={{ color: '#84919d', margin: '-10px' }} onClick={() => this.handleDeleteClick(params)}><Icon icon='ic:baseline-delete' /></Button>
                    </>
                ),
            },
        ];

        const { rows, totalRows, loading, pageSize, page, openDelete, openView, openEdit, selectedStaticPage, selectedStaticPageId } = this.state;

        return (
            <Card >
                <CardHeader title='Families' />
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
                {openDelete ? <StaticPageDeletePopup selectedStaticPageId={selectedStaticPageId} show={openDelete} handleclose={() => this.setState({ openDelete: false }, this.fetchData())} /> : null}

                {openView ? <StaticViewPopup selectedStaticPage={selectedStaticPage} show={openView} handleclose={() => this.setState({ openView: false })} /> : null}

                {openEdit ? <StaticPageEditPopup selectedStaticPage={selectedStaticPage} show={openEdit} handleclose={() => this.setState({ openEdit: false }, this.fetchData())} /> : null}

            </Card>

        );
    }
}

export default StaticPageList;
