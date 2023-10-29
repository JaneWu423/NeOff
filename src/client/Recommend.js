import './App.css';
import React, { useState } from 'react';
import styled from 'styled-components';
import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyD68VVTgiVceafaNB-Brrp-I9-_xiTLEBo",
    authDomain: "vandyhack2023.firebaseapp.com",
    projectId: "vandyhack2023",
    storageBucket: "vandyhack2023.appspot.com",
    messagingSenderId: "700079134322",
    appId: "1:700079134322:web:81c95ff7175e428c2354eb"
  };

import { getFirestore, collection, query, where, doc, getDoc, setDoc, addDoc, updateDoc, increment, limit , getDocs} from "firebase/firestore";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const IconDiv = styled.div`
    margin-left: 3em;
    display: flex;
    justify-content: center;
    flex-direction: row;
`
const LineDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-top: 1.5em;
`

const NeonText = ({ text }) => {
    return (
        <div className="neon-text-flicker">
            {text}
        </div>
    )
}


const NeonObj = ({ data }) => {
    const url = data.url;
    const name = data.name;
    const icon = data.icon;
    const like = data.like;
    const dislike = data.dislike;
    const report = data.report;

    return (
        <LineDiv>
            <div><img src={icon} style={{ width: "25px", height: "25px" }} /></div>
            <div style={{ marginLeft: "1em" }}>
                <div>{name}</div>
                <div>{url}</div>
            </div>
            <IconDiv>
                <div style={{ marginLeft: "1em" }}>
                    <svg className="heart" width="24" height="30" viewBox="0 0 24 30" fill="none">
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div><div style={{ marginLeft: "0.3em" }}>{like}</div>
                <div style={{ marginLeft: "1em" }}>
                    <svg width="24" height="30" viewBox="0 0 24 30" className="heart">
                        <line x1="3" y1="20" x2="20" y2="3" stroke-width="2" />
                        <line x1="3" y1="3" x2="20" y2="20" stroke-width="2" />
                    </svg>
                </div>
                <div > {dislike} </div>
                <div className="neon-btn-sm" style={{ marginLeft: "1em" }}>Report</div>
            </IconDiv>
            <div></div>
        </LineDiv>
    )
}

const NeonList = ({ list }) => {
    return (
        <div>
            {list.map(item => (
                <NeonObj data={item} />
            ))}
        </div>
    )

}
const defaultData = [{ url: "", name: "", icon: "", like: 0, dislike: 0, report: 0 }];

export const Recommend = () => {
    let [text, setText] = useState("");
    let [rec, setRec] = useState(defaultData);

    const url = window.location.href;
  
    
    const neonEffect = function () {
        text = !text ? "Neon Effect" : ""
        setText(text);
        fetch("/recommend/random").then(data => data.json()).then(res => {
            setRec(res);
            console.log([res])
        });
    }
    const addUrl = async function() {
        const urlsRef = collection(db, "urls");
        const docRef = await addDoc(collection(db, "urls"), {
            dislike: 0,
            iconUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16`,
            like: 0,
            name: "Test",
            report : 0,
            url: url
        });
    }
    
    const like = async function() {
        const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            let ref = querySnapshot.docs[0].ref; 
            let ret = await updateDoc(ref, {
               like: increment(1)
            });
        } else {
            return "Not exist"
        }
    }

    const dislike = async function() {
        const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            let ref = querySnapshot.docs[0].ref; 
            let ret = await updateDoc(ref, {
               dislike: increment(1)
            });
        } else {
            return "Not exist"
        }
    }

    const report = async function() {
        const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            let ref = querySnapshot.docs[0].ref; 
            let ret = await updateDoc(ref, {
               report: increment(1)
            });
        } else {
            return "Not exist"
        }
    }
    const testlike = async function( ){
        console.log(url)

        // const urlRef = db.doc('VP3ErOtmSqxD6pEKJQkC');
        // console.log(urlRef)

        // const doc = await urlRef.get();
        // console.log(doc)

        const urlsRef = collection(db, "urls");
        console.log(urlsRef)


        // await setDoc(doc(urlsRef, VP3ErOtmSqxD6pEKJQkC),{
        //     name: "San Francisco", state: "CA", country: "USA",
        //     capital: false, population: 860000,
        //     regions: ["west_coast", "norcal"] });


        const docRef = await addDoc(collection(db, "urls"), {
            dislike: 0,
            iconUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16`,
            like: 0,
            name: "Test",
            report : 0,
            url: url
        });
        console.log(0)
    

    }

    return (
        <div className="App" style={{ backgroundColor: "black" }}>
            <header className="App-header">
            </header>
            <div className="container">
                <div className="neon-btn" onClick={neonEffect}>Click Me</div>
                <div style={{ marginTop: "1em" }}>
                    {rec === defaultData ? null : <NeonList list={rec} />}
                </div>

                <div className="neon-btn" onClick={like}>Test</div>
            </div>
        </div>
    );
}

export default App;
