
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { useNavigate} from 'react-router-dom';
import ReactLogo from './components/sendicon.svg';
import smileLogo from './components/emojiicon.png';
import Picker from 'emoji-picker-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from './components/logout.png';
import usericon from './components/genericProfile.png';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useCollectionData } from 'react-firebase-hooks/firestore';


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

function onAuthStateChange(callback) {
  return firebase.auth().onAuthStateChanged(user => {
    if (user) {
      callback({loggedIn: true, email: user.email});
    } else {
      callback({loggedIn: false});
    }
  });
}

function App() {

  return (
    <div className="App">
      
     <section>        
      
           

      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
          <Route path="/SignInWithEmail" element={<SignInWithEmail/>}/>
          <Route path="/SignUp" element={<SignUp/>}/>
          <Route path="/ChatRoom" element={<IsAuth><ChatRoom/></IsAuth>}/>
          <Route path="*" element={<NotFound/>} />
        </Routes> 
      </Router>

      
        
      </section>
      
    </div>
    
  );
}

function Home(){

  let navigate = useNavigate();
  
  return  (

    <div class='loginbtn'>

    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}  
>
      <div class="buttonwrap">

    <button3 onClick={() => {SignInWithGoogle(); setTimeout(()=> {navigate("/ChatRoom")}, 3000);}}>Login with<img class="google-icon-svg" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/></button3>
    
    <button2 onClick={() => {navigate("/SignInWithEmail")}}>Login with Email</button2>
    
    <button4 onClick={() => {navigate("/SignUp")}}>New User? Sign Up</button4>
    </div>
    </motion.div>
    </div>
  
  )

}
//COMPLETE DO NOT TOUCH EASILY BREAKS trust me :....(
//Forces them back to login if not logged in means they cant go to that page or be on that page if they are not logged in
function IsAuth({children}){
  let navigate = useNavigate();
  const [user, setUser] = useState({ loggedIn: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    }
  }, []);

  if (!user.loggedIn) {
    navigate("/")
  }
  return children;
}


function SignInWithGoogle() {
  
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider); 
  
}


//Needs 
function SignInWithEmail() {
  
  let navigate = useNavigate();
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const signIn = e => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
    ).then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      navigate('/ChatRoom');
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  };


  return (
    <>
    <div class="SignUp">
      <div class="wrapper">
        <form action="">
            <h1>Sign In</h1>
            
  
            <div class="form-group">
            <label for="Email"></label>
            <input ref={emailRef} type="Email" id="Email" placeholder="Email Address" />          
            </div>

            <div class="form-group">
            <label for="password"></label>
            <input ref={passwordRef} type="password" id="password" placeholder="Password" />          
            </div>

            <p class="forgot_pswd"><span onClick={() => {navigate("/forgotPassword")}}>Forgot your password?</span></p>
            <div class="form-group"></div>
            <button class="SignBtn" onClick={signIn}>Login</button>
        </form>
        <p class="additional-act">Don't have an account ? <span onClick={() => {navigate("/SignUp")}}> Sign Up</span></p>
    </div>
    </div>
    </>
)

}

function ForgotPassword() {
  
  let navigate = useNavigate();

  const emailRef = useRef(null);

  const forgotPassword = e => {

    e.preventDefault();
    auth.sendPasswordResetEmail(emailRef.current.value)
    .then(() => {
      // Password reset email sent!
      // ..
      navigate('/');
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/user-not-found') {
          document.getElementById('invalidemail').innerHTML = 'Invalid Email';
      } else {
          alert(errorMessage);
      }
      // ..
    });

  };
  
  return (
    <>
    <div class="SignUp">
      <div class="wrapper">
        <form action="">
            <h1>Forgot Password</h1>
            <div class="form-group">
            <input ref={emailRef} type="email" id="email" placeholder="Please Enter Email" /> 
            <br></br>
            <span class="invalidemail" id='invalidemail'></span>         
            </div>
            <div class="form-group"></div>
            <button class="SignBtn" onClick={forgotPassword}>Send</button>
            
        </form>
        <p class="additional-act">Remembered your password?<span onClick={() => {navigate("/")}}> Sign In</span></p>
    </div>
    </div>
    </>
)

}

