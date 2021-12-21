import React, { useState } from 'react';
import './App.css';

import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { signInAnonymously } from 'firebase/auth';

firebase.initializeApp({
  apiKey: "AIzaSyBTCC3D80WmuS37rJ3TZlGWxjdAMXYHNoQ",
  authDomain: "reactchat-85657.firebaseapp.com",
  projectId: "reactchat-85657",
  storageBucket: "reactchat-85657.appspot.com",
  messagingSenderId: "849973960376",
  appId: "1:849973960376:web:c2a15b437d3a5a963e5e4d",
  measurementId: "G-K2JBT5YXNV"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const[user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      
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

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [message] = useCollectionData(query, {idField: 'id'});

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

  }

  return(
    <>
      <div>
       {messages && message.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />

        <button type="submit"><img src={"../public/img/sendButtonIdea_1.png"} /></button>

      </form>
    </>
  )

}

function ChatMessage(props) {
  const { text, uid } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={'message ${messageClass}'}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
