
import React, { useState, useRef } from 'react';
import './App.css';
import Picker from 'emoji-picker-react';


import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';



import { useAuthState } from 'react-firebase-hooks/auth';
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
const appCheck = firebase.appCheck();
appCheck.activate('6LeTTcAdAAAAAPeZFeFXLOFd09Xx3I-awHD9g0hS', true);

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {
  
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);

  }


  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser&& (

    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt');

  const [messages] = useCollectionData(query, {idField: 'id'});


//Emoji Construct
const [showPicker, setShowPicker] = useState(false);

const onEmojiClick = (event, emojiObject) => {
  setFormValue(prevInput => prevInput + emojiObject.emoji);
  setShowPicker(false);
};

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
      
      <div>
          
        <input className='input-style' value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <img className="emoji-icon" src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg" onClick={() => setShowPicker(val => !val)} /> 
        {showPicker && <Picker pickerStyle={{width: '100%'}} onEmojiClick={onEmojiClick} />}

        <button onClick={sendMessage}>Send</button>
          
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
