'use client'
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp

interface User {
  id: string;
  username: string;
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  createdAt: Timestamp; // Use Timestamp for Firestore timestamp
}

const MessageComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');

  const currentUserId = 'your_user_id'; // Change this to the actual user ID

  // Fetch Users from Firestore
  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch Messages from Firestore
  const fetchMessages = async () => {
    try {
      const messagesSnapshot = await getDocs(collection(db, 'messages'));
      const messagesData = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleSendMessage = async () => {
    if (!newMessage || !selectedUserId) return;

    const messageData = {
      senderId: currentUserId,
      recipientId: selectedUserId,
      text: newMessage,
      createdAt: Timestamp.now(), // Use Firestore's Timestamp
    };

    try {
      await addDoc(collection(db, 'messages'), messageData);
      setNewMessage('');
      fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex">
      {/* User List */}
      <div className="w-1/3 border-r p-4">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className={`cursor-pointer hover:bg-gray-200 p-2 rounded ${
                selectedUserId === user.id ? 'bg-gray-300' : ''
              }`}
              onClick={() => handleUserSelect(user.id)}
            >
              <span className="text-black">{user.username}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Messages Conversation */}
      <div className="w-2/3 p-4">
        <h2 className="text-lg font-bold mb-4">Messages</h2>
        <div className="bg-white border rounded-md p-4 h-full">
          {selectedUserId ? (
            <div className="space-y-2">
              {messages
                .filter(
                  (message) =>
                    (message.senderId === currentUserId && message.recipientId === selectedUserId) ||
                    (message.recipientId === currentUserId && message.senderId === selectedUserId)
                )
                .map((message) => (
                  <div
                    key={message.id}
                    className={`${
                      message.senderId === currentUserId ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block p-2 rounded-lg ${
                        message.senderId === currentUserId ? 'bg-blue-200 text-black' : 'bg-gray-200 text-black'
                      }`}
                    >
                      {message.text}
                      <span className="block text-xs text-gray-600">
                        {message.createdAt.toDate().toLocaleString()} {/* Convert Timestamp to Date */}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">Select a user to view messages.</p>
          )}
        </div>
        {/* Message Input */}
        <div className="mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="border rounded w-full p-2"
          />
          <button
            onClick={handleSendMessage}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
