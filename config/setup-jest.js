/*
  eslint
    @typescript-eslint/no-var-requires: "off"
*/
const { config } = require('dotenv');

config();

// Override your environment variables here in order to make your tests pass
// if they rely on specific environment variables (or you can manually add them
// in your CI service).
process.env.JWT_SECRET = 'a4bde95d-9a13-4389-81ad-31c893e22b82';
