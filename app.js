/* What time is it for them? — static, no server, everything from Intl and a bit of astronomy.
   Sun times: NOAA/Meeus sunrise equation. Moon phase: synodic count from the 2000-01-06 new moon. */
(() => {
"use strict";

/* ------------------------------------------------------------------ cities */
// name, country code, IANA zone, lat, lon, aliases
const RAW = [
["New York","US","America/New_York",40.71,-74.01,"nyc|new york city|manhattan|brooklyn|big apple"],
["Los Angeles","US","America/Los_Angeles",34.05,-118.24,"la|l.a.|cali|california|hollywood|socal"],
["San Francisco","US","America/Los_Angeles",37.77,-122.42,"sf|bay area|san fran|frisco|silicon valley"],
["Chicago","US","America/Chicago",41.88,-87.63,"chi|chi-town"],
["Houston","US","America/Chicago",29.76,-95.37,""],
["Dallas","US","America/Chicago",32.78,-96.8,""],
["Austin","US","America/Chicago",30.27,-97.74,"atx"],
["Denver","US","America/Denver",39.74,-104.99,""],
["Phoenix","US","America/Phoenix",33.45,-112.07,"arizona"],
["Seattle","US","America/Los_Angeles",47.61,-122.33,""],
["Portland","US","America/Los_Angeles",45.52,-122.68,"pdx"],
["Las Vegas","US","America/Los_Angeles",36.17,-115.14,"vegas"],
["San Diego","US","America/Los_Angeles",32.72,-117.16,""],
["Miami","US","America/New_York",25.76,-80.19,"florida"],
["Boston","US","America/New_York",42.36,-71.06,""],
["Washington","US","America/New_York",38.91,-77.04,"dc|washington dc|d.c."],
["Atlanta","US","America/New_York",33.75,-84.39,"atl"],
["Philadelphia","US","America/New_York",39.95,-75.17,"philly"],
["Detroit","US","America/Detroit",42.33,-83.05,""],
["Minneapolis","US","America/Chicago",44.98,-93.27,""],
["Nashville","US","America/Chicago",36.16,-86.78,""],
["New Orleans","US","America/Chicago",29.95,-90.07,"nola"],
["Salt Lake City","US","America/Denver",40.76,-111.89,"slc|utah"],
["Anchorage","US","America/Anchorage",61.22,-149.9,"alaska"],
["Honolulu","US","Pacific/Honolulu",21.31,-157.86,"hawaii|oahu"],
["Toronto","CA","America/Toronto",43.65,-79.38,""],
["Vancouver","CA","America/Vancouver",49.28,-123.12,""],
["Montreal","CA","America/Toronto",45.5,-73.57,"montréal"],
["Calgary","CA","America/Edmonton",51.05,-114.07,""],
["Ottawa","CA","America/Toronto",45.42,-75.7,""],
["Halifax","CA","America/Halifax",44.65,-63.58,""],
["St. John's","CA","America/St_Johns",47.56,-52.71,"newfoundland"],
["Mexico City","MX","America/Mexico_City",19.43,-99.13,"cdmx|ciudad de mexico"],
["Cancun","MX","America/Cancun",21.16,-86.85,"cancún"],
["Guadalajara","MX","America/Mexico_City",20.66,-103.35,""],
["Tijuana","MX","America/Tijuana",32.51,-117.04,""],
["Havana","CU","America/Havana",23.11,-82.37,"cuba"],
["Kingston","JM","America/Jamaica",17.97,-76.79,"jamaica"],
["San Juan","PR","America/Puerto_Rico",18.47,-66.11,"puerto rico"],
["Panama City","PA","America/Panama",8.98,-79.52,"panama"],
["San José","CR","America/Costa_Rica",9.93,-84.08,"costa rica"],
["Guatemala City","GT","America/Guatemala",14.63,-90.51,""],
["Bogotá","CO","America/Bogota",4.71,-74.07,"bogota"],
["Medellín","CO","America/Bogota",6.24,-75.58,"medellin"],
["Lima","PE","America/Lima",-12.05,-77.04,""],
["Quito","EC","America/Guayaquil",-0.18,-78.47,""],
["Caracas","VE","America/Caracas",10.48,-66.9,""],
["Santiago","CL","America/Santiago",-33.45,-70.67,""],
["Buenos Aires","AR","America/Argentina/Buenos_Aires",-34.6,-58.38,"bsas|baires"],
["Montevideo","UY","America/Montevideo",-34.9,-56.16,""],
["São Paulo","BR","America/Sao_Paulo",-23.55,-46.63,"sao paulo|sampa"],
["Rio de Janeiro","BR","America/Sao_Paulo",-22.91,-43.17,"rio"],
["Brasília","BR","America/Sao_Paulo",-15.79,-47.88,"brasilia"],
["Manaus","BR","America/Manaus",-3.12,-60.02,""],
["La Paz","BO","America/La_Paz",-16.5,-68.15,""],
["London","GB","Europe/London",51.51,-0.13,"uk|england|britain|great britain|london uk"],
["Manchester","GB","Europe/London",53.48,-2.24,""],
["Birmingham","GB","Europe/London",52.48,-1.9,""],
["Edinburgh","GB","Europe/London",55.95,-3.19,"scotland"],
["Glasgow","GB","Europe/London",55.86,-4.25,""],
["Cardiff","GB","Europe/London",51.48,-3.18,"wales"],
["Belfast","GB","Europe/London",54.6,-5.93,"northern ireland"],
["Dublin","IE","Europe/Dublin",53.35,-6.26,"ireland"],
["Paris","FR","Europe/Paris",48.86,2.35,"france"],
["Lyon","FR","Europe/Paris",45.76,4.84,""],
["Marseille","FR","Europe/Paris",43.3,5.37,""],
["Nice","FR","Europe/Paris",43.71,7.26,""],
["Berlin","DE","Europe/Berlin",52.52,13.41,"germany"],
["Munich","DE","Europe/Berlin",48.14,11.58,"münchen|muenchen"],
["Hamburg","DE","Europe/Berlin",53.55,9.99,""],
["Frankfurt","DE","Europe/Berlin",50.11,8.68,""],
["Cologne","DE","Europe/Berlin",50.94,6.96,"köln|koln"],
["Amsterdam","NL","Europe/Amsterdam",52.37,4.9,"netherlands|holland"],
["Rotterdam","NL","Europe/Amsterdam",51.92,4.48,""],
["Brussels","BE","Europe/Brussels",50.85,4.35,"belgium|bruxelles"],
["Luxembourg","LU","Europe/Luxembourg",49.61,6.13,""],
["Zurich","CH","Europe/Zurich",47.38,8.54,"zürich|switzerland"],
["Geneva","CH","Europe/Zurich",46.2,6.14,"genève"],
["Vienna","AT","Europe/Vienna",48.21,16.37,"wien|austria"],
["Prague","CZ","Europe/Prague",50.08,14.44,"praha|czech|czechia"],
["Warsaw","PL","Europe/Warsaw",52.23,21.01,"poland|warszawa"],
["Kraków","PL","Europe/Warsaw",50.06,19.94,"krakow|cracow"],
["Budapest","HU","Europe/Budapest",47.5,19.04,"hungary"],
["Bratislava","SK","Europe/Bratislava",48.15,17.11,"slovakia"],
["Ljubljana","SI","Europe/Ljubljana",46.06,14.51,"slovenia"],
["Zagreb","HR","Europe/Zagreb",45.81,15.98,"croatia"],
["Belgrade","RS","Europe/Belgrade",44.79,20.45,"serbia|beograd"],
["Sarajevo","BA","Europe/Sarajevo",43.86,18.41,"bosnia"],
["Bucharest","RO","Europe/Bucharest",44.43,26.1,"romania"],
["Sofia","BG","Europe/Sofia",42.7,23.32,"bulgaria"],
["Athens","GR","Europe/Athens",37.98,23.73,"greece"],
["Istanbul","TR","Europe/Istanbul",41.01,28.98,"turkey|türkiye"],
["Ankara","TR","Europe/Istanbul",39.93,32.86,""],
["Rome","IT","Europe/Rome",41.9,12.5,"roma|italy"],
["Milan","IT","Europe/Rome",45.46,9.19,"milano"],
["Naples","IT","Europe/Rome",40.85,14.27,"napoli"],
["Florence","IT","Europe/Rome",43.77,11.26,"firenze"],
["Venice","IT","Europe/Rome",45.44,12.33,"venezia"],
["Madrid","ES","Europe/Madrid",40.42,-3.7,"spain|españa"],
["Barcelona","ES","Europe/Madrid",41.39,2.17,"barca"],
["Valencia","ES","Europe/Madrid",39.47,-0.38,""],
["Seville","ES","Europe/Madrid",37.39,-5.98,"sevilla"],
["Málaga","ES","Europe/Madrid",36.72,-4.42,"malaga"],
["Lisbon","PT","Europe/Lisbon",38.72,-9.14,"lisboa|portugal"],
["Porto","PT","Europe/Lisbon",41.15,-8.61,""],
["Copenhagen","DK","Europe/Copenhagen",55.68,12.57,"denmark|københavn"],
["Stockholm","SE","Europe/Stockholm",59.33,18.07,"sweden"],
["Oslo","NO","Europe/Oslo",59.91,10.75,"norway"],
["Helsinki","FI","Europe/Helsinki",60.17,24.94,"finland"],
["Reykjavík","IS","Atlantic/Reykjavik",64.15,-21.94,"reykjavik|iceland"],
["Tallinn","EE","Europe/Tallinn",59.44,24.75,"estonia"],
["Riga","LV","Europe/Riga",56.95,24.11,"latvia"],
["Vilnius","LT","Europe/Vilnius",54.69,25.28,"lithuania"],
["Minsk","BY","Europe/Minsk",53.9,27.57,"belarus"],
["Kyiv","UA","Europe/Kyiv",50.45,30.52,"kiev|ukraine"],
["Lviv","UA","Europe/Kyiv",49.84,24.03,""],
["Moscow","RU","Europe/Moscow",55.76,37.62,"russia|moskva"],
["St Petersburg","RU","Europe/Moscow",59.93,30.32,"saint petersburg|petersburg"],
["Yekaterinburg","RU","Asia/Yekaterinburg",56.84,60.6,""],
["Novosibirsk","RU","Asia/Novosibirsk",55.03,82.92,""],
["Vladivostok","RU","Asia/Vladivostok",43.12,131.89,""],
["Valletta","MT","Europe/Malta",35.9,14.51,"malta"],
["Nicosia","CY","Asia/Nicosia",35.17,33.37,"cyprus"],
["Tbilisi","GE","Asia/Tbilisi",41.72,44.83,"georgia"],
["Yerevan","AM","Asia/Yerevan",40.18,44.51,"armenia"],
["Baku","AZ","Asia/Baku",40.41,49.87,"azerbaijan"],
["Tel Aviv","IL","Asia/Jerusalem",32.08,34.78,"israel"],
["Jerusalem","IL","Asia/Jerusalem",31.77,35.21,""],
["Beirut","LB","Asia/Beirut",33.89,35.5,"lebanon"],
["Amman","JO","Asia/Amman",31.95,35.93,"jordan"],
["Damascus","SY","Asia/Damascus",33.51,36.29,"syria"],
["Baghdad","IQ","Asia/Baghdad",33.31,44.37,"iraq"],
["Tehran","IR","Asia/Tehran",35.69,51.39,"iran"],
["Riyadh","SA","Asia/Riyadh",24.71,46.68,"saudi|saudi arabia"],
["Jeddah","SA","Asia/Riyadh",21.49,39.19,""],
["Dubai","AE","Asia/Dubai",25.2,55.27,"uae|emirates"],
["Abu Dhabi","AE","Asia/Dubai",24.45,54.38,""],
["Doha","QA","Asia/Qatar",25.29,51.53,"qatar"],
["Manama","BH","Asia/Bahrain",26.23,50.59,"bahrain"],
["Kuwait City","KW","Asia/Kuwait",29.38,47.99,"kuwait"],
["Muscat","OM","Asia/Muscat",23.59,58.41,"oman"],
["Cairo","EG","Africa/Cairo",30.04,31.24,"egypt"],
["Casablanca","MA","Africa/Casablanca",33.57,-7.59,"morocco"],
["Marrakesh","MA","Africa/Casablanca",31.63,-8.01,"marrakech"],
["Algiers","DZ","Africa/Algiers",36.75,3.06,"algeria"],
["Tunis","TN","Africa/Tunis",36.81,10.18,"tunisia"],
["Lagos","NG","Africa/Lagos",6.52,3.38,"nigeria"],
["Abuja","NG","Africa/Lagos",9.06,7.49,""],
["Accra","GH","Africa/Accra",5.6,-0.19,"ghana"],
["Dakar","SN","Africa/Dakar",14.72,-17.47,"senegal"],
["Abidjan","CI","Africa/Abidjan",5.36,-4.01,"ivory coast|côte d'ivoire"],
["Kinshasa","CD","Africa/Kinshasa",-4.44,15.27,"congo|drc"],
["Addis Ababa","ET","Africa/Addis_Ababa",9.03,38.74,"ethiopia"],
["Nairobi","KE","Africa/Nairobi",-1.29,36.82,"kenya"],
["Kampala","UG","Africa/Kampala",0.35,32.58,"uganda"],
["Kigali","RW","Africa/Kigali",-1.94,30.06,"rwanda"],
["Dar es Salaam","TZ","Africa/Dar_es_Salaam",-6.79,39.28,"tanzania"],
["Lusaka","ZM","Africa/Lusaka",-15.39,28.32,"zambia"],
["Harare","ZW","Africa/Harare",-17.83,31.05,"zimbabwe"],
["Johannesburg","ZA","Africa/Johannesburg",-26.2,28.05,"joburg|jozi|south africa"],
["Cape Town","ZA","Africa/Johannesburg",-33.92,18.42,""],
["Durban","ZA","Africa/Johannesburg",-29.86,31.02,""],
["Antananarivo","MG","Indian/Antananarivo",-18.88,47.51,"madagascar"],
["Port Louis","MU","Indian/Mauritius",-20.16,57.5,"mauritius"],
["Karachi","PK","Asia/Karachi",24.86,67.01,"pakistan"],
["Lahore","PK","Asia/Karachi",31.55,74.34,""],
["Islamabad","PK","Asia/Karachi",33.69,73.04,""],
["Kabul","AF","Asia/Kabul",34.53,69.17,"afghanistan"],
["Tashkent","UZ","Asia/Tashkent",41.3,69.24,"uzbekistan"],
["Almaty","KZ","Asia/Almaty",43.24,76.89,"kazakhstan"],
["Astana","KZ","Asia/Almaty",51.17,71.43,""],
["Mumbai","IN","Asia/Kolkata",19.08,72.88,"bombay|india"],
["Delhi","IN","Asia/Kolkata",28.61,77.21,"new delhi"],
["Bengaluru","IN","Asia/Kolkata",12.97,77.59,"bangalore"],
["Hyderabad","IN","Asia/Kolkata",17.39,78.49,""],
["Chennai","IN","Asia/Kolkata",13.08,80.27,"madras"],
["Kolkata","IN","Asia/Kolkata",22.57,88.36,"calcutta"],
["Pune","IN","Asia/Kolkata",18.52,73.86,""],
["Ahmedabad","IN","Asia/Kolkata",23.02,72.57,""],
["Goa","IN","Asia/Kolkata",15.3,74.12,"panaji"],
["Colombo","LK","Asia/Colombo",6.93,79.85,"sri lanka"],
["Kathmandu","NP","Asia/Kathmandu",27.72,85.32,"nepal"],
["Dhaka","BD","Asia/Dhaka",23.81,90.41,"bangladesh"],
["Yangon","MM","Asia/Yangon",16.87,96.2,"rangoon|myanmar|burma"],
["Bangkok","TH","Asia/Bangkok",13.76,100.5,"thailand|krung thep"],
["Chiang Mai","TH","Asia/Bangkok",18.79,98.98,""],
["Phuket","TH","Asia/Bangkok",7.89,98.4,""],
["Hanoi","VN","Asia/Ho_Chi_Minh",21.03,105.85,"vietnam"],
["Ho Chi Minh City","VN","Asia/Ho_Chi_Minh",10.82,106.63,"saigon|hcmc"],
["Phnom Penh","KH","Asia/Phnom_Penh",11.56,104.93,"cambodia"],
["Vientiane","LA","Asia/Vientiane",17.97,102.63,"laos"],
["Kuala Lumpur","MY","Asia/Kuala_Lumpur",3.14,101.69,"kl|malaysia"],
["Singapore","SG","Asia/Singapore",1.35,103.82,"sg|sing"],
["Jakarta","ID","Asia/Jakarta",-6.21,106.85,"indonesia"],
["Bali","ID","Asia/Makassar",-8.41,115.19,"denpasar|ubud|canggu"],
["Surabaya","ID","Asia/Jakarta",-7.26,112.75,""],
["Manila","PH","Asia/Manila",14.6,120.98,"philippines"],
["Cebu","PH","Asia/Manila",10.32,123.89,""],
["Hong Kong","HK","Asia/Hong_Kong",22.32,114.17,"hk|hongkong"],
["Macau","MO","Asia/Macau",22.2,113.54,"macao"],
["Taipei","TW","Asia/Taipei",25.03,121.57,"taiwan"],
["Shanghai","CN","Asia/Shanghai",31.23,121.47,"china"],
["Beijing","CN","Asia/Shanghai",39.9,116.4,"peking"],
["Shenzhen","CN","Asia/Shanghai",22.54,114.06,""],
["Guangzhou","CN","Asia/Shanghai",23.13,113.26,"canton"],
["Chengdu","CN","Asia/Shanghai",30.57,104.07,""],
["Hangzhou","CN","Asia/Shanghai",30.27,120.15,""],
["Wuhan","CN","Asia/Shanghai",30.59,114.31,""],
["Ulaanbaatar","MN","Asia/Ulaanbaatar",47.89,106.91,"mongolia"],
["Seoul","KR","Asia/Seoul",37.57,126.98,"korea|south korea"],
["Busan","KR","Asia/Seoul",35.18,129.08,""],
["Pyongyang","KP","Asia/Pyongyang",39.04,125.76,"north korea"],
["Tokyo","JP","Asia/Tokyo",35.68,139.69,"japan|tokyo japan"],
["Osaka","JP","Asia/Tokyo",34.69,135.5,""],
["Kyoto","JP","Asia/Tokyo",35.01,135.77,""],
["Sapporo","JP","Asia/Tokyo",43.06,141.35,""],
["Fukuoka","JP","Asia/Tokyo",33.59,130.4,""],
["Okinawa","JP","Asia/Tokyo",26.33,127.8,"naha"],
["Perth","AU","Australia/Perth",-31.95,115.86,"western australia"],
["Darwin","AU","Australia/Darwin",-12.46,130.84,""],
["Adelaide","AU","Australia/Adelaide",-34.93,138.6,""],
["Brisbane","AU","Australia/Brisbane",-27.47,153.03,"queensland|brissie"],
["Gold Coast","AU","Australia/Brisbane",-28.02,153.4,""],
["Sydney","AU","Australia/Sydney",-33.87,151.21,"australia|nsw"],
["Melbourne","AU","Australia/Melbourne",-37.81,144.96,"victoria"],
["Canberra","AU","Australia/Sydney",-35.28,149.13,""],
["Hobart","AU","Australia/Hobart",-42.88,147.33,"tasmania"],
["Auckland","NZ","Pacific/Auckland",-36.85,174.76,"new zealand|nz|aotearoa"],
["Wellington","NZ","Pacific/Auckland",-41.29,174.78,""],
["Christchurch","NZ","Pacific/Auckland",-43.53,172.64,""],
["Queenstown","NZ","Pacific/Auckland",-45.03,168.66,""],
["Suva","FJ","Pacific/Fiji",-18.14,178.44,"fiji"],
["Port Moresby","PG","Pacific/Port_Moresby",-9.44,147.18,"papua new guinea"],
["Nouméa","NC","Pacific/Noumea",-22.28,166.46,"noumea|new caledonia"],
["Apia","WS","Pacific/Apia",-13.83,-171.76,"samoa"],
["Papeete","PF","Pacific/Tahiti",-17.54,-149.57,"tahiti"],
["Nuuk","GL","America/Nuuk",64.18,-51.72,"greenland"],
["Longyearbyen","SJ","Arctic/Longyearbyen",78.22,15.63,"svalbard"],
["Tromsø","NO","Europe/Oslo",69.65,18.96,"tromso"],
["Ushuaia","AR","America/Argentina/Ushuaia",-54.8,-68.3,""],
["Bermuda","BM","Atlantic/Bermuda",32.3,-64.78,"hamilton"],
["Azores","PT","Atlantic/Azores",37.74,-25.67,"ponta delgada"],
["Canary Islands","ES","Atlantic/Canary",28.12,-15.43,"tenerife|las palmas|lanzarote|gran canaria"],
["Malé","MV","Indian/Maldives",4.17,73.51,"male|maldives"],
["Tashkent","UZ","Asia/Tashkent",41.3,69.24,""],
["Bishkek","KG","Asia/Bishkek",42.87,74.59,"kyrgyzstan"],
["Thimphu","BT","Asia/Thimphu",27.47,89.64,"bhutan"],
["Brunei","BN","Asia/Brunei",4.94,114.95,"bandar seri begawan"],
["Dili","TL","Asia/Dili",-8.56,125.57,"timor"],
["Honiara","SB","Pacific/Guadalcanal",-9.43,159.95,"solomon islands"],
["Chatham Islands","NZ","Pacific/Chatham",-43.95,-176.55,""],
["Kiritimati","KI","Pacific/Kiritimati",1.87,-157.4,"christmas island|kiribati"],
["Pago Pago","AS","Pacific/Pago_Pago",-14.28,-170.7,"american samoa"],
["Adak","US","America/Adak",51.88,-176.66,"aleutians"],
["Guam","GU","Pacific/Guam",13.44,144.79,""],
["UTC","UN","UTC",0,0,"gmt|zulu|utc|coordinated universal time"],
];

const regionNames = (() => { try { return new Intl.DisplayNames(["en"], { type: "region" }); } catch { return null; } })();
const flagOf = cc => cc === "UN" ? "🕰️" : String.fromCodePoint(...[...cc].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
const countryOf = cc => { if (cc === "UN") return ""; try { return regionNames?.of(cc) || cc; } catch { return cc; } };
const fold = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const slugOf = s => fold(s).replace(/ /g, "-");

const CITIES = RAW.map(([name, cc, tz, lat, lon, al], rank) => ({
  name, cc, tz, lat, lon, rank, flag: flagOf(cc), country: countryOf(cc),
  slug: slugOf(name),
  aliases: al ? al.split("|").map(fold) : [],
}));
const seenSlug = new Set();
const CITY_LIST = CITIES.filter(c => { if (seenSlug.has(c.slug)) return false; seenSlug.add(c.slug); return true; });

// Every zone the browser knows, as a fallback (no coordinates → fixed daylight hours)
let ZONES = [];
try { ZONES = Intl.supportedValuesOf("timeZone"); } catch { ZONES = CITY_LIST.map(c => c.tz); }
const ZONE_SET = new Set(ZONES.concat(CITY_LIST.map(c => c.tz)));
const zoneLabel = z => { const p = z.split("/"); return (p[p.length - 1] || z).replace(/_/g, " "); };
const ZONE_ENTRIES = ZONES.filter(z => z.includes("/") && !z.startsWith("Etc/")).map(z => ({
  name: zoneLabel(z), cc: null, tz: z, lat: null, lon: null, flag: "🌐", country: z.split("/")[0].replace(/_/g, " "),
  slug: "tz:" + z, aliases: [], isZone: true,
}));

const cityBySlug = new Map(CITY_LIST.map(c => [c.slug, c]));
function placeFromParam(v) {
  if (!v) return null;
  if (cityBySlug.has(v)) return cityBySlug.get(v);
  if (ZONE_SET.has(v)) return CITY_LIST.find(c => c.tz === v) || { name: zoneLabel(v), tz: v, flag: "🌐", country: v.split("/")[0], slug: "tz:" + v, lat: null, lon: null };
  const hit = search(v.replace(/[-_]/g, " "))[0];
  return hit || null;
}
function placeFromZone(z) {
  return CITY_LIST.find(c => c.tz === z) || { name: zoneLabel(z), tz: z, flag: "🌐", country: (z.split("/")[0] || "").replace(/_/g, " "), slug: "tz:" + z, lat: null, lon: null };
}

/* ------------------------------------------------------------------ search */
function search(q) {
  const f = fold(q);
  if (!f) return [];
  const toks = f.split(" ");
  const score = c => {
    const name = fold(c.name), country = fold(c.country || ""), words = name.split(" ");
    let s = 0;
    if (c.aliases.includes(f) || name === f) s += 100;
    if (name.startsWith(f)) s += 60;
    for (const t of toks) {
      let best = 0;
      if (name === t) best = 40;
      else if (words.some(w => w.startsWith(t))) best = 25;
      else if (c.aliases.some(a => a === t || a.split(" ").some(w => w.startsWith(t)))) best = 22;
      else if (country && (country === t || country.split(" ").some(w => w.startsWith(t)))) best = 15;
      else if (c.cc && c.cc.toLowerCase() === t) best = 15;
      else if (name.includes(t)) best = 8;
      else if (c.aliases.some(a => a.includes(t))) best = 6;
      if (!best) return 0;
      s += best;
    }
    if (c.isZone) s -= 5;
    return s;
  };
  let scored = [];
  for (const c of CITY_LIST) { const s = score(c); if (s) scored.push([s, c]); }
  // if anything matched by name or alias prefix, drop the substring-only matches ("lon" should not offer Barcelona)
  const strong = scored.some(([s]) => s >= 25 * toks.length);
  if (strong) scored = scored.filter(([s]) => s >= 15 * toks.length);
  scored.sort((a, b) => b[0] - a[0] || (a[1].rank ?? 1e9) - (b[1].rank ?? 1e9));
  const out = [], seenSlug = new Set(), seenTz = new Set();
  for (const [, c] of scored) { if (seenSlug.has(c.slug)) continue; seenSlug.add(c.slug); seenTz.add(c.tz); out.push(c); if (out.length >= 6) break; }
  if (out.length < 3) {
    const extra = [];
    for (const c of ZONE_ENTRIES) { if (seenTz.has(c.tz)) continue; const s = score(c); if (s >= 15 * toks.length || (!strong && s)) extra.push([s, c]); }
    extra.sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name));
    for (const [, c] of extra) { if (seenTz.has(c.tz)) continue; seenTz.add(c.tz); out.push(c); if (out.length >= 6) break; }
  }
  return out;
}

/* ------------------------------------------------------------------ time */
const fmtCache = new Map();
const partsFmt = z => { let f = fmtCache.get(z); if (!f) { f = new Intl.DateTimeFormat("en-US", { timeZone: z, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", weekday: "short" }); fmtCache.set(z, f); } return f; };
const WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
function local(z, ms) {
  const o = {};
  for (const p of partsFmt(z).formatToParts(new Date(ms))) if (p.type !== "literal") o[p.type] = p.value;
  const h = +o.hour % 24;
  return { y: +o.year, m: +o.month, d: +o.day, h, mi: +o.minute, s: +o.second, wd: WD[o.weekday], hf: h + (+o.minute) / 60 };
}
function offsetMin(z, ms) {
  const l = local(z, ms);
  const asUTC = Date.UTC(l.y, l.m - 1, l.d, l.h, l.mi, l.s);
  return Math.round((asUTC - Math.floor(ms / 1000) * 1000) / 60000);
}
const pad = n => String(n).padStart(2, "0");
const h12 = (h, mi, withMin = true) => `${h % 12 || 12}${withMin ? ":" + pad(mi) : ""}${h < 12 ? "am" : "pm"}`;
const clockRound = hf => { const x = ((Math.round(hf * 4) / 4) % 24 + 24) % 24; const h = Math.floor(x), mi = Math.round((x - h) * 60); return mi ? h12(h, mi) : h12(h, 0, false); };
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const fmtOffset = m => { const a = Math.abs(m), h = Math.floor(a / 60), mm = a % 60; const frac = mm === 30 ? "½" : mm === 45 ? "¾" : mm === 15 ? "¼" : ""; return (h || !frac ? h : "") + frac + ((h === 1 && !mm) ? " hour" : " hours"); };

/* ------------------------------------------------------------------ sun & moon */
const RAD = Math.PI / 180;
function sunTimes(ms, lat, lon) {
  // NOAA / Meeus sunrise equation. Returns {rise, set} in ms, or {polar:"day"|"night"}.
  const J = ms / 86400000 + 2440587.5;
  const n = Math.round(J - 2451545.0 + 0.0008);
  const Jstar = n - lon / 360;
  const M = ((357.5291 + 0.98560028 * Jstar) % 360 + 360) % 360;
  const C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
  const L = (M + C + 180 + 102.9372) % 360;
  const Jt = 2451545.0 + Jstar + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * L * RAD);
  const dec = Math.asin(Math.sin(L * RAD) * Math.sin(23.4397 * RAD));
  const cosW = (Math.sin(-0.833 * RAD) - Math.sin(lat * RAD) * Math.sin(dec)) / (Math.cos(lat * RAD) * Math.cos(dec));
  if (cosW > 1) return { polar: "night" };
  if (cosW < -1) return { polar: "day" };
  const w = Math.acos(cosW) / RAD;
  const toMs = j => (j - 2440587.5) * 86400000;
  return { rise: toMs(Jt - w / 360), set: toMs(Jt + w / 360), transit: toMs(Jt) };
}
// sun times for the local calendar day containing `ms` in zone z
function daySun(p, ms) {
  if (p.lat == null) return null;
  const l = local(p.tz, ms);
  const off = offsetMin(p.tz, ms);
  const localNoonUTC = Date.UTC(l.y, l.m - 1, l.d, 12) - off * 60000;
  return sunTimes(localNoonUTC, p.lat, p.lon);
}
const TW = 40 * 60000; // twilight half-width
function phaseOf(p, ms) {
  const s = daySun(p, ms);
  if (!s) { const h = local(p.tz, ms).hf; return h < 5 || h >= 21 ? "night" : h < 8 ? "dawn" : h < 18 ? "day" : "dusk"; }
  if (s.polar) return s.polar;
  if (ms < s.rise - TW) return "night";
  if (ms < s.rise + TW) return "dawn";
  if (ms < s.set - TW) return "day";
  if (ms < s.set + TW) return "dusk";
  return "night";
}
function moonPhase(ms) { // 0 new, .5 full
  const syn = 29.530588853 * 86400000, ref = Date.UTC(2000, 0, 6, 18, 14);
  return (((ms - ref) % syn) + syn) % syn / syn;
}
// orb position: returns {kind:"sun"|"moon", x:0..1, y:0..1 (0 = top)}
function orbPos(p, ms) {
  const s = daySun(p, ms);
  let rise, set;
  if (!s || s.polar) {
    const l = local(p.tz, ms); const base = ms - l.hf * 3600000;
    rise = base + 6 * 3600000; set = base + 18 * 3600000;
    if (s && s.polar === "day") return { kind: "sun", x: 0.5 + 0.4 * Math.sin(l.hf / 24 * 2 * Math.PI), y: 0.35 };
    if (s && s.polar === "night") return { kind: "moon", x: 0.5 + 0.4 * Math.sin(l.hf / 24 * 2 * Math.PI), y: 0.35 };
  } else { rise = s.rise; set = s.set; }
  const arc = t => ({ x: 0.3 + 0.65 * t, y: 0.6 - Math.sin(Math.max(0, Math.min(1, t)) * Math.PI) * 0.46 });
  if (ms >= rise - TW && ms <= set + TW) { return { kind: "sun", ...arc((ms - rise) / (set - rise)) }; }
  // night: from set to next rise
  const dayLen = set - rise, nightLen = 86400000 - dayLen;
  const t = ms > set ? (ms - set) / nightLen : (ms - (set - 86400000)) / nightLen;
  return { kind: "moon", ...arc(t) };
}

/* ------------------------------------------------------------------ moods */
function mood(p, ms) {
  const l = local(p.tz, ms), h = l.h, mi = l.mi, hf = l.hf;
  if (l.m === 12 && l.d === 31 && h >= 20) return ["🥂", "New Year's Eve there. Nobody is answering."];
  if (l.m === 1 && l.d === 1 && h < 4) return ["🎆", "Already next year there. Still not up."];
  if (h === 0 && mi === 0) return ["🕛", "Midnight, on the dot."];
  if (h === 3 && mi === 33) return ["👁️", "3:33am. Don't."];
  if (h === 4 && mi === 20) return ["🌿", "4:20. No comment."];
  if (l.wd === 5 && h === 17) return ["🍻", "Friday, five o'clock. Gone."];
  if ((l.wd === 0 || l.wd === 6) && h >= 7 && h < 10) return ["🛌", "Weekend. Lying in."];
  return hf < 5 ? ["😴", "Fast asleep. Do not call."] :
    hf < 7 ? ["🥱", "Barely conscious. Coffee first."] :
    hf < 9 ? ["☕", "Early meeting territory."] :
    hf < 12 ? ["👋", "Awake and useful."] :
    hf < 14 ? ["🥪", "Lunch. Wait a bit."] :
    hf < 18 ? ["💻", "Awake and useful."] :
    hf < 21 ? ["🍽️", "Evening. Keep it short."] :
    hf < 23 ? ["📺", "Winding down."] :
    ["🌙", "Snooze. Send a message instead."];
}

/* ------------------------------------------------------------------ state */
const $ = id => document.getElementById(id);
const detectedZone = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "UTC"; } })();
const people = []; // {place, el, refs, lastEmoji}
let scrubMs = 0;   // virtual time offset
let pinnedPick = null; // {ms}
const now = () => Date.now() + scrubMs;
const WHO = ["You, in", "Your friend, in", "And, in", "Also, in"];
const MAX = 4;

/* ------------------------------------------------------------------ DOM per person */
const halves = $("halves");
function makeHalf(i) {
  const sec = document.createElement("section");
  sec.className = "half";
  sec.innerHTML = `
    <div class="sky" aria-hidden="true"><div class="stars"></div><div class="orb hidden"></div></div>
    <div class="top">
      <div class="who"><span>${WHO[i]}</span>${i >= 2 ? '<button type="button" class="remove" aria-label="Remove this person">remove</button>' : ""}</div>
      <div class="search">
        <input class="city" type="text" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Type a city" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-label="${i === 0 ? "Your city" : "Their city"}">
        <ul class="menu" role="listbox" hidden></ul>
      </div>
    </div>
    <div>
      <div class="time" aria-live="off">--:--</div>
      <div class="date"></div>
      <div class="mood"><span class="emoji"></span><span class="text"></span></div>
      <div class="sunline"></div>
    </div>`;
  const refs = {
    input: sec.querySelector(".city"), menu: sec.querySelector(".menu"), time: sec.querySelector(".time"), date: sec.querySelector(".date"),
    emoji: sec.querySelector(".emoji"), moodText: sec.querySelector(".text"), sun: sec.querySelector(".sunline"), orb: sec.querySelector(".orb"), stars: sec.querySelector(".stars"),
  };
  const person = { place: null, el: sec, refs, lastEmoji: null, idx: i };
  wireSearch(person);
  sec.querySelector(".remove")?.addEventListener("click", () => removePerson(person));
  return person;
}
function addPerson(place, focus) {
  if (people.length >= MAX) return null;
  const p = makeHalf(people.length);
  p.place = place;
  if (place) p.refs.input.value = place.name;
  people.push(p);
  halves.insertBefore(p.el, divider);
  layout();
  if (focus) p.refs.input.focus();
  return p;
}
function removePerson(p) {
  const i = people.indexOf(p); if (i < 2) return;
  people.splice(i, 1); p.el.remove();
  people.forEach((q, k) => { q.idx = k; q.el.querySelector(".who span").textContent = WHO[k]; });
  layout(); sync();
}
function layout() {
  halves.style.setProperty("--n", people.length);
  halves.dataset.count = people.length;
  $("addBtn").hidden = people.length >= MAX;
}

/* ------------------------------------------------------------------ search UI */
function wireSearch(p) {
  const { input, menu } = p.refs;
  let items = [], sel = -1;
  const close = () => { menu.hidden = true; input.setAttribute("aria-expanded", "false"); sel = -1; };
  const choose = c => { p.place = c; input.value = c.name; close(); sync(); };
  const open = () => {
    items = search(input.value);
    if (!items.length) return close();
    const t = now();
    menu.innerHTML = items.map((c, k) => {
      const l = local(c.tz, t);
      return `<li role="option" id="opt-${p.idx}-${k}" aria-selected="${k === sel}"><span class="flag">${c.flag}</span><span class="name">${esc(c.name)}${c.country ? ` <small>${esc(c.country)}</small>` : ""}</span><span class="t">${h12(l.h, l.mi)}</span></li>`;
    }).join("");
    menu.hidden = false; input.setAttribute("aria-expanded", "true");
    [...menu.children].forEach((li, k) => li.addEventListener("mousedown", e => { e.preventDefault(); choose(items[k]); }));
  };
  input.addEventListener("input", () => { sel = -1; open(); });
  input.addEventListener("focus", () => { input.select(); });
  input.addEventListener("blur", () => { close(); if (p.place) input.value = p.place.name; });
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (menu.hidden) open(); if (!items.length) return;
      e.preventDefault(); sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      [...menu.children].forEach((li, k) => li.setAttribute("aria-selected", k === sel));
      input.setAttribute("aria-activedescendant", `opt-${p.idx}-${sel}`);
      menu.children[sel]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = sel >= 0 ? items[sel] : search(input.value)[0];
      if (c) { choose(c); input.blur(); } else toast("No idea where that is. Try a bigger city.");
    } else if (e.key === "Escape") { close(); input.blur(); }
    e.stopPropagation();
  });
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ------------------------------------------------------------------ divider (scrub by drag) */
const divider = document.createElement("button");
divider.className = "divider"; divider.type = "button";
divider.setAttribute("aria-label", "Drag to scrub time forward or back. Arrow keys also work.");
divider.innerHTML = '<span class="grip" aria-hidden="true">‹›</span>';
halves.appendChild(divider);
function placeDivider() { divider.style.left = (100 / people.length) + "%"; }

