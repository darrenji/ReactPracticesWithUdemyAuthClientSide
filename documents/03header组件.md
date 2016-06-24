> touch src/components/header.js

<br>

	import React, { Component } from 'react';
	
	class Header extends Component{
	    render(){
	        return (
	            <nav className="navbar navbar-light">
	                <ul className="nav navbar-nav">
	                    <li className="nav-item">Sign in</li>
	                </ul>
	            </nav>
	        );
	    }
	}
	
	export default Header;

<br>

> src/components/app.js

<br>

	import React, { Component } from 'react';
	import Header from './header';
	
	export default class App extends Component {
	  render() {
	    return (
	      <div>
	        <Header />
	        React simple starter
	      </div>
	    );
	  }
	}

<br>

> localhost:8080

<br>


