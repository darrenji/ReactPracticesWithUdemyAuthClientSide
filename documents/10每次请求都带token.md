如何让每次请求都带着token呢？

<br>

首先来到action.

<br>

> src/actions/index.js

<br>

添加了fetchMessage方法：

	import axios  from 'axios';
	import { browserHistory } from 'react-router';
	import { AUTH_USER, AUTH_ERROR, UNAUTH_USER, FETCH_MESSAGE } from './types';
	
	const ROOT_URL = 'http://localhost:3090';
	
	
	export function signinUser({email, password}){
	    return function(dispatch){
	        //submit email and password to the server
	        axios.post(`${ROOT_URL}/signin`, { email, password })
	            .then(response => {
	                //if request is good
	                //- update state to indicate user is authenticated
	                dispatch({type: AUTH_USER});
	                //- save the JWT token
	                localStorage.setItem('token', response.data.token);
	                //- redirect to the route /feature
	                browserHistory.push('/feature');
	            })
	            .catch(() => {
	                //if request is bad
	                // - show an error to the user
	                dispatch(authError('Bad Login Info'));
	            });
	        
	    }
	    
	}
	    
	export function signupUser({ email, password }){
	    return function(dispatch){
	        axios.post(`${ROOT_URL}/signup`, { email, password })
	            .then(response => {
	                dispatch({type: AUTH_USER});
	                localStorage.setItem('token', response.data.token);
	                browserHistory.push('/feature');
	            })
	            .catch(response => dispatch(authError(response.data.error)));
	    }
	}
	    
	export function authError(error){
	    return {
	      type: AUTH_ERROR,
	      payload: error
	    };
	}
	    
	export function signoutUser(){
	    localStorage.removeItem('token');
	    return {
	        type: UNAUTH_USER
	    };
	}
	    
	export function fetchMessage(){
	    return function(dispatch){
	        axios.get(ROOT_URL,{
	                headers: {authorization: localStorage.getItem('token')}
	            })
	            .then(response => {
	                dispatch({
	                    type: FETCH_MESSAGE,
	                    payload: response.data.message
	                });
	            });
	    }
	}

以上，axios.get方法中，从localStorage中取出了token.

<br>

> src/actions/types.js

<br>

	export const AUTH_USER = 'auth_user';
	export const UNAUTH_USER = 'unauth_user';
	export const AUTH_ERROR = 'auth_error';
	export const FETCH_MESSAGE = 'fetch_message';

<br>

接着就是reducer.

<br>

> src/reducers/auth_reducer.js

<br>

	import {
	    AUTH_USER,
	    UNAUTH_USER,
	    AUTH_ERROR,
	    FETCH_MESSAGE
	} from '../actions/types';
	
	export default function(state = {}, action){
	    switch(action.type){
	        case AUTH_USER:
	            return { ...state, error: '', authenticated: true };
	        case UNAUTH_USER:
	            return { ...state, authenticated: false };
	        case AUTH_ERROR:
	            return { ...state, error: action.payload };
	        case FETCH_MESSAGE:
	            return { ...state, message: action.payload }
	    }
	    
	    return state;
	}

<br>

> src/components/feature.js

<br>

	import React, { Component } from 'react';
	import { connect } from 'react-redux';
	import * as actions from '../actions';
	
	class Feature extends Component {
	    
	    
	    componentWillMount(){
	        this.props.fetchMessage();
	    }
	    
	    render(){
	        return (
	            <div>{this.props.message}</div>
	        );
	    }
	}
	
	
	function mapStateToProps(state){
	    return { message: state.auth.message }
	}
	
	export default connect(mapStateToProps, actions)(Feature);

<br>

> localhost:8080

<br>






