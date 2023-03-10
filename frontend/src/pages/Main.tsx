import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import "../css/main.css"
import { useParams } from "react-router-dom";
import {useState, useEffect} from "react";
import {Header} from "../component/Main/Header";
import Contact from "../component/SIdePanel/Contact";
import {SidePanel} from "../component/SIdePanel/SidePanel";
import {Document} from "../component/Markdown/Document";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import {Note} from "../component/Markdown/Note";
import {useDispatch, useSelector} from "react-redux";
import {logOut} from "../redux/actions";
import {IRootState} from "../index";

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function MainPage() {

    const dispatch = useDispatch()
    const isLogin = useSelector((state: IRootState) => state.app.login)

    const {pageId} = useParams();

    const [checkText, setCheckText] = useState<string | undefined>("")

    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const addText = (text: string | undefined) => {
        setCheckText(text)
    }

    async function handleSubmitToLogout(){
        await fetch('/auth/logout', {
            method: 'POST',
        });
        dispatch(logOut())
        window.location.replace('/login');
    }

    useEffect(() => {
        if(!isLogin){
            window.location.replace("/login");
        }
    }, [])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const toNote = () => {
        window.location.replace("/wiki");
    }

    return (
        <Box sx={{ display: 'flex' }} className='size'>
            <Header
                handleDrawerOpen={handleDrawerOpen}
                open={open}
                handleSubmitToLogout={handleSubmitToLogout}
            />

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <Contact/>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <Button className="noteBtn" variant="text" onClick={toNote}>
                        Заметки
                    </Button>

                </List>
                <Divider />
                <SidePanel checkText={checkText}/>
            </Drawer>

            <Main open={open} >
                <DrawerHeader />
                {(pageId ? <Document addText={addText}/> : <Note/>)}
            </Main>
        </Box>
    );
}