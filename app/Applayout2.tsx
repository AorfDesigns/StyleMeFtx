import React from 'react';
import Header2 from './header/_components/Header2'; // Adjust the import path as necessary

type AppLayout2Props = {
  children: React.ReactNode;
};

const AppLayout2: React.FC<AppLayout2Props> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header2 />
      <main className="flex-grow">{children}</main>
      {/* You can add a Footer component here if needed */}
    </div>
  );
};

export default AppLayout2;
