import { Router } from "express";
import { allgroupname } from "../Controlers/SideBar/AllGroupName.js";
import { allusersname } from "../Controlers/SideBar/AllUsersName.js";
import { markread } from "../Controlers/SideBar/MarkRead.js";
import { unreadmessage } from "../Controlers/SideBar/UnReadMessages.js";

const sidebar = Router();

sidebar.get('/allgroupname',allgroupname);
sidebar.get('/allusersname',allusersname);
sidebar.get('/markread',markread);
sidebar.get('/unreadmessage',unreadmessage);

export {sidebar}