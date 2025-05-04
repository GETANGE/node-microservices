const urlVersioning = (version) => (req, res, next) =>{
    if(req.path.startsWith(`/api/${version}`)){
        next()
    }else{
        res.status(404).json({
            status: false,
            error: "API version is not supported"
        })
    }
}

const headerVersioning = (version) => (req, res, next)=>{
    if(req.get('Accept-version') === version ){
        next()
    }else{
        res.status(404).json({
            status: false,
            error: "API version is not supported"
        })
    }
}

const contentTypeVersioning = (version)=>(req, res, next)=>{
    const contentType = req.get('Content-Type');

    if(contentType && contentType.includes(`application/vnd.api.${version}+json`)){
        next()
    }else{
        res.status(404).json({
            status: false,
            error: "API version is not supported"
        })
    }
}

export { urlVersioning, headerVersioning, contentTypeVersioning}