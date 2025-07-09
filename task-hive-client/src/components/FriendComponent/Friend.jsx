
import './freind.css'
import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";
import Button from "../ButtonComponent/Button.jsx";
export default function Freind(){
    const [friends, setFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [friendsRequest, setFriendsRequest] = useState([]);
    const {user} = useAuth();
    useEffect(()=>{
        if(user){
            fetch('http://localhost:5291/api/Friend/getFriends', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setFriends(data);
                })
                .catch(error => {
                    console.error('Error getting friends', error);
                    setFriends([]);
                })
        }
    }, [user])
    const handleAddFriend = async () => {
        if (!searchQuery.trim()) {
            setError("Please enter a username");
            return;
        }
        try {
            await fetch('http://localhost:5291/api/Friend/addFriend', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`
                },
                credentials: 'include',
                body: JSON.stringify(searchQuery)
            })
                .then(response => {
                    console.log(response);
                    return response.json();
                })
                .then(data => {
                    console.log(data.message);
                    setSuccess(data.message);
                })
        } catch (error) {
            console.error('Error adding friend', error);
            setError("Failed to add friend. Please try again.");
            setSuccess(null);
        }
    };
    useEffect(() => {
         fetch('http://localhost:5291/api/Friend/getFriendsRequest', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setFriendsRequest(data);
            })
    }, [user]);

    function acceptFriendRequest(friendName){
        fetch('http://localhost:5291/api/Friend/addFriend', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify(friendName),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setFriendsRequest(friendsRequest.filter(friend => friend !== friendName));
            })
    }
    return (
        <>
            <div className="friend-main-container">
                <div className="friend-container">
                    <h1>Welcome to Freind component</h1>
                    <p>Your friends: </p>
                        {friends.length > 0 ? (
                            friends.map((friend, index) => (
                                <ol key={index}>{friend}</ol>
                            ))
                        ) : (
                            <h4>No friends found</h4>
                        )}
                </div>
                <div className="box">
                    <h3>Add friends</h3>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter username"
                        className="friend-input"
                    />
                    <br/>
                    <Button variant={'primary'} onClick={handleAddFriend} className="friend-button">
                        Add Friend
                    </Button>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </div>
                <div className="friends-requests">
                    <h4>Friend request</h4>
                    {friendsRequest.length > 0 ? (
                        friendsRequest.map((friend, index) => (
                            <div className="friends-request-list">
                                <p key={index}>{friend}</p>
                                <Button variant={'accept'} onClick={() => acceptFriendRequest(friend)}>Accept</Button>
                            </div>
                        ))
                    ) : (
                        <h4>No requests found</h4>
                    )}
                </div>
            </div>
        </>
    )
}