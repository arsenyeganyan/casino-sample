import '../styles/DetailView.css';
import { useEffect } from "react";
import { useStore } from "../store";
import { Navigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function DetailView() {
  const { gameId } = useParams();
  console.log(gameId);

  const { gameDetail, setGameDetail } = useStore();

  useEffect(() => {
    fetch(`http://localhost:8000/sport/games/football/${gameId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${Cookies.get('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if(!res.ok) {
          throw new Error("Status code: " + res.status);
        }
        
        return res.json();
      })
      .then(data => {
        setGameDetail(data);
      })
      .catch(err => console.error(err))
  }, []);
  
  const g = Object.values(gameDetail);

  if(Cookies.get('token') === undefined) {
    return (<Navigate to="/auth/login"/>)
  }
  return (
    <div className="detail--view--container">
      <div className="game--overview">
        <div className='game--date'>{g[3]}</div>
        <div className='teams--detail'>
          <div>{g[1].name}</div>
          <div>{g[2].name}</div>
        </div>
        <div className='bets'>
          <div>{g[g.length - 3]}</div>
          <div>{g[g.length - 2]}</div>
          <div>{g[g.length - 1]}</div>
        </div>
        <div className='players'>
          <div>
            {g[1].players.map((p, index) => (
              <div key={index}>{p.name}</div>
            ))}
          </div>
          <div>
            {g[2].players.map((p, index) => (
              <div key={index}>{p.name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
