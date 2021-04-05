import React, { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import axios from 'axios';

interface IProps {
    setToken: Dispatch<SetStateAction<string>>
}

interface IErrors {
    name: string,
    email: string
}

export default function Login({ setToken } : IProps) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<IErrors>({ name: '', email: ''})
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    const getToken = () => {
        console.log("Getting Token")
        axios.post('/api/auth/login', {
            name: name,
            email: email
        })
        .then(function (response) {
            console.log(response);
            const { data } = response;
            const { token } = data
            console.log(token)
            setToken(token)
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { name, value } = event.target;
        let currentErrors = errors;
        let nameError = '';
        let emailError = '';
        switch (name) {
          case 'name': 
            nameError = 
              value.length < 5
                ? 'Name must be 5 characters long!'
                : '';
            setErrors({
                ...errors,
                name: nameError
            })
            if(!nameError) {
                setName(value)      
            }
            break;
          case 'email': 
            emailError = 
              validEmailRegex.test(value)
                ? ''
                : 'Email is not valid!';
            
            setErrors({
                ...errors,
                email: emailError
            })       
            if(!nameError) {
                setEmail(value)
            }
            break;
          default:
            break;
        }
      } 
    const validateForm = (errors: IErrors) => {
        let valid = true;
        Object.values(errors).forEach(
            // if we have an error string set valid to false
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }
    const handleSubmit = (event: MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(validateForm(errors)) {
            getToken()
        } else {
            alert('Invalid Form')
        }
    }
    console.log(errors.name)

    console.log(errors.email)
    return (
        <div className='wrapper'>
            <div className='form-wrapper'>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} noValidate >
                <div className='name'>
                <label htmlFor="name">Full Name</label>
                <input type='text' name='name' onChange={handleChange} noValidate />
                {errors.name.length > 0 && 
                    <span className='error'>{errors.name}</span>}
                </div>
                <div className='email'>
                <label htmlFor="email">Email</label>
                <input type='email' name='email' onChange={handleChange} noValidate />
                {errors.email.length > 0 && 
                <span className='error'>{errors.email}</span>}
                </div>
                <div className='submit'>
                <button>Create</button>
                </div>
            </form>
            </div>
        </div>
    )
};