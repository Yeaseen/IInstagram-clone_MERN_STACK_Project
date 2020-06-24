import React, { useEffect, useState, useContext, useRef } from 'react'
import { userContext } from '../../App'

import axios from 'axios';
const Profile = () => {
    const [selfProfileUser, setSelfProfileUser] = useState(null)
    const [selfProfilePosts, setSelfProfilePosts] = useState([])
    const [uploadPercentage, setUploadPercentage] = useState(0)
    const [progressStyle, setProgressStyle] = useState({})
    const inputImageName = useRef(null);
    const inputImageFile = useRef(null);
    const { state, dispatch } = useContext(userContext)

    const [image, setImage] = useState("")

    const setProgressStyleF = (per) => {
        var p = (per / 100) * 645
        //console.log(p)
        const newStyle = {
            opacity: 1,
            width: p
        }
        
        setProgressStyle(newStyle)
       
    }



    useEffect(() => {
        fetch('/mypost', {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                setSelfProfileUser(result.selfuser)
                setSelfProfilePosts(result.selfposts)
            })
    }, [])



    useEffect(() => {
        if (image) {

            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "iinsta-clone")
            data.append("cloud_name", "yeaseen")

            setUploadPercentage(1)
            setProgressStyleF(1)

            // fetch("https://api.cloudinary.com/v1_1/yeaseen/image/upload", {
            //     method: "post",
            //     body: data
            // })

            axios.post("https://api.cloudinary.com/v1_1/yeaseen/image/upload", data)
                .then(res => {
                    //console.log(res.data.url)
                    // setSelfProfileUser({
                    //     ...selfProfileUser,
                    //     pic: res.data.url
                    // })
                    setUploadPercentage(50)
                    setProgressStyleF(50)

                    fetch('/updateprofilepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: res.data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            //console.log(result)
                            setSelfProfileUser(result)
                            setUploadPercentage(100)
                            setProgressStyleF(100)
                            
                             setTimeout(()=>{
                                inputImageFile.current.value = null
                                inputImageName.current.value = null
                                setUploadPercentage(0)
                                setProgressStyleF(0)
                             },1300)
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])

    const updateProfilePic = (file) => {
        setImage(file)
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                const newData = selfProfilePosts.filter(item => {
                    return item._id != result._id
                })
                setSelfProfilePosts(newData)
            })
    }

    return (
        <>
            {selfProfileUser
                ?
                <div style={{ maxWidth: "700px", margin: "0px auto" }}>
                    <div style={{
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-around",

                        }}>
                            <div>
                                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                    src={selfProfileUser.pic}
                                />
                            </div>
                            <div>
                                <h4> {selfProfileUser.name} </h4>

                                <div style={{ display: "flex", justifyContent: "space-around", width: "110%" }}>
                                    <h6> {selfProfilePosts.length} posts</h6>
                                    <h6> {selfProfileUser.followers.length} followers</h6>
                                    <h6> {selfProfileUser.following.length} following</h6>
                                </div>
                            </div>
                        </div>

                        <div className="file-field input-field" style={{ margin: "1px 0px 10px 55px" }}>
                            <div className="btn #64b5f6 blue darken-1">
                                <span>Update Profile Picture</span>

                                <input type="file" ref={inputImageFile} onChange={(e) => {
                                    e.preventDefault()
                                    updateProfilePic(e.target.files[0])

                                }} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" ref={inputImageName} type="text" placeholder="Upload you image" />
                            </div>

                            {uploadPercentage > 0 &&
                                <div className="progress" >
                                    <div className="progress-done" style={progressStyle}>
                                        {uploadPercentage}%
	                                </div>
                                </div>
                            }


                        </div>

                    </div>
                    <div className="gallery">
                        {
                            selfProfilePosts.map(item => {
                                return (
                                    <div key={item._id} className="gallery-content">
                                        <i className="material-icons"
                                            style={{ top: "0px", color: "red" }}
                                            onClick={() => { deletePost(item._id) }}
                                        >delete</i>

                                        <img src={item.photo} alt={item.title} />

                                    </div>
                                )
                            })
                        }

                    </div>

                </div>
                :
                <h2>Loading.....</h2>
            }
        </>
    )
}

export default Profile