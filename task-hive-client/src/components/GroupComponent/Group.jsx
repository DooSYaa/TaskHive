import './group.css';
import GroupModal from './GroupModal.jsx';
import Button from "../ButtonComponent/Button.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../Context/AuthContext.jsx";
import {Link, useBlocker} from "react-router-dom";

export default function Group()
{
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupData, setGroupData] = useState(null);
    const {user} = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('start!!');
        const response = await fetch('http://localhost:5292/api/Group/CreateGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                'groupName': groupName,
            })
        });
        if(!response.ok){
            throw new Error(`Error occurred: ${response.status}`);
        }
        const data = await response.json();
        if (data)
            alert(`Successfully created!`);
        else alert(`Error occurred: ${response.status}`);
        console.log(data);
        setShowModal(false);
    };
    useEffect( () => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:5292/api/Group/getMyGroups', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },

            });
            if(!response.ok){
                throw new Error(`Error occurred: ${response.status}`);
            }
            const data =  await response.json();
            setGroupData(data);
            console.log(data);
        }
        fetchData();
    }, [])
    return (
        <>
            <div className='create-group-container'>
                <Button onClick={() => setShowModal(true)}>CreateGroup</Button>
            </div>

            <div className="group-list">

                {groupData ? (groupData.map((name, index ) => (
                    <div className="group-block">
                        <Link className='group-block-name' to={`/group/${name.name}`}>
                            <h2 key={index}>{name.name}</h2>
                        </Link>
                    </div>
                ))) : null}
            </div>

            {showModal && (
                <GroupModal
                    groupName={groupName}
                    setGroupName={setGroupName}
                    setShowModal={setShowModal}
                    handleSubmit={handleSubmit}
                />
            )}
        </>
    )
}