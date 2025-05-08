import {useState} from "react";
import TopHeader from "./components/header/header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TopHeader />
      <div className=" mb-3 bg-blue-600 w-1/2 h-screen items-center flex justify-center ">
        <h1 className="  bg-emerald-800 flex items-center justify-center h-23 w-2xl ">
          Hello The world is for us to taek worfasdfld{" "}
        </h1>
      </div>
    </>
  );
}

export default App;