function dragScrub(el, opts = {}) {
  let startX = 0, base = 0, active = false;
  el.addEventListener("pointerdown", e => {
    if (e.button && e.button !== 0) return;
    active = true; startX = e.clientX; base = scrubMs; el.setPointerCapture(e.pointerId);
    halves.classList.add("scrubbing"); e.preventDefault();
  });
  el.addEventListener("pointermove", e => {
    if (!active) return;
    const dx = e.clientX - startX;
    const perPx = (24 * 3600000) / Math.max(320, window.innerWidth); // full width = 24h
    setScrub(base + dx * perPx, false);
    if (opts.move) opts.move(dx);
  });
  const end = () => { if (!active) return; active = false; halves.classList.remove("scrubbing"); if (opts.move) opts.move(0); if (!opts.hold) setScrub(0); };
  el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end); el.addEventListener("lostpointercapture", end);
}
dragScrub(divider, { move: dx => { divider.querySelector(".grip").style.transform = `translate(calc(-50% + ${Math.max(-60, Math.min(60, dx))}px), -50%)`; } });
dragScrub($("bar"));

function setScrub(ms, fromSlider) {
  scrubMs = Math.max(-24 * 3600000, Math.min(48 * 3600000, Math.round(ms / 60000) * 60000));
  if (!fromSlider) $("scrub").value = Math.round(scrubMs / 60000);
  $("nowBtn").hidden = scrubMs === 0;
  $("scrubLabel").textContent = scrubMs === 0 ? "What about later?" : (scrubMs > 0 ? `In ${fmtDur(scrubMs)}` : `${fmtDur(-scrubMs)} ago`);
  tick();
}
const fmtDur = ms => { const m = Math.round(ms / 60000), h = Math.floor(m / 60), mm = m % 60; return h && mm ? `${h}h ${mm}m` : h ? `${h} hour${h === 1 ? "" : "s"}` : `${mm} min`; };
$("scrub").addEventListener("input", e => setScrub(+e.target.value * 60000, true));
$("nowBtn").addEventListener("click", () => setScrub(0));
document.addEventListener("keydown", e => {
  const tag = (e.target.tagName || "").toLowerCase();
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); (people.find(p => !p.place) || people[1] || people[0]).refs.input.focus(); return; }
  if (tag === "input" && e.target.type !== "range") return;
  if (tag === "input" && e.target.type === "range") return; // slider handles its own arrows
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); const step = (e.shiftKey ? 180 : 30) * 60000; setScrub(scrubMs + (e.key === "ArrowRight" ? step : -step)); }
  else if (e.key === "0" || (e.key === "Escape" && scrubMs)) setScrub(0);
});

