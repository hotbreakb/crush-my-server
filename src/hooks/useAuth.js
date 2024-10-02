import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/factory";

export const useAuth = () => {
  const loginMutation = useMutation(loginApi);

  const login = (credentials) => loginMutation.mutate(credentials);

  return {
    login,
    isLoading: loginMutation.isLoading,
    error: loginMutation.error,
  };
};
