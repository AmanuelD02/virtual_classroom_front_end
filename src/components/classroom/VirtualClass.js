import React, {useState, useEffect} from 'react';
import {Row, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText} from 'reactstrap';
import * as signalR from '@microsoft/signalr'
import Peer from 'peerjs'

let user_infos = {
    "a2565c20-0175-43e9-8385-8a2d6e3fb7a8":
        {"UserName":"Biruk11 Tesfaye11","Role":"Instructor","ConnectionId":"wFRmaJFZdk3tD2fxPRNnLA","CallId":"a2565c20-0175-43e9-8385-8a2d6e3fb7a8","HasAudio":false,"HasVideo":false},
    "b0d1a360-d507-4141-953d-23d33668a15a":
        {"UserName":"Biruk Solomon","Role":"Student","ConnectionId":"t2l5RHrL9EgcHTF8GoQzvA","CallId":"b0d1a360-d507-4141-953d-23d33668a15a","HasAudio":false,"HasVideo":false},
    "2d13fb40-fd75-4cc4-ad81-474e680f8104":
        {"UserName":"Biruk Solomon","Role":"Student","ConnectionId":"C8D8OJHUWMqywW9adA9YGQ","CallId":"2d13fb40-fd75-4cc4-ad81-474e680f8104","HasAudio":false,"HasVideo":false},
    "1c13fb40-fd75-4cc4-ad81-474e680f8104":
        {"UserName":"Biruk Solomon","Role":"Student","ConnectionId":"C8D8OJHUWMqywW9adA9YGQ","CallId":"1c13fb40-fd75-4cc4-ad81-474e680f8104","HasAudio":false,"HasVideo":false},
    "1d23fb40-fd75-4cc4-ad81-474e680f8104":
        {"UserName":"Biruk Solomon","Role":"Student","ConnectionId":"C8D8OJHUWMqywW9adA9YGQ","CallId":"1d23fb40-fd75-4cc4-ad81-474e680f8104","HasAudio":false,"HasVideo":false},
    "1113fb40-fd75-4cc4-ad81-474e680f8104":
        {"UserName":"Biruk Solomon","Role":"Student","ConnectionId":"C8D8OJHUWMqywW9adA9YGQ","CallId":"1113fb40-fd75-4cc4-ad81-474e680f8104","HasAudio":false,"HasVideo":false},
    "fc66b1f0-a371-4454-9605-fba65e66a862":
        {"UserName":"Biruk Solomon","Role":"Student","ConnectionId":"a7GMMAVXcJgRWm9gBvsz_Q","CallId":"fc66b1f0-a371-4454-9605-fba65e66a862","HasAudio":false,"HasVideo":false}
    }


function VirtualClassRoom(props){
    let query = new URLSearchParams(props.location.search);
    
    function init_video(role){
        console.log(`Initing for ${role}`);
        let myPeer;
        let myStream = null;
        let connection;
        let classID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
        const token = query.get('teacher') ? "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjRjYjdhMTBhLWNmYmYtNDAyMC1mYWNkLTA4ZDkyMzM0NTJkOCxJbnN0cnVjdG9yIiwibmJmIjoxNjIyMzU2NjMwLCJleHAiOjE2MjIzOTI2MzAsImlhdCI6MTYyMjM1NjYzMH0.mLGnSjc1ZiOUrxWYnp_1cNR2-tQ0zj4sU4LohCgICnU": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjVhMmVjZmM2LWQzOWYtNGQ3YS0yNzk2LTA4ZDkyM2Y2MmYxYixTdHVkZW50IiwibmJmIjoxNjIyNDM5NDk5LCJleHAiOjE2MjI0NzU0OTksImlhdCI6MTYyMjQzOTQ5OX0.f7IAx-_us8fNLNK0mfG9aIVdmvqwR1aLhPiAeYnLJ7w";

        // const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjVhMmVjZmM2LWQzOWYtNGQ3YS0yNzk2LTA4ZDkyM2Y2MmYxYixTdHVkZW50IiwibmJmIjoxNjIyNDM5NDk5LCJleHAiOjE2MjI0NzU0OTksImlhdCI6MTYyMjQzOTQ5OX0.f7IAx-_us8fNLNK0mfG9aIVdmvqwR1aLhPiAeYnLJ7w";
        
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
            
            connection.on('UserDisconnected', userId => {
                console.log("Servers reports disconnect");
                removeUser(userId);
            })
            
            function connectToNewUser(userId, stream) {
                console.log("New User Connected " + userId);
                const call = myPeer.call(userId, stream)
                call.on('stream', userVideoStream => {
                    console.log("Got stream from remote peer")
                    addStream(userVideoStream, userId)
                })
                call.on('close', () => {
                    console.log("remote peer closed call");
                    // TODO: finish remove stream; I don't think we have to use it for removing the teacher stream
                    removeStream(userId);
                })
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
                });
            }).catch(function (err) {
                return console.error(err.toString());
            });
        });
        
        
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

        function removeStream(id){
            // remove 
        }

        return async () => {await connection.stop()}
    }

    // state studentlist : call_id : {call_id: connected: bool, audio: boolean, username: string}  

    let [studentDict, setStudentDict] = useState({});
    let [teacherDict, setTeacherDict] = useState({});

    // state streams : call_id: src 

    let [streams, setStreams] = useState({});


    let tempStudentDict = {};
    let tempTeacherDict = {};
    Object.entries(user_infos).forEach(([id, user]) => {
        if (user.Role === "Student"){
            tempStudentDict[id] = {connected: false, audio: user.HasAudio, video: user.HasVideo, username: user.UserName};
        } else {
            tempTeacherDict[id] = {connected: false, audio: user.HasAudio, video: user.HasVideo, username: user.UserName};
        }
    });

    
    useEffect(()=> {
        // TODO: Change this to from local storage
        let end_func = init_video((query.get('teacher') === null) ? "Student" : "Instructor");
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
                        {Object.entries(teacherDict).map(([id, teacher]) => (
                            <div key={id}>
                                <p>{teacher.username}</p>
                                {(streams[id] !== undefined) && <video ref = {video => {
                                    if (video === null) return;
                                    video.srcObject = streams[id]; 
                                    video.addEventListener('loadedmetadata', () => {
                                        console.log("Video metadata loaded, video should play")
                                        video.play()
                                    })}}/>}
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
                                        {(streams[id] !== undefined) && <audio ref = {audio => {
                                            if (audio === null) return
                                            audio.srcObject = streams[id]; 
                                            audio.addEventListener('loadedmetadata', () => {
                                                console.log("Audio metadata loaded, video should play")
                                                audio.play()
                                        })}}/>}
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
