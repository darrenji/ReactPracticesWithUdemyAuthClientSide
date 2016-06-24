首先来到action部分。

<br>

> src/actions/index.js

<br>

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

- signinUser不像其它的action一样返回对象，而是返回函数，这里隐式用到了redux-thunk,它允许我们使用dispatch对action等有更多的控制
- 使用localStorage作为本地缓存
- browserHistory作为路由转换

<br>

当然，所有的action操作名称放在了一个单独的文件中。

<br>

> src/actions/types.js

<br>

	export const AUTH_USER = 'auth_user';
	export const UNAUTH_USER = 'unauth_user';
	export const AUTH_ERROR = 'auth_error';

<br>

说完action,就自然到了reducer,用他们来更改状态。

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
	            return { ...state, authenticated: true };
	        case UNAUTH_USER:
	            return { ...state, authenticated: false };
	        case AUTH_ERROR:
	            return { ...state, error: action.payload };
	    }
	    
	    return state;
	}

<br>

reducer是需要注册的。

<br>

> src/reducers/index.js

<br>

	import { combineReducers } from 'redux';
	import { reducer as form } from 'redux-form';
	import authReducer from './auth_reducer';
	
	const rootReducer = combineReducers({
	   form,
	   auth: authReducer
	});
	
	export default rootReducer;

<br>

接着要来到组件部分了，首先来到Signin组件。

<br>

> src/components/auth/signin.js

<br>

	import React, { Component } from 'react';
	import { reduxForm } from 'redux-form';
	import * as actions from '../../actions';
	
	class Signin extends Component {
	    
	    
	    handleFormSubmit({email, password}){
	        console.log(email, password);
	        
	        //need to do sth to log user in
	        this.props.signinUser({email, password});
	    }
	    
	    renderAlert(){
	        if(this.props.errorMessage){
	            return (
	                <div className="alert alert-danger">
	                    <strong>Oops!</strong> {this.props.errorMessage}
	                </div>
	            );
	        }
	    }
	    
	    
	    render(){
	        
	        const { handleSubmit, fields: { email, password }} = this.props;
	        
	        return  (
	            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
	                <fieldset className="form-group">
	                    <label>Email:</label>
	                    <input {...email} className="form-control" />
	                </fieldset>
	                <fieldset className="form-group">
	                    <label>Password:</label>
	                    <input {...password} type="password" className="form-control" />
	                </fieldset>   
	                {this.renderAlert()}
	                <button action="submit" className="btn btn-primary">Sign in</button>
	            </form>
	        );
	    }
	}
	
	
	function mapStateToProps(state){
	    return { errorMessage: state.auth.error };
	}
	
	export default reduxForm({
	    form: 'signin',
	    fields: ['email', 'password']
	}, mapStateToProps, actions)(Signin);

<br>

> src/components/auth/signout.js

<br>


	import React, { Component } from 'react';
	import { connect } from 'react-redux';
	import * as actions from '../../actions';
	
	
	class Signout extends Component {
	    componentWillMount(){
	        this.props.signoutUser();
	    }
	    
	    render(){
	        return <div>Sorry to see you go ...</div>;
	    }
	}
	
	export default connect(null, actions)(Signout);

<br>

> src/components/header.js

<br>

	import React, { Component } from 'react';
	import { connect } from 'react-redux';
	import { Link } from 'react-router';
	
	class Header extends Component{
	    
	    renderLinks(){
	        if(this.props.authenticated){
	            //show a link to sign out
	            return <li className="nav-item">
	                <Link className="nav-link" to="/signout">Sign Out</Link>
	            </li>
	        } else {
	            //show a link to sign in or sign up
	            return [
	                <li className="nav-item" key={1}>
	                    <Link className="nav-link" to="/signin">Sign In</Link>
	                </li>,
	                <li className="nav-item" key={2}>
	                    <Link className="nav-link" to="/signup">Sign Up</Link>
	                </li>
	            ];
	            
	        }
	        
	        
	    }
	    
	    render(){
	        return (
	            <nav className="navbar navbar-light">
	                <Link to="/" className="navbar-brand">Redux Auth</Link>
	                <ul className="nav navbar-nav">
	                    {this.renderLinks()}
	                </ul>
	            </nav>
	        );
	    }
	}
	
	
	function mapStateToProps(state){
	    return {
	        authenticated: state.auth.authenticated
	    }
	}
	
	export default connect(mapStateToProps)(Header);

<br>

> src/index.js

<br>

	import React from 'react';
	import ReactDOM from 'react-dom';
	import { Provider } from 'react-redux';
	import { createStore, applyMiddleware } from 'redux';
	import { Router, Route, IndexRoute, browserHistory } from 'react-router';
	import reduxThunk from 'redux-thunk';
	
	import App from './components/app';
	import Signin from './components/auth/signin';
	import Signout from './components/auth/signout';
	import reducers from './reducers';
	
	const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
	
	ReactDOM.render(
	  <Provider store={createStoreWithMiddleware(reducers)}>
	    <Router history={browserHistory}>
	        <Route path="/" component={App}>
	            <Route path="signin" component={Signin} />
	            <Route path="signout" component={Signout} />
	        </Route>
	    </Router>
	  </Provider>
	  , document.querySelector('.container'));

<br>

> http://localhost:8080/signin

<br>









