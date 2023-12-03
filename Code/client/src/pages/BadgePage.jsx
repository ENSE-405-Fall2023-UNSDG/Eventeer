import { Link, useParams } from "react-router-dom";
import BadgeFromPage from "../forms/BadgeFormPage";
import { useEffect, useState } from "react";
import axios from "axios";


export default function BadgePage(){

    const [badges, setBadges] = useState([]);
    const {action} = useParams();
    
    useEffect(() =>{
        axios.get('/userBadges').then(({data}) => {
            setBadges(data);
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

        <div>
                <h1 className="badge-earned-title">My Badges</h1>
                <div className=" text-center">
                    <Link className="add-new-event gap-1" to={'/profilepage/badgepage/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>

                    Add new badge
                    </Link>
                </div>
            {action !== 'new' && (
                <div>
                    
                    

                    <div className="mt-5">
                        
                        {badges.length > 0 && badges.map(badge => (
                            <Link to={'/profilepage/badgepage/edit/' + badge._id} className="flex cursor-pointer primary gap-4 p-4 rounded-3xl mb-5">
                                
                                <div className="flex bg-indigo-100 w-32 h-32 grow-0 shrink-0">
                                    {badge.photo.length > 0 && (
                                        <img className="object-cover" src={'http://localhost:4000/' + badge.photo[0]} alt=''/>
                                    )}
                                </div>
                                
                                
                                <div className="grow-0 shrink">
                                    <h2 className="text-l mb-2">{badge.title}</h2>
                                    <p className="text-sm">{badge.description}</p>
                                </div>
                               
                            </Link>
                        ))}
                    </div>

                </div>
            )}
            
            {action === 'new' && (
                <BadgeFromPage/>
            )}

            {action === 'edit' && (
                <BadgeFromPage/>
            )}


        </div>

    );


}