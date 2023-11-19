import express from 'express'
import { Express, Request, Response } from 'express';
import fs from 'fs';
import { nanoid } from 'nanoid'

const path = require('path');



const app: Express = express();
app.use(express.json());

const port: number = 3000;
const groups = JSON.parse(fs.readFileSync(`${__dirname}/mock-database/groups.json`, 'utf-8'));
app.use(express.static(path.join(__dirname, 'my-app', 'build')));
// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route

// Server react app
app.get('/', (req: Request, res: Response) => {
//  res.status(200).sendFile("../client/index.html");
  res.sendFile(`${__dirname}/my-app/build/index.html`); 
})
// Create group
app.post('/group', (req: Request, res: Response) => {
  // TODO: Need to add a way to authenticate the react app so that this end point can only be used by our React App
  // TODO: Add Error Checking
  let UGID: string = nanoid()

  let newGroup =  JSON.parse(`{
    "chatId": "${UGID}",
    "chatName": "${req.body.groupName}",
    "participants": [],
    "messages": [],
    "createdAt": "${req.body.createdAt}",
    "createdBy": "${req.body.createdBy}"
  }`)   

  newGroup.participants = req.body.participants
  groups.push(newGroup)
  fs.writeFileSync(`${__dirname}/mock-database/groups.json`, JSON.stringify(groups), 'utf-8')

  console.log(UGID)
  res.status(200).json({
    status: "success",
    data: newGroup
  })
})

// Add group members


// Send message


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
