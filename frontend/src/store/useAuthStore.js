import {create} from "zustand";
import {axisoInstance} from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLogginIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({isCheckingAuth: true});
    try {
      const res = await axisoInstance.get("/auth/check");
      set({authUser: res.data.user});
    } catch (error) {
      console.log("error checking auth", error);
      set({authUser: null});
    } finally {
      set({isCheckingAuth: false});
    }
  },

  signup: async (data) => {
    set({isSigninUp: true});
    set({isSigninUp: true});
    try {
      const res = await axisoInstance.post("/auth/register", data);

      set({authUser: res.data.user});

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("Error signing up");
    } finally {
      set({isSigninUp: false});
    }
  },

  login: async (data) => {
    set({isLoggingIn: true});
    try {
      const res = await axisoInstance.post("/auth/login", data);

      set({authUser: res.data.user});

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("Error logging in");
    } finally {
      set({isLoggingIn: false});
    }
  },

  logout: async () => {
    try {
      await axisoInstance.post("/auth/logout");
      set({authUser: null});
    } catch (error) {
      console.log("Error logging out.", error);
      toast.error("Error logging out.");
    }
  },
}));
