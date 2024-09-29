'use client'
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

interface User {
  id: string;
  username: string;
  status: 'online' | 'offline'; // Add user status
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  createdAt: Timestamp;
}

const MessageComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');

  const currentUserId = 'your_user_id'; // Change this to the actual user ID

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const messagesSnapshot = await getDocs(collection(db, 'messages'));
      const messagesData = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

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
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, 'messages'), messageData);
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* User List */}
      <div className="w-1/3 border-r p-4 bg-white shadow-md">
        <h2 className="text-lg font-bold mb-4">Designers & Manufacturers</h2>
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className={`flex items-center cursor-pointer p-2 rounded hover:bg-gray-100 transition ${
                selectedUserId === user.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleUserSelect(user.id)}
            >
              {/* Status Indicator */}
              <span
                className={`w-3 h-3 mr-2 rounded-full ${
                  user.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={user.status === 'online' ? 'Online' : 'Offline'}
              ></span>
              <span className="text-gray-700">{user.username}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Messages Conversation */}
      <div className="w-2/3 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4">Chat</h2>
        <div className="flex-grow bg-white border rounded-md p-4 overflow-y-auto">
          {selectedUserId ? (
            <div className="space-y-3">
              {messages
                .filter(
                  (message) =>
                    (message.senderId === currentUserId && message.recipientId === selectedUserId) ||
                    (message.recipientId === currentUserId && message.senderId === selectedUserId)
                )
                .map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`inline-block max-w-xs p-3 rounded-lg ${
                        message.senderId === currentUserId
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <p>{message.text}</p>
                      <span className="block text-xs text-gray-500 mt-1">
                        {message.createdAt.toDate().toLocaleString()}
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
        {selectedUserId && (
          <div className="mt-4 flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow border rounded-l p-2 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-r"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
