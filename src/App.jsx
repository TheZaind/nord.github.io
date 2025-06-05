import React from 'react';
import { UserProvider } from './context/UserContext';
import { ChannelProvider } from './context/ChannelContext';
import { MessageProvider } from './context/MessageContextNew';
import SidebarComponent from './components/layout/SidebarComponent';
import ChatComponentNew from './components/chat/ChatComponentNew';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <ChannelProvider>
          <MessageProvider>
            <div className="discord-layout">
              <SidebarComponent />
              <ChatComponentNew />
            </div>
          </MessageProvider>
        </ChannelProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
