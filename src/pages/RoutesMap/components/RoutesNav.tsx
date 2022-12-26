import * as React from 'react';
import {useState} from 'react';
import Box from "@mui/material/Box";
import {Divider, TextField} from "@mui/material";
import {MetaRawData} from "../types";
import {CheckedRoutes} from "../RoutesMap";
import CloseIcon from '@mui/icons-material/Close';
import RouteIcon from '@mui/icons-material/Route';
import IconButton from "@mui/material/IconButton";
import {RoutesNavRow} from "./RoutesNavRow";

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
    const [opened, setOpened] = useState(false);
    const [query, setQuery] = useState('');

    return (
        <>
            <IconButton
                sx={theme => ({
                    position: 'fixed',
                    right: theme.spacing(2),
                    top: theme.spacing(2),
                    zIndex: theme.zIndex.drawer
                })}
                size="medium"
                onClick={() => setOpened(!opened)}>
                {
                    opened ?
                        <CloseIcon fontSize="inherit"/> :
                        <RouteIcon fontSize="inherit"/>
                }
            </IconButton>
            <Box sx={(theme) => ({
                maxWidth: 280,
                width: 280,
                position: 'fixed',
                zIndex: 999,
                right: theme.spacing(1),
                top: theme.spacing(1),
                bgcolor: 'background.paper',
                visibility: opened ? 'visibility' : 'hidden',
            })}>
                <Box sx={(theme) => ({
                    padding: theme.spacing(),
                    maxWidth: 236,
                })}>
                    <TextField
                        size={'small'}
                        onChange={(ev) => {
                            setQuery(ev.target.value.toLowerCase())
                        }}
                        value={query}
                        label="Маршрут" variant="outlined"/>
                </Box>
                <Divider/>
                <Box sx={theme => ({
                    width: '100%',
                    maxWidth: 280,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: `calc(100vh - ${theme.spacing(12)})`,
                    padding: 2,
                })}>
                    {
                        routes.map(({transport, routes},) =>
                            <RoutesNavRow
                                key={transport}
                                transport={transport}
                                query={query}
                                checked={checked}
                                onChangeRoot={handleChangeRoot}
                                onChange={handleChange}
                                metaRawData={routes}
                            />
                        )
                    }
                </Box>
            </Box>
        </>
    );
}
