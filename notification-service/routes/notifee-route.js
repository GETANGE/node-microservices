import { Hono } from "hono";
import { getAllNotifications } from "../controllers/notification.js";

const notifeeRoute = new Hono();

notifeeRoute.get('/', getAllNotifications);

export default notifeeRoute;