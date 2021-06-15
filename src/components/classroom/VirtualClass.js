import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Row, Col, ListGroup, ListGroupItem, ListGroupItemText} from 'reactstrap';
import * as signalR from '@microsoft/signalr'
import Peer from 'peerjs';
import {useParams} from 'react-router';
import ImageGallery from 'react-image-gallery';
// import { FloatingButton, Item } from "react-floating-button";
import FloatingButtons from 'react-floating-buttons'
import { FaMicrophoneAltSlash, FaMicrophoneAlt } from "react-icons/fa"
import endCall from './../../assets/img/endCall.svg';
import shareScreen from './../../assets/img/shareScreen.svg';
import { io } from "socket.io-client";


function VirtualClassRoom(props){
    let {id} = useParams();
    const classID = id;
    const token = localStorage.getItem("REACT_TOKEN_AUTH") || '';
    // let role = localStorage.getItem("userType");
    // role = role.charAt(0).toUpperCase() + role.slice(1);
    let role = "Instructor";
    const host = process.env.BASE_URL_HOST || "http://127.0.0.1:5000";
    function init_video(role){
        console.log(`Initing for ${role}`);
        let myPeer;
        let myStream = null;
        
        function configure_connection(connection){
            connection.on('UserConnected', user => {
                user = JSON.parse(user);
                let userID = user.CallId;
                console.log("Server Reports new user")
                console.log(user);
                addNewUser([userID, user]);
                connectToNewUser(userID, myStream);
            })
            
            connection.on('ClassInfo', infos => {
                infos = JSON.parse(infos);
                console.log("Server Reports Information");
                console.log(infos);
                setStudentDict({});
                Object.entries(infos).forEach(addNewUser);
                configure_peer(myPeer);
            })
            
            connection.on('Classroom', classroomID => {
                console.log(`Original id: 3fa85f64-5717-4562-b3fc-2c963f66afa6, reported id: ${classroomID}`);
            })

            connection.on('MakeMute', mute);

            connection.on('MakeUnmute', unmute);
            
            connection.on('UserDisconnected', userId => {
                console.log("Servers reports disconnect");
                removeUser(userId);
            })
            
            function connectToNewUser(userId, stream) {
                console.log("New User Connected " + userId);
                let options = {
                    'constraints': {
                        'mandatory': {
                        'OfferToReceiveAudio': true,
                        'OfferToReceiveVideo': true
                        },
                        offerToReceiveAudio: 1,
                        offerToReceiveVideo: 1,
                    }
                }
                const call = myPeer.call(userId, stream, options);
                call.on('stream', userVideoStream => {
                    console.log("Got stream from remote peer")
                    addStream(userVideoStream, userId)
                })
                call.on('error', () => {
                    console.log("call reported error");
                })
                call.on('close', () => {
                    console.log("remote peer closed call");
                    // TODO: finish remove stream; I don't think we have to use it for removing the teacher stream
                    removeStream(userId);
                }) 
            }
            function removeUser(id){
                console.log("Removing user");
                if (studentDict[id] !== undefined){
                    setStudentDict((oldStudentDict) => {
                        const newStudentDict = {...oldStudentDict};
                        delete newStudentDict[id];
                        return newStudentDict;
                    });
                } else {
                    setTeacherDict((oldTeacherDict) => {
                        const newTeacherDict = {...oldTeacherDict};
                        delete newTeacherDict[id];
                        return newTeacherDict;
                    });
                }
            }
        }
        function configure_peer(myPeer){

            myPeer.on('call', call => {
                
                console.log("Found Call from " + call.peer);
                
                call.answer(myStream);
        
                call.on('stream', userStream => {
                    console.log("Got stream from remote peer")
                    addStream(userStream, call.peer);
                });
                
                call.on('close', () => {
                    console.log("Peer has closed connection");
                })
            })
            
        }

        let socket;
        navigator.mediaDevices.getUserMedia(
            role === 'Instructor' ? { video: true, audio: true } : {audio: true}
        ).then(stream => {
            myStream = stream;
            console.log("Current user video stream added!");
            socket = io("http://127.0.0.1:5000");
            setSocket(socket);
            socket.on('connect', function() {
                configure_connection(socket);
                socket.on("disconnect", ()=> {stream.getTracks().forEach(function(track) {
                    track.stop();
                  })})

                // TODO: Improve this implementation
                myPeer = new Peer(undefined, {host: "/", port:3001});

                myPeer.on('open', id => {
                    console.log("Peer is open");
                    setMainId(id);
                    socket.emit("JoinRoom", id, classID, token);
                    addStream(myStream, id);
                    console.log(`Muting ${id}`);
                    mute(id);
                });
            });
        });
        

        function removeStream(id){
            // remove 
        }

        function mute(id){
            setMuteList(oldMuteList => ({...oldMuteList, [id]: true}))
        }
        function unmute(id){
            setMuteList(oldMuteList => {
                const newMuteList = {...oldMuteList};
                delete newMuteList[id];
                return newMuteList;
            })
        }

        return async () => {await socket.disconnect()}
    }

    function sendMute(id){
        socket.emit("SendMute", id, classID);
    }

    function sendUnmute(id){
        socket.emit("SendUnMute", id, classID);
    }

    function addNewUser([id, info]){
        console.log("Adding user");

        const user = {[id]: {call_id: id, connected: false, audio: info.HasAudio, video: info.HasVideo, username: info.UserName}}
        if (info.Role === "Student"){
            setStudentDict((oldStudentDict) => ({...oldStudentDict, ...user}));
        } else {
            setTeacherDict((oldTeacherDict) => ({...oldTeacherDict, ...user}));
        }
    }

    function addStream(stream, id){
        setStreams((oldStreams) => ({...oldStreams, [id]: stream}));
        setStudentDict(oldStudentDict => {
            if (oldStudentDict[id] !== undefined){
                const newStudentDict = {...oldStudentDict};
                newStudentDict[id].connected = true;
                return newStudentDict
            }
            return oldStudentDict;
        })
        setTeacherDict(oldTeacherDict => {
            if (oldTeacherDict[id] !== undefined){
                const newTeacherDict = {...oldTeacherDict};
                newTeacherDict[id].connected = true;
                return newTeacherDict
            }
            return oldTeacherDict;
        })
    }

    function createScreen(){
        navigator.mediaDevices.getDisplayMedia().then((screenStream)=>{
            
            let stillAlive = true;
            screenStream.getVideoTracks()[0].onended = async function () {
                stillAlive = false;
                screenSocket.disconnect();
            };
            let screenPeer;
            let screenSocket = io("http://127.0.0.1:5000");
            screenSocket.on('connect', function() {
                console.log("Ohhhhh myyyy goddd we connected");
                // TODO: find a way to close sharing;
                socket.on("disconnect", async () => {
                    await screenSocket.disconnect()
                    if(stillAlive){
                        screenStream.getTracks().forEach(function(track) {
                            track.stop();
                        })
                    }
                })
                
                screenPeer = new Peer(undefined, {host: "/", port: 3001});

                screenPeer.on('open', id => {
                    console.log("Peer is open");
                    addNewUser([id, {Role: "Instructor", HasAudio: false, HasVideo: false, UserName: "My Screen Share" }]);
                    screenSocket.emit("ScreenShare", id, classID);
                    addStream(screenStream, id);
                });
                screenPeer.on('call', call => {
                    
                    console.log("Found Call!!");
                    
                    call.answer(screenStream);
                    
                    call.on('close', () => {
                        console.log("Peer has closed connection");
                    })
                })
            });
            screenSocket.on('UserConnected', user => {
                user = JSON.parse(user);
                let userID = user.CallId;
                console.log("Server Reports success")
                console.log(user);
                addNewUser([userID, user]);
                console.log("New User To Get Screen Share Stream " + userID);
                let options = {
                    'constraints': {
                        'mandatory': {
                        'OfferToReceiveAudio': true,
                        'OfferToReceiveVideo': true
                        },
                        offerToReceiveAudio: 1,
                        offerToReceiveVideo: 1,
                    }
                }
                screenPeer.call(userID, screenStream, options);
            })
        })
    }

    // state studentlist : call_id : {call_id: connected: bool, audio: boolean, username: string}  

    let [studentDict, setStudentDict] = useState({});
    let [teacherDict, setTeacherDict] = useState({});
    let [teacherIds, setTeacherIds] = useState([]);
    const hist = useHistory();

    // state streams : call_id: src 

    let [streams, setStreams] = useState({});

    // state mutelist: call_id: true
    let [mutelist, setMuteList] = useState({})

    // Adding the socket object as a state
    let [socket, setSocket] = useState({});\

    // Adding the main Id from call as state
    let [mainId, setMainId] = useState("");

    useEffect(()=> {
        // TODO: Change this to from local storage
        let end_func = init_video(role);
        return end_func;
    }, []);

    useEffect(() => {
        // Render for image gallary
        setTeacherIds(Object.entries(teacherDict).map(([id, obj]) => ({
            id, 
            username: obj.username, 
            renderItem: item => renderItem('85vh', item, false),
            renderThumbInner: item => renderItem('10vh', item, true),
            // Todo: fix
            originalTitle: obj.username,
            thumbnailTitle: obj.username,
            description: obj.username
        })))
    }, [teacherDict])

    function renderItem(height, item, isMain){
        return (
            <div key={item.id}>
                
                {(streams[item.id] !== undefined) && <video style={{height:height}} ref = {video => {
                    if (video === null) return;
                    video.srcObject = streams[item.id]; 
                    video.onloadedmetadata = () => {
                        video.play()
                    }
                    if (mutelist[item.id] || mainId === item.id || isMain){
                        video.muted=true;
                    }
                    }}
                />}
                {(streams[item.id] === undefined) && <video style={{height:'400px'}}/>}
            </div>
        )
    }

    let buttonsList = [
        {
            src: shareScreen,
            onClick: createScreen
        },
        {
            src: endCall,
            onClick: () => hist.goBack()
        }
    ] 
    return (
        <React.Fragment>
        <div className="wrapper">
            <div className="page-header">
            <FloatingButtons buttonType='hori-dots' buttonColor='#cceeaa' dimension={50} buttonsList={buttonsList} top={'calc(100% - 75px)'} left={'calc(50% - 50px)'} />

                <div className="content">
                    
                <Row>
                    <Col sm="9">
                        <ImageGallery
                            items={teacherIds}
                            lazyLoad={true}
                            infinite={true}
                            showBullets={false}
                            showFullscreenButton={true}
                            showPlayButton={false}
                            showThumbnails={true}
                            showIndex={false}
                            showNav={false}
                            thumbnailPosition='left'
                            slideDuration={40}
                            slideInterval={50000}
                            slideOnThumbnailOver={false}
                            additionalClass="app-image-gallery"
                            useWindowKeyDown={true}
                            style={{height: '500px'}}
                        />
                    </Col>
                    <Col sm="3">
                        {/* Student list */}
                        <ListGroup style={{height: '85vh', backgroundColor: 'transparent', overflowY: 'scroll', border: 'none'}}>
                            {Object.entries(studentDict).map(([id, user]) => (
                                
                                <ListGroupItem key={id} style={{backgroundColor: '#110033'}}>
                                    <ListGroupItemText>
                                        {user.username}
                                        {((role === "Instructor" && (mutelist[id] === undefined || id === mainId)) && 
                                            <FaMicrophoneAlt onClick={()=>sendMute(id)} style={{float: 'right', size: '3em'}}/>)
                                        }
                                        {((role === "Instructor" && mutelist[id] !== undefined) && 
                                            <FaMicrophoneAltSlash onClick={()=>sendUnmute(id)} style={{float: 'right', size: '3em'}}/>)
                                        }
                                        {(streams[id] !== undefined) && <audio ref = {audio => {
                                            if (audio === null) return
                                            audio.srcObject = streams[id]; 
                                            audio.onloadedmetadata = () => {
                                                console.log("Audio metadata loaded, audio should play")
                                                audio.play()
                                            }
                                            if (mutelist[id] || id === mainId){
                                                console.log("muting audio for student");
                                                audio.muted = true;
                                            } else {
                                                audio.muted = false;
                                            }
                                        }}/>}
                                    </ListGroupItemText>
                                    <br />
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>

                    
                </div>
            </div>
        </div>

        </React.Fragment>
    );
}

export default VirtualClassRoom;
