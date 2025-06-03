export const authenticateRequest = (c , next) =>{
    const userId = c.req.header('x-user-id');

    if(!userId){
        return c.json({ errorMessage: `Authentication required! Please login to continue`}, 401)
    }

    c.req.user = { userId }

    return next()
}