//Needs Server Sign Sync
function SignUp() {

  let navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const signUp = e => {
    e.preventDefault();
    var passwordRegex = {
      'full': /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$*])(?=.*[a-zA-Z0-9!@#$*]).{8,}$/gm
    };

    if(passwordRegex.full.test(passwordRef.current.value) && (document.getElementById('password').value == 
    document.getElementById('confirm_password').value)) {
      auth.createUserWithEmailAndPassword(
          emailRef.current.value,
          passwordRef.current.value
      ).then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        navigate('/SignInWithEmail');
        // ...
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/email-already-in-use') {
          alert('This email is already registered.');
          document.getElementById('taken').innerHTML = 'This email is already registered.';
        } else {
          alert(errorMessage);
        }
      });
    }else{

      alert("Password Requirements Not Met");

    }
  };

  var check = function() {

    var re = {
      'capital': /.*[A-Z]/,
      'digit':  /.*[0-9]/,
      'symbol': /.*[!@#$*]/,
      'length': /^(?=.*\w).{8,}$/
  };

    if (document.getElementById('password').value == document.getElementById('confirm_password').value) {
      document.getElementById('Match').style.color = 'green';
      document.getElementById('Match').innerHTML = 'Matching ✓';
    
    } if (document.getElementById('password').value != document.getElementById('confirm_password').value){
      document.getElementById('Match').style.color = 'red';
      document.getElementById('Match').innerHTML = 'Not Matching';
    
    } if(re.capital.test(document.getElementById('password').value) == true)  {
      document.getElementById('capital').style.color = 'green';
      document.getElementById('capital').innerHTML = 'Capital ✓';

    } if(re.capital.test(document.getElementById('password').value) == false)  {
      document.getElementById('capital').style.color = 'red';
      document.getElementById('capital').innerHTML = 'Add Capitals';

    } if(re.digit.test(document.getElementById('password').value) == true)  {
      document.getElementById('digits').style.color = 'green';
      document.getElementById('digits').innerHTML = 'Digits ✓';

    } if(re.digit.test(document.getElementById('password').value) == false)  {
      document.getElementById('digits').style.color = 'red';
      document.getElementById('digits').innerHTML = 'Add Digits';
  
    } if(re.symbol.test(document.getElementById('password').value) == true)  {
      document.getElementById('symbols').style.color = 'green';
      document.getElementById('symbols').innerHTML = 'Symbols ✓';

    } if(re.symbol.test(document.getElementById('password').value) == false)  {
      document.getElementById('symbols').style.color = 'red';
      document.getElementById('symbols').innerHTML = 'Add Symbols';
  
    } if(re.length.test(document.getElementById('password').value) == true)  {
      document.getElementById('length').style.color = 'green';
      document.getElementById('length').innerHTML = 'Length ✓';

    } if(re.length.test(document.getElementById('password').value) == false)  {
      document.getElementById('length').style.color = 'red';
      document.getElementById('length').innerHTML = 'Add Length';
  
    }

    
  }

return (
    <>

    <div class="SignUp">

      <div class="wrapper">
      <motion.div
        initial={{height: "200vh", bottom: 0}}
        animate={{
        height: 0,
        transition: {
        duration: .6,
        ease: [0.87, 0, 0.13, 1]
        }}}>

        </motion.div>

        <form onSubmit={signUp} action="">
            <h1>Lets create your account</h1>

            <div class="form-group">
            <label for="fullname"></label>
            <input type="text" id="fullname" placeholder="Full Name"/>
            </div>

            <div class="form-group">
            <label for="Email"></label>
            <input ref={emailRef} type="Email" id="Email" placeholder="Email Address"></input>
            <br></br>
            <span id="taken"></span>
            </div>

            <div class="form-group">
            <label for="password"></label>
            <input name="password" ref={passwordRef} type="password" id="password" placeholder="Password" onKeyUp={check}/>
            </div>

            <div class="form-group">
            <label for="password"></label>
            <input name="confirm_password" id="confirm_password" type="password" placeholder="Confirm Password" onKeyUp={check}/>
            </div>
      
            <span id='Match'></span>
            <span> | </span>
            <span id='capital'></span>
            <span> | </span>
            <span id='digits'></span>
            <span> | </span>
            <span id='symbols'></span><span> | </span>
            <span id='length'></span>
        
            <div class="form-group"></div>
            <button class="SignBtn" type="submit" >Create an account</button>
        </form>
        <p class="additional-act">Already have an account? <span onClick={() => {navigate("/")}}> Sign in </span></p>
    </div>
    </div>
    </>
)


}



function NotFound() {

}


//Add Emoji
function ChatRoom(){
  
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(1000);

  const [messages] = useCollectionData(query, {idField: 'id'});

  //Emoji Construct
  const [formValue, setFormValue] = useState('');

  const [pickerOpen, togglePicker] = React.useReducer(state => !state, false);
  const ref = useRef(null);
  const onEmojiClick = (event, emojiObject) => {
    const cursor = ref.current.selectionStart;
    const text = formValue.slice(0, cursor) + emojiObject.emoji + formValue.slice(cursor);
    setFormValue(text);
  };

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

  return auth.currentUser &&(
    <>
      <div class="signOutBtn">
      <button1 onClick={() => auth.signOut()}><img class="logoutlogo" src={logo}/></button1>
      </div>
      <main>
      
       {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      
        <div ref={dummy}></div>
      
      </main>
    <footer>
      <div class="message-box">
        <input id="text" ref={ref} type="text" class="message-input" placeholder="Type your message" value={formValue}
          onKeyPress={e => {
           if (e.key !== "Enter") return;
           console.log(formValue);
          }}
          onChange={e => setFormValue(e.target.value)}
        />
      
        <button onClick={togglePicker} class="emoji-icon"><img class="smiley" src={smileLogo}></img></button>        
        {pickerOpen && <div className="emoji-picker"><Picker onEmojiClick={onEmojiClick} /></div>}
        
        <button onClick={sendMessage} class="message-submit"><div class='buttonwrapper'><img class="rocket" src={ReactLogo}></img></div></button>
        </div>
      </footer>
    </>
  )

}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || usericon } />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
