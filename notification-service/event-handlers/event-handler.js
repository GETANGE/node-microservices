import notifeeModel from "../models/notifee-model.js";
export const mediaEventHandler = async (event)=>{
    try {
        const { title, message, type, read, data, channel } = event;

        // save the notifications to the database
        const newlyCreatedMedia = new notifeeModel( { title, message, type, read, data, channel });

        await newlyCreatedMedia.save();

        // send mail

        // send sms

        // websockets for in-app (notifications)
    } catch (error) {
        console.log(`Error handling event`)
    }
}