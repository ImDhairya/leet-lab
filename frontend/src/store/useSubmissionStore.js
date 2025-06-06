import {create} from "zustand";
import {axisoInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import React from "react";

export const useSubmissionStore = create((set) => ({
  isLoading: false,
  submissions: [],
  submission: null,
  submissionCount: null,
  getAllSubmissions: async () => {
    try {
      set({isLoading: true});
      const res = await axisoInstance.get("/submission/get-all-submissions");

      set({submissions: res.data.submissions});

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting all submissions", error);
      toast.error("Error getting all submissions");
    } finally {
      set({isLoading: false});
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      set({isLoading: true});
      const res = await axisoInstance.get(
        `/submission/get-submission/${problemId}`
      );
      set({submissions: res.data.submissions});
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting submissions for problem", error);
      toast.error("Error getting submissions for problem");
    } finally {
      set({isLoading: false});
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axisoInstance.get(
        `/submission/get-submissions-count/${problemId}`
      );

      set({submissionCount: res.data.count});
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },
}));
