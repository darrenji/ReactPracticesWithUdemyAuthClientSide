首先来到action.

<br>

> src/actions/index.js

<br>

添加了signupUser方法。

	import axios  from 'axios';
	import { browserHistory } from 'react-router';
	import { AUTH_USER, AUTH_ERROR, UNAUTH_USER } from './types';
	
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

<br>

接着就是reducer.

<br>

> src/reducers/auth_reducer.js

<br>

	import {
	    AUTH_USER,
	    UNAUTH_USER,
	    AUTH_ERROR
	} from '../actions/types';
	
	export default function(state = {}, action){
	    switch(action.type){
	        case AUTH_USER:
	            return { ...state, error: '', authenticated: true };
	        case UNAUTH_USER:
	            return { ...state, authenticated: false };
	        case AUTH_ERROR:
	            return { ...state, error: action.payload };
	    }
	    
	    return state;
	}

<br>

> src/components/auth/signup.js

<br>

包含了表单验证。

	import React, { Component } from 'react';
	import { reduxForm } from 'redux-form';
	import * as actions from '../../actions';
	
	class Signup extends Component {
	    
	    
	    handleFormSubmit(formProps){
	        //call action creator to sign up the user
	        this.props.signupUser(formProps);
	    }
	    
	    renderAlert() {
	        if(this.props.errorMessage){
	            return (
	                <div className="alert alert-danger">
	                    <strong>Oops!</strong>{this.props.errorMessage}
	                </div>
	            );
	        }
	    }
	    
	    
	    render(){
	        
	        const { handleSubmit, fields: { email, password, passwordConfirm }} = this.props;
	        
	        return (
	            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
	                <fieldset className="form-group">
	                    <label>Email:</label>
	                    <input className="form-control" {...email} />
	                    {email.touched && email.error && <div className="error">{email.error}</div>}
	                </fieldset>
	                <fieldset className="form-group">
	                    <label>Password:</label>
	                    <input className="form-control" {...password} type="password" />
	                    {password.touched && password.error && <div className="error">{password.error}</div>}
	                </fieldset>
	                <fieldset className="form-group">
	                    <label>Confirm Password:</label>
	                    <input className="form-control" {...passwordConfirm} type="password" />
	                    {passwordConfirm.touched && passwordConfirm.error && <div className="error">{passwordConfirm.error}</div>}
	                </fieldset>   
	                {this.renderAlert()}
	                <button action="submit" className="btn btn-primary">Sign up</button>
	            </form>
	        );
	    }
	}
	
	
	function validate(formProps){
	    const errors = {};
	    
	    if(!formProps.email){
	        errors.email = 'Please enter an email';
	    }
	    
	    if(!formProps.password){
	        errors.password = 'Please enter a password';
	    }
	    
	    if(!formProps.passwordConfirm){
	        errors.passwordConfirm = 'Please enter a password confirmation';
	    }
	    
	    if(formProps.password !== formProps.passwordConfirm){
	        errors.password = 'Password must match';
	    }
	    
	    return errors;
	}
	
	
	function mapStateToProps(state){
	    return { errorMessage: state.auth.error };
	}
	
	export default reduxForm({
	    form: 'signup',
	    fields: ['email', 'password', 'passwordConfirm'],
	    validate: validate
	}, mapStateToProps, actions)(Signup);


<br>

> src/components/feature.js

<br>

	import React, { Component } from 'react';
	
	class Feature extends Component {
	    render(){
	        return (
	            <div>This is a feature</div>
	        );
	    }
	}
	
	export default Feature;

<br>

> src/components/auth/require_auth.js

<br>
这是一个HOC组件，higer order component:

	import React, { Component } from 'react';
	import { connect } from 'react-redux';
	
	export default function(ComposedComponent) {
	  class Authentication extends Component {
	    static contextTypes = {
	      router: React.PropTypes.object
	    }
	
	    componentWillMount() {
	      if (!this.props.authenticated) {
	        this.context.router.push('/');
	      }
	    }
	
	    componentWillUpdate(nextProps) {
	      if (!nextProps.authenticated) {
	        this.context.router.push('/');
	      }
	    }
	
	    render() {
	      return <ComposedComponent {...this.props} />
	    }
	  }
	
	  function mapStateToProps(state) {
	    return { authenticated: state.auth.authenticated };
	  }
	
	  return connect(mapStateToProps)(Authentication);
	}

<br>

> src/index.js

<br>
把需要验证的组件通过HOC组件包裹一下。

	import React from 'react';
	import ReactDOM from 'react-dom';
	import { Provider } from 'react-redux';
	import { createStore, applyMiddleware } from 'redux';
	import { Router, Route, IndexRoute, browserHistory } from 'react-router';
	import reduxThunk from 'redux-thunk';
	
	import App from './components/app';
	import Signin from './components/auth/signin';
	import Signout from './components/auth/signout';
	import Signup from './components/auth/signup';
	import Feature from './components/feature';
	import RequireAuth from './components/auth/require_auth';
	import reducers from './reducers';
	
	const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
	
	ReactDOM.render(
	  <Provider store={createStoreWithMiddleware(reducers)}>
	    <Router history={browserHistory}>
	        <Route path="/" component={App}>
	            <Route path="signin" component={Signin} />
	            <Route path="signout" component={Signout} />
	            <Route path="signup" component={Signup} />
	            <Route path="feature" component={RequireAuth(Feature)} />
	        </Route>
	    </Router>
	  </Provider>
	  , document.querySelector('.container'));

<br>

> style/style.css

<br>

	.error{
	    color:red;
	}

<br>

> localhost:8080

<br>




