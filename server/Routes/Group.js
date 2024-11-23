import { Router } from 'express';
import { allUserDetail } from '../Controlers/Group/AllUserControler.js';
import { messages } from '../Controlers/Group/MessagesControler.js';
import {details} from '../Controlers/Group/Details.Controler.js';
import { notUser } from '../Controlers/Group/NotUserControler.js';
import { addUser } from '../Controlers/Group/AddUserControler.js';

const group = Router();

group.get('/alluser',allUserDetail);
group.get('/messages',messages);
group.get('/detail',details);
group.get('/notuser',notUser);
group.post('/adduser',addUser)

export {group}