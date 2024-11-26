import { Router } from 'express';
import { allUserDetail } from '../Controlers/Group/AllUserControler.js';
import { messages } from '../Controlers/Group/MessagesControler.js';
import {details} from '../Controlers/Group/Details.Controler.js';
import { notUser } from '../Controlers/Group/NotUserControler.js';
import { addUser } from '../Controlers/Group/AddUserControler.js';
import { userInfo } from '../Controlers/Group/UserInfoControler.js';
import { removeUser } from '../Controlers/Group/RemoveUserControler.js';
import { roleUpdate } from '../Controlers/Group/RoleUpdateControler.js';

const group = Router();

group.get('/alluser',allUserDetail);
group.get('/messages',messages);
group.get('/detail',details);
group.get('/notuser',notUser);
group.get('/userinfo',userInfo);
group.post('/adduser',addUser)
group.delete('/removeuser',removeUser)
group.post('/roleupdate',roleUpdate)

export {group}