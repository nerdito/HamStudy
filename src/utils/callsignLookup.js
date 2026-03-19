const STATE_TO_COUNTRY = {
  'PR': { country: 'Puerto Rico', code: 'PR', flag: '🇵🇷' },
  'US': { country: 'United States', code: 'US', flag: '🇺🇸' },
  'AK': { country: 'United States', code: 'US', flag: '🇺🇸' },
  'HI': { country: 'United States', code: 'US', flag: '🇺🇸' },
};

const CODE_TO_FLAG = {
  'PR': 'https://flagcdn.com/w80/cw.png',
  'US': 'https://flagcdn.com/w80/us.png',
  'CA': 'https://flagcdn.com/w80/ca.png',
  'MX': 'https://flagcdn.com/w80/mx.png',
  'GB': 'https://flagcdn.com/w80/gb.png',
  'DE': 'https://flagcdn.com/w80/de.png',
  'FR': 'https://flagcdn.com/w80/fr.png',
  'ES': 'https://flagcdn.com/w80/es.png',
  'IT': 'https://flagcdn.com/w80/it.png',
  'JP': 'https://flagcdn.com/w80/jp.png',
  'AU': 'https://flagcdn.com/w80/au.png',
  'BR': 'https://flagcdn.com/w80/br.png',
  'RU': 'https://flagcdn.com/w80/ru.png',
  'CN': 'https://flagcdn.com/w80/cn.png',
  'IN': 'https://flagcdn.com/w80/in.png',
};

const COUNTRY_TO_FLAG = {
  'United States': 'https://flagcdn.com/w80/us.png',
  'Canada': 'https://flagcdn.com/w80/ca.png',
  'Mexico': 'https://flagcdn.com/w80/mx.png',
  'United Kingdom': 'https://flagcdn.com/w80/gb.png',
  'Germany': 'https://flagcdn.com/w80/de.png',
  'France': 'https://flagcdn.com/w80/fr.png',
  'Spain': 'https://flagcdn.com/w80/es.png',
  'Italy': 'https://flagcdn.com/w80/it.png',
  'Japan': 'https://flagcdn.com/w80/jp.png',
  'Australia': 'https://flagcdn.com/w80/au.png',
  'Brazil': 'https://flagcdn.com/w80/br.png',
  'Russia': 'https://flagcdn.com/w80/ru.png',
  'China': 'https://flagcdn.com/w80/cn.png',
  'India': 'https://flagcdn.com/w80/in.png',
  'Puerto Rico': 'https://flagcdn.com/w80/cw.png',
  'England': 'https://flagcdn.com/w80/gb.png',
  'Scotland': 'https://flagcdn.com/w80/gb.png',
  'Wales': 'https://flagcdn.com/w80/gb.png',
};

function getFlagForCountry(country) {
  if (COUNTRY_TO_FLAG[country]) {
    return COUNTRY_TO_FLAG[country];
  }
  
  for (const [key, url] of Object.entries(CODE_TO_FLAG)) {
    if (country && country.toLowerCase().includes(key.toLowerCase())) {
      return url;
    }
  }
  
  return null;
}

export async function lookupCallsign(callsign) {
  try {
    const response = await fetch(`http://api.hamdb.org/v1/${encodeURIComponent(callsign.trim())}/json/hamdb`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.hamdb && data.hamdb.callsign) {
      const info = data.hamdb.callsign;
      let country = info.country || null;
      let state = info.state || null;
      
      if (state === 'PR') {
        country = 'Puerto Rico';
      }
      
      const flagUrl = getFlagForCountry(country);
      
      return {
        callsign: callsign.toUpperCase(),
        country,
        state,
        name: info.fname && info.name ? `${info.fname} ${info.name}` : (info.fname || info.name || null),
        grid: info.grid || null,
        flagUrl,
        success: true
      };
    }
    
    return {
      callsign: callsign.toUpperCase(),
      country: null,
      flagUrl: null,
      success: false,
      error: 'Callsign not found'
    };
  } catch (error) {
    return {
      callsign: callsign.toUpperCase(),
      country: null,
      flagUrl: null,
      success: false,
      error: error.message
    };
  }
}
