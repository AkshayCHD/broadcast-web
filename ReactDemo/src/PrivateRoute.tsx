import  React from  "react";
import { Route, Redirect } from  "react-router-dom";

interface IProps {
    render: any;
    path: string;
    exact: boolean;
    token: string;
}

const  PrivateRoute = (props : IProps) => {
    return  props.token ? (<Route  path={props.path} exact={props.exact} render={props.render} />) : 
        (<Redirect  to="/login"  />);
};
export  default  PrivateRoute;