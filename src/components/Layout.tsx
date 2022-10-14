import * as React from 'react';
import {PropsWithChildren, useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MenuIcon from '@mui/icons-material/Menu';
import {Link, LinkProps, Outlet, useMatch, useResolvedPath} from "react-router-dom";
import './index.css';

interface CustomLinkProps extends LinkProps {
    icon: JSX.Element
    text: string
}

function CustomLink({children, icon, text, to, ...props}: CustomLinkProps) {
    let resolved = useResolvedPath(to);
    let match = useMatch({path: resolved.pathname, end: true});

    return (
        <ListItem disablePadding>
            <ListItemButton to={to} component={Link}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text}/>
            </ListItemButton>
        </ListItem>
    );
}

export const Layout: React.FC<PropsWithChildren> = ({children}) => {
    const [open, setOpen] = useState(false);
    return <div>
        <IconButton
            sx={{
                position: 'absolute',
                left: 8,
                top: 8
            }}
            onClick={() => setOpen(!open)}><MenuIcon/></IconButton>
        <Drawer
            anchor={'left'}
            open={open}
            onClose={() => setOpen(false)}
        >
            <Box
                sx={{width: 250}}
                role="presentation"
                onClick={() => setOpen(false)}
                onKeyDown={() => setOpen(false)}
            >
                <List>
                    <CustomLink to="/" icon={<InboxIcon/>} text={'Главная'}/>
                    <CustomLink to="/routes" icon={<InboxIcon/>} text={'Маршрути'}/>
                </List>
            </Box>
        </Drawer>
        <Outlet/>
    </div>
}