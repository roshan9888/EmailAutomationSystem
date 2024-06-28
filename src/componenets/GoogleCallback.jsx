import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlparams",urlParams);
    const code = urlParams.get('code');
    console.log("code",code);
    // Send the code to your backend to exchange it for tokens
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`https://email-4.onrender.com/auth/google/callback?code=${code}`);
        console.log('Authentication successful:', response.data);
        navigate('/'); // Redirect to home page or any other page after successful authentication
      } catch (error) {
        console.error('Error during authentication:', error);
        // navigate('/error'); // Redirect to an error page or show an error message
      }
    };

    if (code) {
        console.log("I am in the code",code);
      fetchTokens();
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

export default GoogleCallback;
