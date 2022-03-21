if(process.env.NODE_ENV == 'production') {
    module.exports = {mongoURI: "mongodb+srv://adm_lucas:rTFi2Omsw0vizq5n@blogapp.lsxcb.mongodb.net/blogapp?retryWrites=true&w=majority"}
} else {
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}