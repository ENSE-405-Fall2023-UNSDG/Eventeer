import { Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import Header from "../Header";
import { useEffect, useState } from "react";
import axios from "axios";


export default function MainPage(){
    
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('/events').then(response => {
            const currentEvents = response.data.filter(event => {
                const eventDate = new Date(event.date);
                const currentDate = new Date();
                return eventDate >= currentDate;
            });
            setEvents(currentEvents);
        });
    }, []);
    

    function convertTo12HrFormat(time) {
        if (!time) return '';
    
        let [hours, minutes] = time.split(':');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
    
        return `${hours}:${minutes} ${ampm}`;
    }

    
    
    return(
        <div className="main-container">
            <div className="events-grid">
                {events.length > 0 && events.map(event => (
                    <Link to={'/eventpage/' + event._id} className="event-card">
                        {event.photo[0] && (
                            <div className="event-image-container">
                            <img
                                src={'http://localhost:4000/' + event.photo[0]}
                                alt={event.title}
                                className="event-image"
                            />
                           
                           {event.badge && (
                                <div className="badge-icon">
                                    <img
                                        src="../Icons/badge11.svg" 
                                        alt="Badge"
                                        className=""
                                    />
                                </div>
                            )}
                            
                        </div>
                        )}
                        <div className="event-content">
                            <h3 className="event-title">{event.title}</h3>
                            <p className="event-description">
                                {event.description}
                            </p>
                        </div>
                        <div className="event-details">
                            <p className="event-info-date">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                </svg>
                                <span className="info-text ml-4"><strong>Event Date: </strong> {event.date.split('T')[0]}</span>
                            </p>
                        </div>
                        <div className="event-details">
                            <p className="event-info">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>

                                <span className="info-text"><strong>Max:</strong> {event.maxPeople}</span>
                            </p>
                            <p className="event-info">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="info-text"><strong>Start:</strong> {convertTo12HrFormat(event.timeStart)} </span>
                            
                            </p>
                            <p className="event-info">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                                </svg>

                                <span className="info-text"><strong>End:</strong> {convertTo12HrFormat(event.timeEnd)}</span>
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}