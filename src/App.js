
import React, { useState, useRef } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import ReactLogo from './components/sendicon.svg';
import smileLogo from './components/smileBitch.png';
import Picker from 'emoji-picker-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
//import { signInAnonymously } from 'firebase/auth';

firebase.initializeApp({
  apiKey: "AIzaSyBTCC3D80WmuS37rJ3TZlGWxjdAMXYHNoQ",
  authDomain: "reactchat-85657.firebaseapp.com",
  projectId: "reactchat-85657",
  storageBucket: "reactchat-85657.appspot.com",
  messagingSenderId: "849973960376",
  appId: "1:849973960376:web:c2a15b437d3a5a963e5e4d",
  measurementId: "G-K2JBT5YXNV"
})

//reCaptcha AppCheck setup
//const appCheck = firebase.appCheck();
//appCheck.activate('6LeTTcAdAAAAAPeZFeFXLOFd09Xx3I-awHD9g0hS', true);


const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {


  const [user] = useAuthState(auth);
  
  
  
  
  return (
    <div className="App">
      <header>
        <SignOut />
      </header>

     <section>        
        <div class="backgroundlog">        

      

      <Router>
        <Routes>
          <Route path="/" element={<SignIn/>}/>
          <Route path="/SignInWithEmail" element={<SignInWithEmail/>}/>
          <Route path="/SignUp" element={<SignUp/>}/>
          <Route path="/ChatRoom" element={<ChatRoom/>}/>
        </Routes> 
      </Router>

    

        </div>
        
      </section>
      
    </div>
    
  );
}




function SignIn() {

  let navigate = useNavigate();


  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);


  
  }


  
 
  return  (
    
    
    <div class='loginbtn'>

    <button3 class="material-bubble" onClick={signInWithGoogle} onClick={() => {navigate(<ChatRoom/>)}}>Login with<img class="google-icon-svg" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/></button3>

    <button2 onClick={useSignInWithEmailAndPassword}>Login with Email</button2>
    
    <button4 onClick={() => {navigate("/SignUp")}}>New User? Sign Up</button4>


    </div>

  
  )

}

function SignInWithEmail() {

}

function SignUp() {
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  
  const signUp = e => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
    ).then(user => {
        console.log(user)
    }).catch(err => {
        console.log(err)
    })
  }

  return (
    <>
    <div className={signUp}>
        <form action="">
            <h1>Sign Up</h1>
            <input ref={emailRef} type="email" />
            <input ref={passwordRef} type="password" />
            <button>Sign in </button>
        </form>
    </div>

    </>
)


}

function SignOut(){




  return auth.currentUser&& (

    <button1 onClick={() => auth.signOut()}>Sign Out</button1>
  )
}

function ChatRoom(){
  
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(1000);

  const [messages] = useCollectionData(query, {idField: 'id'});

  //Emoji Construct
  const EmojiPicker = () => (
    <div className="emoji-picker">
      <Picker />
    </div>
  );
  const [pickerOpen, togglePicker] = React.useReducer(state => !state, false);

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
  
    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }

  return(
    <>
      <main>
        
       {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      
        <div ref={dummy}></div>
      
      </main>

      <div class="message-box">

        <textarea  value={formValue} onChange={(e) => setFormValue(e.target.value)}  type="text" class="message-input" placeholder="Type message..."></textarea>
      
        <button onClick={togglePicker} class="emoji-icon"><img class="smiley" src={smileLogo}></img></button>
        {pickerOpen && <EmojiPicker />}
        
        <button onClick={sendMessage} class="message-submit"><img class="rocket" src={ReactLogo}></img></button>

      </div>
    </>
  )

}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