/* ------------------------------------------------------------------ render */
let lastMinuteKey = "";
function renderPerson(p, t, me) {
  const r = p.refs;
  if (!p.place) { r.time.textContent = "--:--"; r.date.textContent = ""; r.emoji.textContent = ""; r.moodText.textContent = ""; r.sun.textContent = ""; p.el.className = "half"; r.orb.className = "orb hidden"; return; }
  const z = p.place.tz, l = local(z, t);
  r.time.innerHTML = `${l.h % 12 || 12}:${pad(l.mi)}<small>${l.h < 12 ? "am" : "pm"}</small>`;
  let rel = "";
  if (me && me.place && me !== p) {
    const ml = local(me.place.tz, t);
    const dm = Date.UTC(ml.y, ml.m - 1, ml.d), dt = Date.UTC(l.y, l.m - 1, l.d);
    if (dt > dm) rel = "tomorrow"; else if (dt < dm) rel = "yesterday";
  }
  r.date.innerHTML = `${DAYS[l.wd]}, ${MONTHS[l.m - 1]} ${l.d}${rel ? `<span class="rel">${rel}</span>` : ""}`;
  const ph = phaseOf(p.place, t);
  p.el.className = "half " + ph;
  const [emoji, text] = mood(p.place, t);
  if (emoji !== p.lastEmoji) { r.emoji.textContent = emoji; r.emoji.classList.remove("pop"); void r.emoji.offsetWidth; r.emoji.classList.add("pop"); p.lastEmoji = emoji; }
  r.moodText.textContent = text;
  // sun/moon
  const o = orbPos(p.place, t);
  r.orb.className = "orb " + o.kind;
  r.orb.style.left = (o.x * 100) + "%"; r.orb.style.top = (o.y * 100) + "%";
  if (o.kind === "moon") { const mp = moonPhase(t); r.orb.style.setProperty("--phase", (mp < 0.5 ? -mp * 200 : (1 - mp) * 200).toFixed(0) + "%"); }
  const s = daySun(p.place, t);
  if (!s) r.sun.textContent = "";
  else if (s.polar === "day") r.sun.textContent = "The sun does not set today.";
  else if (s.polar === "night") r.sun.textContent = "The sun does not rise today.";
  else { const a = local(z, s.rise), b = local(z, s.set); const len = (s.set - s.rise) / 3600000; r.sun.textContent = `Sun ${h12(a.h, a.mi)} to ${h12(b.h, b.mi)} · ${Math.floor(len)}h${pad(Math.round((len % 1) * 60))} of daylight`; }
}

