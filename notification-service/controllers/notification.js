import notifeeModel from "../models/notifee-model.js"

// cache invalidation

export const getAllNotifications = async(c) => {
    try {
        const notifications = await notifeeModel.find();
        if(!notifications || notifications < 1){
            return c.json({ message : "No notifications found"}, 400)
        }

        return c.json({
            status: "success",
            data: notifications
        })
    } catch (error) {
        return c.json({ errorMessage: "Internal server error"}, 500)
    }
}