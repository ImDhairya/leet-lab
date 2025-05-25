import {create} from "zustand";
import {toast} from "react-hot-toast";
import {axisoInstance} from "../../src/lib/axios.js";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({isProblemsLoading: true});

      const res = await axisoInstance.get("/problems/get-all-problems");
      console.log(res.data.problems, "myres");
      set({problems: res.data.problems});
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error getting all problems");
    } finally {
      set({isProblemsLoading: false});
    }
  },

  getProblemById: async (id) => {
    try {
      const res = await axisoInstance.get(`/problems/get-problem/${id}`);
      set({problem: res.data.problem});
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error;
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axisoInstance.get("/problems/get-solved-problem");

      set({solvedProblems: res.data.problems});
    } catch (error) {
      console.log("Error getting solved problems", error);
      toast.error("Error getting solved problems");
    }
  },
}));
