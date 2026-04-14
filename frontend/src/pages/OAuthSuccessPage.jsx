import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const OAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthSuccess } = useAuth();

  useEffect(() => {
    const processOAuth = async () => {
      const token = searchParams.get("token");

      if (token) {
        await handleOAuthSuccess(token);
        navigate("/");
      } else {
        navigate("/login");
      }
    };

    processOAuth();
  }, [searchParams, handleOAuthSuccess, navigate]);

  return <div className="p-6">Completing Google login...</div>;
};

export default OAuthSuccessPage;