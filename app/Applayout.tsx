import React from 'react';
import Header from './header/_components/Header';

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      {/* You can add a Footer component here if needed */}
    </div>
  );
};

export default AppLayout;
