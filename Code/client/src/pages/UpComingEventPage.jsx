import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext"; 
import { Link } from 'react-router-dom';

export default function UpComingEventPage() {
    const [events, setEvents] = useState([]);
    const { user } = useContext(UserContext); 

    useEffect(() => {
        if (user) {
            axios.get(`/user-events/${user._id}`)
                .then(response => {
                    setEvents(response.data);
                })
                .catch(err => console.error(err));
        }
    }, [user]);

    function calculateDaysUntilEvent(eventDate) {
        const currentDate = new Date();
        const event = new Date(eventDate);
    
        
        const timeDifference = event.getTime() - currentDate.getTime();
    
        
        const daysUntilEvent = Math.ceil(timeDifference / (1000 * 3600 * 24));
    
        return daysUntilEvent;
    }
    

    return (
        <div className="upcoming-events-page">
            <h1 className="upcoming-events-title">Upcoming Events</h1>
            <div className="upcoming-events-container">
                {events.length > 0 ? (
                    events.map(event => (
                        <Link to={`/eventpage/${event._id}`} key={event._id} className="upcoming-event-card">
                            <div className="upcoming-event-card-content">
                                <img src={'http://localhost:4000/' + event.photo[0]} alt={event.title} className="upcoming-event-card-image" />
                                <div className="upcoming-event-card-info">
                                    <h2 className="upcoming-event-title">{event.title}</h2>
                                    <p className="upcoming-event-description">{event.description}</p>
                                    <p className="upcoming-event-date">Days until event: {calculateDaysUntilEvent(event.date)}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="no-upcoming-events">No upcoming events found.</p>
                )}
            </div>
        </div>
    );
}
