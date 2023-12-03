import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext"; 
import { Link } from 'react-router-dom';


export default function BadgeEarnedPage() {
    const [badges, setBadges] = useState([]);
    const { user } = useContext(UserContext);
    const [badge, setBadge] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            axios.get(`/user-badges/${user._id}`)
                .then(response => {
                    setBadges(response.data);
                })
                .catch(err => console.error(err));
        }
    }, [user]);

    function BadgeModal({ isOpen, onClose, badge }) {

        if (!isOpen) return null;
        
        const handleBackdropClick = (e) => {
            
            if (e.target.classList.contains('badge-modal-backdrop')) {
                onClose(); 
            }
        };
    
        return (
            <div 
            className="badge-modal-backdrop" 
            style={{ display: isOpen ? 'flex' : 'none' }}
            onClick={handleBackdropClick}
            >
                <div className="badge-modal-content">
                    <button className="badge-close-button" onClick={onClose}>X</button>
                    <img src={'http://localhost:4000/' + badge.photo} alt={badge.title} className="badge-modal-image" />
                    <h2 className="badge-modal-title">{badge.title}</h2>
                    <p className="badge-modal-description">{badge.description}</p>
                </div>
            </div>
        );
    }

    const handleBadgeClick = (badgeData) => {
        setBadge(badgeData.badge); 
        setIsModalOpen(true);
    };


    return (
        <div className="badge-earned-page">
            <h1 className="badge-earned-title">Badges Earned</h1>
            <div className="badge-earned-container">
                {badges.length > 0 ? (
                    badges.map(badgeData => (
                        <div 
                            key={badgeData.badge._id} 
                            className="badge-earned-card"
                            onClick={() => handleBadgeClick(badgeData)} 
                        >
                            <img src={'http://localhost:4000/' + badgeData.badge.photo} alt={badgeData.badge.title} className="badge-earned-image" />
                            <div className="badge-earned-info">
                                <h2 className="badge-title">{badgeData.badge.title}</h2>
                                <p className="badge-description">{badgeData.badge.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-badges-earned">No badges earned yet.</p>
                )}
            </div>
            <BadgeModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                badge={badge} 
            />
        </div>
    );
}
