// Category Icons
const CAT_ICON = { Property:'🏠', Business:'🏢', Tax:'🧾', Legal:'⚖', Personal:'👤', Others:'📎', Finance:'💰' };

// Full DATA (105 items) with documents & official source links
const DATA = [
  // ---------------- PROPERTY ----------------
  {
    category: "Property",
    title: "Khata Transfer",
    desc: "Transfer of property ownership in municipal records",
    documents:[
      "Application form for Khata Transfer",
      "Registered sale deed",
      "Latest property tax receipt",
      "Encumbrance Certificate",
      "Previous Khata certificate/extract"
    ],
    source: "https://site.bbmp.gov.in/departmentwebsites/revenue/kathaservice.html"
  },
  {
    category: "Property",
    title: "Occupancy Certificate (OC)",
    desc: "Document certifying that the building is fit for occupation",
    documents:[
      "Sanctioned building plan",
      "Completion certificate from architect/engineer",
      "Property tax receipts",
      "Photographs of building",
      "Khata certificate"
    ],
    source: "https://site.bbmp.gov.in/"
  },
  {
    category: "Property",
    title: "Building Plan Approval",
    desc: "Permission from authority to construct or modify building",
    documents:[
      "Application form",
      "Ownership documents (sale deed/lease deed)",
      "Latest tax paid receipt",
      "Khata certificate",
      "Sanction drawings",
      "Structural stability certificate"
    ],
    source: "https://www.bda.org.in/"
  },
  {
    category: "Property",
    title: "Property Tax Payment",
    desc: "Annual property tax payment proof",
    documents:[
      "Property Identification Number (PID)",
      "Khata certificate",
      "Previous tax paid receipt"
    ],
    source: "https://bbmptax.karnataka.gov.in/"
  },
  {
    category: "Property",
    title: "Encumbrance Certificate (EC)",
    desc: "Legal proof of property transactions",
    documents:[
      "Property details (survey number/site number)",
      "Application Form 22",
      "Copy of registered deed",
      "Payment of prescribed fee"
    ],
    source: "https://kaverionline.karnataka.gov.in/"
  },
  {
    category: "Property",
    title: "Sale Deed Registration",
    desc: "Legal document for property transfer",
    documents:[
      "Draft sale deed",
      "Identity proof of buyer and seller",
      "PAN card",
      "Photographs",
      "Stamp duty & registration fee receipt"
    ],
    source: "https://igr.karnataka.gov.in/"
  },
  {
    category: "Property",
    title: "Property Mutation",
    desc: "Change of title ownership in revenue records",
    documents:[
      "Registered sale deed",
      "Death certificate (for inheritance)",
      "Succession certificate/legal heir certificate",
      "Latest tax paid receipt",
      "Application form"
    ],
    source: "https://revenue.karnataka.gov.in/"
  },
  {
    category: "Property",
    title: "Land Conversion Certificate",
    desc: "Approval to convert agricultural land to non-agricultural use",
    documents:[
      "Ownership documents",
      "RTC (Record of Rights, Tenancy, and Crops)",
      "Mutation extract",
      "Survey sketch",
      "Zonal certificate from planning authority"
    ],
    source: "https://landrecords.karnataka.gov.in/"
  },
  {
    category: "Property",
    title: "Property Partition Deed",
    desc: "Legal division of joint property",
    documents:[
      "Draft partition deed",
      "Identity proof of all parties",
      "Property documents",
      "Stamp duty & registration fees"
    ],
    source: "https://igr.karnataka.gov.in/"
  },
  {
    category: "Property",
    title: "Gift Deed Registration",
    desc: "Transfer of property through gift",
    documents:[
      "Draft gift deed",
      "Identity proof of donor and donee",
      "Property ownership proof",
      "Khata certificate",
      "Tax paid receipts",
      "Stamp duty & registration fee receipt"
    ],
    source: "https://igr.karnataka.gov.in/"
  },
  {
    category: "Property",
    title: "Lease Agreement Registration",
    desc: "Registered rental/lease agreement",
    documents:[
      "Draft lease agreement",
      "Identity proof of landlord and tenant",
      "Ownership proof of property",
      "Photographs",
      "Stamp duty & registration fees"
    ],
    source: "https://igr.karnataka.gov.in/"
  },
  {
    category: "Property",
    title: "Property Valuation Certificate",
    desc: "Certificate stating market value of property",
    documents:[
      "Application form",
      "Property documents (sale deed/Khata/RTC)",
      "Encumbrance Certificate",
      "Tax paid receipt"
    ],
    source: "https://igr.karnataka.gov.in/"
  },
  {
    category: "Property",
    title: "Property NOC",
    desc: "No Objection Certificate from authority",
    documents:[
      "Application form",
      "Ownership documents",
      "Tax receipts",
      "Khata certificate"
    ],
    source: "https://bbmp.gov.in/"
  },
  {
    category: "Property",
    title: "Property E-Khata",
    desc: "Electronic property Khata certificate",
    documents:[
      "Application form",
      "Registered sale deed",
      "Tax paid receipt",
      "Encumbrance certificate"
    ],
    source: "https://bbmp.gov.in/"
  },
  {
    category: "Property",
    title: "Property Title Deed",
    desc: "Primary ownership document of property",
    documents:[
      "Application form",
      "Previous title deed",
      "Registered sale deed",
      "Stamp duty & registration proof"
    ],
    source: "https://igr.karnataka.gov.in/"
  },

    // ---------------- BUSINESS ----------------
  {
    category: "Business",
    title: "Private Limited Company Registration",
    desc: "Incorporation of a private limited company",
    documents:[
      "PAN card of directors",
      "Identity proof (Aadhaar/Passport/Driver’s License)",
      "Address proof (utility bill/bank statement)",
      "Digital Signature Certificate (DSC)",
      "Director Identification Number (DIN)",
      "Memorandum of Association (MOA)",
      "Articles of Association (AOA)",
      "SPICe+ forms"
    ],
    source: "https://www.mca.gov.in/"
  },
  {
    category: "Business",
    title: "LLP Registration",
    desc: "Limited Liability Partnership registration",
    documents:[
      "PAN card of partners",
      "Identity proof of partners",
      "Address proof",
      "DSC of designated partners",
      "LLP Agreement",
      "Proof of registered office"
    ],
    source: "https://www.mca.gov.in/"
  },
  {
    category: "Business",
    title: "Partnership Firm Registration",
    desc: "Registration of a partnership firm",
    documents:[
      "Partnership deed",
      "Identity proof of partners",
      "Address proof of partners",
      "PAN card of firm",
      "Proof of business address"
    ],
    source: "https://www.mca.gov.in/"
  },
  {
    category: "Business",
    title: "Sole Proprietorship Registration",
    desc: "Basic registration for proprietorship",
    documents:[
      "PAN card",
      "Aadhaar card",
      "Utility bill for address proof",
      "Shop and Establishment certificate",
      "GST registration (if applicable)"
    ],
    source: "https://udyamregistration.gov.in/"
  },
  {
    category: "Business",
    title: "MSME (Udyam) Registration",
    desc: "Micro, Small & Medium Enterprises registration",
    documents:[
      "Aadhaar number of proprietor/partners/directors",
      "PAN number",
      "Business address proof",
      "Bank account details"
    ],
    source: "https://udyamregistration.gov.in/"
  },
  {
    category: "Business",
    title: "FSSAI License",
    desc: "License for food business operators",
    documents:[
      "Photo ID proof of applicant",
      "Proof of possession of premises",
      "Partnership deed or MOA & AOA",
      "List of food products",
      "Declaration form"
    ],
    source: "https://foscos.fssai.gov.in/"
  },
  {
    category: "Business",
    title: "Import Export Code (IEC)",
    desc: "Mandatory code for import and export businesses",
    documents:[
      "PAN card",
      "Bank account details",
      "Address proof of business",
      "Digital photograph"
    ],
    source: "https://www.dgft.gov.in/"
  },
  {
    category: "Business",
    title: "Trademark Registration",
    desc: "Registering a brand trademark",
    documents:[
      "PAN card of applicant",
      "Identity proof",
      "Address proof",
      "Logo (if applicable)",
      "Power of Attorney (if filed through agent)"
    ],
    source: "https://ipindia.gov.in/"
  },
  {
    category: "Business",
    title: "Patent Registration",
    desc: "Filing and registering a patent",
    documents:[
      "Patent specification",
      "Application form",
      "Proof of ownership",
      "Priority documents (if any)",
      "Power of Attorney"
    ],
    source: "https://ipindia.gov.in/"
  },
  {
    category: "Business",
    title: "GST Registration",
    desc: "Goods and Services Tax registration",
    documents:[
      "PAN card of applicant",
      "Aadhaar card",
      "Proof of business registration",
      "Address proof of business place",
      "Bank account proof",
      "Authorisation form"
    ],
    source: "https://www.gst.gov.in/"
  },
  {
    category: "Business",
    title: "Professional Tax Registration",
    desc: "Tax registration for professionals and businesses",
    documents:[
      "Application form",
      "PAN card",
      "Address proof",
      "Identity proof of owner/partners",
      "Salary details (for employers)"
    ],
    source: "https://ctax.kar.nic.in/"
  },
  {
    category: "Business",
    title: "Shops and Establishment Registration",
    desc: "License for operating shops and commercial establishments",
    documents:[
      "PAN card",
      "Proof of establishment address",
      "ID proof of owner",
      "Photographs",
      "Fee payment receipt"
    ],
    source: "https://labour.gov.in/"
  },
  {
    category: "Business",
    title: "ESI Registration",
    desc: "Employee State Insurance registration",
    documents:[
      "Registration certificate of establishment",
      "PAN card",
      "Bank statement",
      "List of employees with details"
    ],
    source: "https://www.esic.gov.in/"
  },
  {
    category: "Business",
    title: "EPF Registration",
    desc: "Employees Provident Fund registration",
    documents:[
      "PAN card",
      "Proof of business registration",
      "Address proof",
      "Bank details",
      "Employee details"
    ],
    source: "https://www.epfindia.gov.in/"
  },
  {
    category: "Business",
    title: "Startup India Registration",
    desc: "Recognition under Startup India scheme",
    documents:[
      "Certificate of incorporation",
      "Details of directors/partners",
      "PAN card",
      "Pitch deck or write-up of business idea"
    ],
    source: "https://www.startupindia.gov.in/"
  },
  {
    category: "Business",
    title: "Digital Signature Certificate (DSC)",
    desc: "Certificate for secure digital transactions",
    documents:[
      "Application form",
      "PAN card",
      "Identity proof",
      "Address proof",
      "Photograph"
    ],
    source: "https://www.cca.gov.in/"
  },
  {
    category: "Business",
    title: "ISO Certification",
    desc: "International Standards Organization certification",
    documents:[
      "Application form",
      "Business registration proof",
      "Address proof",
      "Quality manual",
      "Process documents"
    ],
    source: "https://bis.gov.in/"
  },
  {
    category: "Business",
    title: "Import License",
    desc: "License for importing restricted goods",
    documents:[
      "IEC certificate",
      "PAN card",
      "Bank certificate",
      "Application form",
      "Product details"
    ],
    source: "https://www.dgft.gov.in/"
  },
  {
    category: "Business",
    title: "Export License",
    desc: "License for exporting restricted goods",
    documents:[
      "IEC certificate",
      "PAN card",
      "Bank certificate",
      "Application form",
      "Export product details"
    ],
    source: "https://www.dgft.gov.in/"
  },
  {
    category: "Business",
    title: "Trade License",
    desc: "Mandatory license for running a business/trade",
    documents:[
      "PAN card",
      "Identity proof of applicant",
      "Address proof of business",
      "NOC from neighbors (in some cases)",
      "Fee payment receipt"
    ],
    source: "https://bbmp.gov.in/"
  },


    // ---------------- TAX ----------------
  {
    category: "Tax",
    title: "PAN Application",
    desc: "Permanent Account Number for individuals and entities",
    documents:[
      "Identity proof (Aadhaar/Passport/Voter ID)",
      "Address proof (utility bill/Passport/Driving License)",
      "Birth certificate/School leaving certificate (for DOB proof)",
      "Photograph"
    ],
    source: "https://www.incometax.gov.in/"
  },
  {
    category: "Tax",
    title: "PAN Correction",
    desc: "Correction or update in PAN details",
    documents:[
      "Existing PAN card copy",
      "Identity proof",
      "Address proof",
      "Supporting documents for correction"
    ],
    source: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html"
  },
  {
    category: "Tax",
    title: "Income Tax Return Filing",
    desc: "Annual income tax filing for individuals and businesses",
    documents:[
      "Form 16 (for salaried employees)",
      "Bank account details",
      "TDS certificates",
      "Investment proofs",
      "Other income details"
    ],
    source: "https://www.incometax.gov.in/"
  },
  {
    category: "Tax",
    title: "TAN Application",
    desc: "Tax Deduction and Collection Account Number",
    documents:[
      "Application form (49B)",
      "Business registration proof",
      "Identity proof",
      "Address proof"
    ],
    source: "https://www.tin-nsdl.com/"
  },
  {
    category: "Tax",
    title: "TDS Return Filing",
    desc: "Quarterly return of Tax Deducted at Source",
    documents:[
      "TAN",
      "Challan details",
      "PAN of deductees",
      "Amount deducted",
      "Form 27A"
    ],
    source: "https://www.tin-nsdl.com/"
  },
  {
    category: "Tax",
    title: "Advance Tax Payment",
    desc: "Quarterly advance tax payment for taxpayers",
    documents:[
      "PAN number",
      "Bank account details",
      "Income estimation details"
    ],
    source: "https://onlineservices.tin.egov-nsdl.com/etaxnew/tdsnontds.jsp"
  },
  {
    category: "Tax",
    title: "Professional Tax Payment",
    desc: "Payment of professional tax by individuals and employers",
    documents:[
      "Professional Tax Registration Certificate",
      "Salary details (for employers)",
      "PAN card"
    ],
    source: "https://ctax.kar.nic.in/"
  },
  {
    category: "Tax",
    title: "GST Return Filing",
    desc: "Monthly/Quarterly filing of GST returns",
    documents:[
      "GSTIN",
      "Sales and purchase invoices",
      "Input tax credit details",
      "Payment challans"
    ],
    source: "https://www.gst.gov.in/"
  },
  {
    category: "Tax",
    title: "GST Cancellation",
    desc: "Cancellation of GST registration",
    documents:[
      "Application form (GST REG-16)",
      "Business closure proof",
      "PAN card"
    ],
    source: "https://www.gst.gov.in/"
  },
  {
    category: "Tax",
    title: "GST Amendment",
    desc: "Modification of GST registration details",
    documents:[
      "Application form",
      "Proof of new address/details",
      "Authorisation letter"
    ],
    source: "https://www.gst.gov.in/"
  },
  {
    category: "Tax",
    title: "Tax Refund Application",
    desc: "Claim for income tax refund",
    documents:[
      "ITR acknowledgment",
      "Form 16/Form 26AS",
      "Bank account proof"
    ],
    source: "https://www.incometax.gov.in/"
  },
  {
    category: "Tax",
    title: "Capital Gains Tax Filing",
    desc: "Filing of taxes on capital gains",
    documents:[
      "Property sale deed/transaction proof",
      "Purchase deed (for cost basis)",
      "Investment proofs for exemptions",
      "Bank account details"
    ],
    source: "https://www.incometax.gov.in/"
  },
  {
    category: "Tax",
    title: "Wealth Tax Filing",
    desc: "Declaration of assets and liabilities (where applicable)",
    documents:[
      "Details of assets (property, jewelry, etc.)",
      "Bank account statements",
      "Loan statements"
    ],
    source: "https://www.incometax.gov.in/"
  },
  {
    category: "Tax",
    title: "Customs Duty Payment",
    desc: "Payment of customs duty for imported goods",
    documents:[
      "Bill of entry",
      "Commercial invoice",
      "Packing list",
      "Import license (if required)",
      "PAN card"
    ],
    source: "https://www.cbic.gov.in/"
  },
  {
    category: "Tax",
    title: "Excise Duty Registration",
    desc: "Registration for excise duty (for manufacturers)",
    documents:[
      "PAN card",
      "Identity proof",
      "Business registration documents",
      "Factory address proof"
    ],
    source: "https://www.cbic.gov.in/"
  },

    // ---------------- LEGAL ----------------
  {
    category: "Legal",
    title: "Legal Notice Drafting",
    desc: "Formal legal notice to individuals or organizations",
    documents:[
      "Identity proof of sender",
      "Details of grievance",
      "Supporting evidence (agreements, bills, receipts)"
    ],
    source: "https://districts.ecourts.gov.in/"
  },
  {
    category: "Legal",
    title: "Power of Attorney",
    desc: "Authorization for someone to act on your behalf",
    documents:[
      "Draft of power of attorney",
      "Photographs of principal and agent",
      "Identity proof of both parties",
      "Stamp paper"
    ],
    source: "https://igrmaharashtra.gov.in/"
  },
  {
    category: "Legal",
    title: "Non-Disclosure Agreement",
    desc: "Confidentiality agreement between parties",
    documents:[
      "Draft NDA",
      "Identity proof of parties",
      "Company registration documents (if applicable)"
    ],
    source: "https://legalaffairs.gov.in/"
  },
  {
    category: "Legal",
    title: "Employment Contract",
    desc: "Formal agreement between employer and employee",
    documents:[
      "Draft contract",
      "Company registration certificate",
      "Identity proof of employee"
    ],
    source: "https://labour.gov.in/"
  },
  {
    category: "Legal",
    title: "Divorce Petition",
    desc: "Petition for mutual or contested divorce",
    documents:[
      "Marriage certificate",
      "Address proof of both parties",
      "Photographs",
      "Income proof"
    ],
    source: "https://districts.ecourts.gov.in/"
  },
  {
    category: "Legal",
    title: "Consumer Complaint",
    desc: "Complaint filing with consumer forum",
    documents:[
      "Complaint application",
      "Invoice/bill/receipt",
      "Proof of deficiency (emails, photos, etc.)",
      "Identity proof"
    ],
    source: "https://consumeraffairs.nic.in/"
  },
  {
    category: "Legal",
    title: "Cyber Crime Complaint",
    desc: "Complaint against online fraud or crime",
    documents:[
      "Written complaint",
      "Identity proof",
      "Evidence (screenshots, emails, chats)",
      "Transaction proof (if monetary fraud)"
    ],
    source: "https://cybercrime.gov.in/"
  },
  {
    category: "Legal",
    title: "Bail Application",
    desc: "Application for bail in criminal cases",
    documents:[
      "FIR copy",
      "Identity proof of applicant",
      "Case documents"
    ],
    source: "https://districts.ecourts.gov.in/"
  },
  {
    category: "Legal",
    title: "Probate Application",
    desc: "Probate of will in succession cases",
    documents:[
      "Original will",
      "Death certificate of testator",
      "Identity proof of executor",
      "Property ownership documents"
    ],
    source: "https://districts.ecourts.gov.in/"
  },
  {
    category: "Legal",
    title: "Arbitration Filing",
    desc: "Application for dispute resolution via arbitration",
    documents:[
      "Arbitration agreement",
      "Identity proof of parties",
      "Dispute-related documents"
    ],
    source: "https://legalaffairs.gov.in/"
  },
  {
    category: "Legal",
    title: "Cheque Bounce Case",
    desc: "Complaint filing for dishonored cheques",
    documents:[
      "Original cheque",
      "Bank memo for dishonor",
      "Legal notice copy",
      "Identity proof"
    ],
    source: "https://districts.ecourts.gov.in/"
  },
  {
    category: "Legal",
    title: "Family Court Petition",
    desc: "Cases related to family disputes",
    documents:[
      "Marriage certificate (for divorce/maintenance)",
      "Birth certificate (for custody)",
      "Identity proof",
      "Address proof"
    ],
    source: "https://districts.ecourts.gov.in/"
  },
  {
    category: "Legal",
    title: "Property Dispute Resolution",
    desc: "Filing disputes related to immovable property",
    documents:[
      "Property ownership documents",
      "Identity proof of claimant",
      "Supporting evidence"
    ],
    source: "https://districts.ecourts.gov.in/"
  },
  {
    category: "Legal",
    title: "Labour Dispute Filing",
    desc: "Resolution of employment-related disputes",
    documents:[
      "Employment contract",
      "Salary slips",
      "Appointment letter",
      "Identity proof"
    ],
    source: "https://labour.gov.in/"
  },
  {
    category: "Legal",
    title: "Money Recovery Suit",
    desc: "Legal suit for recovery of money",
    documents:[
      "Loan agreement/transaction proof",
      "Identity proof of claimant",
      "Evidence of non-payment"
    ],
    source: "https://districts.ecourts.gov.in/"
  },


    // ---------------- PERSONAL ----------------
  {
    category: "Personal",
    title: "Aadhaar Card Application",
    desc: "Application for new Aadhaar card",
    documents:[
      "Proof of Identity (PAN, Passport, Driving License)",
      "Proof of Address (Voter ID, Utility Bill, Bank Statement)",
      "Birth Certificate (for minors)"
    ],
    source: "https://uidai.gov.in/"
  },
  {
    category: "Personal",
    title: "Passport Application",
    desc: "Application for fresh passport",
    documents:[
      "Proof of Identity",
      "Proof of Address",
      "Birth Certificate",
      "Photographs"
    ],
    source: "https://portal2.passportindia.gov.in/"
  },
  {
    category: "Personal",
    title: "Voter ID Registration",
    desc: "Register for new Voter ID",
    documents:[
      "Proof of Identity",
      "Proof of Address",
      "Photograph",
      "Age proof (Birth Certificate, School Certificate)"
    ],
    source: "https://voterportal.eci.gov.in/"
  },
  {
    category: "Personal",
    title: "Driving License Application",
    desc: "Application for learner or permanent license",
    documents:[
      "Proof of Age",
      "Proof of Address",
      "Application Form",
      "Passport-size Photographs"
    ],
    source: "https://parivahan.gov.in/"
  },
  {
    category: "Personal",
    title: "Marriage Certificate",
    desc: "Registration of marriage",
    documents:[
      "Application form",
      "Photographs of couple",
      "Identity proofs of both",
      "Marriage invitation card",
      "Affidavit of marriage"
    ],
    source: "https://services.india.gov.in/"
  },
  {
    category: "Personal",
    title: "Birth Certificate",
    desc: "Application for birth certificate",
    documents:[
      "Proof of birth (hospital letter)",
      "Identity proof of parents",
      "Address proof of parents"
    ],
    source: "https://crsorgi.gov.in/"
  },
  {
    category: "Personal",
    title: "Death Certificate",
    desc: "Registration of death",
    documents:[
      "Medical certificate of cause of death",
      "Identity proof of deceased",
      "Application form"
    ],
    source: "https://crsorgi.gov.in/"
  },
  {
    category: "Personal",
    title: "Name Change Affidavit",
    desc: "Affidavit for legally changing name",
    documents:[
      "Notarized affidavit",
      "Identity proof",
      "Address proof",
      "Newspaper publication copy"
    ],
    source: "https://legalaffairs.gov.in/"
  },
  {
    category: "Personal",
    title: "Caste Certificate",
    desc: "Certificate for caste category",
    documents:[
      "Application form",
      "Proof of caste (school certificate, community certificate)",
      "Identity proof",
      "Address proof"
    ],
    source: "https://services.india.gov.in/"
  },
  {
    category: "Personal",
    title: "Domicile Certificate",
    desc: "Proof of residence in a state",
    documents:[
      "Application form",
      "Residence proof",
      "Identity proof",
      "Birth certificate"
    ],
    source: "https://services.india.gov.in/"
  },
  {
    category: "Personal",
    title: "Income Certificate",
    desc: "Proof of income issued by authority",
    documents:[
      "Application form",
      "Salary slip / ITR",
      "Identity proof",
      "Address proof"
    ],
    source: "https://services.india.gov.in/"
  },
  {
    category: "Personal",
    title: "Disability Certificate",
    desc: "Certification of physical/mental disability",
    documents:[
      "Medical certificate from authorized doctor",
      "Application form",
      "Identity proof"
    ],
    source: "https://socialjustice.gov.in/"
  },
  {
    category: "Personal",
    title: "Pension Application",
    desc: "Application for pension benefits",
    documents:[
      "Application form",
      "Service records",
      "Identity proof",
      "Bank passbook"
    ],
    source: "https://epfigms.gov.in/"
  },
  {
    category: "Personal",
    title: "Ration Card Application",
    desc: "Application for new ration card",
    documents:[
      "Application form",
      "Proof of residence",
      "Family members’ identity proofs",
      "Photographs"
    ],
    source: "https://nfsa.gov.in/"
  },
  {
    category: "Personal",
    title: "Gas Connection",
    desc: "Application for new LPG gas connection",
    documents:[
      "Identity proof",
      "Address proof",
      "Photographs"
    ],
    source: "https://mylpg.in/"
  },
  {
    category: "Personal",
    title: "Educational Certificate Verification",
    desc: "Verification of educational qualification",
    documents:[
      "Original mark sheets",
      "Passing certificate",
      "Identity proof"
    ],
    source: "https://services.india.gov.in/"
  },
  {
    category: "Personal",
    title: "Employment Exchange Registration",
    desc: "Registration for job seekers",
    documents:[
      "Application form",
      "Educational certificates",
      "Identity proof",
      "Address proof"
    ],
    source: "https://services.india.gov.in/"
  },


  // ===== Finance (20) =====
  {category:'Finance', title:'Personal Loan Application', desc:'Apply for personal loans with smart document assistance', documents:[
    'PAN & Aadhaar',
    'Income proof (salary slips / bank statements)',
    'Address proof & photographs',
    'Employment proof / employer certificate'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'Home Loan Application', desc:'Complete home loan documentation and processing', documents:[
    'PAN & Aadhaar of applicant(s)',
    'Income proof & bank statements',
    'Property documents (sale deed, approved plan, tax receipts)',
    'Legal & technical valuation reports'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'Vehicle Loan Application', desc:'Auto loan paperwork and approval assistance', documents:[
    'PAN & Aadhaar',
    'Income proof & bank statements',
    'Dealer proforma invoice / tax invoice',
    'Photographs'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'Credit Card Application', desc:'Apply for credit cards with optimized documentation', documents:[
    'PAN & Aadhaar',
    'Income proof / ITR',
    'Address proof & photograph'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'Bank Account Opening', desc:'Open savings and current accounts seamlessly', documents:[
    'Officially Valid Documents (OVD) per KYC (Aadhaar/Passport/Voter ID/Driving License)',
    'PAN or Form 60',
    'Photograph'
  ], source:'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12145&Mode=0'},

  {category:'Finance', title:'Fixed Deposit Creation', desc:'Create FD accounts with best interest rates', documents:[
    'KYC (OVD)',
    'PAN or Form 60',
    'Deposit instruction and beneficiary details'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'EMI Calculator Assistance', desc:'Calculate and plan your EMI payments', documents:[
    'Loan amount, tenure & interest rate',
    'Income & repayment preferences'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'Insurance Claim Process', desc:'File and track insurance claims efficiently', documents:[
    'Policy document & claim form',
    'KYC & bank details of claimant',
    'Bills, invoices, FIR or medical reports (as applicable)'
  ], source:'https://irdai.gov.in/'},

  {category:'Finance', title:'Mutual Fund Investment', desc:'Invest in mutual funds with guided assistance', documents:[
    'KYC (PAN, OVD, photograph)',
    'FATCA declaration & bank account details'
  ], source:'https://www.sebi.gov.in/'},

  {category:'Finance', title:'Stock Trading Account', desc:'Open demat and trading accounts', documents:[
    'PAN & Aadhaar',
    'KYC (OVD) & photograph',
    'Bank proof & income proof (for derivatives)'
  ], source:'https://www.sebi.gov.in/'},

  {category:'Finance', title:'PPF Account Opening', desc:'Public Provident Fund account setup', documents:[
    'KYC (OVD)',
    'PAN or Form 60',
    'Photograph & initial deposit'
  ], source:'https://www.indiapost.gov.in/'},

  {category:'Finance', title:'NSC Investment', desc:'National Savings Certificate investment', documents:[
    'KYC (OVD)',
    'PAN / Form 60',
    'Photograph'
  ], source:'https://www.indiapost.gov.in/'},

  {category:'Finance', title:'Gold Loan Application', desc:'Secure loans against gold jewelry', documents:[
    'KYC (OVD)',
    'PAN (or Form 60)',
    'Photograph'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'Education Loan', desc:'Finance your education with student loans', documents:[
    'KYC (PAN, Aadhaar, OVD)',
    'Admission letter & fee structure',
    'Income proof of borrower / co-borrower',
    'Collateral documents (if applicable)'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'Business Loan Application', desc:'Funding solutions for your business', documents:[
    'KYC of entity & promoters',
    'Financial statements & bank statements',
    'GST returns and business plan',
    'Collateral details (if any)'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'Loan Closure Process', desc:'Complete loan repayment and closure', documents:[
    'Loan account details & final payment receipt',
    'Request for NOC and lien release',
    'No-dues certificate'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'Credit Score Check', desc:'Monitor and improve your credit score', documents:[
    'PAN & basic KYC',
    'Consent to fetch credit bureau data'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'Forex Card Application', desc:'International travel currency cards', documents:[
    'KYC (OVD)',
    'PAN',
    'Travel documents'
  ], source:'https://www.rbi.org.in/'},

  {category:'Finance', title:'Senior Citizen Schemes', desc:'Special financial schemes for seniors', documents:[
    'Age proof (60+)',
    'KYC (OVD)',
    'Photographs'
  ], source:'https://www.indiapost.gov.in/'},

  {category:'Finance', title:'Kisan Credit Card', desc:'Agricultural credit card for farmers', documents:[
    'KYC (OVD)',
    'Land records / RTC / proof of cultivation',
    'Photograph & application form'
  ], source:'https://www.rbi.org.in/'},
 



  // ===== Others (3) =====
  {
    category: 'Others',
    title: 'Apostille Service',
    desc: 'Document apostille for international use',
    documents: [
      'Original document for apostille',
      'Attestation by designated authority (if required)',
      'Identity document of applicant',
      'Apostille fee payment proof'
    ],
    source: 'https://mea.gov.in/apostille.htm'
  },

  {category:'Others', title:'Document Translation', desc:'Certified document translation services', documents:[
    'Original document to be translated',
    'ID proof of applicant',
    'Certified translator declaration (if demanded by receiving authority)'
  ], source:'https://www.mea.gov.in/'},

  {category:'Others', title:'Notary Service', desc:'Document notarization and attestation', documents:[
    'Original document to be notarized',
    'Signatory ID proof',
    'Photograph (if required)'
  ], source:'https://legalaffairs.gov.in/'},


]; 





// ---------- Render ----------
const $categories = document.getElementById('categories');
const byCat = DATA.reduce((m, item) => {
  (m[item.category] ||= []).push(item);
  return m;
}, {});

Object.keys(byCat).forEach((cat, idx) => {
  const details = document.createElement('details');
  details.className = 'category';
  if (idx === 0) details.open = true;

  const summary = document.createElement('summary');
  summary.className = 'summary';
  summary.innerHTML = `<h2><span class="icon">${CAT_ICON[cat] || '📦'}</span>${cat}</h2>
  <span class="badge"><span data-count>${byCat[cat].length}</span> items</span>`;
  details.appendChild(summary);

  const grid = document.createElement('div');
  grid.className = 'grid';
  grid.dataset.category = cat;

  byCat[cat].forEach(({title, desc}) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.title = title.toLowerCase();
    card.dataset.category = cat;
    card.innerHTML = `<div class="card-head">
        <span class="icon">${CAT_ICON[cat] || '📦'}</span>
        <h3>${title}</h3>
      </div>
      <p class="desc">${desc}</p>
      <div class="actions">
        <button class="btn" data-open="${encodeURIComponent(title)}">Check Documents</button>
      </div>`;
    grid.appendChild(card);
  });

  const empty = document.createElement('div');
  empty.className = 'no-results';
  empty.textContent = 'No processes match your filters in this category.';
  details.appendChild(grid);
  details.appendChild(empty);

  $categories.appendChild(details);
});

// ---------- Filtering ----------
const $search = document.getElementById('searchInput');
const $filter = document.getElementById('categoryFilter');

function applyFilters(){
  const searchTerm = $search.value.toLowerCase();
  const selectedCat = $filter.value;

  document.querySelectorAll('.category').forEach(section => {
    let visibleCount = 0;
    const grid = section.querySelector('.grid');
    const empty = section.querySelector('.no-results');
    grid.querySelectorAll('.card').forEach(card => {
      const matchesSearch = card.dataset.title.includes(searchTerm);
      const matchesCategory = selectedCat === 'All' || card.dataset.category === selectedCat;
      if (matchesSearch && matchesCategory) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });
    empty.style.display = visibleCount === 0 ? 'block' : 'none';
    section.querySelector('[data-count]').textContent = visibleCount;
    section.style.display = visibleCount > 0 || selectedCat === 'All' ? '' : 'none';
  });
}

$search.addEventListener('input', applyFilters);
$filter.addEventListener('change', applyFilters);

// Initial render
applyFilters();

// ---------- Modal logic ----------
const $modal = document.getElementById('modal');
const $mdTitle = document.getElementById('md-title');
const $mdCat = document.getElementById('md-cat');
const $mdDesc = document.getElementById('md-desc');
const $mdDocs = document.getElementById('md-docs');
const $mdSource = document.getElementById('md-source');
const $mdClose = document.getElementById('md-close');

function openModal(item) {
  $mdTitle.textContent = item.title;
  $mdCat.textContent = item.category;
  $mdDesc.textContent = item.desc || '';
  $mdDocs.innerHTML = '';
  (item.documents || []).forEach(d => {
    const li = document.createElement('li');
    li.textContent = d;
    $mdDocs.appendChild(li);
  });
  $mdSource.href = item.source || '#';
  $mdSource.textContent = item.source || 'Official portal';
  $modal.classList.add('open');
}

function closeModal(){ $modal.classList.remove('open'); }

addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-open]');
  if (btn) {
    const decoded = decodeURIComponent(btn.getAttribute('data-open'));
    const item = DATA.find(d => d.title === decoded);
    if (item) openModal(item);
  }
});

$mdClose.addEventListener('click', closeModal);
$modal.addEventListener('click', (e) => { if (e.target === $modal) closeModal(); });