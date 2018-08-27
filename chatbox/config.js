const request = require('request-promise');
const KMS_URL =  process.env.INSURE2GO_KMS_URL || 'http://kms:5000/kms/load/fbchatbot';
let config, loading_callback;
if(process.env.INSURE2GO_SERVER == 'PROD'){
  // Load configuration from KMS
  console.log("Loading configuration from KMS: " + KMS_URL);
  loadFromKMS(true);
}else{
  // Load configuration from KMS
  console.log("Loading configuration from KMS: " + KMS_URL);
  loadFromKMS(false);
}

async function loadFromKMS(is_production){
  await request({
    uri: KMS_URL
  }).then((res, err) => {
    console.log("Successfully responded from KMS");
    //console.log("Response from KMS: " + res);
    KMS_CONFIG = JSON.parse(res);
    setup(is_production);
    console.log("module.exports = config #2");
    module.exports = config;
    if(typeof loading_callback == 'function'){
      console.log("Calling callback #2");
      loading_callback(config);
    }

  }).catch(function(err) { // catch error
    console.error(err);
  });
}

function setup(is_production){
  // Production
  if(is_production){
    console.log("Exporting variables with values from ***KMS***...");
    config = {
      // Page Access Token
      PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN || KMS_CONFIG['PAGE_ACCESS_TOKEN'],

      // Express Server Port
      LISTEN_PORT: process.env.LISTEN_PORT || 1337
    };
  }
  // Development
  else{
    console.log("Exporting variables with DEVELOPMENT values...");
    config = {
      // Page Access Token
      PAGE_ACCESS_TOKEN: process.env.PAGE_ACCESS_TOKEN || KMS_CONFIG['PAGE_ACCESS_TOKEN'],

      // Express Server Port
      LISTEN_PORT: process.env.LISTEN_PORT || 1337
    };
  }
}

module.exports = function(callback){
  if(typeof config != "undefined"){
    console.log("module.exports = config #1");
    module.exports = config;
    console.log("Calling callback #1");
    callback(config);
  }else{
    loading_callback = callback;
  }
}
