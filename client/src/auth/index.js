import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    ADD_WRONG_CREDENTIALS: "ADD_WRONG_CREDENTIALS",
    REMOVE_WRONG_CREDENTIALS: "REMOVE_WRONG_CREDENTIALS" 
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        wrongCredentials: null,
        isWrongCredentials: false
    });

    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    wrongCredentials: null,
                    isWrongCredentials: false
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    wrongCredentials: null,
                    isWrongCredentials: false
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    wrongCredentials: null,
                    isWrongCredentials: false
                })
            }

            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    wrongCredentials: null,
                    isWrongCredentials: false
                })
            }

            case AuthActionType.ADD_WRONG_CREDENTIALS: {
                console.log(payload.message)
                return setAuth({
                    user: null,
                    loggedIn: false,
                    wrongCredentials: payload.message,
                    isWrongCredentials: true
                })
            }

            case AuthActionType.REMOVE_WRONG_CREDENTIALS: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    wrongCredentials: null,
                    isWrongCredentials: false
                })
            }

            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        console.log(response.status)
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.loginUser = async function(userData, store) {
        console.log('auth.loginUser')
        console.log(userData)

        const response = await api.loginUser(userData);

        if (response.status === 200) {
            if(response.data.success){
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
            else {

                authReducer({
                    type: AuthActionType.ADD_WRONG_CREDENTIALS,
                    payload: {
                        message: response.data.errorMessage
                    }
                })
            }
        }

    }

    auth.logoutUser = async function(store) {
        console.log('auth method')
        const response = await api.logoutUser();
        if(response.status===200){
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: {

                }
            })
        }
    }

    auth.registerUser = async function(userData, store) {
        const response = await api.registerUser(userData);      
        if (response.status === 200) {
            if(response.data.success){
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
            else{
                authReducer({
                    type: AuthActionType.ADD_WRONG_CREDENTIALS,
                    payload: {
                        message: response.data.errorMessage
                    }
                })
            }
        }

    }

    auth.closeErrorMessage = async function(store) {
        authReducer({
            type: AuthActionType.REMOVE_WRONG_CREDENTIALS,
            payload:{

            }
        })
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };