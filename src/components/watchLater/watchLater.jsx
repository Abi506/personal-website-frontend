import { useState, useEffect } from 'react';
import { watchLaterUrl } from '../apiUrl';
import { useNavigate } from 'react-router';
import "./watchLater.css";
import axios from 'axios';

const WatchLater = () => {
    const [videoData, setVideoData] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('desc');
    const [status, setStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [newVideoTitle, setNewVideoTitle] = useState('');
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [showAddVideoForm, setShowAddVideoForm] = useState(false);

    const navigate=useNavigate()

    console.log(videoData,'videoData')

    // Fetch videos with search, sort, and filter options
    const fetchVideos = async () => {
        try {
            const response = await axios.get(`${watchLaterUrl}`, {
                params: { search, status, sort },
            });
            setVideoData(response.data);
        } catch (error) {
            console.error("Error fetching videos", error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [search, status, sort]);

    // Handle adding a new video
    const addVideo = async () => {
        try {
            await axios.post(watchLaterUrl, {
                title: newVideoTitle,
                url: newVideoUrl,
            });
            setNewVideoTitle('');
            setNewVideoUrl('');
            setShowAddVideoForm(false); // Hide form after adding
            fetchVideos(); // Refresh the list after adding
        } catch (error) {
            console.error("Error adding video", error);
        }
    };

    // Show confirmation modal for marking as watched
    const handleMarkWatched = (id) => {
        setSelectedVideoId(id);
        setShowModal(true);
    };

    // Confirm marking as watched
    const confirmWatched = async () => {
        if (selectedVideoId) {
            try {
                await axios.put(`${watchLaterUrl}/${selectedVideoId}`, { status: 'Watched' });
                setShowModal(false);
                setSelectedVideoId(null);
                fetchVideos(); // Refresh the list after updating status
            } catch (error) {
                console.error("Error updating video status", error);
            }
        }
    };


    const handleUrl=(url)=>{
        window.open(url,'__blank')  
    }

    const extractVideoId = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    return (
        <div className='watch-later-container'>
            <h2>Watch Later Videos</h2>

            <button onClick={() => setShowAddVideoForm(!showAddVideoForm)} style={{ marginTop: '20px',backgroundColor:"red",color:"white",borderRadius:"5px" }}>
                {showAddVideoForm ? "Cancel" : "Add New Video"}
            </button>

            {showAddVideoForm && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Add a New Video</h3>
                    <input
                        type="text"
                        placeholder="Video Title"
                        value={newVideoTitle}
                        onChange={(e) => setNewVideoTitle(e.target.value)}
                        style={{padding:"7px",borderRadius:"5px",width:"250px"}}
                    />
                    <br/>
                    <input
                        type="text"
                        placeholder="Video URL"
                        value={newVideoUrl}
                        className='mt-3'
                        style={{padding:"7px",borderRadius:"5px",width:"250px",marginBottom:"10px"}}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                    />
                    <br/>
                    <button onClick={addVideo} className='btn btn-secondary'>Add Video</button>
                </div>
            )}
            
            {/* Search and Filter Options */}
            <div style={{textAlign:"center",marginTop:"10px"}}>
                <input
                    type="text"
                    placeholder="Search by title"
                    value={search}
                    style={{padding:"7px",borderRadius:"5px",width:"200px",marginBottom:"10px"}}
                    onChange={(e) => setSearch(e.target.value)}
                />
                
                <select onChange={(e) => setSort(e.target.value)} value={sort}>
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
                
                <button onClick={fetchVideos}>Filter</button>
            </div>

            {/* Button to Show Add Video Form */}
            

            <div style={{display:"flex",flexWrap:"wrap"}}>
            {videoData.length > 0 ? (
            videoData.map((video) => {
                const videoId = extractVideoId(video.url);
                return (
                    <div 
                        key={video._id} 
                        style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', borderRadius: "5px",width:"300px" }}
                    >
                        {videoId && (
                            <img 
                                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                                alt={`${video.title} thumbnail`} 
                                style={{width:"100%"}}
                                onClick={() => handleUrl(video.url)}
                            />
                        )}
                        <h3 className="video-title" onClick={() => handleUrl(video.url)}>{video.title}</h3>
                        <p>Status: {video.status}</p>
                        <p>{new Date(video.addedAt).toLocaleString()}</p>
                        <button onClick={() => handleMarkWatched(video._id)} style={{backgroundColor:"blue",color:"white",borderRadius:"4px"}} >
                            Mark as {video.status === 'Pending' ? 'Watched' : 'Pending'}
                        </button>
                    </div>
                );
            })
        ) : (
            <p>No videos found</p>
        )}
            </div>

            

            {/* Form to Add a New Video, Visible Only When Button is Clicked */}
            

            {/* Display Video Data */}

            {/* Modal for Confirmation */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '300px',
                        textAlign: 'center'
                    }}>
                        <p>Are you sure you want to mark this video as "Watched"?</p>
                        <button onClick={confirmWatched} style={{ margin: '5px' }}>Yes</button>
                        <button onClick={() => setShowModal(false)} style={{ margin: '5px' }}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WatchLater;
