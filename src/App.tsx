import { startTransition, useState } from "react";
import { PlayGround,MetaChat3D } from "./components";
import { SocketContextWrapper } from './contexts/Socket.tsx'
import ColorSelectionWindowj from "./components/ColorSelectionWindowj.tsx";


const App = () => {
  const [userName,updateUserName] = useState<string>("")
  const [eligible,updateEligible] = useState<boolean>(false)
  const [message,updateMessage] = useState<string>("")
  const [currentChoice, setCurrentChoice] = useState(0);


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
      <div className="h-svh flex items-center justify-center" style={{ background: "linear-gradient(180deg, #000000, #0a2a43, #1a4465)"}}>
      <div className="flex flex-col justify-center items-center w-5/6">
        <MetaChat3D />
        <h3 className="text-white font-light text-sm font-mono ">Connect with anyone, anytime</h3>
        <ColorSelectionWindowj  currentChoice={currentChoice} setCurrentChoice={setCurrentChoice}/>
        <div className="flex justify-center mt-5 items-center">
          <input  onChange={(e)=>updateUserName(e.target.value)} type="text" name="" id=""  className="rounded-md h-10 font-mono border border-black" placeholder="Enter your name.."/><button className="font-mono text-white md:text-5xl text-4xl font-extrabold ms-5 -rotate-6" 
          onClick={handleEnterIntoMetaverse}>Go!</button>
        </div>
        <div className="mt-3">
          {message && <span className="font-normal font-mono text-red-500">{message}</span>}
        </div>
        </div>
    </div>:
    <div>
      <SocketContextWrapper userName={userName} colorCode={currentChoice}> 
      <PlayGround />
      </SocketContextWrapper>
    </div>
}
    </>
  );
};

export default App;
