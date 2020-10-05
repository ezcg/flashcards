let dev = {};
dev.flashcardsappurl = "http://localhost:3000/";

// Todo: make shared with backend
dev.maxCharsTitle = 70;
dev.maxCharsDescription = 200;
dev.maxCharsQuestion = 300;
dev.maxCharsAnswer = 450;
//

dev.GOOGLE_CLIENT_ID="FOO";
dev.GOOGLE_CLIENT_SECRET="BAR";

// overwrite any prod values
let prod = Object.assign({}, dev);
prod.flashcardsappurl = "https://flashcardsadmin.ezcg.com/";

const config = process.env.REACT_APP_ENVIRONMENT === 'dev'
  ? dev
  : prod;

export default config;