function tick() {
  const t = now();
  const me = people[0];
  people.forEach(p => renderPerson(p, t, me));
  const friends = people.slice(1).filter(p => p.place);
  const ready = me.place && friends.length;
  $("strip").hidden = $("actions").hidden = $("share").hidden = !ready;
  if (!ready) { $("summary").textContent = me.place ? "Now pick a city for your friend." : "Pick two cities."; $("later").hidden = true; $("pick").hidden = true; document.title = "What time is it for them?"; return; }
  $("later").hidden = false;
  renderSummary(t, me, friends);
  renderStrip(t, me, friends);
  const key = people.map(p => p.place ? local(p.place.tz, t).h + ":" + local(p.place.tz, t).mi : "-").join("|") + friends[0].place.tz + scrubMs;
  if (key !== lastMinuteKey) { lastMinuteKey = key; updateTitle(t, me, friends[0]); updateFavicon(t, friends[0]); }
}

function renderSummary(t, me, friends) {
  const f = friends[0];
  const diff = offsetMin(f.place.tz, t) - offsetMin(me.place.tz, t);
  const ml = local(me.place.tz, t), fl = local(f.place.tz, t);
  const later = scrubMs !== 0;
  const isSelf = me.place.tz === detectedZone && f.place.tz === detectedZone && f.place.slug === me.place.slug;
  let s;
  if (isSelf) s = `Talking to yourself. Fine.`;
  else if (diff === 0) s = `You're in the same timezone. This site is unnecessary. Call them.`;
  else {
    const dir = diff > 0 ? "ahead of" : "behind";
    const verb = later ? "it'll be" : "it's";
    s = `<strong>${esc(f.place.name)}</strong> is <strong>${fmtOffset(diff)} ${dir}</strong> you. At <strong>${h12(ml.h, ml.mi)}</strong> for you ${verb} <strong>${h12(fl.h, fl.mi)}</strong> for them.`;
    if (Math.abs(diff) === 720) s += ` Exactly opposite. One of you is always the villain.`;
  }
  const extra = friends.slice(1).map(p => {
    const d = offsetMin(p.place.tz, t) - offsetMin(me.place.tz, t), l = local(p.place.tz, t);
    return `<strong>${esc(p.place.name)}</strong> is ${d === 0 ? "on your time" : `${fmtOffset(d)} ${d > 0 ? "ahead" : "behind"}`}, ${h12(l.h, l.mi)}.`;
  });
  if (extra.length) s += " " + extra.join(" ");
  const km = distance(me.place, f.place);
  if (km != null && km > 100 && !isSelf) s += ` <span class="dim">${fmtKm(km)} apart. ${flightLine(km)}</span>`;
  $("summary").innerHTML = s;
}
function distance(a, b) {
  if (a.lat == null || b.lat == null) return null;
  const dLat = (b.lat - a.lat) * RAD, dLon = (b.lon - a.lon) * RAD;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}
