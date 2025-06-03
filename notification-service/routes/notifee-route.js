import { Hono } from "hono";
import { getAllNotifications } from "../controllers/notification.js";
import { authenticateRequest } from "../middleware/auth.js";

const notifeeRoute = new Hono();

notifeeRoute.get('/', authenticateRequest, getAllNotifications);

export default notifeeRoute;