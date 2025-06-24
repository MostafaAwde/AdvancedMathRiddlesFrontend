import { useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import config from "../config/config";

export const useApiRequest = () => {
  const {loading, setLoading} = useContext(AuthContext);

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

        if (["post", "put", "patch", "delete"].includes(method.toLowerCase())) {
          options.data = requestData;
        } else if (method.toLowerCase() === "get") {
          options.params = requestData;
        }

        const response = await axios(options);
        return response;
      } catch (err) {
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { sendRequest, loading };
};
