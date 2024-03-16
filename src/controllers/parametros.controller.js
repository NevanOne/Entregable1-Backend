const {response, request} = require('express')

class ParametrosController {

 static getSearchWord = (req, res=response) => {
             const { category } = req.params
             res.status(200).send({category})
     }
    static getSearchWord = (req, res=response) => {
            const { word } = req.params
            res.status(200).send({word})
    }

    static definirParams = async (req, res, next, word)=>{
        const dictionaryService = [ 
            {word: 'hola', lenguage: 'español'},
            {word: 'hello', lenguage: 'ingles'},
            {word: 'hola', lenguage: 'ingles'},
        ]
        let searchWord = dictionaryService.find( item => item.word === word)
        if(!searchWord){
            req.word = null
        } else {
            req.word = searchWord
        }
        next()
    }

}
module.exports = {
    ParametrosController
}