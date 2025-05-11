import React, {useEffect} from "react";

import {Toaster} from "react-hot-toast";
import {Routes, Route, Navigate} from "react-router-dom";
import {Loader} from "lucide-react";
import HomePage from "./page/HomePage";
import AdminRoute from "./components/AdminRoute";
import LoginPage from "./page/LoginPage";
import Layout from "./layout/Layout";
import SignUpPage from "./page/SignUpPage";
import AddProblem from "./page/AddProblem";
import {useAuthStore} from "./store/useAuthStore";
const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={<Layout />}
        >
          <Route
            index
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
        </Route>

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />

        <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={authUser ? <AddProblem /> : <Navigate to="/" />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
