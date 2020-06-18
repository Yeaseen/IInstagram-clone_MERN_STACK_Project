import React,{useState,useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'

import {userContext} from '../../App'
//import {WebSocketContext} from '../../WebSocket'
import makeToast from '../../Toaster'


const SignIn = () => {

    const {state,dispatch} = useContext(userContext)
    //const ws = useContext(WebSocketContext)
    const history = useHistory()
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    
    const PostData =()=>{

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            
            makeToast("error","Invalid email or password")
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            //console.log(data)
            if(data.error){
                
                makeToast("error",data.error)
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                
                makeToast("success","Signed in successfully")
                history.push("/")
                //ws.setupSocket(data.token)
            }
        }).catch(err=>{
            console.log(err)
        })
    }



    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>IInstagram</h2>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                onClick={()=>PostData()}
                >
                SignIn
                </button>

                <h5>
                    <Link to ="/signup">Don't have an account ?</Link>
                </h5>


            </div>
        </div>

    )
}

export default SignIn