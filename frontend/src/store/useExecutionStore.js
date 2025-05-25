import {create} from "zustand";
import {axisoInstance} from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,

  executeCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    try {
      set({isExecuting: true});
      const response = await axisoInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      set({submission: response.data.submission});
      toast.success("Code executed successfully");
    } catch (error) {
      console.error("Error executing code:", error);
      toast.error("Failed to execute code");
    } finally {
      set({isExecuting: false});
    }
  },
}));
