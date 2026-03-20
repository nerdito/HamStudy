const COUNTRY_TO_FLAG = {
  'United States': 'https://flagcdn.com/w80/us.png',
  'Canada': 'https://flagcdn.com/w80/ca.png',
  'Mexico': 'https://flagcdn.com/w80/mx.png',
  'United Kingdom': 'https://flagcdn.com/w80/gb.png',
  'England': 'https://flagcdn.com/w80/gb.png',
  'Scotland': 'https://flagcdn.com/w80/gb.png',
  'Wales': 'https://flagcdn.com/w80/gb.png',
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
  'Puerto Rico': 'https://flagcdn.com/w80/pr.png',
};

function getFlagForCountry(country) {
  if (!country) return null;
  
  if (COUNTRY_TO_FLAG[country]) {
    return COUNTRY_TO_FLAG[country];
  }
  
  const countryLower = country.toLowerCase();
  
  if (countryLower.includes('puerto rico')) {
    return 'https://flagcdn.com/w80/pr.png';
  }
  if (countryLower.includes('united states') || countryLower.includes('usa')) {
    return 'https://flagcdn.com/w80/us.png';
  }
  if (countryLower.includes('canada')) {
    return 'https://flagcdn.com/w80/ca.png';
  }
  if (countryLower.includes('mexico')) {
    return 'https://flagcdn.com/w80/mx.png';
  }
  if (countryLower.includes('united kingdom') || countryLower.includes('england') || 
      countryLower.includes('scotland') || countryLower.includes('wales')) {
    return 'https://flagcdn.com/w80/gb.png';
  }
  if (countryLower.includes('germany')) {
    return 'https://flagcdn.com/w80/de.png';
  }
  if (countryLower.includes('france')) {
    return 'https://flagcdn.com/w80/fr.png';
  }
  if (countryLower.includes('spain')) {
    return 'https://flagcdn.com/w80/es.png';
  }
  if (countryLower.includes('italy')) {
    return 'https://flagcdn.com/w80/it.png';
  }
  if (countryLower.includes('japan')) {
    return 'https://flagcdn.com/w80/jp.png';
  }
  if (countryLower.includes('australia')) {
    return 'https://flagcdn.com/w80/au.png';
  }
  if (countryLower.includes('brazil')) {
    return 'https://flagcdn.com/w80/br.png';
  }
  if (countryLower.includes('russia')) {
    return 'https://flagcdn.com/w80/ru.png';
  }
  if (countryLower.includes('china')) {
    return 'https://flagcdn.com/w80/cn.png';
  }
  if (countryLower.includes('india')) {
    return 'https://flagcdn.com/w80/in.png';
  }
  
  return null;
}

export async function lookupCallsign(callsign) {
  try {
    const response = await fetch(`https://api.hamdb.org/v1/${encodeURIComponent(callsign.trim())}/json/hamdb`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.hamdb && data.hamdb.callsign) {
      const info = data.hamdb.callsign;
      let country = info.country || null;
      const state = info.state || null;
      
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
        clss: info.class || null,
        expires: info.expires || null,
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
