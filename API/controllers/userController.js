const Account_User = require('../models/userModel');
const crypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup_User = async(req, res) => {

    const {firstname, lastname, email, phone, password} = req.body;

    try{

        const goodEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!goodEmail.test(email)){
            return res.status(400).json({message: 'email invalide'});
        }

        const existEmail = await Account_User.findOne({ email: email});
        if(existEmail){
            return res.status(400).json({message: 'email existant'});
        }

        if (phone) {
            const phoneRegex = /^\d{10,15}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ message: 'Numéro de téléphone invalide.' });
            }
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
        }

        const hash_password = await crypt.hash(password, 10);
        const new_user = new Account_User({
            firstname,
            lastname,
            email: email.toLowerCase(),
            phone: phone || null,
            password: hash_password
        });
        await new_user.save();

        const token = jwt.sign({ID: new_user._id}, MYSECRET, {expiresIn: '1h'});

        res.status(201).json({token});

    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }

}

exports.login_User = async(req, res) => {
    const {email, password} = req.body;

    try{
        const userOn = await Account_User.findOne({ email: email});
        if(!userOn){
            return res.status(404).json({message: 'Utilisateur non-trouvé'});
        }

        const isPassword = await crypt.compare(password, userOn.password);
        if(!isPassword){
            return res.status(403).json({message: 'Mot de passe incorrect'})
        }

        const token = jwt.sign({ID: userOn._id}, MYSECRET, {expiresIn: '1h'});
        res.status(200).json({token});

    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

exports.get_Information_User = async(req, res) => {

    try{
        const userOn = await Account_User.findById(req.user.ID);
        if(!userOn){
            return res.status(404).json({message: 'Utilisateur non-trouvé'});
        }

        res.status(200).json({username: userOn.username, email: userOn.email});


    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }

}

exports.find_User = async(req, res) => {

    try{
        const {username} = req.params;
        const other_User = await Account_User.findOne({ username: username});

        if(!other_User){
            return res.status(404).json({message: 'Utilisateur non-trouvé'});
        }

        res.status(200).json({ID: other_User._id, username: other_User.username, email: other_User.email});

    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}