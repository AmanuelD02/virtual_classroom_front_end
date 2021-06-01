import React, {useState, useEffect} from 'react';
import {Row, Col, ListGroup, ListGroupItem, Button, ListGroupItemText} from 'reactstrap';
import * as signalR from '@microsoft/signalr'
import Peer from 'peerjs';
import {useParams} from 'react-router';


function VirtualClassRoom(props){
    let query = new URLSearchParams(props.location.search);
    let id = useParams();
    const classID = id;
    const token = localStorage.getItem("REACT_TOKEN_AUTH") || '';
    let role = localStorage.getItem("userType");
    role = role.charAt(0).toUpperCase() + role.slice(1);

    function init_video(role){
        console.log(`Initing for ${role}`);
        let myPeer;
        let myStream = null;
        
        function configure_connection(connection){
            connection.on('UserConnected', user => {
                user = JSON.parse(user);
                let userID = user.CallId;
                console.log("Server Reports success")
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
                
                console.log("Found Call!!");
                
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


        connection = new signalR.HubConnectionBuilder().withUrl(`http://127.0.0.1:51044/p/Courses/3fa85f64-5717-4562-b3fc-2c963f66afa6/Classrooms/${classID}/join`).build();
        setConnection(connection);
        navigator.mediaDevices.getUserMedia(
            role === 'Instructor' ? { video: true, audio: true } : {audio: true}
        ).then(stream => {
            myStream = stream;
            console.log("Current user video stream added!");

            connection.start().then(function () {
                configure_connection(connection);

                // TODO: Improve this implementation
                myPeer = new Peer(undefined, {host: "/", port: 3001});

                myPeer.on('open', id => {
                    console.log("Peer is open");
                    connection.invoke("JoinRoom", id, classID, token);
                    addStream(myStream, id);
                    console.log(`Muting ${id}`);
                    mute(id);
                });
            }).catch(function (err) {
                return console.error(err.toString());
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

        return async () => {await connection.stop()}
    }

    function sendMute(id){
        connection.invoke("SendMute", id, classID);
    }

    function sendUnmute(id){
        connection.invoke("SendUnMute", id, classID);
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
            let connection = new signalR.HubConnectionBuilder().withUrl(`http://127.0.0.1:51044/p/Courses/3fa85f64-5717-4562-b3fc-2c963f66afa6/Classrooms/${classID}/join`).build();
            let screenPeer;
            connection.start().then(() => {
                
                screenPeer = new Peer(undefined, {host: "/", port: 3001});

                screenPeer.on('open', id => {
                    console.log("Peer is open");
                    addNewUser([id, {Role: "Instructor", HasAudio: false, HasVideo: false, UserName: "My Screen Share" }]);
                    connection.invoke("ScreenShare", id, classID);
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

            connection.on('UserConnected', user => {
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

    // state streams : call_id: src 

    let [streams, setStreams] = useState({});

    // state mutelist: call_id: true
    let [mutelist, setMuteList] = useState({})

    // Adding the connection object as a state
     let [connection, setConnection] = useState({});

    useEffect(()=> {
        // TODO: Change this to from local storage
        let end_func = init_video(role);
        return end_func;
    }, []);

    return (
        <React.Fragment>
        <div className="wrapper vh-100">
            <div className="page-header">
                <div className="content">
                    
                <Row>
                    <Col sm="9">
                        Teacher video stream
                        {(role == "Instructor" && 
                            <Button onClick={createScreen}>Create Screen</Button> 
                        )}
                        {Object.entries(teacherDict).map(([id, teacher]) => (
                            <div key={id}>
                                <p>{teacher.username} {id}</p>
                                {console.log(streams)}
                                {(streams[id] !== undefined) && <video ref = {video => {
                                    if (video === null) return;
                                    video.srcObject = streams[id]; 
                                    video.onloadedmetadata = () => {
                                        console.log("Video metadata loaded, video should play")
                                        video.play()
                                    }
                                    if (mutelist[id]){
                                        console.log("muting video for teacher");
                                        video.muted=true;
                                    }
                                    }}/>}
                            </div>
                        ))}
                    </Col>
                    <Col sm="3">
                        {/* Student list */}
                        <ListGroup>
                            {Object.entries(studentDict).map(([id, user]) => (
                                
                                <ListGroupItem key={id} color='dark'>
                                    <ListGroupItemText>
                                        {user.username} <br />
                                        Video: {user.video.toString()} 
                                        Audio: {user.audio.toString()} 
                                        CallID: {id}
                                        Connected: {user.connected.toString()} 
                                        {((role === "Instructor" && mutelist[id] === undefined) && 
                                            <Button onClick={()=>sendMute(id)}> Mute </Button>)
                                        }
                                        {((role === "Instructor" && mutelist[id] !== undefined) && 
                                            <Button onClick={()=>sendUnmute(id)}> Unmute </Button>)
                                        }
                                        {(streams[id] !== undefined) && <audio ref = {audio => {
                                            if (audio === null) return
                                            audio.srcObject = streams[id]; 
                                            audio.onloadedmetadata = () => {
                                                console.log("Audio metadata loaded, audio should play")
                                                audio.play()
                                            }
                                            if (mutelist[id]){
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
