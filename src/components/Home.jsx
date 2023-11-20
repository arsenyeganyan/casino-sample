//frontend for this page is written by Aren Allahverdyan
import '../styles/Home.css';
import Navbar from './Navbar';
import { useEffect } from 'react';
import { useStore } from '../store';

export default function Home() {
  const store = useStore();
  const news = store.news;
  const setNews = store.setNews;

  useEffect(() => {
    fetch('http://localhost:8000/sport/news/football')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setNews(data);
      })
  }, []);

  return(
    <div className='homepage--container'>
    <Navbar />
    <div className="game--list">
        <div className="game--list--header">
            <form>
                <input type="search" placeholder="Search..." />
                <button type="submit">
                    <i className="fas fa-search"></i>
                </button>
              </form>
            <p>Games</p>
        </div>
        <div className="games">
            <div className="game">
                <div className='teams'>
                    <a className="team1">Al Nasar</a>
                    <a className='team2'>FC Barcelona</a>
                </div>
                <div className='info'>
                    <p className="kf">3.71</p>
                    <p className="kf">1.54</p>
                    <p className="kf">1.21</p>
                </div>
            </div>
        </div>
    </div> 
    
    <div className="list--news">
        <div className="news--header">
            <div className="news--header--text">
                Sport News
            </div>
        </div>
        <div className='news--container'>
            {(news instanceof Array) ? news.map((n, index) => (
                <div className="news" key={index}>
                    <img className="news--image" src={n.image} />
                    <a className="news--title" href={n.title_url}>
                        <br />{n.title}
                    </a>      
                    <p>
                        {n.description}
                    </p>
                </div>
            )) : (<div>Loading News...</div>)}
            {/* <div className="news">
                <img className="news--image" src="https://sportnewsapi.snapi.dev/images/v1/g/y/01hesnr1z0rt6ahacqs8-42164.jpg" />
                <a className="news--title">
                    <br />Mikel Arteta sends Bukayo Saka message after latest injury concern
                </a>       
                <p>
                    Saka withdrawn towards end of Champions League clash with Sevilla because of knockThe 22-year-old grabbed a goal and an assist to push Arsenal closer to knockout stagesLeandro Trossard opened the scoring to lead Gunners to three valuable points
                </p>
            </div> */}
        </div>
    </div>
    </div>
  )
}