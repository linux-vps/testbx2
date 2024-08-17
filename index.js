const axios = require('axios');

const registerEvent = async () => {
  try {
    const response = await axios.post('https://b24-7w9mjb.bitrix24.vn/rest/event.bind', {
      event: 'ONAPPINSTALL',
      handler: 'https://bx-oauth2.aasc.com.vn/bx/oauth2_man?oauth2_id=local.66b9d759e841e3.01890559'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_access_token'
      }
    });

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

registerEvent();