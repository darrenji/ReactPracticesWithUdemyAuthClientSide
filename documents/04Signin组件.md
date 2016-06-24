> npm install redux-form --save

<br>

创建Signin组件。

<br>

> src/components/signin.js

<br>

	import React, { Component } from 'react';
	import { reduxForm } from 'redux-form';
	
	class Signin extends Component {
	    
	    
	    handleFormSubmit({email, password}){
	        console.log(email, password);
	        
	        //need to do sth to log user in
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
	                    <input {...password} className="form-control" />
	                </fieldset>   
	                <button action="submit" className="btn btn-primary">Sign in</button>
	            </form>
	        );
	    }
	}
	
	export default reduxForm({
	    form: 'signin',
	    fields: ['email', 'password']
	})(Signin);

reduxForm相当于react-redux中的connect方法

<br>

**redux-form有自己的reducer。**

<br>

> src/reducers/index.js

<br>

	import { combineReducers } from 'redux';
	import { reducer as form } from 'redux-form';
	
	const rootReducer = combineReducers({
	   form
	});
	
	export default rootReducer;

<br>

接下来，为Signin组件配置路由。

> src/index.js

<br>

	import React from 'react';
	import ReactDOM from 'react-dom';
	import { Provider } from 'react-redux';
	import { createStore, applyMiddleware } from 'redux';
	import { Router, Route, IndexRoute, browserHistory } from 'react-router';
	
	import App from './components/app';
	import Signin from './components/auth/signin';
	import reducers from './reducers';
	
	const createStoreWithMiddleware = applyMiddleware()(createStore);
	
	ReactDOM.render(
	  <Provider store={createStoreWithMiddleware(reducers)}>
	    <Router history={browserHistory}>
	        <Route path="/" component={App}>
	            <Route path="signin" component={Signin} />
	        </Route>
	    </Router>
	  </Provider>
	  , document.querySelector('.container'));

<br>

由于Signin对应的路由配置成了被嵌套路由，在路由关系中App是Signin的父组件，所以，需要在App组件中添加{this.props.children}。

> src/components/app.js

<br>

	import React, { Component } from 'react';
	import Header from './header';
	
	export default class App extends Component {
	  render() {
	    return (
	      <div>
	        <Header />
	        {this.props.children}
	      </div>
	    );
	  }
	}

<br>

> localhost:8080

<br>

填写表单，点击Sign in按钮，控制台有输出。

<br>



