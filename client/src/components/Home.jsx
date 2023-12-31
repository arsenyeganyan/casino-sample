//frontend for this page is written by Aren Allahverdyan
import '../styles/Home.css';
import Navbar from './Navbar';
import { Navigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '../store';
import Cookies from 'js-cookie';

export default function Home() {
  const {
    news,
    setNews,
    games,
    setGames
  } = useStore();

  const token = Cookies.get('token');
  
  console.log(token);
  console.log(games);
  console.log(news);

  if(Cookies.get('token') === undefined) {
    return (<Navigate to='/auth/login'/>);
  } else {
    useEffect(() => {
        fetch('http://localhost:8000/sport/news/football/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
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
            console.log(data);
            setNews(data);
          })
          .catch(err => console.error(err))

          fetch('http://localhost:8000/sport/games/football/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
          })
            .then(res => {
                if(!res.ok) {
                    throw new Error("Status code: " + res.status);
                }

                return res.json()
            })
            .then(data => {
                console.log(data);
                setGames(data);
            })
            .catch(err => console.error(err))
      }, []);
  }

  return(
    <div className='homepage--container'>
        <Navbar />
        <div className="game--list">
            <div className="game--list--header">
                <form>
                    <input type="search" placeholder="Search..." />
                    <button type="submit">
                    </button>
                </form>
                <p>Games</p>
            </div>
            {games.hasOwnProperty('detail') ? (
                <div style={{color: "white"}}>
                    Something went wrong while loading, please try again later!
                </div>
            ) : (
                <div className='games--container'>
                    {games.map((g, index) => (
                        <Link className="game" key={index} to={`/${g.id}`}>
                            <div className='teams' >
                                <div className="team1">{g.team1.name}</div>
                                <div className="team2">{g.team2.name}</div>
                            </div>
                            <div className='info'>
                                <Link to={`/${g.id}/${g.win}`} className='bet'>{g.win}</Link>
                                <Link to={`/${g.id}/${g.draw}`} className='bet'>{g.draw}</Link>
                                <Link to={`/${g.id}/${g.lose}`} className='bet'>{g.lose}</Link>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div> 
        <div className="list--news">
            <div className="news--header">
                <div className="news--header--text">
                    Sport News
                </div>
            </div>
            <div className='news--container'>
                {news.hasOwnProperty('detail') ? (
                    <div style={{color: "white"}}>Something went wrong while loading, please try again later!</div>
                ) : (
                    <div className='news--box'>
                        {news.map((n, index) => (
                            <div className="news" key={index}>
                                <img className="news--image" src={n.image} />
                                <a className="news--title" href={n.title_url}>
                                    <br />{n.title}
                                </a>    
                                <p>
                                    {n.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}