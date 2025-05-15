import cors from "cors"

const configureCors = function(){
    const allowedOrigins = [
        "http://localhost:3000",
        "https://localhost:3000",
        "https://frontendcustomdomain.com"
    ]
    return cors({
        origin : function(origin, callback){
            if(!origin || allowedOrigins.indexOf(origin) !== -1){
                callback(null, true)
            }else{
                callback(new Error("Not allowed by cors"))
            }
        },

        methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept-Version'
        ],
        exposedHeaders:[
            'Content-Range',
            'X-Total-Count'
        ],
        credentials: true,
        preflightContinue: false,
        maxAge: 600,
        optionsSuccessStatus: 204
    })
}

export default configureCors