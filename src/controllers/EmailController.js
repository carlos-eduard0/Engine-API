const crypto = require('crypto');
const connection = require('../database/connection');
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: "oculoslegais10@gmail.com",
		pass: "semideia"
	}
});

module.exports = {

	async index(req, res){

		const {email} = req.body;

		const empresa = await connection('empresas')
        .where('email', email)
        .select('*')
        .first();

        if(!empresa) {
            res.status(400).send({
            	message: 'email não cadastrado'
            });
            return;
        }

        const date = new Date();
		const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate()+1);

		// console.log(today);

        const token = crypto.randomBytes(20).toString('HEX');

        const att = await connection('empresas')
        .where('email', email)
        .update({
		    updateCode: token,
		    updateCode_expires: today
	  	});

		var mailOptions = {
		    from: '"Equipe Engine" <oculoslegais10@gmail.com>',
		    to: email,
		    subject: "Mudança de senha",
		    html: "<h1>https://engine-frontend.herokuapp.com/codigo/senha/"+token+"</h1>"
		}

		transporter.sendMail(mailOptions, function(err, info){
		    if(err){
		        console.log(err);
		    }else{
		        console.log("Mensagem enviada com sucesso");
            	res.status(200).json('email enviado')
		    }
		});
		
	}
}