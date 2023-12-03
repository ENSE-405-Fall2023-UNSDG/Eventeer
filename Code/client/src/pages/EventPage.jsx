import { Link, useParams } from "react-router-dom";
import EventFormPage from "../forms/EventFormPage";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EventPage(){
    const [events, setEvents] = useState([]);
    const {action} = useParams();
    useEffect(() =>{
        axios.get('/userEvents').then(({data}) => {
            setEvents(data);
        });
    },[]);

    function linkClasses(type = null){
        let classes = 'sidebar-link mb-5';
        if (type === false){
            classes += ' bg-fuchsia-500 rounded-md';
        }
        return classes;
    }


    return (
        <div className="mt-3">
                    <h1 className="badge-earned-title">My Events</h1>
                    <div className=" text-center">
                    <Link className="add-new-event gap-1" to={'/profilepage/eventpage/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>

                    Add new event
                    </Link>
                    </div>
            {action !== 'new' && (
                <div>
                    
                    

                    <div className="mt-5">
                        
                        {events.length > 0 && events.map(event => (
                            <Link to={'/profilepage/eventpage/edit/' + event._id} className="flex cursor-pointer primary gap-4 p-4 rounded-3xl mb-5">
                                
                                <div className="flex bg-indigo-100 w-32 h-32 grow-0 shrink-0">
                                    {event.photo.length > 0 && (
                                        <img className="object-cover" src={'http://localhost:4000/' + event.photo[0]} alt=''/>
                                    )}
                                </div>
                                
                                
                                <div className="grow-0 shrink">
                                    <h2 className="text-l mb-3">{event.title}</h2>
                                    <p className="text-sm">{event.description}</p>
                                </div>
                               
                            </Link>
                        ))}
                    </div>

                </div>
            )}
            
            {action === 'new' && (
                <EventFormPage/>
            )}

            {action === 'edit' && (
                <EventFormPage/>
            )}

        </div>
    );
}