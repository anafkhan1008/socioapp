
const express = require('express');
const session = require('express-session');
const { TwitterApi } = require('twitter-api-v2');
const cookieParser = require('cookie-parser');
const { IgApiClient } = require('instagram-private-api');
const axios = require('axios')
const app = express();
const port = process.env.PORT;



app.set('view engine', 'ejs')

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'Thisissecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// const twitterClient = new TwitterApi({
//   appKey: process.env.TWITTER_API_KEY,
//   appSecret: process.env.TWITTER_API_KEY_SECRET,
// });

// const callbackURL = process.env.TWITTER_CALLBACK_URL;


// app.get('/auth/twitter', async (req, res) => {
//   try {
//     const { url, oauth_token, oauth_token_secret } = await twitterClient.generateAuthLink(callbackURL);
//     req.session.oauth_token_twitter = oauth_token;
//     req.session.oauth_token_secret_twitter = oauth_token_secret;
//     res.redirect(url);
//   } catch (error) {
//     console.error('Error generating auth link:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// app.get('/callback', async (req, res) => {
//   const { oauth_token, oauth_verifier } = req.query;
//   const oauth_token_session = req.session.oauth_token_twitter;
//   const oauth_token_secret_session = req.session.oauth_token_secret_twitter;

//   if (!oauth_token || !oauth_verifier || oauth_token !== oauth_token_session) {
//     return res.status(400).send('Invalid or missing tokens');
//   }

//   try {
//     const tempClient = new TwitterApi({
//       appKey: process.env.TWITTER_API_KEY,
//       appSecret: process.env.TWITTER_API_KEY_SECRET,
//       accessToken: oauth_token,
//       accessSecret: oauth_token_secret_session,
//     });

//     const { client: loggedClient, accessToken, accessSecret } = await tempClient.login(oauth_verifier);

//     // Store accessToken and accessSecret in the session
//     req.session.access_token = accessToken;
//     req.session.access_secret = accessSecret;

//     // Post a simple tweet
//     const userClient = new TwitterApi({
//       appKey: process.env.TWITTER_API_KEY,
//       appSecret: process.env.TWITTER_API_KEY_SECRET,
//       accessToken,
//       accessSecret,
//     });

//     const tweet = await userClient.v2.tweet("This is a test tweet");
//     res.send(`Tweet posted successfully: ${tweet.data.id}`);
//   } catch (error) {
//     console.error('Error during login with OAuth1:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });



///post to insta

// const postToInsta = async () => {
//     const ig = new IgApiClient();
//     ig.state.generateDevice(process.env.IG_USERNAME);
    
//     try {
//       await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  
//       const response = await axios.get('https://images.pexels.com/photos/20807656/pexels-photo-20807656/free-photo-of-black-and-white-photo-of-a-ferris-wheel.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load', {
//         responseType: 'arraybuffer',
//       });
  
//       const imageBuffer = response.data;
  
//       await ig.publish.photo({
//         file: imageBuffer,
//         caption: 'This image is good!!!!!',
//       });
  
//       console.log('Photo posted successfully!');
//     } catch (error) {
//       console.error('Failed to post photo:', error.message);
//     }
//   };


//   app.get('/postinsta', async (req, res) => {
//     try {
//       await postToInsta();
//       res.send('Photo posted successfully!');
//     } catch (error) {
//       res.status(500).send('Failed to post photo.');
//     }
//   });

// app.get('/privacy' , async(req , res) => {
//     res.render('index.ejs')
// })  

///post to pinterest

// const getBoards = async () => {
//     const url = 'https://api.pinterest.com/v5/boards';
//     const token = process.env.PINTEREST_ACCESS_TOKEN;
  
//     const config = {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     };
  
//     try {
//       const response = await axios.get(url, config);
//       console.log('Boards:', response.data);
//     } catch (error) {
//       if (error.response) {
//         console.error('Error status:', error.response.status);
//         console.error('Error data:', error.response.data);
//       } else {
//         console.error('Error:', error.message);
//       }
//     }
//   };

//   getBoards();

// const createPin = async () => {
//     const url = 'https://api.pinterest.com/v5/pins';
//     const token = process.env.PIN_ACCESS_TOKEN;
  
//     const data = {
//       link: 'https://www.pinterest.com/',
//       title: 'Your Pin Title',
//       description: 'Your Pin Description',
//       dominant_color: '#6E7874',
//       alt_text: 'Alt text for the image',
//       board_id: 'your_board_id', // replace with your actual board ID
//       media_source: {
//         source_type: 'image_url', // or use 'image_base64'
//         url: 'https://i.imgur.com/BZBHsauh.jpg' // URL or base64 string of your image
//       }
//     };
  
//     const config = {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     };
  
//     try {
//       const response = await axios.post(url, data, config);
//       console.log('Pin created:', response.data);
//     } catch (error) {
//       if (error.response) {
//         console.error('Error status:', error.response.status);
//         console.error('Error data:', error.response.data);
//       } else {
//         console.error('Error:', error.message);
//       }
//     }
//   };





app.get('/auth/instagram', (req, res) => {
  const authURL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APPID}&redirect_uri=${process.env.INSTA_REDIRECT_URL}&scope=threads_basic,threads_content_publish&response_type=code`;
  res.redirect(authURL);
});

app.get('/callback/instagram', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://api.instagram.com/oauth/access_token', null, {
      params: {
        client_id: process.env.INSTAGRAM_APPID,
        client_secret: process.env.INSTAGRAM_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTA_REDIRECT_URL,
        code: code
      }
    });

    const accessToken = response.data.access_token;

    // Use the access token to make requests to the Threads API
    res.send(`Access Token: ${accessToken}`);
  } catch (error) {
    console.error(error.response.data);
    res.status(500).send('Error exchanging code for access token');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


