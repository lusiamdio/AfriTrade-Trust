export interface AfricanCountry {
  name: string;
  code: string;
  authority: string;
  region: 'Southern Africa' | 'East Africa' | 'West Africa' | 'North Africa' | 'Central Africa';
  primaryLang: 'en' | 'fr' | 'pt' | 'ar' | 'sw';
}

/**
 * All 54 sovereign African Member States of the African Union (AU)
 * complete with sovereign business registry authorities and ISO-2 country codes.
 */
export const ALL_AFRICAN_COUNTRIES: AfricanCountry[] = [
  { name: 'Algeria', code: 'DZ', authority: 'Centre National du Registre du Commerce (CNRC)', region: 'North Africa', primaryLang: 'ar' },
  { name: 'Angola', code: 'AO', authority: 'Guichet Único da Empresa (GUE) / INAPEM', region: 'Southern Africa', primaryLang: 'pt' },
  { name: 'Benin', code: 'BJ', authority: 'Guichet Unique de Formalisation des Entreprises (GUFE)', region: 'West Africa', primaryLang: 'fr' },
  { name: 'Botswana', code: 'BW', authority: 'Companies and Intellectual Property Authority (CIPA)', region: 'Southern Africa', primaryLang: 'en' },
  { name: 'Burkina Faso', code: 'BF', authority: 'Maison de l’Entreprise du Burkina Faso (MEBF)', region: 'West Africa', primaryLang: 'fr' },
  { name: 'Burundi', code: 'BI', authority: 'Agence de Promotion des Investissements (API)', region: 'East Africa', primaryLang: 'fr' },
  { name: 'Cabo Verde', code: 'CV', authority: 'Casa do Cidadão / Registo Comercial', region: 'West Africa', primaryLang: 'pt' },
  { name: 'Cameroon', code: 'CM', authority: 'Centre de Formalités de Création des Entreprises (CFCE)', region: 'Central Africa', primaryLang: 'fr' },
  { name: 'Central African Republic', code: 'CF', authority: 'Guichet Unique des Formalités des Entreprises', region: 'Central Africa', primaryLang: 'fr' },
  { name: 'Chad', code: 'TD', authority: 'Agence Nationale des Investissements et des Exportations (ANIE)', region: 'Central Africa', primaryLang: 'fr' },
  { name: 'Comoros', code: 'KM', authority: 'Agence Nationale pour la Promotion des Investissements (ANPI)', region: 'East Africa', primaryLang: 'fr' },
  { name: 'Congo (DRC)', code: 'CD', authority: 'Guichet Unique de Création d’Entreprise (GUCE)', region: 'Central Africa', primaryLang: 'fr' },
  { name: 'Congo (Republic)', code: 'CG', authority: 'Centre de Formalités des Entreprises (CFE)', region: 'Central Africa', primaryLang: 'fr' },
  { name: 'Côte d’Ivoire', code: 'CI', authority: 'Centre de Promotion des Investissements (CEPICI)', region: 'West Africa', primaryLang: 'fr' },
  { name: 'Djibouti', code: 'DJ', authority: 'Office Djiboutien de Développement Industriel (ODDEG)', region: 'East Africa', primaryLang: 'fr' },
  { name: 'Egypt', code: 'EG', authority: 'General Authority for Investment and Free Zones (GAFI)', region: 'North Africa', primaryLang: 'ar' },
  { name: 'Equatorial Guinea', code: 'GQ', authority: 'Ventanilla Única Empresarial', region: 'Central Africa', primaryLang: 'pt' },
  { name: 'Eritrea', code: 'ER', authority: 'Ministry of Trade & Industry Enterprise Registry', region: 'East Africa', primaryLang: 'en' },
  { name: 'Eswatini', code: 'SZ', authority: 'Ministry of Commerce, Industry and Trade Registrar', region: 'Southern Africa', primaryLang: 'en' },
  { name: 'Ethiopia', code: 'ET', authority: 'Ministry of Trade & Regional Integration (MOTRI)', region: 'East Africa', primaryLang: 'en' },
  { name: 'Gabon', code: 'GA', authority: 'Agence Nationale de Promotion des Investissements (ANPI-Gabon)', region: 'Central Africa', primaryLang: 'fr' },
  { name: 'Gambia', code: 'GM', authority: 'Single Window Business Registration (MoJ)', region: 'West Africa', primaryLang: 'en' },
  { name: 'Ghana', code: 'GH', authority: 'Registrar General’s Department (RGD) / Registrar of Companies', region: 'West Africa', primaryLang: 'en' },
  { name: 'Guinea', code: 'GN', authority: 'Agence de Promotion des Investissements Privés (APIP)', region: 'West Africa', primaryLang: 'fr' },
  { name: 'Guinea-Bissau', code: 'GW', authority: 'Centro de Formalização de Empresas (CFE)', region: 'West Africa', primaryLang: 'pt' },
  { name: 'Kenya', code: 'KE', authority: 'Business Registration Service (BRS) / KEBS', region: 'East Africa', primaryLang: 'en' },
  { name: 'Lesotho', code: 'LS', authority: 'One-Stop Business Facilitation Centre (OBFC)', region: 'Southern Africa', primaryLang: 'en' },
  { name: 'Liberia', code: 'LR', authority: 'Liberia Business Registry (LBR)', region: 'West Africa', primaryLang: 'en' },
  { name: 'Libya', code: 'LY', authority: 'Ministry of Economy & Trade Commercial Registry', region: 'North Africa', primaryLang: 'ar' },
  { name: 'Madagascar', code: 'MG', authority: 'Economic Development Board of Madagascar (EDBM)', region: 'East Africa', primaryLang: 'fr' },
  { name: 'Malawi', code: 'MW', authority: 'Department of the Registrar General (DRG)', region: 'Southern Africa', primaryLang: 'en' },
  { name: 'Mali', code: 'ML', authority: 'Agence pour la Promotion des Investissements (API-Mali)', region: 'West Africa', primaryLang: 'fr' },
  { name: 'Mauritania', code: 'MR', authority: 'Guichet Unique de Mauritanie (APIM)', region: 'North Africa', primaryLang: 'ar' },
  { name: 'Mauritius', code: 'MU', authority: 'Corporate and Business Registration Department (CBRD)', region: 'East Africa', primaryLang: 'en' },
  { name: 'Morocco', code: 'MA', authority: 'Office Marocain de la Propriété Industrielle (OMPIC)', region: 'North Africa', primaryLang: 'ar' },
  { name: 'Mozambique', code: 'MZ', authority: 'Balcão de Atendimento Único (BAÚ)', region: 'Southern Africa', primaryLang: 'pt' },
  { name: 'Namibia', code: 'NA', authority: 'Business and Intellectual Property Authority (BIPA)', region: 'Southern Africa', primaryLang: 'en' },
  { name: 'Niger', code: 'NE', authority: 'Maison de l’Entreprise du Niger (MDE)', region: 'West Africa', primaryLang: 'fr' },
  { name: 'Nigeria', code: 'NG', authority: 'Corporate Affairs Commission (CAC) / SON', region: 'West Africa', primaryLang: 'en' },
  { name: 'Rwanda', code: 'RW', authority: 'Rwanda Development Board (RDB)', region: 'East Africa', primaryLang: 'en' },
  { name: 'São Tomé and Príncipe', code: 'ST', authority: 'Guiché Único para a Criação de Empresas (GUCE)', region: 'Central Africa', primaryLang: 'pt' },
  { name: 'Senegal', code: 'SN', authority: 'Agence Nationale de la Promotion de l’Investissement (APIX)', region: 'West Africa', primaryLang: 'fr' },
  { name: 'Seychelles', code: 'SC', authority: 'Registrar General’s Department', region: 'East Africa', primaryLang: 'en' },
  { name: 'Sierra Leone', code: 'SL', authority: 'Corporate Affairs Commission (CAC Sierra Leone)', region: 'West Africa', primaryLang: 'en' },
  { name: 'Somalia', code: 'SO', authority: 'Ministry of Commerce and Industry Business Registry', region: 'East Africa', primaryLang: 'ar' },
  { name: 'South Africa', code: 'ZA', authority: 'Companies and Intellectual Property Commission (CIPC)', region: 'Southern Africa', primaryLang: 'en' },
  { name: 'South Sudan', code: 'SS', authority: 'Ministry of Justice Business Registry', region: 'East Africa', primaryLang: 'en' },
  { name: 'Sudan', code: 'SD', authority: 'Commercial Registrar General', region: 'North Africa', primaryLang: 'ar' },
  { name: 'Tanzania', code: 'TZ', authority: 'Business Registrations and Licensing Agency (BRELA)', region: 'East Africa', primaryLang: 'sw' },
  { name: 'Togo', code: 'TG', authority: 'Centre de Formalités des Entreprises (CFE Togo)', region: 'West Africa', primaryLang: 'fr' },
  { name: 'Tunisia', code: 'TN', authority: 'Registre National des Entreprises (RNE)', region: 'North Africa', primaryLang: 'ar' },
  { name: 'Uganda', code: 'UG', authority: 'Uganda Registration Services Bureau (URSB)', region: 'East Africa', primaryLang: 'en' },
  { name: 'Zambia', code: 'ZM', authority: 'Patents and Companies Registration Agency (PACRA)', region: 'Southern Africa', primaryLang: 'en' },
  { name: 'Zimbabwe', code: 'ZW', authority: 'Companies and Intellectual Property Commission (DCIP)', region: 'Southern Africa', primaryLang: 'en' },
];

export function getAfricanCountryByName(name: string): AfricanCountry {
  const normalized = name.toLowerCase().trim();
  const found = ALL_AFRICAN_COUNTRIES.find(
    (c) =>
      c.name.toLowerCase() === normalized ||
      c.code.toLowerCase() === normalized ||
      (normalized.includes('congo') && (c.name.toLowerCase().includes('congo')))
  );
  return found || ALL_AFRICAN_COUNTRIES[1]; // default to Angola if unmatched
}
