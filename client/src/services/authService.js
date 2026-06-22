import api from "./api";

// POST /auth/register -> { token, user: { id, name, email } }
export const registerUser = async (name, email, password) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return response.data.data;
};

// POST /auth/login -> { token, user: { id, name, email } }
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data.data;
};

// No backend call needed — JWTs are stateless, so "logout" is just
// removing the token locally so future requests stop sending it.
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};