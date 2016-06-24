import axios  from 'axios';

const ROOT_URL = 'http://localhost:3090';


export function signinUser({email, password}){
    return function(dispatch){
        //submit email and password to the server
        axios.post(`${ROOT_URL}/signin`, { email, password });
    
        //if request is good
        //- update state to indicate user is authenticated
        //- save the JWT token
        //- redirect to the route /feature

        //if request is bad
        // - show an error to the user
    }
    
}