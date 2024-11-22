import { Router } from 'express';
import { allUserDetail } from '../Controlers/Group/AllUserControler.js';
import { messages } from '../Controlers/Group/MessagesControler.js';
import {details} from '../Controlers/Group/Details.Controler.js'

const group = Router();

group.get('/alluser',allUserDetail)
group.get('/messages',messages)
group.get('/detail',details)

export {group}