import * as React from 'react';
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {Input} from "reactstrap";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import "../../css/sidePanel.css"

type Obj = {
    name: string,
    shared: boolean
}

type Props ={
    open: boolean,
    handleClose: () => void,
    newObject: Obj,
    handleChange:(e: React.ChangeEvent<HTMLInputElement>) => void,
    addSub:boolean,
    AddSubpage: () => void,
    handleSubmit: () => void
    editId: number | undefined,
    error: string,
    shared: boolean,
    placeholder: string
}

export const ModalWindow = ({open, handleClose, newObject, handleChange, addSub, AddSubpage, handleSubmit, editId, error, shared, placeholder}: Props) => {
    return(
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className='modalWindowEditOrAdd'>
                    <Input
                        className='addSpaceOrPage'
                        type="text"
                        name="name"
                        id="name"
                        placeholder={placeholder}
                        value={newObject.name}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                    <div className='text-red-600 font-bold ml-4'>
                        {error}
                    </div>
                    <FormControl className='!ml-4'>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="shared"
                            value={newObject.shared}
                            onChange={handleChange}
                        >
                            {shared &&
                            <FormControlLabel className="text-white" value={true} control={<Radio
                                sx={{color: '#FFFFFF', '&.Mui-checked': {color: '#8482FF',},}} size="small"/>}
                                              label="публичный"/>
                            }

                            <FormControlLabel className="text-white" value={false} control={<Radio
                                sx={{color: '#FFFFFF', '&.Mui-checked': {color: '#8482FF',},}} size="small"/>}
                                              label="приватный"/>
                        </RadioGroup>
                    </FormControl>
                    {(addSub ?
                            <Button
                                className='addOrEditBtn'
                                variant="text"
                                size="small"
                                onClick={AddSubpage}
                            >
                                Создать
                            </Button>
                            :
                            <Button
                                className='addOrEditBtn'
                                variant="text"
                                size="small"
                                onClick={handleSubmit}
                            >
                                {(!editId ? <div>Создать</div> : <div>Изменить</div>)}
                            </Button>
                    )}
                </Box>
            </Modal>
        </div>
    )
}