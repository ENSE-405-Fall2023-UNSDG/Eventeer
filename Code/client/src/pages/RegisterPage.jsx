import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


export default function RegisterPage(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    async function registerNewUser(ev){
        ev.preventDefault();
        try{
            await axios.post('/register',{
                name,
                email,
                password,
            });
            alert("Registeration Successful! Now you can Login!");
        } catch(e){
            alert("Registeration Failed! Please try again later!");
        }
        
    }

    return (

        <div className= "mt-4 grow flex items-center justify-around">
            
            <div>

                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-lg mx-auto" onSubmit={registerNewUser}>
                    <input type="text" placeholder="Name" 
                    value={name} 
                    onChange={ev => setName(ev.target.value)}/>
                    <input type= "email" placeholder="your@email.com"
                    value={email} 
                    onChange={ev => setEmail(ev.target.value)}/>
                    <input type= "password" placeholder="password"
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)}/>
                    <button className="registerbutton">Register</button>
                    <div className="text-center py-2">
                        You have account? <Link className="underline text-blue-700" to={'/login'}>Login</Link> 
                    </div>
                </form>

            </div>
            
            
        </div>
    );
}