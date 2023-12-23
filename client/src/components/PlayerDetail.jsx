import { useParams } from "react-router-dom";
import { useStore } from "zustand";

export default function PlayerDetail() {
  const params = useParams();
  const { gameDetail } = useStore();
  //rendering data for the selected player
  
  return (
    <div className="player--detail--container">
      {params.hasOwnProperty('playerId') && (<>PlayerDetail</>)}
    </div>
  )
}
