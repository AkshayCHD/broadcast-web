import React, { MouseEvent, useEffect, useState } from 'react';
import Call from './Call';
import PrivateRoute from './PrivateRoute'
import Login from './Login'
import {
  Route,
  Switch,
  useHistory
} from "react-router-dom";
import { io, Socket } from 'socket.io-client'

export default function App() {    
  const [token, setToken] = useState<string>('')
    const [socket, setSocket] = useState<Socket | undefined>(undefined)
    const history = useHistory();
    useEffect(() => {
      if(token !== "") {
        const mainSocketInstance = io("https://qa-web.pally.live/", {
          transports: ["websocket"],
          query: { token: token },
        }).connect()
        setSocket(mainSocketInstance)
        mainSocketInstance.emit('join_broadcast', { body: {} })
        history.push("/")
      }
    }, [token])

    const serverErrorHandler = (data: any) => {
      console.error(data)
    }
    useEffect(() => {
      socket?.on("server_error", serverErrorHandler);
      return () => {
        socket?.off("server_error", serverErrorHandler);
      }
    }, [socket])
    return (
      <Switch>
        <PrivateRoute token={token} exact={true} path="/" render={() => <Call socket={socket} />} />
        <Route  path='/login' render={() => <Login setToken={setToken} />}/>
      </Switch>
    )
};