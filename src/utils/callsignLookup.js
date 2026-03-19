export async function lookupCallsign(callsign) {
  try {
    const response = await fetch(`https://www.qrz.com/lookup/${encodeURIComponent(callsign.trim())}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const html = await response.text();
    
    let country = null;
    let flagUrl = null;
    
    const flagImgMatch = html.match(/<img[^>]*src="([^"]*flag[^"]*)"[^>]*alt="([^"]*DX Atlas[^"]*)"[^>]*>/i);
    if (flagImgMatch) {
      flagUrl = flagImgMatch[1];
      const atlasMatch = flagUrl.match(/flags-iso\/flat\/32\/([A-Z]{2})\.png/i);
      if (atlasMatch) {
        country = atlasMatch[1];
      }
    }
    
    if (html.includes('DX Atlas for:')) {
      const atlasCountryMatch = html.match(/title="DX Atlas for:\s*([^"]+)"/);
      if (atlasCountryMatch) {
        country = atlasCountryMatch[1];
      }
      
      const flagPattern = /src="(https:\/\/static\.qrz\.com\/static\/flags-iso\/flat\/32\/[A-Z]{2}\.png)"/;
      const flagMatch = html.match(flagPattern);
      if (flagMatch) {
        flagUrl = flagMatch[1];
      }
    }
    
    if (!country) {
      const strongMatch = html.match(/<h2[^>]*>\s*([A-Z0-9]+)\s*<img[^>]*title="DX Atlas for:\s*([^"]+)"[^>]*>/i);
      if (strongMatch) {
        country = strongMatch[2];
        const flagMatch = html.match(/src="(https:\/\/static\.qrz\.com\/static\/flags-iso\/flat\/32\/[^"]+)"/);
        if (flagMatch) {
          flagUrl = flagMatch[1];
        }
      }
    }
    
    if (!country) {
      const headerContent = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      if (headerContent) {
        const imgMatch = headerContent[1].match(/title="DX Atlas for:\s*([^"]+)"/);
        if (imgMatch) {
          country = imgMatch[1];
        }
      }
    }
    
    if (!country && !flagUrl) {
      const lineMatch = html.match(/(Puerto Rico|United States|Germany|Japan|United Kingdom|Canada|Mexico|Brazil|Australia|France|Spain|Italy|China|Russia|India)/i);
      if (lineMatch) {
        country = lineMatch[1];
      }
    }
    
    if (flagUrl) {
      const countryCode = flagUrl.match(/flags-iso\/flat\/32\/([A-Z]{2})\.png/);
      if (countryCode) {
        const codeToCountry = {
          'PR': 'Puerto Rico',
          'US': 'United States',
          'DE': 'Germany',
          'JP': 'Japan',
          'GB': 'United Kingdom',
          'CA': 'Canada',
          'MX': 'Mexico',
          'BR': 'Brazil',
          'AU': 'Australia',
          'FR': 'France',
          'ES': 'Spain',
          'IT': 'Italy',
          'CN': 'China',
          'RU': 'Russia',
          'IN': 'India',
          'VU': 'United States',
          'KL': 'United States',
          'K': 'United States',
          'W': 'United States',
          'N': 'United States'
        };
        if (countryCode[1] in codeToCountry) {
          country = codeToCountry[countryCode[1]];
        }
      }
    }
    
    return {
      callsign: callsign.toUpperCase(),
      country,
      flagUrl,
      success: !!(country || flagUrl)
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
