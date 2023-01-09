import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Check from '@mui/icons-material/Check';
import ListItemIcon from "@mui/material/ListItemIcon";

export type EnabledFiltersKeys = 'onlyChecked';

interface Props<E extends Record<EnabledFiltersKeys, boolean> = Record<EnabledFiltersKeys, boolean>> {
    enabled: E
    setEnabled: (value: (((prevState: E) => E) | E)) => void
}

export default function RoutesNavFilter({enabled, setEnabled}: Props) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onClick = () => setEnabled({...enabled, 'onlyChecked': !enabled['onlyChecked']});
    return (
        <div>
            <IconButton
                sx={theme => ({marginLeft: theme.spacing(0.5)})}
                size="medium"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <FilterAltIcon fontSize="inherit"/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{'aria-labelledby': 'basic-button',}}
            >
                <MenuItem onClick={onClick}>
                    <ListItemIcon>
                        {enabled['onlyChecked'] ? <Check/> : null}
                    </ListItemIcon>
                    Тільки вибрані
                </MenuItem>
            </Menu>
        </div>
    );
}