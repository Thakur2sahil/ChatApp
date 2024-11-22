import { Router } from "express";
import { singlemessages } from "../Controlers/SingleChat/Singlemessages.js";


const single_Chat =  Router();

single_Chat.get('/singlemessages',singlemessages);


export {single_Chat};