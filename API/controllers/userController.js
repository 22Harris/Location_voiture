const Account_User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.signup_User = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Email invalide' });
        }

        const existEmail = await Account_User.findOne({ email: email });
        if (existEmail) {
            return res.status(400).json({ message: 'Email existant' });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
        }

        const hash_password = await bcrypt.hash(password, 10);

        const new_user = new Account_User({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: hash_password
        });
        await new_user.save();

        // Génération du token JWT
        const token = jwt.sign({ ID: new_user._id }, process.env.MYSECRET, { expiresIn: '1h' });

        res.status(201).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.login_User = async(req, res) => {
    const {email, password} = req.body;

    try{
        const userOn = await Account_User.findOne({ email: email});
        if(!userOn){
            return res.status(404).json({message: 'Utilisateur non-trouvé'});
        }

        const isPassword = await bcrypt.compare(password, userOn.password);
        if(!isPassword){
            return res.status(403).json({message: 'Mot de passe incorrect'})
        }

        const token = jwt.sign({ ID: userOn._id }, process.env.MYSECRET, { expiresIn: '1h' });
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