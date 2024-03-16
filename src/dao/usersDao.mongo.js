const { userModel } = require("../db/models/user.model") 

class UserDaoMongo { 
    constructor(){
        this.modelMongoose = userModel
    }

    get = () => { 
        return this.userModel.find({})
    }
    
    getBy = (filter) => { 
        return this.userModel.findOne(filter)
    }
    create = (newUser) => { 
        return this.userModel.create(newUser)
    } 
    update = (uid, userToUpdate) => { 
        return this.userModel.findByIdAndUpdate({_id: uid}, userToUpdate, {new: true})
    } 
    delete = (uid) => {
        return this.userModel.findByIdAndDelete({_id: uid})
    } 
}

module.exports = UserDaoMongo