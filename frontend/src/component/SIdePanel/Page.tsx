import React, {useEffect, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CustomTreeItem from './CustomTreeItem'
import {ContextMenu} from "./ContextMenu";
import Button from "@mui/material/Button";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Box from "@mui/material/Box";
import {ModalWindow} from "./Modal";
import { useParams } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import {getPages, openSpace, treePages} from "../../redux/actions";
import "../../css/sidePanel.css"
import {IRootState} from "../../index";
import {Action} from "redux";

type Props = {
    idSpace: number,
    checkText: string | undefined
}

interface IComp {
    createdAt: Date,
    id: number,
    name: string,
    shared: boolean,
    subpages?: readonly IComp[],
    updatedAt: Date
}

export const Page = ({idSpace, checkText}:Props) =>{

    const dispatch = useDispatch()
    const pageList = useSelector((state: IRootState) => state.app.pages)
    const treeP = useSelector((state: IRootState) => state.app.tree)
    const spaceOp = useSelector((state: IRootState) => state.app.openSpace)
    const spaceN = useSelector((state: IRootState) => state.app.space)

    const { pageId } = useParams();
    const { spaceId } = useParams();

    const[editId, setEditId] = useState<number>()

    const[error, setError] = useState("")

    const[newObject, setNewObject] = useState({
        name: '',
        shared: spaceN.shared
    })

    const [openSave, setOpenSave] = useState(false);

    const [redirectId, setRedirectId] = useState(0)

    const[addSub, setAddSub] = useState(false)

    const [open, setOpen] = useState(false);

    const[document, setDocument] = useState({
        text: checkText
    });

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleOpenSave = () => setOpenSave(true);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEditId(undefined)
        setNewObject({
            name: '',
            shared: spaceN.shared
        })
        setAddSub(false)
        setError("")
    }

    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, name:string, shared:boolean, id:number) => {
        setAnchorEl(event.currentTarget);
        setEditId(id);
        setNewObject({
            name: name,
            shared: spaceN.shared ? shared : false
        })
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setEditId(undefined);
        setNewObject({
            name: '',
            shared: spaceN.shared
        });
    };

    const handleCloseMenuForEdit = () => {
        setAnchorEl(null);
        setOpen(true);
    };

    const handleCloseMenuForAdd = () => {
        setAnchorEl(null);
        setOpen(true);
        setAddSub(true)
        setNewObject({
            name: '',
            shared: spaceN.shared
        })
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewObject({
            ...newObject,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        treeOpen()
    }, [])

    const treeOpen = () => {
        if(spaceOp !== String(idSpace)){
            dispatch(treePages([]))
            dispatch(openSpace(String(idSpace)))
        }
        getList()
    }

    async function getList() {
        dispatch<Action>(getPages(idSpace))
    }

    async function handleSubmit() {
        if(!errorEmpty()){
            let response = await fetch('/spaces/' + idSpace + '/pages' + (editId ? '/' + editId : ''), {
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
                    shared: spaceN.shared
                })
            }else {
                setError("Страница уже существует")
            }
        }
    }

    async function AddSubpage() {
        if(!errorEmpty()){
            let response = await fetch('/spaces/' + idSpace + '/pages/' + editId, {
                method: 'POST',
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
                    shared: spaceN.shared
                })
            }else {
                setError("Страница уже существует")
            }
        }
    }


    async function backParent(response: Response){
        if(response.ok){
            let json = await response.json()
            window.location.replace("/wiki/space/" + idSpace +"/page/" + json.id);
        }else {
            window.location.replace("/wiki/space/" + idSpace);
        }
    }

    async function remove() {
        if(String(editId) === pageId) {
            let response = await fetch("/spaces/" + idSpace + "/pages/" + pageId + "/parent");

            await fetch('/spaces/' + idSpace + '/pages/' + editId, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            getList()
            handleCloseMenu()

            await backParent(response)
        }else {
            await fetch('/spaces/' + idSpace + '/pages/' + editId, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            handleCloseMenu()
            await getList();
            setEditId(undefined)
            setNewObject({
                name: '',
                shared: spaceN.shared
            })
        }
    }

    const errorEmpty = () => {

        let error = false;

        if(newObject.name.length === 0){
            setError("Поле не должно быть пустым")
            error = true;
        }

        return error;
    }

    async function save(){
        let newDoc = false
        let response = await fetch('/spaces/' + spaceId + '/pages/' + pageId + '/document');
        if(!response.ok){
            newDoc = true
        }
        await fetch('/spaces/' + spaceId + '/pages/' + pageId + '/document', {
            method: (newDoc ? 'POST' : 'PUT'),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(document),
        })
        redirect(redirectId)
    }

    const checkSave = async (id: number) => {
        let response = await fetch('/spaces/' + spaceId + '/pages/' + pageId + '/document');
        if (response.ok) {
            let json = await response.json()
            if (json.text !== checkText) {
                handleOpenSave()
            } else {
                redirect(id)
            }
        } else {
            if (checkText !== "") {
                handleOpenSave()
            } else {
                redirect(id)
            }
        }
    }

    const toPage = async (id: number) => {
        setDocument({
            text: checkText
        })
        setRedirectId(id)
        if (pageId !== undefined) {
            await checkSave(id)
        } else {
            redirect(id)
        }
    }

    const redirect = (id: number) => {
        window.location.replace("/wiki/space/" + idSpace + "/page/" + id);
    }

    const renderTree = (nodes: IComp) => {
        return(
            <CustomTreeItem key={String(nodes.id)} nodeId={String(nodes.id)}
                            label={
                                <Button
                                    className="spaceBtn"
                                    variant="text"
                                    size="small"

                                    onClick={()=> toPage(nodes.id)}
                                    onContextMenu={(e) => handleClickMenu(e, nodes.name, nodes.shared, nodes.id)}
                                >
                                    {(String(nodes.id) === pageId ?  <DescriptionOutlinedIcon className='!h-5 !w-5 !text-blue-470'/> :  <DescriptionOutlinedIcon className='!h-5 !w-5'/> )}
                                    <div>&emsp;</div>
                                    {(String(nodes.id) === pageId ? <div className='!mt-1 !text-blue-470'>{nodes.name}</div> : <div className="mt-1">{nodes.name}</div>)}
                                </Button>
                            }
            >
                {Array.isArray(nodes.subpages)
                    ? nodes.subpages.map((node:any) => renderTree(node))
                    : null}
            </CustomTreeItem>
        );
    }


    const OList = pageList.map((l: IComp) => {
        return (
            <div  key={l.id}
                  onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                  }}>
                {renderTree(l)}
            </div>
        )
    });

    return(
        <div>
            <IconButton
                className='!absolute !ml-14 !-mt-[44px]'
                aria-label="delete"
                size="small"
                onClick={handleOpen}
            >
                <AddIcon className="!h-6 !w-6"/>
            </IconButton>

            <Box className='scrollbar'>
                <TreeView
                    aria-label="rich object"
                    defaultCollapseIcon={<ExpandMoreIcon className="!text-slate-500" />}
                    defaultExpanded={treeP}
                    defaultExpandIcon={<ChevronRightIcon className="!text-slate-500" />}
                >
                    {OList}
                </TreeView>
            </Box>

            <ContextMenu
                anchorEl={anchorEl}
                openMenu={openMenu}
                handleCloseMenu={handleCloseMenu}
                handleCloseMenuForAdd={handleCloseMenuForAdd}
                handleCloseMenuForEdit={handleCloseMenuForEdit}
                remove={remove}
            />

            <ModalWindow
                open={open}
                handleClose={handleClose}
                newObject={newObject}
                handleChange={handleChange}
                addSub={addSub}
                AddSubpage={AddSubpage}
                handleSubmit={handleSubmit}
                editId={editId}
                error={error}
                shared={spaceN.shared}
                placeholder={"Страница"}
            />

            <Modal
                open={openSave}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className='modalWindowNotSave'>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <div className="text-white mx-5 my-3">
                            Последние изменения не сохранены
                        </div>
                    </Typography>
                    <Button variant="text"  className="notSave !right-36" onClick={save}>
                        Cохранить
                    </Button>
                    <Button variant="text" className="notSave !right-5" onClick={() => redirect(redirectId)}>
                        Продолжить
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}