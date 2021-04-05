import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { io, Socket } from 'socket.io-client'
import useAgora from './hooks/useAgora';
import MediaPlayer from './components/MediaPlayer';
import axios from 'axios';
import './Call.css';
axios.defaults.baseURL = 'https://qa-web.pally.live/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'live' });

interface IntiateCall {
  token: String,
  uid: String,
  appId: String,
  channel: String
}

interface IProps {
  socket: Socket | undefined;
}

function Call({ socket } : IProps) {
  // const [ appid, setAppId] = useState('ec567d18c6454a7eabb9de9dfda67bb2');
  const [ channel, setChannel ] = useState('');
  // const [token, setToken] = useState('')
  // const [uid, setUid] = useState('')
  const {
    localAudioTrack, localVideoTrack, leave, join, joinAsAudience, joinState, remoteUsers
  } = useAgora(client);

  const initiateConnectionAsHost = (data : IntiateCall) => {
    console.log("Initiate call data")
    console.log(data)
    const { uid, channel, token, appId } = data
    join(appId, channel, token, uid);
  }

  const leaveCallAsHost = () => {
    leave();
  }

  const fetchTokenAndJoin = (joiningStatus : String) => {
    socket?.emit('broadcast_video', { channel }, initiateConnectionAsHost)
  }

  const leaveCall = () => {
    socket?.emit('leave_broadcast', {}, leaveCallAsHost);
  }

  return (
    <div className='call'>
      <form className='call-form'>
        {/* <label>
          AppID:
          <input type='text' name='appid' onChange={(event) => { setAppId(event.target.value) }}/>
        </label> */}
        {/* <label>
          Token(Optional):
          <input type='text' name='token' onChange={(event) => { setToken(event.target.value) }} />
        </label> */}
        {/* <label>
          Channel:
          <input type='text' name='channel' onChange={(event) => { setChannel(event.target.value) }} />
        </label> */}
        {/* <label>
          uid:
          <input type='text' name='channel' onChange={(event) => { setUid(event.target.value) }} />
        </label> */}
        <div className='button-group'>
          {/* <button id='joinAsAudience' type='button' className='btn btn-primary btn-sm' disabled={joinState} onClick={() => {fetchTokenAndJoin("audience")}}>Fetch Token</button> */}
          <button id='leave' type='button' className='btn btn-primary btn-sm' disabled={!joinState} onClick={() => {leaveCall()}}>Leave</button>
          <button id='simpleJoinAsHost' type='button' className='btn btn-primary btn-sm' disabled={joinState} onClick={() => {fetchTokenAndJoin("host")}}>Join</button>
          {/* <button id='simpleJoinAsAudience' type='button' className='btn btn-primary btn-sm' disabled={joinState} onClick={() => {fetchTokenAndJoin("audience")}}>Join as Audience</button>         */}
        </div>
      </form>
      <div className='player-container'>
        <div className='local-player-wrapper'>
          <p className='local-player-text'>{localVideoTrack && `localTrack`}{joinState && localVideoTrack ? `(${client.uid})` : ''}</p>
          <MediaPlayer videoTrack={localVideoTrack} audioTrack={localAudioTrack}></MediaPlayer>
        </div>
        {remoteUsers.map(user => (<div className='remote-player-wrapper' key={user.uid}>
            <p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>
            <MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
          </div>))}
      </div>
    </div>
  );
}

export default Call;
