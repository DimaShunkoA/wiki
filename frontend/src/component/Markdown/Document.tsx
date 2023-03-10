import React, { useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import { Markdow} from "./Markdow";

type Props = {
    addText:(text: string | undefined) => void
}

export const Document = ({addText}:Props) =>{

    const {spaceId} = useParams();
    const { pageId } = useParams();

    const[newDoc, setNewDoc] = useState(true);

    const[document, setDocument] = useState({
        text: ''
    });

    const[edit, setEdit] = useState(false);

    const CloseEdit = () => setEdit(false);
    const OpenEdit = () => setEdit(true);


    useEffect(() => {
         getText()
    }, [setDocument])

    async function getText(){
        let response = await fetch('/spaces/' + spaceId + '/pages/' + pageId + '/document');
        if(response.ok){
            let json = await response.json()
            setDocument({
                text: json.text
            })
            addText(json.text)
            setNewDoc(false)
        }
    }

    async function save(){

        await fetch('/spaces/' + spaceId + '/pages/' + pageId + '/document', {
            method: (newDoc ? 'POST' : 'PUT'),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(document),
        })
        await getText()
    }

    const newText = (val: string | undefined) => {
        setDocument({text: val!})
        addText(val)
    }

    return (
        <div data-color-mode="light">
            <Markdow
                save={save}
                edit={edit}
                CloseEdit={CloseEdit}
                OpenEdit={OpenEdit}
                document={document}
                newText={newText}
            />
        </div>
    );
}