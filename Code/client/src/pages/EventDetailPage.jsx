import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function EventDetailPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [maxPeople, setMaxPeople] = useState('');
    const {ready, user, setUser} = useContext(UserContext);
    const [goLoginPage, setLoginPage] = useState(null);
    const navigate = useNavigate(); 
    const [hasJoined, setHasJoined] = useState(false);
    const [badge, setBadge] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
   
    

    function convertTo12HrFormat(time) {
        if (!time) return '';
    
        let [hours, minutes] = time.split(':');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
    
        return `${hours}:${minutes} ${ampm}`;
    }

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/eventpage/' + id)
        .then(response => {
            setEvent(response.data);
            if (response.data.badge) {
                
                return axios.get('/badge/' + response.data.badge);
            }
        })
        .then(badgeResponse => {
            if (badgeResponse) {
                setBadge(badgeResponse.data);
            }
        })
        .catch(error => {
            console.error('Error fetching event or badge details:', error);
        });
    }, [id]);

    
    useEffect(() => {
        const interval = setInterval(() => {
            changeImage("next");
        }, 5000); 

        return () => clearInterval(interval);
    }, [event, currentImageIndex]);

    if (!event) return <div>Loading...</div>;
    

    const changeImage = (direction) => {
        if (!event.photo || event.photo.length === 0) {
            return;
        }

        if (direction === "next") {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex + 1) % event.photo.length 
            );
        } else if (direction === "prev") {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex - 1 + event.photo.length) % event.photo.length 
            );
        }
    };
    
    function BadgeModal({ isOpen, onClose, badge }) {

        if (!isOpen) return null;
        
        const handleBackdropClick = (e) => {
            
            if (e.target.classList.contains('modal-backdrop')) {
                onClose(); 
            }
        };
    
        return (
            <div 
                className="modal-backdrop" 
                style={{ display: isOpen ? 'flex' : 'none' }}
                onClick={handleBackdropClick} 
            >
                <div className="modal-content">
                    <button className="close-button" onClick={onClose}>X</button>
                    <img src={'http://localhost:4000/' + badge.photo} alt={badge.title} className="modal-badge-image" />
                    <h2 className="modal-title">{badge.title}</h2>
                    <p className="modal-description">{badge.description}</p>
                </div>
            </div>
        );
    }
    
    
    const handleBadgeClick = () => {
        setIsModalOpen(true);
    };


    const handleJoinClick = async () => {
        if (!user) {
            
            navigate('/login');
            return;
        }
    
        try {
            const response = await axios.post('/joins', {
                event: event._id,
                user: user._id,
            });
    
            if (response.status === 201) {
                setHasJoined(true); 
    
                
                if (event.badge) {
                    const badgeResponse = await axios.get('/badge/' + event.badge);
                    if (badgeResponse.data) {
                        setBadge(badgeResponse.data);
                    }
                }
            }
        } catch (error) {
            console.error('Error joining event:', error);
           
        }
    };
    


    return (
        <div className="event-detail-container">
            
            <div className="event-header-detail">
                <h1 className="event-title-detail">{event.title}</h1>
                <div className="event-time-wrapper2">
                    <div className="event-time-detail2"> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="icon2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <strong className=" mr-2"> Start:</strong> {convertTo12HrFormat(event.timeStart)}
                    </div>
                    <div className="event-time-detail2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                        </svg>
                        <strong className=" mr-2">End: </strong> {convertTo12HrFormat(event.timeEnd)}
                    </div>
                </div>
            </div>
            <h1 className="event-title-detail text-center">Event Date: {event.date.split('T')[0]}</h1>
            <div className="event-image-slider-2">
                <button onClick={() => changeImage("prev")} className="slider-button-2 prev-button-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                </button>
                <img
                    src={'http://localhost:4000/' + event.photo[currentImageIndex]}
                    alt={`${event.title} - image`}
                    className="event-image-2"
                />
                <button onClick={() => changeImage("next")} className="slider-button-2 next-button-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                </button>
            </div>

            <div className="event-description-detail">{event.description}</div>
                <div className="event-info-detail">
                    <p className="flex gap-1"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg><strong>
                        

                        Address:</strong> {event.address}</p>
                    <p className="flex gap-1" > <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                        </svg>
                        <strong>Max People:</strong> {event.maxPeople}</p>
                    {badge && (
                        <div className="event-badge-container-detail" onClick={handleBadgeClick}>
                            <div>
                                <img src={'http://localhost:4000/' + badge.photo[0]} alt="Event Badge" className="event-badge-detail" />
                            </div>
                        </div>
                    )}
                </div>
                
                <button 
                className="join-event-button" 
                onClick={handleJoinClick}
                disabled={hasJoined}
                >
                    {hasJoined ? 'Joined' : 'Join Event'}
                </button>
                <div>
                <BadgeModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    badge={badge} 
                />
                </div>
               
                
        </div>
    );
}
