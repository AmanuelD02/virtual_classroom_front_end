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

    
    function init_video(role){
        let myPeer;
        let myStream;
        let classID = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
        const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjVhMmVjZmM2LWQzOWYtNGQ3YS0yNzk2LTA4ZDkyM2Y2MmYxYixTdHVkZW50IiwibmJmIjoxNjIyNDM5NDk5LCJleHAiOjE2MjI0NzU0OTksImlhdCI6MTYyMjQzOTQ5OX0.f7IAx-_us8fNLNK0mfG9aIVdmvqwR1aLhPiAeYnLJ7w";
        
        function configure_connection(connection){
            connection.on('UserConnected', user => {
                let userID = user.callId;
                console.log("Server Reports success")
                console.log(user)
                connectToNewUser(userID, myStream)
            })
            
            connection.on('ClassInfo', infos => {
                infos = JSON.parse(infos);
                console.log("Server Reports Information");
                console.log(infos);
                setStudentDict({});
                Object.entries(infos).forEach(addNewUser);
            })
            
            connection.on('Classroom', classroomID => {
                console.log(`Original id: 3fa85f64-5717-4562-b3fc-2c963f66afa6, reported id: ${classroomID}`);
            })
            
            connection.on('UserDisconnected', userId => {
                console.log("Servers reports disconnect")
            })
            
            function connectToNewUser(userId, stream) {
                console.log("New User Connected " + userId);
                return;
                const call = myPeer.call(userId, stream)
                call.on('stream', userVideoStream => {
                    console.log("Got stream from remote peer")
                    addVideoStream(userVideoStream, userId)
                })
                call.on('close', () => {
                    console.log("remote peer closed call");
                    removeStream(userId);
                })
            }
            function addNewUser([id, info]){
                console.log("Adding user");
                const user = {[id]: {call_id: id, connected: false, audio: info.HasAudio, username: info.UserName}}
                if (info.Role === "Student"){
                    console.log("Got here");
                    console.log(user);
                    setStudentDict((oldStudentDict) => ({...oldStudentDict, ...user}));
                } else {
                    setTeacherDict((oldTeacherDict) => ({...oldTeacherDict, ...user}));
                }
            }
        }
        function configure_peer(myPeer){
            myPeer.on('open', id => {
                console.log("Peer is open");
                connection.invoke("JoinRoom", id, classID, token);
            });
            
            myPeer.on('call', call => {
                console.log("Found Call!!");
                
                call.answer(myStream);
        
                call.on('stream', userVideoStream => {
                    console.log("Got stream from remote peer")
                    addVideoStream(userVideoStream, call.peer)
                });
                
                call.on('close', () => {
                    console.log("Peer has closed connection");
                })
            })
            
        }


        var connection = new signalR.HubConnectionBuilder().withUrl(`http://127.0.0.1:51044/p/Courses/3fa85f64-5717-4562-b3fc-2c963f66afa6/Classrooms/${classID}/join`).build();
        navigator.mediaDevices.getUserMedia(
            role === 'Student' ? { video: true, audio: true } : {audio: true}
        ).then(stream => {
            myStream = stream;
            console.log("Current user video stream added!");
            // addVideoStream(stream, myPeer.id)

            connection.start().then(function () {
                configure_connection(connection);

                // TODO: Improve this implementation
                myPeer = new Peer(undefined);

                myPeer.on('open', id => {
                    console.log("Peer is open");
                    // TODO: Make sure it works
                    connection.invoke("JoinRoom", id, classID, token);
                });

                // TODO: should be called after JoinClassroom
                // myPeer = new Peer(undefined);
                // configure_peer(myPeer);
            }).catch(function (err) {
                return console.error(err.toString());
            });
        });
        
        
        
        function addVideoStream(stream, id) {
            console.log("video stream added");
            console.log(id);
            if (studentDict[id] !== null){
                studentDict[id] = {call_id: id, connected: true, audio: true, username: "Unknown"};
                setStudentDict(studentDict);
            } else {
                teacherDict[id] = {call_id: id, connected: true, audio: true, username: "Unknown"};
                setTeacherDict(teacherDict);
            }
        }

        function removeStream(id){
            // remove 
        }
    }


    // state studentlist : {call_id: connected: bool, audio: boolean, username: string}  

    let [studentDict, setStudentDict] = useState({});
    let [teacherDict, setTeacherDict] = useState({});


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
        init_video("Instructor");
    }, []);

    return (
        <React.Fragment>
        <div className="wrapper vh-100">
            <div className="page-header">
                <div className="content">
                    
                <Row>
                    <Col sm="9">
                        Teacher video stream
                        <video />
                    </Col>
                    <Col sm="3">
                        {/* Student list */}
                        <ListGroup>
                            {Object.entries(studentDict).map(([id, user]) => (
                                
                                <ListGroupItem key={id} color='dark'>
                                    <ListGroupItemText>
                                        {user.username} <br />
                                        Video: {user.audio} 
                                        Audio: {user.HasAudio} 
                                        CallID: {id}
                                        Connected: {user.connected} 
                                        {(user.src !== null) && <audio src={user.src} onLoadedMetadata={(e)=>e.target.play()}/>}
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
