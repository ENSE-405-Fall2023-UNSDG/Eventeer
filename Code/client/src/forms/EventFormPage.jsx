import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";


export default function EventFormPage(){

    
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhoto, setAddedPhoto] = useState([]);
    const [description, setDescription] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [maxPeople, setMaxPeople] = useState(1);
    const [date, setDate] = useState('');
    const [redirectToEventList, setRedirectToEventList] = useState(false);
    const {id} = useParams();
    const [userBadges, setUserBadges] = useState([]);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const { user } = useContext(UserContext); 

    useEffect(() => {
        if (!id){
            return;
        }

        axios.get('/eventpage/edit/' + id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setDescription(data.description);   
            setAddedPhoto(data.photo);
            setTimeStart(data.timeStart);
            setTimeEnd(data.timeEnd);
            setMaxPeople(data.maxPeople);
            setAddress(data.address);
            setDate(data.date.split('T')[0]);
            
        })
    }, [id])



    useEffect(() => {
        if (user) {
            fetchUserBadges();
        }
    }, [user]);
    
    const fetchUserBadges = async () => {
        try {
            
            const response = await axios.get('/userBadges', {
                withCredentials: true 
            });
            setUserBadges(response.data);
        } catch (error) {
            console.error('Error fetching badges:', error);
        }
    };

    const handleBadgeSelect = badgeId => {
        if (selectedBadge === badgeId) {
            setSelectedBadge(null); 
        } else {
            setSelectedBadge(badgeId); 
        }
    };


    function uploadPhoto(ev){
        const files = ev.target.files;
        const data = new FormData();
        
        for (let i =0; i < files.length; i++){
            data.append('photos', files[i]);
        }
        

        axios.post('/uploadphoto', data, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(response => {
            const {data:filenames} = response;
            setAddedPhoto(prev => {
                return [...prev, ...filenames];
            })
        })
    }
    
    
    async function saveEvent(ev){
        ev.preventDefault();

        if (id){
            await axios.put('/events', {id, title,address, addedPhoto, badgeId:selectedBadge 
                , description,timeStart,timeEnd,maxPeople, date});

                setRedirectToEventList(true);

        }else{
            await axios.post('/events', {title,address, addedPhoto, 
                 description,timeStart,timeEnd,maxPeople, date, badgeId:selectedBadge});

                setRedirectToEventList(true);
        }   
        
    }
    if (redirectToEventList) {
        return <Navigate to={'/profilepage/eventpage'} />
    }

    function removePhoto(ev, filename){
        ev.preventDefault();
        setAddedPhoto(addedPhoto.filter(photo => photo !== filename));
    }

    function selectMainPhoto(ev, filename){
        ev.preventDefault();

        setAddedPhoto([filename, ...addedPhoto.filter(photo => photo !== filename)]);
        
        
    }
    
    return (
        <div>
            <form className="new-event-from" onSubmit={saveEvent}>
                <h2>Title</h2>
                <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="Event title"/>
                <h2>Address</h2>
                <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder="Address..."/>
                <h2>Photos</h2>
                <div className="mt-2 gap-2 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                    {addedPhoto.length > 0 && addedPhoto.map(link => (
                        <div className="h-25 flex relative" key={link}>
                            <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/'+ link}/>
                            <button onClick={ev=> removePhoto(ev, link)} className=" absolute text-white bg-black rounded-xl bottom-2 right-2 bg-opacity-50 p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>

                            </button>
                            <button onClick={ev=> selectMainPhoto(ev, link)} className=" absolute text-white bg-black rounded-xl top-2 left-2 bg-opacity-50 p-2">
                            {link === addedPhoto[0] && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                              </svg>
                              
                            )}
                            {link !== addedPhoto[0] && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                              </svg>                              
                              
                            )}
                        
                            </button>
                            
                        </div>
                    ))}

                    <label className="add-new-photo h-25 items-center gap-2 justify-center">
                        <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Upload image
                    </label>
                </div>
                <h2>Description</h2>
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Write small description about the event"/>
                
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="form-inputs">
                        <h2>Time start:</h2>
                        <input value={timeStart} onChange={ev => setTimeStart(ev.target.value)} type="time" />
                    </div>
                    <div className="form-inputs">
                        <h2>Time end:</h2>
                        <input value={timeEnd} onChange={ev => setTimeEnd(ev.target.value)} type="time"/>
                    </div>
                    <div className="form-inputs">
                        <h2>People Number</h2>
                        <input value={maxPeople} onChange={ev => setMaxPeople(ev.target.value)} type="number" min='1' max='100'/>
                    </div>
                    <div className="form-inputs">
                        <h2>Date</h2>
                        <input value={date} onChange={ev => setDate(ev.target.value)} type="date"/>
                    </div>
                </div>
                <h2>Choose a Badge to Associate with Your Event (Optional)</h2>
                <div className="badge-selection">
                    {userBadges.length > 0 ? (
                        userBadges.map(badge => (
                            <label key={badge._id} className="badge-label">
                                <input
                                    type="checkbox"
                                    className="badge-checkbox"
                                    checked={selectedBadge === badge._id}
                                    onChange={() => handleBadgeSelect(badge._id)}
                                />
                                <img src={'http://localhost:4000/' + badge.photo[0]} alt={badge.title} className="badge-image" />
                                <span className="badge-title">{badge.title}</span>
                            </label>
                        ))
                    ) : (
                        <p className="badges-empty">No badges found</p>
                    )}
                </div>

                
                <button className="formbutton">Save</button>
                
            </form>
        </div>
    );
}