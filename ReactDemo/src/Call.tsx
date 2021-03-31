import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { io, Socket } from 'socket.io-client'
import useAgora from './hooks/useAgora';
import MediaPlayer from './components/MediaPlayer';
import './Call.css';

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'live' });
const mainSocketInstance = io("http://localhost:3030/").connect()

interface IntiateCall {
  token: String,
  uid: String,
  appId: String,
  channel: String
}

function Call() {
  // const [ appid, setAppId] = useState('ec567d18c6454a7eabb9de9dfda67bb2');
  const [ channel, setChannel ] = useState('');
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  // const [token, setToken] = useState('')
  // const [uid, setUid] = useState('')
  const {
    localAudioTrack, localVideoTrack, leave, join, joinAsAudience, joinState, remoteUsers
  } = useAgora(client);

  useEffect(() => {
    setSocket(mainSocketInstance);
  }, [])

  const initiateConnectionAsAudience = (data : IntiateCall) => {
    console.log(data)
    const { uid, channel, token, appId } = data
    joinAsAudience(appId, channel, token, uid)
  }

  const initiateConnectionAsHost = (data : IntiateCall) => {
    const { uid, channel, token, appId } = data
    join(appId, channel, token, uid);
  }

  const fetchTokenAndJoin = (joiningStatus : String) => {
    if(joiningStatus === "host") {
      socket?.emit('get_token', { channel }, initiateConnectionAsHost)
    } else {
      socket?.emit('get_token', { channel }, initiateConnectionAsAudience)
    }
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
        <label>
          Channel:
          <input type='text' name='channel' onChange={(event) => { setChannel(event.target.value) }} />
        </label>
        {/* <label>
          uid:
          <input type='text' name='channel' onChange={(event) => { setUid(event.target.value) }} />
        </label> */}
        <div className='button-group'>
          {/* <button id='joinAsAudience' type='button' className='btn btn-primary btn-sm' disabled={joinState} onClick={() => {fetchTokenAndJoin("audience")}}>Fetch Token</button> */}
          <button id='leave' type='button' className='btn btn-primary btn-sm' disabled={!joinState} onClick={() => {leave()}}>Leave</button>
          <button id='simpleJoinAsHost' type='button' className='btn btn-primary btn-sm' disabled={joinState} onClick={() => {fetchTokenAndJoin("host")}}>Join</button>
          <button id='simpleJoinAsAudience' type='button' className='btn btn-primary btn-sm' disabled={joinState} onClick={() => {fetchTokenAndJoin("audience")}}>Join as Audience</button>        
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
