import { RADIUS } from "./constants"
type CalculateDistanceProps = {
    currentPlayerX:number,
    currentPlayerZ:number,
    userX:number,
    userZ:number
    
}

export const calculateDistance= (args:CalculateDistanceProps) =>{ 

    const DISTANCE = Math.sqrt(
        Math.pow(args.userX - args.currentPlayerX, 2) +
        Math.pow(args.userZ - args.currentPlayerZ, 2)
      );    console.log("args...",args)
    console.log("Distance between",DISTANCE)
    if((DISTANCE+RADIUS)<3.5){
        console.log("they are close");
        return true
    }
    console.log("They are not close");
    return false
}




