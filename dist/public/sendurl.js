import React from"react";import{initializeApp}from"firebase/app";const firebaseConfig={apiKey:"AIzaSyD68VVTgiVceafaNB-Brrp-I9-_xiTLEBo",authDomain:"vandyhack2023.firebaseapp.com",projectId:"vandyhack2023",storageBucket:"vandyhack2023.appspot.com",messagingSenderId:"700079134322",appId:"1:700079134322:web:81c95ff7175e428c2354eb"},app=initializeApp(firebaseConfig),db=getFirestore(app);import{getFirestore,collection,query,where,addDoc,updateDoc,increment,limit,getDocs}from"firebase/firestore";chrome.bookmarks.onCreated.addListener(((e,t)=>{t.url&&chrome.tabs.query({url:t.url},(e=>{0!==e.length&&(e[0],promptUserForPreference(t.url))}))})),chrome.tabs.onUpdated.addListener(((e,t,o)=>{"complete"===t.status&&o.url&&promptUserForFeedback(o.url)}));const promptUserForFeedback=async e=>{console.log(JSON.stringify(e));const t=query(collection(db,"urls"),where("url","==",e),limit(1));(await getDocs(t)).empty||(console.log(2),chrome.notifications.create({type:"basic",iconUrl:"https://res.cloudinary.com/dmpx9tjf3/image/upload/v1698571992/neoff/iftbzuq328fro5eovolr.png",title:"NeOff wants to know...",message:"Do you like this recommendation?",buttons:[{title:"Yes"},{title:"No"}]}))};function showNotification(e,t){chrome.notifications.create("Id",{type:"basic",iconUrl:"https://res.cloudinary.com/dmpx9tjf3/image/upload/v1698571992/neoff/iftbzuq328fro5eovolr.png",title:e,message:t})}const like=async function(e,t){const o=query(collection(db,"urls"),where("url","==",e),limit(1)),i=await getDocs(o);if(i.empty)await addDoc(collection(db,"urls"),{dislike:0,iconUrl:`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${e}&size=16`,like:0,name:t,report:0,url:e,totalViewed:0});else{let e=i.docs[0].ref;await updateDoc(e,{like:increment(1)})}};function promptUserForPreference(e){chrome.notifications.create({type:"basic",title:"NeOff wants to know...",message:"Do you like this website?",iconUrl:"https://res.cloudinary.com/dmpx9tjf3/image/upload/v1698571992/neoff/iftbzuq328fro5eovolr.png",buttons:[{title:"Share!"},{title:"Never!"}]})}chrome.notifications.onButtonClicked.addListener(((e,t)=>{switch(console.log(t),console.log(20),t){case 0:chrome.tabs.query({active:!0,currentWindow:!0},(function(e){var t=e[0];like(t.url,t.title)}));break;case 1:chrome.tabs.query({active:!0,currentWindow:!0},(function(e){var t=e[0];dislike(t.url)}))}}));const dislike=async function(e){const t=query(collection(db,"urls"),where("url","==",e),limit(1)),o=await getDocs(t);if(!o.empty){let e=o.docs[0].ref;await updateDoc(e,{dislike:increment(1)})}};