import React from 'react';
import {DataGrid, GridToolbarContainer, GridToolbarExport} from '@mui/x-data-grid';
import {average, calcSpeed, toReadableTime} from "../../helpers";
import * as R from "ramda";
import {gridClasses} from "@mui/material";

const columns = [
    { field: 'bort_name', headerName: 'Бортовой номер', width: 150 },
    { field: 'avSpeed', headerName: 'Средняя скорость', width: 150, description: 'км/ч',},
    { field: 'time', headerName: 'Время', width: 250,  description: 'мин.'},
    { field: 'timeS', headerName: 'Время старта', width: 250 },
    { field: 'timeF', headerName: 'Время финиша', width: 250},
    { field: 'completed', headerName: 'Растояние', width: 250},
];

function CustomToolbar() {
    return (
        <GridToolbarContainer className={gridClasses.toolbarContainer}>
            <GridToolbarExport/>
        </GridToolbarContainer>
    );
}

export const ChartByDistance2Table = (props) => {
    const _data = React.useMemo(() =>
        props.data.map(([bort_name, value]) => {
            const first = R.head(value);
            const last = R.last(value);

            const time = R.prop('timestamp')(last) - R.prop('timestamp')(first);
            return {
                id: bort_name,
                bort_name,
                time: (time / 60).toFixed(2),
                timeS: toReadableTime(R.prop('timestamp')(first)),
                timeF: toReadableTime(R.prop('timestamp')(last)),
                avSpeed: calcSpeed(R.prop('dist')(last), time).toFixed(2),
                completed: R.prop('dist')(last),
            }
        }),[props.data])
    return <div style={{ height: 500, width: '100%' }}>
        <DataGrid rows={_data} columns={columns}
                  components={{
                      Toolbar: CustomToolbar,
                  }}
        />
    </div>
}
