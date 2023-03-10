import React from "react";
import "../css/hello.css"
import Contacts from "./Button";
import {motion} from 'framer-motion'
import {fadeIn} from "../variants";

export class Hello extends React.Component<any, any>{
    render() {
        return(
            <div>
                <div className="formHello">
                    <div className='mx-auto'>
                        <motion.div
                            variants={fadeIn('up', 0.3)}
                            initial="hidden"
                            whileInView={'show'}
                            viewport={{once: false, amount: 0.7}}
                            className='flex flex-col gap-y-12 items-center'>
                            <div className='flex-1 flex flex-row gap-x-12 items-center overflow-hidden'>

                                <div className='rect'></div>

                                <div className="wsLogo">
                                    WS
                                </div>

                                <div className='rect'></div>

                            </div>

                            <div className="text flex-1">
                                Добро пожаловать в наш <br/>  wiki-сервис!
                            </div>

                        </motion.div>
                    </div>
                </div>
                <Contacts/>
            </div>
        );
    }
}