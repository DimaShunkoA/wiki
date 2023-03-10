import React, {useEffect, useState} from "react";
import List from '@mui/material/List';
import IconButton from "@mui/material/IconButton";
import "../../css/sidePanel.css"
import Divider from "@mui/material/Divider";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Space} from "./Space";
import {Page} from "./Page";
import {ModalWindow} from "./Modal";
import { useParams } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {cleanPages, getSpace, spaceNameAndShared} from "../../redux/actions";
import {IRootState} from "../../index";
import {Action} from "redux";

type Props = {
    checkText: string | undefined
}

export const SidePanel = ({checkText}:Props) => {

    const dispatch = useDispatch()
    const spaceN = useSelector((state: IRootState) => state.app.space)

    const { spaceId } = useParams();

    const[editId, setEditId] = useState<number>()

    const[error, setError] = useState("")

    const[newObject, setNewObject] = useState({
        name: '',
        shared: true
    })

    const[spaceOpenId, setSpaceOpenId] = useState<number>(Number(spaceId))

    const [open, setOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEditId(undefined)
        setNewObject({
            name: '',
            shared: true
        })
        setError("")
    }

    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, name:string, shared:boolean, id:number) => {
        setAnchorEl(event.currentTarget);
        setEditId(id);
        setNewObject({
            name: name,
            shared: shared
        })
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setEditId(undefined);
        setNewObject({
            name: '',
            shared: true
        });
    };

    const handleCloseMenuForEdit = () => {
        setAnchorEl(null);
        setOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewObject({
            ...newObject,
            [e.target.name]: e.target.value
        });
    }

    const handleBack = () => {
        setSpaceOpenId(Number(undefined))
    }

    useEffect(() => {
        if(spaceId !== undefined){
            getNameSpace()
        }
        getList()
    }, [])

    async function getList() {
        dispatch<Action>(getSpace())
    }

    async function getNameSpace(){
        let response = await fetch('/spaces/' + spaceId);
        let json = await response.json()
        dispatch(spaceNameAndShared(json.name, json.shared))
    }

    async function handleSubmit() {
        if(!errorEmpty()){
            let response = await fetch('/spaces' + (editId ? '/' + editId : ''), {
                method: (editId) ? 'PUT' : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newObject),
            })

            if(response.ok){
                handleClose()
                handleCloseMenu()
                getList();
                setEditId(undefined)
                setNewObject({
                    name: '',
                    shared: true
                })
            }else {
                setError("Пространство уже существует")
            }
        }
    }

    async function remove() {
        await fetch(`/spaces/`+ editId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        handleCloseMenu()
        await getList();
        setNewObject({
            name: '',
            shared: true
        })
        if(spaceId === String(editId)){
            window.location.replace("/wiki");
        }
        setEditId(undefined)
    }

    const errorEmpty = () => {

        let error = false;

        if(newObject.name.length === 0){
            setError("Поле не должно быть пустым")
            error = true;
        }

        return error;
    }

    const toPage = (id:number, name:string, shared:boolean) =>{
        setSpaceOpenId(id)
        dispatch(spaceNameAndShared(name, shared))
        dispatch(cleanPages())
    }

    const def = () => {}

    return(
        <div>
            {( !spaceOpenId ?
                    <div>
                        <Space
                            handleOpen={handleOpen}
                            anchorEl={anchorEl}
                            openMenu={openMenu}
                            handleCloseMenu={handleCloseMenu}
                            handleCloseMenuForEdit={handleCloseMenuForEdit}
                            remove={remove}
                            toPage={toPage}
                            handleClickMenu={handleClickMenu}
                        />
                    </div>
                    :
                    <div>
                        <List>
                            <div className="spaceName">
                                {spaceN.name}
                            </div>
                        </List>
                        <Divider />
                        <List>
                            <IconButton
                                className='!ml-3'
                                aria-label="delete"
                                size="small"
                                onClick={handleBack}
                            >
                                <ArrowBackIcon className="!h-6 !w-6"/>
                            </IconButton>

                            <Page
                                idSpace={spaceOpenId}
                                checkText={checkText}
                            />

                        </List>

                    </div>
            )}
            <ModalWindow
                open={open}
                handleClose={handleClose}
                newObject={newObject}
                handleChange={handleChange}
                addSub={false}
                AddSubpage={def}
                handleSubmit={handleSubmit}
                editId={editId}
                error={error}
                shared={true}
                placeholder={"Пространство"}
            />
        </div>
    )
}