import axios from "axios";
// this simply return the id for each coding language in judge0
export const getJudge0LanguageId = (language) => {
  console.log(language, "mylang");
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
  };

  return languageMap[language.toUpperCase()];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// this is polling method, which is used to check if the submission is done or not, after an interval of 1 second it again asks the endpoint, wheater the submission is done or not.
export const pollBatchResults = async (tokens) => {
  // asking an endpoint to check if the submission is done or not again and again
  // forever running loop until the submission is done
  while (true) {
    const {data} = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        tokens: tokens.join(","),
        base64_encoded: false,
      }
    );

    const results = data.submissions;

    // every method returns true value when every element in the array is true
    // this means that every single result is not 1 and not 2 which means it is done
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    // breaking the loop if the submission is done (here done doesnot mean success), it means it has finished executing either success or failed.
    if (isAllDone) return results;

    await sleep(1000);
  }
};

export const submitBatch = async (submissions) => {
  // we hit this end point 2 times, once for the token of each language it gives an array of objects
  // use those tokens to check the results (whether the code passed, failed, or errored)
  const {data} = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    }
  );

  console.log(data, "Submissions");
  return data; // [{token}, {token}]
};