const fmtKm = km => `${Math.round(km / 10) * 10 >= 1000 ? Math.round(km / 100) * 100 : Math.round(km / 10) * 10} km`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const flightLine = km => { const h = km / 850 + 0.6; return h < 1.5 ? "Barely worth a plane." : h < 4 ? `About ${Math.round(h)} hours in the air.` : `About ${Math.round(h)} hours in a metal tube.`; };

function renderStrip(t, me, friends) {
  const bar = $("bar"); bar.innerHTML = "";
  const pct = h => (h / 24 * 100) + "%";
  const all = [me, ...friends];
  const offs = all.map(p => (offsetMin(p.place.tz, t) - offsetMin(me.place.tz, t)) / 60);
  all.forEach((p, i) => {
    const start = ((8 - offs[i]) % 24 + 24) % 24;
    const segs = start + 14 <= 24 ? [[start, 14]] : [[start, 24 - start], [0, start + 14 - 24]];
    for (const [l, w] of segs) { const d = document.createElement("div"); d.className = "band b" + i; d.style.left = pct(l); d.style.width = pct(w); bar.appendChild(d); }
  });
  const ml = local(me.place.tz, t);
  const nl = document.createElement("div"); nl.className = "nowline" + (ml.hf > 19 ? " flip" : ""); nl.style.left = pct(ml.hf); nl.dataset.t = scrubMs ? h12(ml.h, ml.mi) : "now"; bar.appendChild(nl);
  // best window: every quarter-hour on my clock, all awake 8-22
  let best = null, cur = null;
  for (let q = 0; q <= 96; q++) {
    const h = q / 4;
    const ok = q < 96 && all.every((p, i) => { const lh = ((h + offs[i]) % 24 + 24) % 24; return lh >= 8 && lh < 22; });
    if (ok) { if (!cur) cur = [h, h]; cur[1] = h + 0.25; }
    else if (cur) { if (!best || cur[1] - cur[0] > best[1] - best[0]) best = cur; cur = null; }
  }
  const names = all.map((p, i) => `<span class="key b${i}"></span>${i === 0 ? "You" : esc(p.place.name)}`).join(" ");
  $("legend").innerHTML = `${names} · waking hours, on your clock. ` + (best ? `Best window to call: <b>${clockRound(best[0])} to ${clockRound(best[1])}</b> your time.` : `<b>No shared waking hours.</b> Someone is staying up late.`);
}

