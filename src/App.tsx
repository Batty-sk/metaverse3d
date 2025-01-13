import { startTransition, useState } from "react";
import { PlayGround } from "./components";
import { SocketContextWrapper } from './contexts/Socket.tsx'


const App = () => {
  const [userName,updateUserName] = useState<string>("")
  const [eligible,updateEligible] = useState<boolean>(false)
  const [message,updateMessage] = useState<string>("")

  const handleEnterIntoMetaverse =()=>{
   if(userName && userName.length < 10){
    startTransition(() => {
      updateEligible(true);
    });    return
   }
   updateMessage("Username shouldn't exceed 9 characters")
  }


  return (
    <>
    {!eligible?
    <div className="h-svh  bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-white md:text-3xl text-5xl font-extrabold space-x-5 mb-3">Meta Chat <span className="animate animate-spin duration-200">🌍</span></h1>
        <h3 className="text-white font-light text-sm font-mono ">Connect with anyone, anytime</h3>

        <div className="flex justify-center mt-5">
          <input  onChange={(e)=>updateUserName(e.target.value)} type="text" name="" id=""  className="rounded-md h-10 font-mono" placeholder="Enter your name.."/><button className="font-mono text-indigo-200 text-3xl font-extrabold ms-5 -rotate-6" 
          onClick={handleEnterIntoMetaverse}>Go!</button>
        </div>
        <div className="mt-3">
          {message && <span className="font-normal font-mono text-red-500">{message}</span>}
        </div>
        </div>
    </div>:
    <div>
      <SocketContextWrapper userName={userName}>
      <PlayGround />
      </SocketContextWrapper>
    </div>
}
    </>
  );
};

export default App;
