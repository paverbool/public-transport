import * as React from 'react';
import Box from '@mui/material/Box';
import {DataGrid, GridColDef, GridToolbar, GridValueGetterParams} from '@mui/x-data-grid';
import {useQuery} from "react-query";
import {Transaction, transactionsAPI} from "../../API/transactionsAPI";

const columns: GridColDef<Transaction>[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 100
    },
    {
        field: 'trans_date',
        headerName: 'Дата транзакції',
        width: 150,
        type: 'date',
    },
    {
        field: 'amount',
        headerName: 'Сума',
        type: 'number',
        width: 200,
    },
    {
        field: 'payment_details',
        headerName: 'Деталі',
        width: 400,
    },
    {
        field: 'payment_data',
        headerName: 'Data',
        width: 400,
    },
    {
        field: 'recipt',
        headerName: 'Отримувач',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 250,
        valueGetter: (params: GridValueGetterParams) =>
            `${params.row.recipt_name || ''} (${params.row.recipt_edrpou || ''})`,
    },
    {
        field: 'payer',
        headerName: 'Платник',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 250,
        valueGetter: (params: GridValueGetterParams) =>
            `${params.row.payer_name || ''} (${params.row.payer_edrpou || ''})`,
    },
];

export const Budget: React.FC = () => {
    const transactions = useQuery('transactions', transactionsAPI, {
        placeholderData: {
            transactions: []
        } as any
    });

    return <Box sx={{height: '100vh', width: '100%'}}>
        <DataGrid
            rows={transactions.data.transactions || []}
            columns={columns}
            pageSize={100}
            rowCount={transactions.data.count}
            rowsPerPageOptions={[15, 100]}
            checkboxSelection
            components={{ Toolbar: GridToolbar }}
            disableSelectionOnClick
            experimentalFeatures={{newEditingApi: true}}
            getRowHeight={() => 'auto'}
        />
    </Box>
}