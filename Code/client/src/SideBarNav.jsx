import { Link } from "react-router-dom";

export default function SideBarNav(){
   
    function linkClasses(type = null){
        let classes = 'sidebar-link mb-5';
        if (type === false){
            classes += ' bg-fuchsia-500 rounded-md';
        }
        return classes;
    }
    
    return (
        <div>
            <div className="sidebar">
                <div className="user-info">
                    <img src="/Icons/user2.png" alt="User" width="65" height="65" />
                    <h3>{user.name}</h3>
                </div>
                <br></br>
                <Link className={linkClasses('badgepage')} to={'/profilepage/badgepage'}> My Badges </Link>
                <Link className={linkClasses('eventpage')} to={'/profilepage/eventpage'}> My Events </Link>
                <Link className={linkClasses('upcomingevents')} to={'/profilepage/upcomingevents'}>Upcoming Events</Link>
                <Link className={linkClasses('settings')} to={'/profilepage/settings'}>Settings</Link>
                
                <br></br>
                <button onClick={logout} className='sidebar-link max-w-xl'>Logout</button>

            </div>

        </div>
        
    );
}