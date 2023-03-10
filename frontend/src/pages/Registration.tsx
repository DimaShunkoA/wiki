import React from "react";
import {Container, FormGroup, Input} from "reactstrap";
import {Hello} from '../component/Hello'
import Button from '@mui/material/Button';
import "../css/loginAndRegistratiom.css"
import {motion} from 'framer-motion'
import {fadeIn} from "../variants";

type Person = {
    username: string,
    password: string,
    name: string,
    email: string
}

interface IState {
    person: Person,
    repeatPassword: string,
    checkUsername: string,
    checkEmail: string,
    checkName: string,
    checkPassword: string,
    checkRepeatPassword: string
}

export class Registration extends React.Component<{}, IState>{

    state: IState ={
        person: {
            username: '',
            password: '',
            name: '',
            email: ''
        },
        repeatPassword: '',
        checkUsername: '',
        checkEmail: '',
        checkName: '',
        checkPassword: '',
        checkRepeatPassword: ''
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let person = {...this.state.person};
        person[name as keyof Person] = value;
        this.setState({person});
    }

    handleChangeRepeatPassword = (event: React.ChangeEvent<HTMLInputElement>) =>{
        this.setState({
            repeatPassword: event.target.value
        });
    }

    handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        const {person} = this.state;

        if(!this.errorEmpty()){
            let response = await fetch('/auth/registration', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':  'application/json'
                },
                body: JSON.stringify(person),
            })

            let json = await response.json()

            if (response.status === 409) {
                this.error(json.errors)
            }else if(response.status === 400){
                this.error(["Email введен неккоректно"])
            }else if(response.status === 201){
                window.location.replace('/login');
            }
        }
    }

    errorEmpty = () => {
        const {person} = this.state;
        const {repeatPassword} = this.state;

        this.setState({
            checkUsername: '',
            checkEmail: '',
            checkName: '',
            checkPassword: '',
            checkRepeatPassword: ''
        })

        let isError = false;

        if(person.name.length === 0){
            this.setState({
                checkName: "Имя не должно быть пустым"
            })
            isError = true;
        }

        if(person.username.length <= 3){
            this.setState({
                checkUsername: "Логин не должен быть короче 4 символов"
            })
            isError = true;
        }

        if(person.email.length === 0){
            this.setState({
                checkEmail: "Email не должен быть пустым"
            })
            isError = true;
        }

        if(person.password.length <= 5){
            this.setState({
                checkPassword: "Пароль не должен быть короче 6 символов"
            })
            isError = true;
        }

        if(person.password !== repeatPassword){
            this.setState({
                checkRepeatPassword: "Пароли не совпадают"
            })
            isError = true;
        }

        return isError;
    }

    error = (errors : string[]) => {

        this.setState({
            checkUsername: '',
            checkEmail: ''
        })

        errors.forEach((entry: string) => {
            if(entry.includes("логин")){
                this.setState({
                    checkUsername: entry
                })
            }else if(entry.includes("Email") || entry.includes("адресом")){
                this.setState({
                    checkEmail: entry
                })
            }
        })
    }

    handleSubmitToLogin(){
        window.location.replace('/login');
    }

    render() {
        const {person} = this.state;
        const {repeatPassword} = this.state;

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
                            onSubmit={this.handleSubmit}
                            className='flex flex-col gap-y-6 items-center overflow-hidden'
                        >
                            <FormGroup className='h-[9vh]'>
                                <Input className="input" type="text" name="name" placeholder="Имя" id="name" value={person.name}
                                       onChange={this.handleChange} autoComplete="name"/>

                                <div className="textError">
                                    {this.state.checkName}
                                </div>
                            </FormGroup>

                            <FormGroup className='h-[9vh]'>
                                <Input className="input" type="text" name="username" placeholder="Логин" id="username" value={person.username}
                                       onChange={this.handleChange} autoComplete="username"/>

                                <div className="textError">
                                    {this.state.checkUsername}
                                </div>
                            </FormGroup>

                            <FormGroup className='h-[9vh]'>
                                <Input className="input" type="text" name="email" placeholder="Email" id="email" value={person.email}
                                       onChange={this.handleChange} autoComplete="email"/>

                                <div className="textError">
                                    {this.state.checkEmail}
                                </div>
                            </FormGroup>

                            <FormGroup className='h-[9vh]'>
                                <Input className="input" type="password" name="password" placeholder="Пароль" id="password" value={person.password}
                                       onChange={this.handleChange} autoComplete="password"/>

                                <div className="textError">
                                    {this.state.checkPassword}
                                </div>
                            </FormGroup>

                            <FormGroup className='h-[9vh] mb-4'>
                                <Input className="input" type="password" name="repeatPassword" placeholder="Повторите пароль" id="repeatPassword" value={repeatPassword}
                                       onChange={this.handleChangeRepeatPassword} autoComplete="repeatPassword"/>

                                <div className="textError">
                                    {this.state.checkRepeatPassword}
                                </div>
                            </FormGroup>

                            <Button
                                className="styleBut"
                                variant="contained"
                                size="medium"
                                type="submit">
                                ЗАРЕГИСТРИРОВАТЬСЯ
                            </Button>
                        </motion.form>
                    </div>
                </Container>
                <Button
                    className="!absolute right-3 !mt-3 styleBut"
                    variant="contained"
                    size="small"
                    onClick={this.handleSubmitToLogin}
                >
                    &emsp;ВХОД&emsp;
                </Button>
            </div>
        );
    }
}