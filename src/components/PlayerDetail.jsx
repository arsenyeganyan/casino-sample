import { useEffect } from "react";
import { useStore } from "../store";

export default function PlayerDetail({ playerId, token }) {
  //rendering data for the selected player
  const slug = playerId.toLowerCase();
  const { player, setPlayer } = useStore();

  console.log(player);
  console.log(token);

  useEffect(() => {
    fetch(`http://localhost:8000/sport/players/${slug}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      }
    })
      .then(res => {
        if(!res.ok) {
          throw new Error('Status: ' + res.status);
        }

        return res.json();
      })
      .then(data => setPlayer(data))
      .catch(e => console.error(e))
  }, [playerId, token]);

  const formatedPlayer = Object.values(player);

  return (
    <div className="player--detail--container">
      <div className="detail--title">
        Showing statistics for {playerId}
      </div>
      <div className="player--info">
        <div className="name">
          <span>Name:</span> {formatedPlayer[0]}
        </div>
        <div className="position"><span>Position:</span> {formatedPlayer[2]}</div>
        <img src={`http://localhost:8000/${formatedPlayer[1]}/`}/>
      </div>
    </div>
  )
}