function updateTitle(t, me, f) {
  const a = local(me.place.tz, t), b = local(f.place.tz, t);
  document.title = `${h12(a.h, a.mi)} here, ${h12(b.h, b.mi)} there`;
}
const favCanvas = document.createElement("canvas"); favCanvas.width = favCanvas.height = 64;
function updateFavicon(t, f) {
  const l = local(f.place.tz, t), ph = phaseOf(f.place, t);
  const c = favCanvas.getContext("2d"); c.clearRect(0, 0, 64, 64);
  const bg = { night: "#0b1230", dawn: "#f0b088", day: "#efdca9", dusk: "#b4533c" }[ph], fg = ph === "night" || ph === "dusk" ? "#f7f4ee" : "#14213d";
  c.fillStyle = bg; c.beginPath(); c.arc(32, 32, 30, 0, Math.PI * 2); c.fill();
  c.strokeStyle = fg; c.lineCap = "round"; c.lineWidth = 6;
  const ha = ((l.h % 12) + l.mi / 60) / 12 * Math.PI * 2 - Math.PI / 2, ma = l.mi / 60 * Math.PI * 2 - Math.PI / 2;
  c.beginPath(); c.moveTo(32, 32); c.lineTo(32 + Math.cos(ha) * 14, 32 + Math.sin(ha) * 14); c.stroke();
  c.lineWidth = 4; c.beginPath(); c.moveTo(32, 32); c.lineTo(32 + Math.cos(ma) * 22, 32 + Math.sin(ma) * 22); c.stroke();
  try { $("favicon").href = favCanvas.toDataURL("image/png"); } catch {}
}

