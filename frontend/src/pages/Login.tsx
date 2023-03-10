import React from "react";
import { Container, Input} from "reactstrap";
import {Hello} from '../component/Hello'
import Button from '@mui/material/Button';
import {personLogIn} from "../redux/actions";
import {connect} from "react-redux";
import Box from "@mui/material/Box";
import "../css/loginAndRegistratiom.css"
import {motion} from 'framer-motion'
import {fadeIn} from "../variants";

type Person = {
    usernameOrEmail: string,
    password: string
}
interface IState {
    person: Person,
    message: string
}

interface IDispatchProps {
    personLogIn: () => void;
}

class Login extends React.Component<IDispatchProps, IState>{

    state : IState = {
        person:{
            usernameOrEmail: '',
            password: ''
        },
        message: ''
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let person = {...this.state.person};
        person[name as keyof Person] = value;
        this.setState({person});
    }

    handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        const {person} = this.state;

        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(person),
        })

        if(response.ok){
            this.props.personLogIn()
            window.location.replace('/wiki');
        }else{
            this.setState({
                message: "Неправильный логин или пароль"
            })
        }
    }

    handleSubmitToRegistration(){
        window.location.replace('/registration');
    }

    render() {
        const {person} = this.state;

        return(
            <div>
                <Hello/>
                <Container className="formInput">
                    <div className='mx-auto'>
                        <motion.form
                            variants={fadeIn('down', 0.3)}
                            initial="hidden"
                            whileInView={'show'}
                            viewport={{once: false, amount: 0.7}}
                            className='flex flex-col gap-y-12 items-center overflow-hidden'
                            onSubmit={this.handleSubmit}
                        >
                            <Input className="input" type="text" name="usernameOrEmail" placeholder="ЛОГИН ИЛИ EMAIL" id="usernameOrEmail" value={person.usernameOrEmail}
                                   onChange={this.handleChange} autoComplete="off"/>

                            <Box className='h-[9vh]'>
                                <Input className="input" type="password" name="password" placeholder="ПАРОЛЬ" id="password" value={person.password}
                                       onChange={this.handleChange} autoComplete="off"/>

                                <div className='textError'>
                                    {this.state.message}
                                </div>
                            </Box>

                            <Button
                                className="styleBut"
                                variant="contained"
                                size="medium"
                                type="submit">
                                &emsp;ВОЙТИ&emsp;
                            </Button>

                         </motion.form>
                    </div>
                </Container>
                <Button
                    className="!absolute right-3 !mt-3 styleBut"
                    variant="contained"
                    size="small"
                    onClick={this.handleSubmitToRegistration}
                >
                    РЕГИСТРАЦИЯ
                </Button>
            </div>
        );
    }
}

const mapDispatchToProps = {
    personLogIn
}

const mapStateToProps = (state:any) =>{
    return {
        isLogin: state.app.loading
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)