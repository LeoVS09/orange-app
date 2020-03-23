import { randomId } from '@/components/utils'
import { Country } from '@/models'
import { City } from '@/models/country'
import { randomItem } from '@/store/utils'

export function mockCountry(): Country {
  return {
    ...randomItem(baseCountries),
    id: `country-${randomId()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export function mockCountries(): Array<Country> {
  return baseCountries.map(country => ({
    ...country,
    id: `country-${randomId()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }))
}

export function mockCities(): Array<City> {
  return baseCities.map(city => ({
    id: `city-${randomId()}`,
    name: city.name,
    createdAt: new Date(),
    updatedAt: new Date(),
    countryId: `country-${randomId()}`
  }))
}

/* tslint:disable */
// TODO: move to database
const baseCountries = [
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Åland Islands', code: 'AX' },
  { name: 'Albania', code: 'AL' },
  { name: 'Algeria', code: 'DZ' },
  { name: 'American Samoa', code: 'AS' },
  { name: 'AndorrA', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Anguilla', code: 'AI' },
  { name: 'Antarctica', code: 'AQ' },
  { name: 'Antigua and Barbuda', code: 'AG' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Armenia', code: 'AM' },
  { name: 'Aruba', code: 'AW' },
  { name: 'Australia', code: 'AU' },
  { name: 'Austria', code: 'AT' },
  { name: 'Azerbaijan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahrain', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbados', code: 'BB' },
  { name: 'Belarus', code: 'BY' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Benin', code: 'BJ' },
  { name: 'Bermuda', code: 'BM' },
  { name: 'Bhutan', code: 'BT' },
  { name: 'Bolivia', code: 'BO' },
  { name: 'Bosnia and Herzegovina', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Bouvet Island', code: 'BV' },
  { name: 'Brazil', code: 'BR' },
  { name: 'British Indian Ocean Territory', code: 'IO' },
  { name: 'Brunei Darussalam', code: 'BN' },
  { name: 'Bulgaria', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Cape Verde', code: 'CV' },
  { name: 'Cayman Islands', code: 'KY' },
  { name: 'Central African Republic', code: 'CF' },
  { name: 'Chad', code: 'TD' },
  { name: 'Chile', code: 'CL' },
  { name: 'China', code: 'CN' },
  { name: 'Christmas Island', code: 'CX' },
  { name: 'Cocos (Keeling) Islands', code: 'CC' },
  { name: 'Colombia', code: 'CO' },
  { name: 'Comoros', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Congo, The Democratic Republic of the', code: 'CD' },
  { name: 'Cook Islands', code: 'CK' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Cote D\'Ivoire', code: 'CI' },
  { name: 'Croatia', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Cyprus', code: 'CY' },
  { name: 'Czech Republic', code: 'CZ' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominica', code: 'DM' },
  { name: 'Dominican Republic', code: 'DO' },
  { name: 'Ecuador', code: 'EC' },
  { name: 'Egypt', code: 'EG' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Equatorial Guinea', code: 'GQ' },
  { name: 'Eritrea', code: 'ER' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Ethiopia', code: 'ET' },
  { name: 'Falkland Islands (Malvinas)', code: 'FK' },
  { name: 'Faroe Islands', code: 'FO' },
  { name: 'Fiji', code: 'FJ' },
  { name: 'Finland', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'French Guiana', code: 'GF' },
  { name: 'French Polynesia', code: 'PF' },
  { name: 'French Southern Territories', code: 'TF' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambia', code: 'GM' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Germany', code: 'DE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Gibraltar', code: 'GI' },
  { name: 'Greece', code: 'GR' },
  { name: 'Greenland', code: 'GL' },
  { name: 'Grenada', code: 'GD' },
  { name: 'Guadeloupe', code: 'GP' },
  { name: 'Guam', code: 'GU' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guernsey', code: 'GG' },
  { name: 'Guinea', code: 'GN' },
  { name: 'Guinea-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haiti', code: 'HT' },
  { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
  { name: 'Holy See (Vatican City State)', code: 'VA' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hungary', code: 'HU' },
  { name: 'Iceland', code: 'IS' },
  { name: 'India', code: 'IN' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Iran, Islamic Republic Of', code: 'IR' },
  { name: 'Iraq', code: 'IQ' },
  { name: 'Ireland', code: 'IE' },
  { name: 'Isle of Man', code: 'IM' },
  { name: 'Israel', code: 'IL' },
  { name: 'Italy', code: 'IT' },
  { name: 'Jamaica', code: 'JM' },
  { name: 'Japan', code: 'JP' },
  { name: 'Jersey', code: 'JE' },
  { name: 'Jordan', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Korea, Democratic People\'S Republic of', code: 'KP' },
  { name: 'Korea, Republic of', code: 'KR' },
  { name: 'Kuwait', code: 'KW' },
  { name: 'Kyrgyzstan', code: 'KG' },
  { name: 'Lao People\'S Democratic Republic', code: 'LA' },
  { name: 'Latvia', code: 'LV' },
  { name: 'Lebanon', code: 'LB' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Liberia', code: 'LR' },
  { name: 'Libyan Arab Jamahiriya', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuania', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Macao', code: 'MO' },
  { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malta', code: 'MT' },
  { name: 'Marshall Islands', code: 'MH' },
  { name: 'Martinique', code: 'MQ' },
  { name: 'Mauritania', code: 'MR' },
  { name: 'Mauritius', code: 'MU' },
  { name: 'Mayotte', code: 'YT' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Micronesia, Federated States of', code: 'FM' },
  { name: 'Moldova, Republic of', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolia', code: 'MN' },
  { name: 'Montserrat', code: 'MS' },
  { name: 'Morocco', code: 'MA' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Namibia', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Netherlands Antilles', code: 'AN' },
  { name: 'New Caledonia', code: 'NC' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Niue', code: 'NU' },
  { name: 'Norfolk Island', code: 'NF' },
  { name: 'Northern Mariana Islands', code: 'MP' },
  { name: 'Norway', code: 'NO' },
  { name: 'Oman', code: 'OM' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palau', code: 'PW' },
  { name: 'Palestinian Territory, Occupied', code: 'PS' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papua New Guinea', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Peru', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Pitcairn', code: 'PN' },
  { name: 'Poland', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Reunion', code: 'RE' },
  { name: 'Romania', code: 'RO' },
  { name: 'Russian Federation', code: 'RU' },
  { name: 'RWANDA', code: 'RW' },
  { name: 'Saint Helena', code: 'SH' },
  { name: 'Saint Kitts and Nevis', code: 'KN' },
  { name: 'Saint Lucia', code: 'LC' },
  { name: 'Saint Pierre and Miquelon', code: 'PM' },
  { name: 'Saint Vincent and the Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'San Marino', code: 'SM' },
  { name: 'Sao Tome and Principe', code: 'ST' },
  { name: 'Saudi Arabia', code: 'SA' },
  { name: 'Senegal', code: 'SN' },
  { name: 'Serbia and Montenegro', code: 'CS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' },
  { name: 'Solomon Islands', code: 'SB' },
  { name: 'Somalia', code: 'SO' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
  { name: 'Spain', code: 'ES' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Sudan', code: 'SD' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Svalbard and Jan Mayen', code: 'SJ' },
  { name: 'Swaziland', code: 'SZ' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Syrian Arab Republic', code: 'SY' },
  { name: 'Taiwan, Province of China', code: 'TW' },
  { name: 'Tajikistan', code: 'TJ' },
  { name: 'Tanzania, United Republic of', code: 'TZ' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Timor-Leste', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tokelau', code: 'TK' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinidad and Tobago', code: 'TT' },
  { name: 'Tunisia', code: 'TN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'Turkmenistan', code: 'TM' },
  { name: 'Turks and Caicos Islands', code: 'TC' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Uganda', code: 'UG' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'United States Minor Outlying Islands', code: 'UM' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Uzbekistan', code: 'UZ' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Viet Nam', code: 'VN' },
  { name: 'Virgin Islands, British', code: 'VG' },
  { name: 'Virgin Islands, U.S.', code: 'VI' },
  { name: 'Wallis and Futuna', code: 'WF' },
  { name: 'Western Sahara', code: 'EH' },
  { name: 'Yemen', code: 'YE' },
  { name: 'Zambia', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' }
]

const baseCities = [
  {
    country: 'AD',
    name: 'Sant Julià de Lòria',
    lat: '42.46372',
    lng: '1.49129'
  },
  {
    country: 'AD',
    name: 'Pas de la Casa',
    lat: '42.54277',
    lng: '1.73361'
  },
  {
    country: 'AD',
    name: 'Ordino',
    lat: '42.55623',
    lng: '1.53319'
  },
  {
    country: 'AD',
    name: 'les Escaldes',
    lat: '42.50729',
    lng: '1.53414'
  },
  {
    country: 'AD',
    name: 'la Massana',
    lat: '42.54499',
    lng: '1.51483'
  },
  {
    country: 'AD',
    name: 'Encamp',
    lat: '42.53474',
    lng: '1.58014'
  },
  {
    country: 'AD',
    name: 'Canillo',
    lat: '42.5676',
    lng: '1.59756'
  },
  {
    country: 'AD',
    name: 'Arinsal',
    lat: '42.57205',
    lng: '1.48453'
  },
  {
    country: 'AD',
    name: 'Andorra la Vella',
    lat: '42.50779',
    lng: '1.52109'
  },
  {
    country: 'AE',
    name: 'Umm al Qaywayn',
    lat: '25.56473',
    lng: '55.55517'
  },
  {
    country: 'AE',
    name: 'Ras al-Khaimah',
    lat: '25.78953',
    lng: '55.9432'
  },
  {
    country: 'AE',
    name: 'Muzayri‘',
    lat: '23.14355',
    lng: '53.7881'
  },
  {
    country: 'AE',
    name: 'Murbaḩ',
    lat: '25.27623',
    lng: '56.36256'
  },
  {
    country: 'AE',
    name: 'Khawr Fakkān',
    lat: '25.33132',
    lng: '56.34199'
  },
  {
    country: 'AE',
    name: 'Dubai',
    lat: '25.0657',
    lng: '55.17128'
  },
  {
    country: 'AE',
    name: 'Dibba Al-Fujairah',
    lat: '25.59246',
    lng: '56.26176'
  },
  {
    country: 'AE',
    name: 'Dibba Al-Hisn',
    lat: '25.61955',
    lng: '56.27291'
  },
  {
    country: 'AE',
    name: 'Sharjah',
    lat: '25.33737',
    lng: '55.41206'
  },
  {
    country: 'AE',
    name: 'Ar Ruways',
    lat: '24.11028',
    lng: '52.73056'
  },
  {
    country: 'AE',
    name: 'Al Fujayrah',
    lat: '25.11641',
    lng: '56.34141'
  },
  {
    country: 'AE',
    name: 'Al Ain',
    lat: '24.19167',
    lng: '55.76056'
  },
  {
    country: 'AE',
    name: 'Ajman',
    lat: '25.41111',
    lng: '55.43504'
  },
  {
    country: 'AE',
    name: 'Adh Dhayd',
    lat: '25.28812',
    lng: '55.88157'
  },
  {
    country: 'AE',
    name: 'Abu Dhabi',
    lat: '24.46667',
    lng: '54.36667'
  },
  {
    country: 'AF',
    name: 'Zorkot',
    lat: '33.54149',
    lng: '69.73446'
  },
  {
    country: 'AF',
    name: 'Wulêswālī Bihsūd',
    lat: '34.3436',
    lng: '67.90567'
  },
  {
    country: 'AF',
    name: 'Kuhsān',
    lat: '34.65389',
    lng: '61.19778'
  },
  {
    country: 'AF',
    name: 'Lāsh',
    lat: '35.3782',
    lng: '64.77457'
  },
  {
    country: 'AF',
    name: 'Tukzār',
    lat: '35.94831',
    lng: '66.42132'
  },
  {
    country: 'AF',
    name: 'Mīray',
    lat: '33.32462',
    lng: '68.44068'
  },
  {
    country: 'AF',
    name: 'Āq Kupruk',
    lat: '36.08352',
    lng: '66.84029'
  },
  {
    country: 'AF',
    name: 'Zurmat',
    lat: '33.43778',
    lng: '69.02774'
  },
  {
    country: 'AF',
    name: 'Zaybāk',
    lat: '36.52947',
    lng: '71.3441'
  },
  {
    country: 'AF',
    name: 'Zīārat-e Shāh Maqşūd',
    lat: '31.9848',
    lng: '65.4736'
  },
  {
    country: 'AF',
    name: 'Zindah Jān',
    lat: '34.34264',
    lng: '61.74675'
  },
  {
    country: 'AF',
    name: 'Zarghūn Shahr',
    lat: '32.84734',
    lng: '68.44573'
  },
  {
    country: 'AF',
    name: 'Zaṟah Sharan',
    lat: '33.14641',
    lng: '68.79213'
  },
  {
    country: 'AF',
    name: 'Zaranj',
    lat: '30.95962',
    lng: '61.86037'
  },
  {
    country: 'AF',
    name: 'Zamtō Kêlay',
    lat: '32.3726',
    lng: '66.17708'
  },
  {
    country: 'AF',
    name: 'Yangī Qal‘ah',
    lat: '37.46572',
    lng: '69.61131'
  },
  {
    country: 'AF',
    name: 'Yaḩyá Khēl',
    lat: '32.93742',
    lng: '68.64622'
  },
  {
    country: 'AF',
    name: 'Wāshēr',
    lat: '32.25122',
    lng: '63.85553'
  },
  {
    country: 'AF',
    name: 'Tōrmay',
    lat: '33.68847',
    lng: '68.40205'
  },
  {
    country: 'AF',
    name: 'Tūlak',
    lat: '33.97509',
    lng: '63.72868'
  },
  {
    country: 'AF',
    name: 'Tītān',
    lat: '33.69032',
    lng: '63.86361'
  },
  {
    country: 'AF',
    name: 'Tīr Pul',
    lat: '34.59431',
    lng: '61.26895'
  },
  {
    country: 'AF',
    name: 'Taywarah',
    lat: '33.52118',
    lng: '64.42116'
  },
  {
    country: 'AF',
    name: 'Bāzār-e Tashkān',
    lat: '36.88168',
    lng: '70.27674'
  },
  {
    country: 'AF',
    name: 'Tarinkot',
    lat: '32.62998',
    lng: '65.87806'
  },
  {
    country: 'AF',
    name: 'Taloqan',
    lat: '36.73605',
    lng: '69.53451'
  },
  {
    country: 'AF',
    name: 'Tagāw-Bāy',
    lat: '35.69941',
    lng: '66.06164'
  },
  {
    country: 'AF',
    name: 'Tagāb',
    lat: '34.85501',
    lng: '69.64917'
  },
  {
    country: 'AF',
    name: 'Markaz-e Ḩukūmat-e Sulţān-e Bakwāh',
    lat: '32.24139',
    lng: '62.94936'
  },
  {
    country: 'AF',
    name: 'Spīn Bōldak',
    lat: '31.00575',
    lng: '66.40001'
  },
  {
    country: 'AF',
    name: 'Spērah',
    lat: '33.20204',
    lng: '69.5152'
  },
  {
    country: 'AF',
    name: 'Sōzmah Qal‘ah',
    lat: '36.09916',
    lng: '66.20823'
  },
  {
    country: 'AF',
    name: 'Siyāhgird',
    lat: '35.00553',
    lng: '68.85578'
  },
  {
    country: 'AF',
    name: 'Sheywah',
    lat: '34.57169',
    lng: '70.58859'
  },
  {
    country: 'AF',
    name: 'Shīnḏanḏ',
    lat: '33.30294',
    lng: '62.1474'
  },
  {
    country: 'AF',
    name: 'Shaykh Amīr Kêlay',
    lat: '33.28744',
    lng: '69.91283'
  },
  {
    country: 'AF',
    name: 'Qāshqāl',
    lat: '35.03975',
    lng: '69.00685'
  },
  {
    country: 'AF',
    name: 'Shibirghān',
    lat: '36.66757',
    lng: '65.7529'
  },
  {
    country: 'AF',
    name: 'Shwāk',
    lat: '33.42386',
    lng: '69.37684'
  },
  {
    country: 'AF',
    name: 'Shahr-e Şafā',
    lat: '31.80347',
    lng: '66.32376'
  },
  {
    country: 'AF',
    name: 'Shahrān',
    lat: '36.97984',
    lng: '70.73928'
  },
  {
    country: 'AF',
    name: 'Shahrak',
    lat: '34.10737',
    lng: '64.3052'
  },
  {
    country: 'AF',
    name: '‘Alāqahdārī Shāh Jōy',
    lat: '32.52154',
    lng: '67.41315'
  },
  {
    country: 'AF',
    name: 'Wulêswālī Sayyid Karam',
    lat: '33.69056',
    lng: '69.36881'
  },
  {
    country: 'AF',
    name: 'Markaz-e Sayyidābād',
    lat: '34.00037',
    lng: '68.71346'
  },
  {
    country: 'AF',
    name: 'Şayād',
    lat: '36.13529',
    lng: '65.8297'
  },
  {
    country: 'AF',
    name: 'Sidqābād',
    lat: '35.02298',
    lng: '69.35112'
  },
  {
    country: 'AF',
    name: 'Sāyagaz',
    lat: '32.56521',
    lng: '67.03324'
  },
  {
    country: 'AF',
    name: 'Sar-e Tayghān',
    lat: '33.50998',
    lng: '65.67632'
  },
  {
    country: 'AF',
    name: 'Sarōbī',
    lat: '34.58962',
    lng: '69.76005'
  },
  {
    country: 'AF',
    name: 'Sar Kāṉī',
    lat: '34.79023',
    lng: '71.10962'
  },
  {
    country: 'AF',
    name: 'Sarfirāz Kalā',
    lat: '32.98333',
    lng: '67.96517'
  },
  {
    country: 'AF',
    name: 'Sar-e Pul',
    lat: '36.21544',
    lng: '65.93249'
  },
  {
    country: 'AF',
    name: 'Sar Chakān',
    lat: '35.70177',
    lng: '65.23055'
  },
  {
    country: 'AF',
    name: 'Sangīn',
    lat: '32.07275',
    lng: '64.8359'
  },
  {
    country: 'AF',
    name: 'Sang-e Māshah',
    lat: '33.1396',
    lng: '67.44046'
  },
  {
    country: 'AF',
    name: 'Sang-e Chārak',
    lat: '35.84972',
    lng: '66.43694'
  },
  {
    country: 'AF',
    name: 'Sang Atesh',
    lat: '35.248',
    lng: '63.0044'
  },
  {
    country: 'AF',
    name: 'Sangar Sarāy',
    lat: '34.40744',
    lng: '70.63937'
  },
  {
    country: 'AF',
    name: 'Aībak',
    lat: '36.26468',
    lng: '68.01551'
  },
  {
    country: 'AF',
    name: 'Rū-ye Sang',
    lat: '35.31999',
    lng: '67.63387'
  },
  {
    country: 'AF',
    name: 'Rūdbār',
    lat: '30.15',
    lng: '62.6'
  },
  {
    country: 'AF',
    name: 'Rustāq',
    lat: '37.12604',
    lng: '69.83045'
  },
  {
    country: 'AF',
    name: 'Rabāţ-e Sangī-ye Pā’īn',
    lat: '34.79951',
    lng: '62.13917'
  },
  {
    country: 'AF',
    name: 'Rāmak',
    lat: '33.52234',
    lng: '68.6264'
  },
  {
    country: 'AF',
    name: 'Qurghān',
    lat: '36.91939',
    lng: '65.0649'
  },
  {
    country: 'AF',
    name: 'Quchanghī',
    lat: '34.06183',
    lng: '66.27801'
  }
]
