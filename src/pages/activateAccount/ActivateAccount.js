import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './activateAccount.css';
import urls from '../../services/apiUrls';
import { useApiRequest } from '../../hooks/useApiRequest';

export const ActivateAccount = () => {
  const [error, setError] = useState('');
  const [isActivated, setIsActivated] = useState(false);
  const { sendRequest } = useApiRequest();
  const { token } = useParams();

  useEffect(() => {
    const activateAccount = async () => {
      const sendData = {
        token: token.split("=")[1],
      };

      try {
        const response = await sendRequest(
          urls.activateAccount.activateAccount,
          sendData,
          false,
          "POST"
        );

        if (response.data.tokenError) {
          const msg = response.data.tokenError;
          setError(msg);
        } else {
          setIsActivated(true);
        }
      } catch (error) {
        console.error("Error during account activation:", error);
      }
    };
    activateAccount();
  }, []);

  return (
    <div className='activateAccount'>
      {error && !isActivated && <p className='error'>{error}</p>}
      {isActivated && <p>Account activated successfully! You can now <Link to='/signupLogin' className='loginLink'>Login</Link></p>}
    </div>
  );
};
