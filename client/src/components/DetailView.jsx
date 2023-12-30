import '../styles/DetailView.css';
import { useEffect } from "react";
import { useStore } from "../store";
import { Navigate, useParams, Link, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export default function DetailView() {
  const { gameId } = useParams();

  const { 
    gameDetail,
    setGameDetail,
    games,
    checkout,
    setCheckout
  } = useStore();

  useEffect(() => { 
    fetch(`http://localhost:8000/sport/games/football/${gameId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${Cookies.get('token')}`,
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
  
  const date1 = g[3].split('T');
  const date2 = date1[1].split('Z');

  if(Cookies.get('token') === undefined) {
    return (<Navigate to="/auth/login"/>);
  }
  return (
    <div className="detail--view--container">
      <div className="games--list">
        <div className='list--title'>List of featured games</div>
        <div className='games'>
          {games.map((g, index) => (
            <Link className='each--game' key={index} to={`/${g.id}`}>
              <div>{g.team1.name} vs</div>
              <div>{g.team2.name}</div>
            </Link>
          ))}
        </div>
      </div>
      <div className='game--container'>
        <div className="game--overview">
          <div className='game--date'>{date1[0]} {date2[0]}</div>
          <div className='teams--detail'>
            <div className="team1--detail">
              <img src={g[1].image}/>
              <div>{g[1].name}</div>
            </div>
            <div className="team2--detail">
              <img src={g[2].image}/>
              <div>{g[2].name}</div>
            </div>
          </div>
          <div className='bets'>
            <Link 
              className='xG' 
              onClick={() => setCheckout(true)}
              to={`${g[g.length - 3]}`}
            >
              x{g[g.length - 3]}
            </Link>
            <Link 
              className='xG'
              onClick={() => setCheckout(true)}
              to={`${g[g.length - 2]}`}
            >
              x{g[g.length - 2]}
            </Link>
            <Link 
              className='xG' 
              onClick={() => setCheckout(true)}
              to={`${g[g.length - 1]}`}
            >
              x{g[g.length - 1]}
            </Link>
          </div>
          <div className='players'>
            <div>
              {g[1].players.map((p, index) => (
                <Link to={p.name} className='player' key={index}>{p.name}</Link>
              ))}
            </div>
            <div>
              {g[2].players.map((p, index) => (
                <Link to={p.name} className='player' key={index}>{p.name}</Link>
              ))}
            </div>
          </div>
        </div>
        {checkout && (<Outlet />)}
      </div>
      <div className='video--embed'>
        <iframe src="https://www.youtube.com/watch?v=BEENL2t1Qzs&ab_channel=Criseditz" frameborder="60"></iframe>
      </div>
    </div>
  )
}
