import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Box from "@mui/material/Box";
import {Divider, FormControlLabel, TextField} from "@mui/material";
import {MetaRawData} from "../types";
import {CheckedRoutes} from "../RoutesMap";

interface Props {
    routes: {
        transport: string
        routes: MetaRawData[]
    }[]
    checked: CheckedRoutes,
    setChecked: (checked: CheckedRoutes) => void
}

export default function RoutesNav({checked, setChecked, routes}: Props) {

    const handleChangeRoot = (event: React.ChangeEvent<HTMLInputElement>) => {
        const transport: keyof typeof checked = event.target.name;
        setChecked({
            ...checked,
            [transport]: {
                checked: event.target.checked,
                indeterminate: false,
                // children: routes.find(x => x.transport === event.target.name)!.routes
                children: Object.keys(checked[transport]!.children)
                    .reduce((acc, k) => ({
                        ...acc,
                        [k]: event.target.checked
                    }), {})
            },
        });
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [transport, id] = event.target.name.split('%')
        const children = {
            ...checked[transport].children,
            [id]: event.target.checked,
        };
        const rootChecked = Object.values(children).some(x => x)
        const rootIndeterminate = rootChecked && Object.values(children).some(x => !x)
        setChecked({
            ...checked,
            [transport]: {
                checked: rootChecked,
                indeterminate: rootIndeterminate,
                children: children
            },
        });
    };
    return (
        <Box sx={(theme) => ({
            maxWidth: 360,
            width: 360,
            position: 'fixed',
            zIndex: 999,
            right: theme.spacing(1),
            top: theme.spacing(1),
            bgcolor: 'background.paper',
        })}>
            <Box sx={(theme) => ({
                padding: theme.spacing()
            })}>
                <TextField size={'small'} label="Маршрут" variant="outlined"/>
            </Box>
            <Divider/>
            <Box sx={theme => ({
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: `calc(100vh - ${theme.spacing(12)})`,
                padding: 2,
            })}>
                {
                    routes.map(({transport, routes}, ) =>
                        <React.Fragment key={transport}>
                            <FormControlLabel
                                label={transport}
                                control={
                                    <Checkbox
                                        name={transport}
                                        checked={checked[transport].checked}
                                        indeterminate={checked[transport].indeterminate}
                                        onChange={handleChangeRoot}
                                    />
                                }
                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                ml: 3,
                            }}>
                                {
                                    routes.map((v) =>
                                        <FormControlLabel
                                            key={v.ri}
                                            label={v.rn}
                                            name={`${transport}%${v.ri}`}
                                            control={<Checkbox
                                                size={'small'}
                                                checked={checked[transport].children[v.ri]}
                                                onChange={handleChange}
                                            />}
                                        />)
                                }
                            </Box>
                        </React.Fragment>)
                }

            </Box>
        </Box>
    );
}