/* ------------------------------------------------------------------ find a good time */
function scoreHour(hf) {
  return hf >= 9 && hf < 12 ? 3 : hf >= 12 && hf < 13 ? 1 : hf >= 13 && hf < 18 ? 3 : hf >= 18 && hf < 21 ? 2 : hf >= 8 && hf < 9 ? 1 : hf >= 21 && hf < 22 ? 0.5 : -100;
}
function findGoodTime() {
  const all = people.filter(p => p.place);
  const start = Math.ceil(Date.now() / 1800000) * 1800000 + 1800000; // next half hour, at least 30 min away
  let best = null;
  for (let k = 0; k < 96; k++) {
    const ms = start + k * 1800000;
    let s = 0;
    for (const p of all) { const l = local(p.place.tz, ms); s += scoreHour(l.hf) - (l.wd === 0 || l.wd === 6 ? 1.5 : 0); }
    s -= k * 0.01; // prefer sooner
    if (!best || s > best.s) best = { s, ms };
  }
  if (!best || best.s < 0) { toast("Nothing decent in the next two days. One of you will have to suffer."); return; }
  pinnedPick = best.ms;
  $("pick").hidden = false;
  $("pickText").innerHTML = pickLine(best.ms, true);
  setScrub(best.ms - Date.now());
  $("pick").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
}
function pickLine(ms, html) {
  const parts = people.filter(p => p.place).map(p => { const l = local(p.place.tz, ms); const day = DAYS[l.wd]; const s = `${day} ${h12(l.h, l.mi)} ${p.place.name}`; return html ? `<b>${esc(day)} ${h12(l.h, l.mi)}</b> ${esc(p.place.name)}` : s; });
  return parts.join(html ? " <span class=\"dim\">/</span> " : " / ");
}
$("findBtn").addEventListener("click", findGoodTime);
$("copyPick").addEventListener("click", () => copy(pickLine(pinnedPick, false), "Copied. Paste it wherever they'll read it."));
$("icsBtn").addEventListener("click", () => {
  if (!pinnedPick) return;
  const d = new Date(pinnedPick), e = new Date(pinnedPick + 1800000);
  const st = x => x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const title = "Call: " + people.filter(p => p.place).map(p => { const l = local(p.place.tz, pinnedPick); return `${p.place.name} ${h12(l.h, l.mi)}`; }).join(" / ");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//whattime//EN", "BEGIN:VEVENT", `UID:${pinnedPick}@whattime`, `DTSTAMP:${st(new Date())}`, `DTSTART:${st(d)}`, `DTEND:${st(e)}`, `SUMMARY:${title.replace(/,/g, "\\,")}`, `URL:${location.href}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  download(new Blob([ics], { type: "text/calendar" }), "call.ics");
});
function download(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); }

