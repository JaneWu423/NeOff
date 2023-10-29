// For bookmarks creation
import React from 'react';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyD68VVTgiVceafaNB-Brrp-I9-_xiTLEBo",
  authDomain: "vandyhack2023.firebaseapp.com",
  projectId: "vandyhack2023",
  storageBucket: "vandyhack2023.appspot.com",
  messagingSenderId: "700079134322",
  appId: "1:700079134322:web:81c95ff7175e428c2354eb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// import reportWebVitals from './reportWebVitals.js';



import { getFirestore, collection, query, where, doc, getDoc, setDoc, addDoc, updateDoc, increment, limit, getDocs } from "firebase/firestore";

chrome.bookmarks.onCreated.addListener((id, bookmarkNode) => {
  if (!bookmarkNode.url) return;

  chrome.tabs.query({ url: bookmarkNode.url }, (tabs) => {
    if (tabs.length === 0) return;

    const tab = tabs[0];
    promptUserForPreference(bookmarkNode.url);
    // console.log(JSON.stringify(tab.url));
    // console.log(JSON.stringify(tab.title));
    // console.log(JSON.stringify(tab.favIconUrl));
    // addUrl(bookmarkNode.url);

  });
});
chrome.tabs.onCreated.addListener((tab) => {
  if (!tab.url) return;
  
  promptUserForPreference(tab.url);
});
function showNotification(title, message) {
  chrome.notifications.create('Id', {
    type: 'basic',
    iconUrl: 'https://icon.horse/icon/youtube.com',  // Path to your extension's icon or any other asset
    title: title,
    message: message
  });
}
const like = async function (url) {
  const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    let ref = querySnapshot.docs[0].ref;
    let ret = await updateDoc(ref, {
      like: increment(1)
    });
  } else {
    const docRef = await addDoc(collection(db, "urls"), {
      dislike: 0,
      iconUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16`,
      like: 0,
      name: "Test",
      report: 0,
      url: url,
      totalViewed: 0,
    });
  }
}
function promptUserForPreference(url) {
  chrome.notifications.create({
    type: "basic",
    title: "URL Preference",
    message: `Do you like the website: ${url}?`,
    iconUrl: 'https://icon.horse/icon/youtube.com',
    buttons: [
      { title: "Share!" },
      { title: "Never!" }
    ]
  });
}
function sendDataToServer(title, url, icon) {

}

// const addUrl = async function(url) {
//   const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
//   const querySnapshot = await getDocs(q);
//   if (querySnapshot.empty) {
//       const docRef = await addDoc(collection(db, "urls"), {
//           dislike: 0,
//           iconUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16`,
//           like: 0,
//           name: "Test",
//           report : 0,
//           url: url,
//           totalViewed: 0,
//       });
//   } else {
//       let ref = querySnapshot.docs[0].ref; 
//       let ret = await updateDoc(ref, {
//          like: increment(1)
//       });
//   }
// }

chrome.notifications.onButtonClicked.addListener((thisNoteId, buttonIndex) => {

  console.log(buttonIndex);
  console.log(20);
  switch (buttonIndex) {
    case 0:
      // Code for Button 1

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        like(currentTab.url); // Log the URL of the current tab
      });

      break;
    case 1:
      // Code for Button 2
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        dislike(currentTab.url); // Log the URL of the current tab
      });
      break;
  }
});


const dislike = async function (url) {
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