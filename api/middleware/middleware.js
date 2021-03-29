const Jokes = require('../jokes/jokes-model'); 

const userName = async (req, res, next) => {
    try{
        const user = await Jokes.checkUsers(req.body)
        if(user){
            res.status(400).json({message:"username taken"})
        } else {
            next();
        }
    } catch (error){
        res.status(500).json(`Sorry about the server error! ${error.message}`)
    }
}

module.exports = {
    userName
} 