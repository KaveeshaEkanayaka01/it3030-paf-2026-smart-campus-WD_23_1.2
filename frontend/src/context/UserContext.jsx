import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

// Mock users for demo purposes (no login required)
const MOCK_USERS = {
  USER: { userId: 'user_001', userName: 'Alice Johnson', role: 'USER' },
  ADMIN: { userId: 'admin_001', userName: 'Admin User', role: 'ADMIN' },
};

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS.USER);

  const toggleRole = () => {
    setCurrentUser(prev =>
      prev.role === 'USER' ? MOCK_USERS.ADMIN : MOCK_USERS.USER
    );
  };

  const switchToUser = (userId) => {
    setCurrentUser(prev => ({ ...prev, userId }));
  };

  return (
    <UserContext.Provider value={{ currentUser, toggleRole, switchToUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
