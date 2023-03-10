import React from "react";
import "../../css/main.css"
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {Container} from "reactstrap";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import LogoutIcon from '@mui/icons-material/Logout';
import Box from "@mui/material/Box";

type Props = {
    handleDrawerOpen: () => void,
    open: boolean,
    handleSubmitToLogout: () => void,
}

export const Header = ({handleDrawerOpen, open, handleSubmitToLogout}: Props) =>{

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <Container className='header' open={open}>

            <div className="flex justify-between px-3 py-[2px]">
                <IconButton
                    color="inherit"
                    onClick={handleDrawerOpen}
                    size="small"
                >
                    <MenuIcon className='iconMenu' />
                </IconButton>

                <Box className="flex flex-row gap-x-4 items-center">
                    <div className="rectMain"></div>

                    <div className="wsLogoMain">
                        WS
                    </div>

                    <div className="rectMain"></div>
                </Box>

                <IconButton
                    size="small"
                    id="basic-button"
                    aria-controls={openMenu ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <AccountCircleOutlinedIcon className='iconMenu'/>
                </IconButton>

            </div>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <Button className="!text-red-600 !w-full" color="primary" type="submit" onClick={handleSubmitToLogout}>
                    <LogoutIcon className="!h-5 !text-red-600"/>
                    &emsp;ВЫХОД
                </Button>
            </Menu>

        </Container>
    );
}