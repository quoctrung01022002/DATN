import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { ListGroup, ListGroupItem, Form, Button } from "react-bootstrap";
import * as signalR from "@microsoft/signalr";
import "../../css/Supportt.css";
import { useOutletContext } from "react-router-dom"; // Import useOutletContext
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const SupportComponent = () => {
  const [customers, setCustomers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [imageUser, setImageUser] = useState(null);
  const cookies = new Cookies(null, { path: "/" });
  const [connection, setConnection] = useState(null);
  const [, , , , , userInfo, setUserInfo] = useOutletContext(); // Use useOutletContext

  console.log("haha", selectedUser);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7138/chatHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection.on("ReceiveMessage", (message) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];

        if (
          !updatedMessages.find((item) => item.messageId === message.messageId)
        ) {
          updatedMessages.push(message);
        }

        return updatedMessages;
      });
      // if((message.senderId === selectedUser && message.receiverId === userInfo.userId)
      //   || message.senderId ===userInfo.userId ) {
      //}
    });

    newConnection
      .start()
      .then(() => {
        setConnection(newConnection);
        console.log("Connected!", newConnection);
      })
      .catch((error) => {
        console.error("Error starting connection:", error);
      });

    return () => {
      newConnection.stop();
    };
  }, []);

  useEffect(() => {
    axios
      .get("https://localhost:7138/api/Chat/Customers")
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  }, []);

  const getMessagesBySenderId = (userId, receiverId) => {
    console.log("Getting messages", userId, receiverId);
    axios
      .get(
        `https://localhost:7138/api/Chat/user/${userId}/receiver/${receiverId}`
      )
      .then((response) => {
        setMessages(response.data[0].chatMessages);
        setImageUser(response.data[0].imageUser);
      })
      .catch((error) => {
        console.error(
          `Error fetching messages for userId ${userId} and receiverId ${receiverId}:`,
          error
        );
      });
  };

  const handleImageClick = (receiverId) => {
    // Change parameter name to receiverId
    setSelectedUser(receiverId);
    getMessagesBySenderId(userInfo.userId, receiverId); // Pass userInfo.userId as senderId and receiverId as receiverId
  };

  const handleMessageSend = () => {
    if (!selectedUser || !newMessage) return;
    const messageData = {
      receiverId: selectedUser,
      content: newMessage,
    };
    axios
      .post(`https://localhost:7138/api/Chat/SendMessage`, messageData, {
        headers: {
          Authorization: `Bearer ${cookies.get("accessToken")}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Message sent successfully");
        setNewMessage("");
        getMessagesBySenderId(userInfo.userId, selectedUser);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div id="supportt-container" className="container">
      <ListGroup style={{ flex: 3 }}>
        {customers.map((customer) => (
          <ListGroupItem
            key={customer.userId}
            onClick={() => handleImageClick(customer.userId)}
            action
          >
            <img
              src={`https://localhost:7138${customer.imageUser}`}
              className="card-img-top rounded-circle"
              alt={customer.imageUser}
              style={{ maxWidth: "50px", height: "auto", marginRight: "10px" }}
            />
            {customer.firstName} {customer.lastName}
          </ListGroupItem>
        ))}
      </ListGroup>

      <h1>Messages</h1>
      <ListGroup>
      <div style={{ maxHeight: "350px", overflowY: "auto" }} className="message-list">
  {selectedUser &&
    messages.map((message) => (
      <div className="row" key={message.messageId}>
        <div
          className={`col-md-6 ${
            message.senderId == userInfo.userId ? "offset-md-6" : ""
          }`}
        >
          <ListGroupItem
            className={
              message.senderId == userInfo.userId ? "right-message" : ""
            }
          >
            <div style={{ display: "flex", justifyContent: message.senderId == userInfo.userId ? "flex-end" : "flex-start" }}>
              {message.senderId == userInfo.userId ? (
                <>
                  <div
                    style={{
                      marginTop: "5px",
                      marginBottom: "5px",
                      textAlign: "right",
                    }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      {message.sentAt
                        ? new Date(message.sentAt).toLocaleTimeString("en-US")
                        : ""}
                    </span>
                    {message.sentAt
                      ? new Date(message.sentAt).toLocaleDateString("en-US")
                      : "-"}
                    <br />
                    {message.content}
                  </div>
                  <img
                    src={`https://localhost:7138${
                      message.senderId == userInfo.userId
                        ? userInfo.imageUser
                        : customers.find(
                            (customer) => customer.userId == selectedUser
                          ).imageUser
                    }`}
                    className="card-img-top"
                    alt={message.imageUser}
                    style={{
                      maxWidth: "20%",
                      height: "20%",
                      marginRight: "-10px",
                      marginLeft: "20px",
                      borderRadius: "50%",
                    }}
                  />
                </>
              ) : (
                <>
                  <img
                    src={`https://localhost:7138${
                      message.senderId == userInfo.userId
                        ? userInfo.imageUser
                        : customers.find(
                            (customer) => customer.userId == selectedUser
                          ).imageUser
                    }`}
                    className="card-img-top"
                    alt={message.imageUser}
                    style={{
                      maxWidth: "20%",
                      height: "20%",
                      marginRight: "20px",
                      marginLeft: "-15px",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    style={{ marginTop: "30px", marginBottom: "5px" }}
                  >
                    <span style={{ marginRight: "5px" }}>
                      {message.sentAt
                        ? new Date(message.sentAt).toLocaleTimeString("en-US")
                        : ""}
                    </span>
                    {message.sentAt
                      ? new Date(message.sentAt).toLocaleDateString("en-US")
                      : "-"}
                    <br />
                    {message.content}
                  </div>
                </>
              )}
            </div>
          </ListGroupItem>
        </div>
      </div>
    ))}
</div>

        {selectedUser && (
          <div className="message-form-container">
            <Form style={{ width: "100%" }} className="message-form">
              <div
                style={{ display: "flex" }}
                className="message-input-container"
              >
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Type your message..."
                  className="message-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button
                  variant="primary"
                  className="message-send-button"
                  onClick={handleMessageSend}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </div>
            </Form>
          </div>
        )}
      </ListGroup>
    </div>
  );
};

export default SupportComponent;
