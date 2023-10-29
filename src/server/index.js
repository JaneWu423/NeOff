import path from "node:path";
import express from "express";
import bodyParser from "body-parser";
import * as url from "url";
import {data} from "./data.js";
import cors from 'cors';

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';
import serviceAccount from './hackathon-2023.json' assert { type: 'json' };
const firebaseConfig = {
  apiKey: "AIzaSyD68VVTgiVceafaNB-Brrp-I9-_xiTLEBo",
  authDomain: "vandyhack2023.firebaseapp.com",
  projectId: "vandyhack2023",
  storageBucket: "vandyhack2023.appspot.com",
  messagingSenderId: "700079134322",
  appId: "1:700079134322:web:81c95ff7175e428c2354eb",

};

// const application = initializeApp(firebaseConfig);
// const db = getFirestore(application);

// const serviceAccount = require('./hackathon-2023.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const corsOptions = {
  origin: 'chrome-extension://nilpdcefgmfkiljgkmofmnfbofmlipal',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // This allows session cookies to be sent back and forth
  allowedHeaders: "Content-Type, Authorization, X-Requested-With"
};

const port = process.env.PORT ? process.env.PORT : 3000;

let app = express();
app.use(express.static(path.join(__dirname, "../../dist"))); // Serve static assets
app.options('*', cors(corsOptions));
app.set("views", __dirname);
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve templates for other routes
app.get("/", (req, res) => {
  const indexPath = path.resolve(__dirname, "../../dist/index.html");
  res.sendFile(indexPath);
});

app.post("/like", async (req, res) => {
  console.log(1)
  const data = req.body;
  const url = data.url;
  const urls = db.collection('urls');
  // const query = urls.where('url' ,'==', url).limit(1);
  // console.log(query)

  const cityRef = db.collection('urls').doc('VP3ErOtmSqxD6pEKJQkC');
  console.log(cityRef)
  const doc = await cityRef.get();
  
  console.log(doc)
  res.status(201).send("return")

  // query.get()
  // .then((snapshot) => {
  //   if (snapshot.empty) {
  //     console.log('No matching documents found.');
  //     return;
  //   }  
  //   const doc = snapshot.docs[0];
  //   const likes = doc.like + 1
  //   const res = cityRef.update({like: likes});
  //   res.status(201).send(res)
  // })
  // .catch((error) => {
  //   console.log("Error getting document:", error);
  //   res.status(400).send('There is an error')
  // });
})


app.get("/recommend/random", (req, res) => {
  res.json(data);
});


app.post("/recommend/like", (req, res) => {
  const url = req.body.url;
  console.log("Like "+url);
  res.sendStatus(200);
});

app.post("/recommend/dislike", (req, res) => {
  const url = req.body.url;
  console.log("Dislike "+url);
  res.sendStatus(200);
});

app.post("/recommend/report", (req, res) => {
  const url = req.body.url;
  console.log("report "+url);
  res.sendStatus(200);
});


// Add CORS middleware
app.use(cors(corsOptions));

// Manually handle the OPTIONS request
app.options('*', cors(corsOptions));
app.set("views", __dirname);
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/storeBookmarkDetails', (req, res) => {
    const { title, url, icon } = req.body;
    console.log('Received details:', title, url, icon);
    
    res.sendStatus(200);

});

// Run the server itself
const server = app.listen(port, () => {
  console.log("Neon listening on " + server.address().port);
});