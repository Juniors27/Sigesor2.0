"use client";

import { useEffect, useState } from "react";

const useUser = () => {
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) return; // No hay token, no hacemos la llamada

      try {
        const res = await fetch("http://127.0.0.1:8000/api/usuario/actual/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!res.ok) {
          // Si status no es 2xx
          const errorData = await res.json();
          throw new Error(JSON.stringify(errorData));
        }

        const data = await res.json();        
        setRol(data.rol);
        
      } catch (err) {
        console.error("Error al obtener el rol del usuario", err.message);
      }
    };

    fetchUserRole();
  }, []);

  return { rol };
};

export default useUser;
