import { TradeDocumentTemplate } from '../types';

export const TRADE_DOCUMENT_TEMPLATES: TradeDocumentTemplate[] = [
  {
    id: 'doc-co-afcfta',
    title: 'AfCFTA Certificate of Origin (Form B)',
    category: 'Customs & Origin',
    standard: 'AfCFTA Annex 2 / AU Protocol on Trade in Goods',
    description: 'Official template for exporters claiming 0% preferential customs duty under the African Continental Free Trade Area.',
    fileType: 'TXT / DOC',
    fieldsIncluded: ['Exporter & Consignee details', '6-digit HS Code', 'Origin Criteria (Wholly Obtained / Substantial Transformation)', 'Customs Certification Stamp', 'Declaration by Exporter'],
    content: `AFRICAN CONTINENTAL FREE TRADE AREA (AfCFTA)
CERTIFICATE OF ORIGIN (FORM B)
Issued under the AfCFTA Protocol on Trade in Goods

1. EXPORTER (Name, Full Address, Country):
   [Company Name]
   [Street Address, Industrial Zone]
   [City, Country, National Tax/VAT ID]
   AfriTrade Trust Verification ID: [AT-XXXX-XX]

2. CONSIGNEE (Name, Full Address, Country):
   [Buyer Enterprise Name]
   [Delivery Address, Port of Entry]
   [City, Destination Country]

3. MEANS OF TRANSPORT AND ROUTE:
   Mode of Transport: [Sea / Road / Air / Rail]
   Port / Border Post of Loading: [e.g., Port of Luanda / Mombasa / Durban]
   Port / Border Post of Discharge: [e.g., Port of Walvis Bay / Lagos]
   Bill of Lading / CMR Consignment Note No.: [B/L Number]

4. ITEM NUMBER & PACKAGES:
   Marks & Numbers: [Container / Seal No.]
   Number & Kind of Packages: [e.g., 500 Cartons on 10 Pallets]
   Description of Goods: [Detailed product description]

5. TARIFF HEADING (HS CODE):
   HS Code (6 Digits minimum): [e.g., 4819.10 / 0801.31]

6. ORIGIN CRITERIA:
   Criterion Satisfied: [P - Wholly Obtained / S - Value Added / V - Change in Tariff Heading]
   Regional Value Content (%): [e.g., 62% African Content]

7. GROSS WEIGHT / OTHER MEASURES:
   Gross Weight (kg): [e.g., 14,250 kg]
   Net Weight (kg): [e.g., 13,800 kg]

8. INVOICE DETAILS:
   Commercial Invoice No.: [INV-2026-XXXX]
   Invoice Date: [YYYY-MM-DD]
   Invoice Value & Currency: [USD / Target Currency]

9. DECLARATION BY THE EXPORTER:
   I, the undersigned, hereby declare that the above details and statements are correct,
   and that all goods meet the origin requirements specified under the AfCFTA Agreement.
   Place and Date: [City, Date]
   Authorized Signature & Seal: ___________________________

10. CUSTOMS / DESIGNATED COMPETENT AUTHORITY ENDORSEMENT:
    Declaration certified correct.
    Competent Authority: [e.g., INAPEM / Kenya Revenue Authority / SARS]
    Official Stamp & Officer Signature: ___________________________`,
  },
  {
    id: 'doc-bill-of-lading',
    title: 'Multimodal Ocean Bill of Lading (B/L)',
    category: 'Logistics & Shipping',
    standard: 'FIATA / BIMCO Standard Clean On-Board',
    description: 'Contract of carriage and title transfer document for maritime and corridor shipments across African ports.',
    fileType: 'TXT / DOC',
    fieldsIncluded: ['Shipper & Notify Party', 'Vessel & Voyage No.', 'Port of Loading & Discharge', 'Container & Seal Numbers', 'Freight Pre-paid / Collect'],
    content: `AFRICAN CORRIDOR & MARITIME BILL OF LADING
NON-NEGOTIABLE / NEGOTIABLE COPY
Standard Multimodal Transport Document

B/L NUMBER: AT-BL-2026-[0000]
BOOKING REFERENCE: [BK-XXXXX]

SHIPPER:
[Exporter Full Name, Address, City, Country]
AfriTrade Verified ID: [AT-XXXX]

CONSIGNEE (or ORDER OF):
[To Order of Bank / Named Importer]
[Full Street Address, City, Country]

NOTIFY PARTY:
[Clearing Agent / Customs Broker Name, Phone, Email]

OCEAN VESSEL & VOYAGE: [Vessel Name, Voyage No.]
PORT OF LOADING: [e.g., Port of Luanda / Mombasa / Durban / Tema]
PORT OF DISCHARGE: [e.g., Port of Walvis Bay / Lagos / Alexandria]
PLACE OF DELIVERY: [Final Inland Port / Dry Port]

CONTAINER NO. / SEAL NO.: [e.g., MSCU-1029384 / SEAL: 948201]
PACKAGES & PIECES: [Number of crates, drums, or pallets]
DESCRIPTION OF GOODS: [Commercial trade name, HS code]
GROSS WEIGHT: [Metric Tons / kg]
MEASUREMENT: [Cubic Meters - CBM]

FREIGHT STATUS: [Freight Prepaid / Freight Collect]
NUMBER OF ORIGINAL BILLS OF LADING: [Three (3) Originals]

CARRIER DECLARATION:
Received by the Carrier in apparent good order and condition.
Dated at: [Port of Loading], Date: [YYYY-MM-DD]
Signed for the Carrier: ___________________________`,
  },
  {
    id: 'doc-commercial-invoice',
    title: 'Pan-African Commercial Invoice (Incoterms 2020)',
    category: 'Commercial & Financial',
    standard: 'WCO & ICC Incoterms 2020 Compliant',
    description: 'Standard customs-cleared commercial invoice containing HS codes, unit breakdown, AfCFTA origin declaration, and payment terms.',
    fileType: 'TXT / DOC',
    fieldsIncluded: ['Commercial HS Code', 'Incoterm (CIF/FOB/DAP)', 'Bank SWIFT & PAPSS info', 'Currency Breakdown', 'AfCFTA Origin Declaration'],
    content: `COMMERCIAL INVOICE / FATURA COMERCIAL
Pan-African Cross-Border Trade Format

INVOICE NO.: INV-2026-[XXXX]
DATE: [YYYY-MM-DD]
PAYMENT TERMS: [AfriTrade Escrow / Irrevocable L/C / PAPSS Wire]
INCOTERM (2020): [CIF / FOB / DAP - Named Place]

SELLER / EXPORTER:
Company: [Exporter Legal Name]
Registration ID: [Registrar & Number, e.g., GUE / CAC / CIPC]
Tax / VAT No.: [Tax Number]
Address: [Physical Facility, City, Country]
WhatsApp / Phone: [Phone]

BUYER / IMPORTER:
Company: [Buyer Corporate Name]
Address: [Full Delivery Address, City, Country]
Country of Ultimate Destination: [Destination Country]

---------------------------------------------------------------------------------
ITEM  HS CODE   DESCRIPTION OF GOODS          QTY    UNIT PRICE     TOTAL (USD)
---------------------------------------------------------------------------------
01    [HS Code] [Product Name & Grade]        [Qty]  $[Price]       $[Subtotal]
02    [HS Code] [Secondary Item]             [Qty]  $[Price]       $[Subtotal]
---------------------------------------------------------------------------------
SUBTOTAL (EX-WORKS):                                                $[Amount]
FREIGHT & LOGISTICS CHARGES:                                        $[Amount]
TRANSIT MARINE INSURANCE:                                           $[Amount]
---------------------------------------------------------------------------------
TOTAL INVOICE VALUE (INCOTERM SPECIFIED):                           $[TOTAL]
---------------------------------------------------------------------------------

COUNTRY OF ORIGIN: [African Origin State]
AfCFTA BENEFICIARY STATUS: [Eligible for Preferential Tariff - Form B Attached]

SETTLEMENT BANK DETAILS:
Beneficiary Name: [Company Legal Name]
Bank Name: [Pan-African Bank, e.g., Ecobank, Standard Bank, Attijariwafa]
SWIFT / BIC: [SWIFT Code]
PAPSS Participant Code: [PAPSS-ID if applicable]
IBAN / Account No.: [Account Number]

CERTIFICATION:
We hereby certify that this invoice is true and correct and that the goods are of
authentic African origin as specified.
Authorized Signatory: ___________________________`,
  },
  {
    id: 'doc-packing-list',
    title: 'Standard Export Packing List & Weight Sheet',
    category: 'Logistics & Shipping',
    standard: 'International Maritime & Airfreight Standard',
    description: 'Detailed package tally, pallet dimensions, net and tare weights required for customs clearance and container terminal weighing.',
    fileType: 'TXT / DOC',
    fieldsIncluded: ['Package number range', 'Net and gross weights', 'Pallet dimensions', 'Container stuffing plan'],
    content: `EXPORT PACKING LIST & WEIGHT TALLY SHEET

PACKING LIST NO.: PL-2026-[XXXX]
ASSOCIATED INVOICE NO.: INV-2026-[XXXX]
DATE: [YYYY-MM-DD]

SHIPPER: [Exporter Legal Name, City, Country]
CONSIGNEE: [Buyer Enterprise, Destination]
SHIPPING MARKS: [e.g., AT / BENGUELA / 01-500]

-----------------------------------------------------------------------------------
PKG NO.  PACKAGE TYPE    CONTENTS / SPECIFICATIONS    NET (KG)  GROSS (KG)  DIM (CM)
-----------------------------------------------------------------------------------
01-20    Wooden Pallets  [Item Description, Grade]    [Net]     [Gross]     120x100x140
21-40    Wooden Pallets  [Item Description, Grade]    [Net]     [Gross]     120x100x140
-----------------------------------------------------------------------------------
TOTAL PACKAGES: [e.g., 40 Pallets containing 2,000 cartons]
TOTAL NET WEIGHT: [Total kg]
TOTAL GROSS WEIGHT: [Total kg]
TOTAL VOLUME (CBM): [Total CBM]

CONTAINER STUFFING DETAILS:
Container Number: [Container ID]
Seal Number: [High Security Bolt Seal No.]
Tare Weight of Container: [kg]
Verified Gross Mass (VGM): [kg - SOLAS Compliant]

Inspector / Warehouse Manager Signature: ___________________________`,
  },
  {
    id: 'doc-phytosanitary',
    title: 'Phytosanitary & Agricultural Inspection Certificate',
    category: 'Quality & Agriculture',
    standard: 'IPPC / FAO & African Standards Organization (ARSO)',
    description: 'Model inspection template for agricultural food exports (seeds, nuts, coffee, fruits, cocoa) certifying freedom from quarantine pests.',
    fileType: 'TXT / DOC',
    fieldsIncluded: ['Botanical name of plants', 'Treatment details (fumigation)', 'Aflatoxin & moisture test levels', 'Plant Protection Organization stamp'],
    content: `PHYTOSANITARY CONFORMITY INSPECTION TEMPLATE
International Plant Protection Convention (IPPC) / ARSO Standards

CERTIFICATE NO.: PH-2026-[XXXX]
TO: Plant Protection Organization of: [Importing African Country]
FROM: National Plant Protection Organization of: [Exporting Country]

1. DESCRIPTION OF CONSIGNMENT:
Name and address of exporter: [Exporter Name & Address]
Declared name and address of consignee: [Buyer Name & Address]
Number and description of packages: [e.g., 500 Jute Bags]
Distinguishing marks: [Lot & Batch Number]
Place of origin: [Farming District & Country]
Declared means of conveyance: [Road / Sea / Air]
Declared point of entry: [Port / Border Customs Post]
Name of produce and quantity declared: [Common Name & Botanical Taxon, kg]

2. LAB TEST & CHEMICAL CONFORMITY:
Moisture Content: [e.g., < 8.5%]
Aflatoxin B1 Level: [e.g., < 2.0 ppb (Within CODEX Alimentarius limits)]
Purity / Foreign Matter: [e.g., < 0.5%]

3. DISINFESTATION AND/OR DISINFECTION TREATMENT:
Date of Treatment: [YYYY-MM-DD]
Treatment: [e.g., Phosphine Fumigation 3g/m3]
Duration & Temperature: [72 Hours at 25°C]
Chemical (Active Ingredient): [Chemical Name]

4. OFFICIAL DECLARATION:
This is to certify that the plants, plant products, or other regulated articles described
herein have been inspected and/or tested according to appropriate official procedures and
are considered to be free from quarantine pests.
Place of Issue: [Capital / Port City]
Date: [YYYY-MM-DD]
Authorized Inspector Name & Signature: ___________________________`,
  },
  {
    id: 'doc-str-declaration',
    title: 'AfCFTA Simplified Trade Regime (STR) Declaration',
    category: 'SME Cross-Border',
    standard: 'AfCFTA & Regional Economic Communities (SADC/EAC/ECOWAS)',
    description: 'Streamlined customs document designed for small traders and SMEs crossing borders with goods valued under $2,000 USD.',
    fileType: 'TXT / DOC',
    fieldsIncluded: ['SME Trader National ID / Phone', 'Value threshold declaration', 'Common list of eligible local goods', 'Customs simplified clearance stamp'],
    content: `SIMPLIFIED TRADE REGIME (STR) PASSENGER / SME CUSTOMS DECLARATION
For Low-Value Cross-Border Consignments (< $2,000 USD Equivalent)

DECLARATION NO.: STR-2026-[XXXX]
BORDER POST: [e.g., Santa Clara/Oshikango / Busia / Malaba / Aflao]
DATE: [YYYY-MM-DD]

1. TRADER / SMALL BUSINESS IDENTIFICATION:
Full Name: [Trader Name]
National ID / Passport No.: [ID Number]
Country of Residence: [Origin Country]
WhatsApp / Mobile Money Phone: [Phone]
AfriTrade Trust SME Storefront: [afritrade.africa/store/...]

2. CONSIGNMENT DETAILS:
Destination Country: [Neighboring Country]
Transport: [Light Truck / Van / Public Transport]

-----------------------------------------------------------------------
ITEM  DESCRIPTION OF GOODS             QTY     EST. VALUE (LOCAL/USD)
-----------------------------------------------------------------------
01    [Locally Produced Food / Craft]  [Qty]   $[Value]
02    [Agro-processed Goods]           [Qty]   $[Value]
-----------------------------------------------------------------------
TOTAL VALUE:                                   $[Total < $2,000 USD]
-----------------------------------------------------------------------

3. LOCAL ORIGIN ATTESTATION:
I certify that the goods listed above were grown, harvested, or manufactured locally
within member states and qualify for simplified duty-free cross-border clearance.
Trader Signature: ___________________________

4. BORDER CUSTOMS ENDORSEMENT:
Customs Officer Station: [Border Post Name]
Inspection Result: [Cleared Duty-Free under STR Protocol]
Officer Stamp & Date: ___________________________`,
  },
];
