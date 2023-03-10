import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {IRootState} from "../index";

export const Redirect = () => {

    const isLogin = useSelector((state: IRootState) => state.app.login)

    useEffect(() => {
        if(isLogin){
            window.location.replace('/wiki');
        }else {
            window.location.replace('/login');
        }
    })

    return (
        <></>
    );
}