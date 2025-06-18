import { useContext, useState, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import config from "../config/config";

export const useApiRequest = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const sendRequest = useCallback(
    async (endpoint, requestData = {}, checkToken = false, method = "GET") => {
      const { BASE_URL, BACKEND_PROCESS, FILE_STARTS_WITH, FILE_EXTENSION } = config;
      const url = `${BASE_URL}/${BACKEND_PROCESS}/${FILE_STARTS_WITH}${endpoint}${FILE_EXTENSION}`;
      setLoading(true);

      try {
        const headers = {};
        if (checkToken) {
          const token = localStorage.getItem("token");
          headers.Authorization = `Bearer ${token}`;
        }

        const options = {
          method: method.toLowerCase(),
          url,
          headers,
        };

        // Add data or params depending on the method
        if (["post", "put", "patch", "delete"].includes(method.toLowerCase())) {
          options.data = requestData;
        } else if (method.toLowerCase() === "get") {
          options.params = requestData;
        }

        const response = await axios(options);

        // Handle unauthorized case
        if (checkToken && response.status === 200 && response.data.authorized === false) {
          localStorage.clear();
          setIsAuthenticated(false);
        }

        return response;
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setIsAuthenticated]
  );

  return { sendRequest, loading };
};
