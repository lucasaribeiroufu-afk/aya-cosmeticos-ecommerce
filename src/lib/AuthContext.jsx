import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Mantemos os estados que o seu app consome, assumindo acesso livre/público
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(true);
  const [appPublicSettings, setAppPublicSettings] = useState({ name: "Aya Cosméticos" });

  const checkAppState = async () => {
    // Função neutra para evitar erros de chamada
    setIsLoadingPublicSettings(false);
  };

  const checkUserAuth = async () => {
    // Função neutra
    setIsLoadingAuth(false);
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      window.location.reload();
    }
  };

  const navigateToLogin = () => {
    // Caso precise de login no futuro, redireciona ou faz nada por enquanto
    console.log("Navegação para login desativada temporariamente.");
  };

  return (
    <AuthContext.Provider value={{
      user, 
      isAuthenticated, 
      isLoadingAuth, 
      isLoadingPublicSettings,
      authError, 
      appPublicSettings, 
      authChecked, 
      logout, 
      navigateToLogin,
      checkUserAuth, 
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
