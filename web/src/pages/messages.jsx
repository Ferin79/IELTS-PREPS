import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  createRef,
} from "react";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import { ToastContainer, toast } from "react-toastify";
import { MdAddCircleOutline } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { Context } from "../data/context";
import firebase from "../data/firebase";
import "../css/message.scss";

const Messages = () => {
  const mesRef = createRef();

  const { institution } = useContext(Context);

  const [modalShow, setModalShow] = useState(false);
  const [newUsers, setNewUsers] = useState([]);
  const [selectedUserForChat, setSelectedUserForChat] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageUsers, setMessageUsers] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState("");

  const fetchNewUserForChat = useCallback(() => {
    firebase
      .firestore()
      .collection("users")
      .where("institute_id", "==", institution)
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          if (doc.data().email !== firebase.auth().currentUser.email) {
            data.push(doc.data());
          } else {
            setCurrentUser(doc.data());
          }
        });
        setNewUsers([...data]);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [institution]);

  const handleStartNewChat = (clickUser) => {
    let threadID;

    const id = clickUser.userId;
    setSelectedUserForChat(id);

    var sum1 = letterValue(id);
    var sum2 = letterValue(firebase.auth().currentUser.uid);

    if (sum1 < sum2) {
      threadID = id + "_" + firebase.auth().currentUser.uid;
    } else {
      threadID = firebase.auth().currentUser.uid + "_" + id;
    }

    const ThreadRef = firebase.firestore().doc(`/conversations/${threadID}`);
    ThreadRef.get()
      .then((doc) => {
        if (!doc.exists) {
          ThreadRef.set({
            threadID: threadID,
            user1: currentUser,
            user2: clickUser,
            users: [id, firebase.auth().currentUser.uid],
            messages: [],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });

          const data = messageUsers;
          data.push({
            threadID: threadID,
            user1: currentUser,
            user2: clickUser,
            users: [id, firebase.auth().currentUser.uid],
            messages: [],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            displayUser: clickUser,
          });
          setMessageUsers([...data]);
        } else {
          setMessages([...doc.data().messages]);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setModalShow(false));
  };

  const UserModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Start A New Chat
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="new-chat-wrapper">
            {newUsers.length ? (
              newUsers.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="new-chat-user"
                    onClick={() => handleStartNewChat(item)}
                  >
                    <Image
                      className="new-chat-icon"
                      src="https://firebasestorage.googleapis.com/v0/b/ielts-preps.appspot.com/o/profile%2Fxn5T7XqglOe2RWyCPlCulHIKZBa2?alt=media&token=acd1ea12-e7dc-4140-9991-b7147f2cf9c5"
                      roundedCircle
                    />
                    <div>
                      <h4>
                        {item.firstname} {item.lastname}
                      </h4>
                      <p>{item.email}</p>
                      <p>
                        {item.isAdmin
                          ? "Admin"
                          : item.isStaff
                          ? "Staff"
                          : "Student"}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <span></span>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const fetchOldUser = useCallback(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("conversations")
      .where("users", "array-contains", firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        const data = messageUsers;

        const changes = snapshot.docChanges();

        changes.forEach((change) => {
          let chnageDocData = change.doc.data();

          if (change.type === "modified") {
            if (chnageDocData.threadID !== selectedThreadId) {
              data.forEach((item) => {
                if (item.threadID === chnageDocData.threadID) {
                  item.notificationCount = item.notificationCount + 1;
                }
              });
            }
          } else {
            if (
              chnageDocData.user1.userId !== firebase.auth().currentUser.uid
            ) {
              data.push({
                ...chnageDocData,
                displayUser: chnageDocData.user1,
                notificationCount: 0,
              });
            }
            if (
              chnageDocData.user2.userId !== firebase.auth().currentUser.uid
            ) {
              data.push({
                ...chnageDocData,
                displayUser: chnageDocData.user2,
                notificationCount: 0,
              });
            }
          }
        });

        setMessageUsers([...data]);
      });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function letterValue(str) {
    var anum = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7,
      h: 8,
      i: 9,
      j: 10,
      k: 11,
      l: 12,
      m: 13,
      n: 14,
      o: 15,
      p: 16,
      q: 17,
      r: 18,
      s: 19,
      t: 20,
      u: 21,
      v: 22,
      w: 23,
      x: 24,
      y: 25,
      z: 26,
    };

    let sum = 0;
    for (var i = 0; i < str.length; i++) {
      if (isNaN(str[i].toLowerCase())) {
        sum = sum + anum[str[i].toLowerCase()];
      } else {
        sum = sum + parseInt(str[i]);
      }
    }

    return sum;
  }

  const handleSendButton = () => {
    if (textMessage.trim() === "") {
      toast.error("Message Cannot Be Empty");
      return;
    }
    const message = messages;
    message.push({
      from: firebase.auth().currentUser.email,
      text: textMessage,
    });
    setMessages([...message]);
    console.log(selectedThreadId);

    firebase.firestore().doc(`/conversations/${selectedThreadId}`).update({
      messages: message,
    });

    setTextMessage("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    mesRef.current.scrollTop = mesRef.current.scrollHeight;
    mesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchNewUserForChat();
    const unsubscribe = fetchOldUser();

    return () => {
      unsubscribe();
    };
  }, [fetchOldUser, fetchNewUserForChat]);

  useEffect(() => {
    if (
      selectedThreadId &&
      selectedThreadId !== null &&
      selectedThreadId.trim() !== ""
    ) {
      firebase
        .firestore()
        .doc(`/conversations/${selectedThreadId}`)
        .onSnapshot((snapshot) => {
          setMessages([...snapshot.data().messages]);
        });
    }
  }, [selectedThreadId]);

  return (
    <Container>
      <div className="chat-wrapper">
        <div className="sidebar-chat-user-list">
          <div className="user-info">
            <h6>{firebase.auth().currentUser.email}</h6>
            <MdAddCircleOutline size={35} onClick={() => setModalShow(true)} />
          </div>
          <div className="chatter-list-wrapper">
            <ListGroup>
              {messageUsers.length ? (
                messageUsers.map((item, index) => {
                  return (
                    <ListGroup.Item
                      key={index}
                      className="chatter-item"
                      action
                      active={
                        item.displayUser.userId === selectedUserForChat
                          ? true
                          : false
                      }
                      onClick={() => {
                        const data = messageUsers;
                        data.forEach((item2) => {
                          if (item2.threadID === item.threadID) {
                            item2.notificationCount = 0;
                          }
                        });
                        setMessageUsers([...data]);
                        setSelectedUserForChat(item.displayUser.userId);
                        setMessages([...item.messages]);
                        setSelectedThreadId(item.threadID);
                      }}
                    >
                      <Image
                        className="chatter-user-icon"
                        src={`https://firebasestorage.googleapis.com/v0/b/ielts-preps.appspot.com/o/profile%2F${item.displayUser.userId}?alt=media&token=07a0d241-5ab9-445a-ad84-da7f68fe59ee`}
                        roundedCircle
                      />

                      <div>
                        <h4>
                          {item.displayUser.firstname}{" "}
                          {item.displayUser.lastname}
                        </h4>
                        <p>{item.displayUser.email}</p>
                      </div>

                      {item.notificationCount > 0 ? (
                        <>
                          <Badge pill variant="primary">
                            {item.notificationCount}
                          </Badge>
                        </>
                      ) : (
                        <span></span>
                      )}
                    </ListGroup.Item>
                  );
                })
              ) : (
                <span></span>
              )}
            </ListGroup>
          </div>
        </div>
        <div className="main-chat-wrapper">
          {selectedUserForChat ? (
            <>
              <div className="main-message-display" ref={mesRef}>
                {messages.length ? (
                  messages.map((item, index) => {
                    return (
                      <div className="message-item" key={index}>
                        <div
                          className={
                            item.from === firebase.auth().currentUser.email
                              ? "message-parent-text-float-right"
                              : "message-parent"
                          }
                        >
                          <p>From: {item.from}</p>
                          <h5>{item.text}</h5>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span>No Messages to Show. Be First to say "Hi..."</span>
                )}
              </div>
              <div className="message-send-wrapper">
                <Form.Control
                  type="text"
                  placeholder="Type A Message"
                  value={textMessage}
                  onChange={(event) => setTextMessage(event.target.value)}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleSendButton();
                    }
                  }}
                />
                <IoMdSend size={40} onClick={() => handleSendButton()} />
              </div>
            </>
          ) : (
            <span>Select User to Show Message</span>
          )}
        </div>
      </div>
      <ToastContainer />
      <UserModal show={modalShow} />
    </Container>
  );
};

export default Messages;
