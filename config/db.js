if(process.env.NODE_ENV == 'production') {
    let username = encodeURIComponent('adm_lucas')
    let password = encodeURIComponent('rTFi2Omsw0vizq5n')
    module.exports = {mongoURI: `mongodb+srv://${username}:${password}@blogapp.lsxcb.mongodb.net/blogapp?retryWrites=true&w=majority`}
} else {
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}