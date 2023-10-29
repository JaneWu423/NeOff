import './App.css';
import React, { useEffect, useState } from 'react';
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

import { getFirestore, collection, query, where, doc, getDoc, setDoc, addDoc, updateDoc, increment, limit , getDocs, orderBy} from "firebase/firestore";

import { Input , InputGroup, InputLeftElement, Box, useToast} from '@chakra-ui/react'
import { LinkIcon } from '@chakra-ui/icons';
import { Spinner } from '@chakra-ui/react'

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const IconDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    width: 90%;
`
const LineDiv = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-top: 0.5em;
    width: 100%;
    justify-content: space-between;
`

const NeonText = ({ text }) => {
    return (
        <div className="neon-text-pulse">
            {text}
        </div>
    )
}

function getValidUrl(url) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url; // The URL is already valid
    } else {
      return `http://${url}`; // Prefix with http://
    }
  }


const NeonObj = ({ data }) => {
    const url = data.url;
    const name = data.name;
    const icon = data.iconUrl;
    const like = data.like;
    const dislike = data.dislike;

    const validUrl = getValidUrl(url);
    
    const likeUrl = async function() {
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

    const dislikeUrl = async function() {
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

    const reportUrl = async function() {
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

    return (
        <LineDiv className="neon-text-box" >
            <div style={{display:"flex",flexDirection:"row"}}>
                <img src={icon} style={{ width: "25px", height: "25px" }} />

                <div style={{ marginLeft: "1em" }}>
                    <NeonText text={name} />
                    <a href={validUrl} style={{textDecoration: "none"}} target="_blank">Visit Site</a>
                </div>
            </div>
            <IconDiv>
                <div style={{ marginLeft: "1em" }}>
                    <svg className="heart" width="24" height="30" viewBox="0 0 24 30" fill="none" onClick={likeUrl}>
                        <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div><div style={{ marginLeft: "0.3em" }}>{like}</div>
                <div style={{ marginLeft: "1em" }}>
                    <svg width="24" height="30" viewBox="0 0 24 30" className="heart" onClick={dislikeUrl}>
                        <line x1="3" y1="20" x2="20" y2="3" stroke-width="2" />
                        <line x1="3" y1="3" x2="20" y2="20" stroke-width="2" />
                    </svg>
                </div>
                <div > {dislike} </div>
                <div className="neon-btn-sm" style={{ marginLeft: "1em" }} onClick={reportUrl}>Report</div>
            </IconDiv>
            <div></div>
        </LineDiv>
    )
}

const NeonList = ({ list }) => {
    return (
        <div style={{display:"flex", flexDirection:"column"}}>
            {list.map(item => (
                <NeonObj data={item} />
            ))}
        </div>

    )
}
const defaultData = [{ url: "", name: "", icon: "", like: 0, dislike: 0, report: 0 }];
const getName = (url) =>{
    const validUrl = getValidUrl(url);
    fetch(validUrl, {
        mode: 'no-cors',
      })
        .then(response => response.text())
        .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const title = doc.querySelector('title').innerText;
        return title;
        }).catch(err => {return null;});
}
export const Recommend = () => {
    const [inputVal, setInputVal] = useState('');
    const [processing, setProcessing] = useState(false)

    const addUrl = async function() {
        setProcessing(true)
        let url = inputVal;
        const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
        const querySnapshot = await getDocs(q);
        const name = getName(url);
        console.log("generatedname: ", name)
        if (querySnapshot.empty) {
            const docRef = await addDoc(collection(db, "urls"), {
                dislike: 0,
                iconUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16`,
                like: 0,
                name: name? name : url,
                report : 0,
                url: url,
                totalViewed: 0,
            });
        } else {
            let ref = querySnapshot.docs[0].ref; 
            let ret = await updateDoc(ref, {
               like: increment(1)
            });
        }

        setProcessing(false)
    }

    let [text, setText] = useState("");
    let [rec, setRec] = useState(defaultData);

    const url = window.location.href;
    

    
    const randomSite = async function () {
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

    const selectTop = function(){
        console.log(0)
        const urlsRef = collection(db, "urls");
        console.log(0.5)
        const q = query(urlsRef, orderBy("like","desc"), limit(5));
        console.log(1)
        const ret = [];
        getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                ret.push({url: doc.data().url, iconUrl: doc.data().iconUrl, like: doc.data().like, dislike: doc.data().dislike, name: doc.data().name})
            });
            setRec(ret)
    })}

    const handleInputChange = (e) => {
        setInputVal(e.target.value);
    };

    // const addUrl = async function() {
    //     const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
    //     const querySnapshot = await getDocs(q);
    //     console.log(querySnapshot)
    //     if (querySnapshot.empty) {
    //         console.log(1)
    //         const docRef = await addDoc(collection(db, "urls"), {
    //             dislike: 0,
    //             iconUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16`,
    //             like: 0,
    //             name: "Test",
    //             report : 0,
    //             url: url,
    //             totalViewed: 0,
    //         });
    //     } else {
    //         console.log(2)
    //         let ref = querySnapshot.docs[0].ref; 
    //         let ret = await updateDoc(ref, {
    //            like: increment(1)
    //         });
    //     }
    // }

    const selectRandom5 = async function() {
        const randomArray = [-1,-1,-1,-1,-1]

        if(collectionSize < randomArray.length){
            return;
        }
        //Get the total size of collection
        const coll = collection(db, "urls");
        const snapshot = await getCountFromServer(coll);
        const collectionSize = snapshot.data().count;

        let randomUrls = []
        let ret = []

        const q = query(coll, limit(collectionSize));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc, index) => {
            ret.push({url: doc.data().url, iconUrl: doc.data().iconUrl})
        });

        for (let i = 0; i < randomArray.length; ++i) {
            let randomIndex = Math.floor(Math.random() * collectionSize);
            while (randomArray.includes(randomIndex)){
                randomIndex = Math.floor(Math.random() * collectionSize);
            }
            randomArray[i] = randomIndex
            randomUrls.push(ret[randomIndex])
        }

        console.log(randomUrls)
    }

    const selectTop5 = async function(){
        // console.log(0)
        const urlsRef = collection(db, "urls");
        // console.log(0.5)
        const q = query(urlsRef, orderBy("like"), limit(5));
        // console.log(1)
        const ret = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            ret.push({url: doc.data().url, iconUrl: doc.data().iconUrl})
        });

        console.log(ret)
        return ret
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

    const addTotalView = async function() {
        const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            let ref = querySnapshot.docs[0].ref; 
            let ret = await updateDoc(ref, {
               totalViewed: increment(1)
            });
        } else {
            return "Not exist"
        }
    }

    return (
       
            // <div className="App" style={{ backgroundColor: "black" border-radius: "10px"}}>
            <Box flex="1" borderRadius="md" borderWidth="1px" borderColor="gray.200" p={4} >
                {/* <header className="App-header">
                </header> */}

                <div className="container">
                    <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
                    <h1 className="neon-text-flicker" style={{marginTop:"0.5em",marginBottom:"0.2em",fontSize:"15px"}}>Share Site?</h1>
                    {/* <input
                        type="text"
                        id="textInput"
                        name="textInput"
                        onChange={handleInputChange}
                    /> */}
                    <InputGroup>
                        <InputLeftElement
                            // fontSize='1.2em'
                            pointerEvents="none"
                            children={<LinkIcon color="gray.300" boxSize="3" />}
                        />
                        <Input placeholder="Enter URL" onChange={(e) => handleInputChange(e)} w='50'/>
                    </InputGroup>

                    
                    {processing ? <Spinner
                        position="absolute"
                        top="30%"
                        left="auto"
                        transform="translate(-50%, -50%)"
                        color='#e85ff5'
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        size='xl'
                        /> : <div></div> }
                    

                    <div className="neon-btn" onClick={addUrl} style={{marginTop:"0.2em", fontSize:"15px"}}>
                        <NeonText text="Add Site" />
                    </div>
                    </div>
                    <hr className="divider"/>
                    <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
                        <div className="neon-btn" onClick={randomSite} style={{marginTop:"0.5em"}}>
                            <NeonText text="Random Site" />
                        </div>
                        <div className="neon-btn" onClick={selectTop} style={{marginTop:"0.5em"}}>
                            <NeonText text="Top Site" />
                        </div>
                    </div>
                    <div style={{ marginTop: "0.5em" }}>
                        {rec === defaultData ? null : <NeonList list={rec} />}
                    </div>
                </div>
            {/* </div> */}
            </Box>
     
    );
}

export default App;
