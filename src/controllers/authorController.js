const AuthorModel = require('../models/authorModel.js');
const jwt = require('jsonwebtoken');

//-----------------------------------------------------------------------------------------------//

const createAuthor = async function (req, res) {
  try {
    const authorData = req.body;

    const email = await AuthorModel.findOne({ email: authorData.email });

    if (Object.keys(authorData).length == 0)
      return res.status(400).send({ status: false, msg: 'enter body' });

    let nameRegex = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
    let mailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    let passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    if (!authorData.fname)
      return res
        .status(400)
        .send({ status: false, msg: 'first name required' });

    if (!authorData.lname)
      return res.status(400).send({ status: false, msg: 'last name required' });

    if (
      !nameRegex.test(authorData.fname) ||
      !nameRegex.test(authorData.lname)
    ) {
      return res
        .status(400)
        .send({ msg: 'Please enter valid characters only in fname and lname' });
    }

    if (!authorData.title)
      return res.status(400).send({ status: false, msg: 'title required' });
    if (
      authorData.title != 'Mr' &&
      authorData.title != 'Mrs' &&
      authorData.title != 'Miss'
    )
      return res.status(400).send({ status: false, msg: 'enter valid title' });

    if (!authorData.email)
      return res.status(400).send({ status: false, msg: 'email required' });
      
    if (!mailRegex.test(authorData.email)) {
      return res.status(400).send({ msg: 'Please enter valid mailId' });
    }
    if (email)
      return res
        .status(400)
        .send({ status: false, msg: 'email already taken' });

    if (!authorData.password)
      return res.status(400).send({ status: false, msg: 'password required' });

    if (!passRegex.test(authorData.password))
      return res.status(400).send({
        msg: 'Please enter a password which contains min 8 letters, at least a symbol, upper and lower case letters and a number',
      });

    const savedData = await AuthorModel.create(authorData);

    res.status(201).send({ status: true, msg: savedData });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//-----------------------------------------------------------------------------------------------//

const loginAuthor = async function (req, res) {
  try {
    let userName = req.body.emailId;
    if (!userName)
      return res
        .status(400)
        .send({ status: false, msg: 'please enter emailId' });

    let password = req.body.password;
    if (!password)
      return res
        .status(400)
        .send({ status: false, msg: 'please enter password' });

    let findAuthor = await AuthorModel.findOne({
      email: userName,
      password: password,
    });
    if (!findAuthor)
      return res.status(404).send({
        status: false,
        msg: 'Email or Password is not valid',
      });

    let token = jwt.sign(
      {
        authorId: findAuthor._id.toString(),
      },
      'group-21'
    );
    res.setHeader('x-api-key', token);
    res.status(200).send({ status: true, token: token });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;
