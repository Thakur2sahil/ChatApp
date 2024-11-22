import { Router } from "express";
import { users } from "../Controlers/CreateGroup/Users.js";
import { formation } from "../Controlers/CreateGroup/Formation.js";


const createGroup = Router();

createGroup.get('/users',users);
createGroup.post('/formation',formation)

export {createGroup};