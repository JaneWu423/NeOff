import path from "node:path";
import express from "express";
import pug from "pug";
import bodyParser from "body-parser";
import * as url from "url";

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

const port = process.env.PORT ? process.env.PORT : 3000;

let app = express();
app.use(express.static(path.join(__dirname, "../../dist"))); // Serve static assets

app.set("views", __dirname);
app.engine("pug", pug.__express);
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve templates for other routes
app.get("/", (req, res) => {
  // res.render("base.pug", {});
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


// Run the server itself
const server = app.listen(port, () => {
  console.log("Neon listening on " + server.address().port);
});