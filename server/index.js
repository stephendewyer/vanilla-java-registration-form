const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const users = require('./data/users.json');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

function sleep(delay) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, delay)
  );
}

// serve user data

app.get('/users', async (req, res) => {
  await sleep(300);
  res.json(users);
});

// handle the form submission data

app.post('/submit', async (req, res) => {

  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { enteredNameInput, enteredEmailInput, enteredReferrerInput, enteredReferrerNameInput } = data;

  console.log(data);

  const name = enteredNameInput;
  const email = enteredEmailInput;

  // check for data

  if (!name && !email ) {
    res.status(422).json({
      message:
        'registration failed due to missing name and email',
    });
    return;
  };

  // validate the name

  const nameRGEX = /^[A-Za-z '-]{1,100}$/;
  const testedName = nameRGEX.test(name);
  if (!name && email) {
    res.status(422).json({
      message:
        'registration failed due to missing name',
    });
    return;
  };

  if (testedName == false) {
    res.status(422).json({
      message:
        'registration failed due to incorrect name formatting.  Name can only contain alpha characters, spaces, hyphens and apostrophes',
    });
    return;
  }

  // validate the email

  const emailRGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const testedEmail = email.match(emailRGEX);

  if (!email && name) {
    res.status(422).json({
      message:
        'registration failed due to missing email address',
    });
    return;
  };

  if (email.indexOf('@') == -1) {
    res.status(422).json({
      message:
        'registration failed.  Email address is missing an @ symbol',
    });
    return;
  };

  if (testedEmail === null) {
    res.status(422).json({
      message:
        'registration failed.  Invalid email address',
    });
    return;
  };

  // data is valid.  Send user to submit page

  res.status(200).json({message: 'registration success'});
  
});

// sendFile

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// use files in public folder

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

