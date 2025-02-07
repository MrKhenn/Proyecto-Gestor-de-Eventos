import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';

// ✅ Definir el tipo de las props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Estado de carga

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    console.log("🔍 Token encontrado:", token);

    if (token) {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Usuario autenticado:", response.data);
        setUser({ username: response.data.username });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("❌ Error verificando autenticación:", error);
        setIsAuthenticated(false);
        logout();
      }
    } else {
      console.log("⚠️ No hay token, cerrando sesión...");
      setIsAuthenticated(false);
      logout();
    }
    setLoading(false); // Termina de cargar la verificación
  }, []);

  const login = async (username: string, password: string): Promise<string | null> => {
    console.log("🔄 Intentando iniciar sesión con:", username);
    try {
      const response = await axios.post('http://localhost:4000/api/login', { username, password });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser({ username: response.data.username });
        setIsAuthenticated(true);
        console.log("✅ Sesión iniciada, usuario:", response.data.username);
        return null;
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      return "Credenciales incorrectas";
    }
    return "Error desconocido";
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkAuthStatus, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
