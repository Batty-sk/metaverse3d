import { RADIUS } from "./constants"
type CalculateDistanceProps = {
    currentPlayerX:number,
    currentPlayerZ:number,
    userX:number,
    userY:number
    
}

export const calculateDistance= (args:CalculateDistanceProps) =>{ 

    const DISTANCE = 0; // some kinda formula
    if(DISTANCE<RADIUS*2){
        return true
    }
    return false

}