state方面：

<br>

![](5.png)

<br>

> src/index.js

<br>

添加路由：

	import React from 'react';
	import ReactDOM from 'react-dom';
	import { Provider } from 'react-redux';
	import { createStore, applyMiddleware } from 'redux';
	import { Router, Route, IndexRoute, browserHistory } from 'react-router';
	
	import App from './components/app';
	import reducers from './reducers';
	
	const createStoreWithMiddleware = applyMiddleware()(createStore);
	
	ReactDOM.render(
	  <Provider store={createStoreWithMiddleware(reducers)}>
	    <Router history={browserHistory}>
	        <Route path="/" component={App}>
	        </Route>
	    </Router>
	  </Provider>
	  , document.querySelector('.container'));