/* ------------------------------------------------------------------ share */
async function copy(text, msg) {
  try { await navigator.clipboard.writeText(text); toast(msg || "Copied."); }
  catch { toast("Couldn't copy. Long-press to select it instead."); }
}
$("copyLink").addEventListener("click", () => copy(location.href, "Link copied. Send it."));
$("copySentence").addEventListener("click", () => copy($("summary").textContent.trim(), "Sentence copied."));
$("shareImg").addEventListener("click", shareImage);
async function shareImage() {
  const all = people.filter(p => p.place);
  try { await document.fonts.load('800 80px "Manrope"'); await document.fonts.load('500 30px "Manrope"'); } catch {}
  const cv = $("og"), c = cv.getContext("2d"), W = cv.width, H = cv.height, t = now(), n = all.length, w = W / n;
  const COL = { night: ["#0b1230", "#f7f4ee"], dawn: ["#f0b088", "#3a1f14"], day: ["#efdca9", "#14213d"], dusk: ["#b4533c", "#fff3ea"] };
  all.forEach((p, i) => {
    const ph = phaseOf(p.place, t), [bg, fg] = COL[ph], l = local(p.place.tz, t), x0 = i * w;
    c.fillStyle = bg; c.fillRect(x0, 0, w, H);
    const o = orbPos(p.place, t);
    c.fillStyle = o.kind === "sun" ? "#ffd166" : "#e9e6da"; c.globalAlpha = .9;
    c.beginPath(); c.arc(x0 + o.x * w, o.y * H * .8, n > 2 ? 34 : 52, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1;
    c.fillStyle = fg; c.textBaseline = "top";
    c.font = `500 ${n > 2 ? 24 : 30}px Manrope, system-ui, sans-serif`;
    c.fillText(i === 0 ? "You, in" : "Them, in", x0 + 48, 54);
    c.font = `800 ${n > 2 ? 34 : 48}px Manrope, system-ui, sans-serif`;
    c.fillText(fit(c, p.place.name, w - 96), x0 + 48, 92);
    const big = `800 ${n > 2 ? 96 : 150}px Manrope, system-ui, sans-serif`, tt = `${l.h % 12 || 12}:${pad(l.mi)}`;
    c.font = big; c.fillText(tt, x0 + 44, H - (n > 2 ? 260 : 330));
    const tw = c.measureText(tt).width;
    c.font = `500 ${n > 2 ? 26 : 34}px Manrope, system-ui, sans-serif`;
    c.fillText(l.h < 12 ? "am" : "pm", x0 + 48 + tw + 10, H - (n > 2 ? 250 : 315));
    c.fillText(`${DAYS[l.wd]}, ${MONTHS[l.m - 1]} ${l.d}`, x0 + 48, H - (n > 2 ? 150 : 165));
    const [em, tx] = mood(p.place, t);
    c.font = `500 ${n > 2 ? 24 : 30}px Manrope, system-ui, sans-serif`;
    c.fillText(fit(c, em + "  " + tx, w - 96), x0 + 48, H - (n > 2 ? 100 : 110));
    c.globalAlpha = .55; c.font = "500 20px Manrope, system-ui, sans-serif"; c.fillText(location.host || "whattime", x0 + 48, H - 44); c.globalAlpha = 1;
  });
  cv.toBlob(async blob => {
    const file = new File([blob], "whattime.png", { type: "image/png" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: document.title, url: location.href }); return; }
    } catch (e) { if (e.name === "AbortError") return; }
    try { if (window.ClipboardItem) { await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]); toast("Picture copied. Paste it into the chat."); return; } } catch {}
    download(blob, "whattime.png"); toast("Picture saved.");
  }, "image/png");
}
function fit(c, text, max) { if (c.measureText(text).width <= max) return text; while (text.length > 3 && c.measureText(text + "…").width > max) text = text.slice(0, -1); return text + "…"; }

let toastT;
function toast(msg) { const el = $("toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 2400); }

/* ------------------------------------------------------------------ URL */
const paramOf = p => p.slug.startsWith("tz:") ? p.tz : p.slug;
function sync() {
  const me = people[0], friends = people.slice(1).filter(p => p.place);
  try {
    const q = new URLSearchParams();
    if (me.place) q.set("you", paramOf(me.place));
    if (friends[0]) q.set("them", paramOf(friends[0].place));
    if (friends.length > 1) q.set("and", friends.slice(1).map(p => paramOf(p.place)).join(","));
    history.replaceState(null, "", "?" + q.toString());
  } catch {}
  placeDivider();
  lastMinuteKey = ""; tick();
}
$("addBtn").addEventListener("click", () => { addPerson(null, true); placeDivider(); });

/* ------------------------------------------------------------------ boot */
const params = new URLSearchParams(location.search);
const youP = placeFromParam(params.get("you")) || placeFromZone(detectedZone);
const themP = placeFromParam(params.get("them"));
addPerson(youP);
addPerson(themP);
(params.get("and") || "").split(",").map(placeFromParam).filter(Boolean).slice(0, MAX - 2).forEach(p => addPerson(p));
placeDivider();
$("foot").textContent = "Times come from your browser's own timezone tables. Sunrise and sunset use the NOAA solar equations; the moon is counted from the January 2000 new moon. Nothing leaves your device.";
sync();
if (!themP) people[1].refs.input.focus({ preventScroll: true });
setInterval(tick, 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });
})();
