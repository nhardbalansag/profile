import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { TbTransfer } from "react-icons/tb";
import { FiSearch } from 'react-icons/fi';

import * as api_account from '../../services/account/account.api.js'

import bankImage from '../../assets/images/ten/bank.png';
import gCashImage from '../../assets/images/ten/GCash.png';
import paypalImage from '../../assets/images/ten/PayPal New 2023.png';
import payNowImage from '../../assets/images/ten/PayNow.png';


const options = [
  { id: "bank", primary_label: "Bank Details", label: <span className="bank_label_id">Bank Transfer</span>, img: bankImage },
  { id: "gcash", primary_label: "Gcash Mobile Number", label: <span className="gcash_label_id">GCash</span>, img: gCashImage },
  { id: "paynow", primary_label: "Mobile Number", label: <span className="paynow_label_id">PayNow</span>, img: payNowImage },
  { id: "paypal", primary_label: "Email Address", label: <span className="paypal_label_id">PayPal</span>, img: paypalImage },
];


// const bankData = [
//   {
//     country: 'Philippines',
//     banks: [
//       'BDO Unibank',
//       'Bank of the Philippine Islands (BPI)',
//       'Metrobank',
//       'Landbank',
//       'Development Bank of the Philippines',
//       'UnionBank',
//       'Security Bank',
//       'Rizal Commercial Banking Corp (RCBC)',
//       'Philippine National Bank (PNB)',
//       'Maya Bank',
//       'Tonik Bank',
//       'GoTyme Bank',
//       'UNO Digital Bank',
//       'CIMB Bank Philippines',
//       'East West Bank',
//       'Citibank Philippines',
//       'Asia United Bank (AUB)',
//       'HSBC Philippines',
//     ],
//   },
//   {
//     country: 'China',
//     banks: [
//       'Industrial and Commercial Bank of China (ICBC)',
//       'China Construction Bank (CCB)',
//       'Agricultural Bank of China (ABC)',
//       'Bank of China (BOC)',
//       'Bank of Communications',
//       'China Merchants Bank',
//       'Postal Savings Bank of China',
//       'Shanghai Pudong Development Bank',
//       'China Minsheng Bank',
//       'Industrial Bank Co., Ltd.',
//       'Huaxia Bank',
//       'Ping An Bank',
//       'China CITIC Bank',
//       'Bank of Beijing',
//       'Bank of Shanghai',
//       'WeBank (Tencent)',
//       'MYbank (Ant Financial)',
//     ],
//   },
//   {
//     country: 'Singapore',
//     banks: [
//       'DBS Bank',
//       'OCBC Bank',
//       'United Overseas Bank (UOB)',
//       'Standard Chartered Bank Singapore',
//       'HSBC Singapore',
//       'Citibank Singapore',
//       'Maybank Singapore',
//       'Bank of China Singapore',
//       'ICBC Singapore',
//       'RHB Bank Singapore',
//       'State Bank of India Singapore',
//       'Bank of America Singapore',
//       'JP Morgan Chase Singapore',
//       'BNP Paribas Singapore',
//       'ANZ Singapore',
//       'MUFG Bank Singapore',
//       'Sumitomo Mitsui Banking Corporation Singapore',
//       'Deutsche Bank Singapore',
//     ],
//   },
//   {
//     country: 'Australia',
//     banks: [
//       'Commonwealth Bank',
//       'Westpac',
//       'ANZ',
//       'National Australia Bank (NAB)',
//       'Macquarie Bank',
//       'Bankwest',
//       'Suncorp Bank',
//       'Bank of Queensland',
//       'Bendigo & Adelaide Bank',
//       'ING Australia',
//       'UBank',
//     ],
//   },
//   {
//     country: 'South Africa',
//     banks: [
//       'Absa Bank',
//       'Capitec Bank',
//       'First National Bank (FNB)',
//       'Nedbank',
//       'Standard Bank',
//       'TymeBank',
//       'Discovery Bank',
//       'African Bank',
//       'Investec',
//     ],
//   },
//   {
//     country: 'Canada',
//     banks: [
//       'Royal Bank of Canada (RBC)',
//       'Toronto-Dominion Bank (TD)',
//       'Bank of Montreal (BMO)',
//       'Scotiabank',
//       'Canadian Imperial Bank of Commerce (CIBC)',
//       'National Bank of Canada',
//       'Laurentian Bank',
//       'EQ Bank',
//       'Simplii Financial',
//     ],
//   },
//   {
//     country: 'Malaysia',
//     banks: [
//       'Maybank',
//       'CIMB Bank',
//       'Public Bank',
//       'RHB Bank',
//       'Hong Leong Bank',
//       'AmBank',
//       'UOB Malaysia',
//       'OCBC Bank (Malaysia)',
//       'HSBC Malaysia',
//       'Bank Islam Malaysia',
//     ],
//   },
//   {
//     country: 'United Kingdom',
//     banks: [
//       'HSBC',
//       'Barclays',
//       'Lloyds Bank',
//       'NatWest',
//       'Royal Bank of Scotland (RBS)',
//       'Standard Chartered',
//       'Santander UK',
//       'Halifax',
//       'TSB Bank',
//       'Monzo',
//       'Revolut',
//       'Starling Bank',
//     ],
//   },
//   {
//     country: 'United States',
//     banks: [
//       'JPMorgan Chase',
//       'Bank of America',
//       'Wells Fargo',
//       'Citibank',
//       'Goldman Sachs',
//       'Morgan Stanley',
//       'U.S. Bank',
//       'PNC Bank',
//       'Capital One',
//       'TD Bank',
//       'Charles Schwab Bank',
//       'Ally Bank',
//       'Chime',
//     ],
//   },
//   {
//     country: 'India',
//     banks: [
//       'State Bank of India (SBI)',
//       'HDFC Bank',
//       'ICICI Bank',
//       'Axis Bank',
//       'Punjab National Bank (PNB)',
//       'Bank of Baroda',
//       'Kotak Mahindra Bank',
//       'Canara Bank',
//       'Union Bank of India',
//       'Yes Bank',
//     ],
//   },
//   {
//     country: 'Germany',
//     banks: [
//       'Deutsche Bank',
//       'Commerzbank',
//       'DZ Bank',
//       'KfW Bank',
//       'UniCredit Bank AG (HypoVereinsbank)',
//       'Postbank',
//       'N26',
//       'ING-DiBa',
//     ],
//   },
//   {
//     country: 'Brazil',
//     banks: [
//       'Banco do Brasil',
//       'Bradesco',
//       'Itaú Unibanco',
//       'Caixa Econômica Federal',
//       'Santander Brasil',
//       'Banco Safra',
//       'Banco Inter',
//       'Nubank',
//     ],
//   },
//   {
//     country: 'United Arab Emirates',
//     banks: [
//       'First Abu Dhabi Bank (FAB)',
//       'Emirates NBD',
//       'Dubai Islamic Bank',
//       'Abu Dhabi Commercial Bank (ADCB)',
//       'Mashreq Bank',
//       'RAKBANK',
//       'Noor Bank',
//     ],
//   },
// ]

const bankData = [
  {
    country: 'Philippines',
    banks: [
      {
        comp: <span className="bdo_unibank" label_id="bdo_unibank">BDO Unibank</span>,
        searchData: "BDO Unibank"
      },
      {
        comp: <span className="bank_of_the_philippine_islands_bpi" label_id="bank_of_the_philippine_islands_bpi">Bank of the Philippine Islands (BPI)</span>,
        searchData: "Bank of the Philippine Islands (BPI)"
      },
      {
        comp: <span className="metrobank" label_id="metrobank">Metrobank</span>,
        searchData: "Metrobank"
      },
      {
        comp: <span className="landbank" label_id="landbank">Landbank</span>,
        searchData: "Landbank"
      },
      {
        comp: <span className="development_bank_of_the_philippines" label_id="development_bank_of_the_philippines">Development Bank of the Philippines</span>,
        searchData: "Development Bank of the Philippines"
      },
      {
        comp: <span className="unionbank" label_id="unionbank">UnionBank</span>,
        searchData: "UnionBank"
      },
      {
        comp: <span className="security_bank" label_id="security_bank">Security Bank</span>,
        searchData: "Security Bank"
      },
      {
        comp: <span className="rizal_commercial_banking_corp_rcbc" label_id="rizal_commercial_banking_corp_rcbc">Rizal Commercial Banking Corp (RCBC)</span>,
        searchData: "Rizal Commercial Banking Corp (RCBC)"
      },
      {
        comp: <span className="philippine_national_bank_pnb" label_id="philippine_national_bank_pnb">Philippine National Bank (PNB)</span>,
        searchData: "Philippine National Bank (PNB)"
      },
      {
        comp: <span className="maya_bank" label_id="maya_bank">Maya Bank</span>,
        searchData: "Maya Bank"
      },
      {
        comp: <span className="tonik_bank" label_id="tonik_bank">Tonik Bank</span>,
        searchData: "Tonik Bank"
      },
      {
        comp: <span className="gotyme_bank" label_id="gotyme_bank">GoTyme Bank</span>,
        searchData: "GoTyme Bank"
      },
      {
        comp: <span className="uno_digital_bank" label_id="uno_digital_bank">UNO Digital Bank</span>,
        searchData: "UNO Digital Bank"
      },
      {
        comp: <span className="cimb_bank_philippines" label_id="cimb_bank_philippines">CIMB Bank Philippines</span>,
        searchData: "CIMB Bank Philippines"
      },
      {
        comp: <span className="east_west_bank" label_id="east_west_bank">East West Bank</span>,
        searchData: "East West Bank"
      },
      {
        comp: <span className="citibank_philippines" label_id="citibank_philippines">Citibank Philippines</span>,
        searchData: "Citibank Philippines"
      },
      {
        comp: <span className="asia_united_bank_aub" label_id="asia_united_bank_aub">Asia United Bank (AUB)</span>,
        searchData: "Asia United Bank (AUB)"
      },
      {
        comp: <span className="hsbc_philippines" label_id="hsbc_philippines">HSBC Philippines</span>,
        searchData: "HSBC Philippines"
      }
    ]
  },
  {
    country: 'China',
    banks: [
      {
        comp: <span className="industrial_and_commercial_bank_of_china_icbc" label_id="industrial_and_commercial_bank_of_china_icbc">Industrial and Commercial Bank of China (ICBC)</span>,
        searchData: "Industrial and Commercial Bank of China (ICBC)"
      },
      {
        comp: <span className="china_construction_bank_ccb" label_id="china_construction_bank_ccb">China Construction Bank (CCB)</span>,
        searchData: "China Construction Bank (CCB)"
      },
      {
        comp: <span className="agricultural_bank_of_china_abc" label_id="agricultural_bank_of_china_abc">Agricultural Bank of China (ABC)</span>,
        searchData: "Agricultural Bank of China (ABC)"
      },
      {
        comp: <span className="bank_of_china_boc" label_id="bank_of_china_boc">Bank of China (BOC)</span>,
        searchData: "Bank of China (BOC)"
      },
      {
        comp: <span className="bank_of_communications" label_id="bank_of_communications">Bank of Communications</span>,
        searchData: "Bank of Communications"
      },
      {
        comp: <span className="china_merchants_bank" label_id="china_merchants_bank">China Merchants Bank</span>,
        searchData: "China Merchants Bank"
      },
      {
        comp: <span className="postal_savings_bank_of_china" label_id="postal_savings_bank_of_china">Postal Savings Bank of China</span>,
        searchData: "Postal Savings Bank of China"
      },
      {
        comp: <span className="shanghai_pudong_development_bank" label_id="shanghai_pudong_development_bank">Shanghai Pudong Development Bank</span>,
        searchData: "Shanghai Pudong Development Bank"
      },
      {
        comp: <span className="china_minsheng_bank" label_id="china_minsheng_bank">China Minsheng Bank</span>,
        searchData: "China Minsheng Bank"
      },
      {
        comp: <span className="industrial_bank_co_ltd" label_id="industrial_bank_co_ltd">Industrial Bank Co., Ltd.</span>,
        searchData: "Industrial Bank Co., Ltd."
      },
      {
        comp: <span className="huaxia_bank" label_id="huaxia_bank">Huaxia Bank</span>,
        searchData: "Huaxia Bank"
      },
      {
        comp: <span className="ping_an_bank" label_id="ping_an_bank">Ping An Bank</span>,
        searchData: "Ping An Bank"
      },
      {
        comp: <span className="china_citic_bank" label_id="china_citic_bank">China CITIC Bank</span>,
        searchData: "China CITIC Bank"
      },
      {
        comp: <span className="bank_of_beijing" label_id="bank_of_beijing">Bank of Beijing</span>,
        searchData: "Bank of Beijing"
      },
      {
        comp: <span className="bank_of_shanghai" label_id="bank_of_shanghai">Bank of Shanghai</span>,
        searchData: "Bank of Shanghai"
      },
      {
        comp: <span className="webank_tencent" label_id="webank_tencent">WeBank (Tencent)</span>,
        searchData: "WeBank (Tencent)"
      },
      {
        comp: <span className="mybank_ant_financial" label_id="mybank_ant_financial">MYbank (Ant Financial)</span>,
        searchData: "MYbank (Ant Financial)"
      }
    ]
  },
  {
    country: 'Singapore',
    banks: [
      {
        comp: <span className="dbs_bank" label_id="dbs_bank">DBS Bank</span>,
        searchData: "DBS Bank"
      },
      {
        comp: <span className="ocbc_bank" label_id="ocbc_bank">OCBC Bank</span>,
        searchData: "OCBC Bank"
      },
      {
        comp: <span className="united_overseas_bank_uob" label_id="united_overseas_bank_uob">United Overseas Bank (UOB)</span>,
        searchData: "United Overseas Bank (UOB)"
      },
      {
        comp: <span className="standard_chartered_bank_singapore" label_id="standard_chartered_bank_singapore">Standard Chartered Bank Singapore</span>,
        searchData: "Standard Chartered Bank Singapore"
      },
      {
        comp: <span className="hsbc_singapore" label_id="hsbc_singapore">HSBC Singapore</span>,
        searchData: "HSBC Singapore"
      },
      {
        comp: <span className="citibank_singapore" label_id="citibank_singapore">Citibank Singapore</span>,
        searchData: "Citibank Singapore"
      },
      {
        comp: <span className="maybank_singapore" label_id="maybank_singapore">Maybank Singapore</span>,
        searchData: "Maybank Singapore"
      },
      {
        comp: <span className="bank_of_china_singapore" label_id="bank_of_china_singapore">Bank of China Singapore</span>,
        searchData: "Bank of China Singapore"
      },
      {
        comp: <span className="icbc_singapore" label_id="icbc_singapore">ICBC Singapore</span>,
        searchData: "ICBC Singapore"
      },
      {
        comp: <span className="rhb_bank_singapore" label_id="rhb_bank_singapore">RHB Bank Singapore</span>,
        searchData: "RHB Bank Singapore"
      },
      {
        comp: <span className="state_bank_of_india_singapore" label_id="state_bank_of_india_singapore">State Bank of India Singapore</span>,
        searchData: "State Bank of India Singapore"
      },
      {
        comp: <span className="bank_of_america_singapore" label_id="bank_of_america_singapore">Bank of America Singapore</span>,
        searchData: "Bank of America Singapore"
      },
      {
        comp: <span className="jp_morgan_chase_singapore" label_id="jp_morgan_chase_singapore">JP Morgan Chase Singapore</span>,
        searchData: "JP Morgan Chase Singapore"
      },
      {
        comp: <span className="bnp_paribas_singapore" label_id="bnp_paribas_singapore">BNP Paribas Singapore</span>,
        searchData: "BNP Paribas Singapore"
      },
      {
        comp: <span className="anz_singapore" label_id="anz_singapore">ANZ Singapore</span>,
        searchData: "ANZ Singapore"
      },
      {
        comp: <span className="mufg_bank_singapore" label_id="mufg_bank_singapore">MUFG Bank Singapore</span>,
        searchData: "MUFG Bank Singapore"
      },
      {
        comp: <span className="sumitomo_mitsui_banking_corporation_singapore" label_id="sumitomo_mitsui_banking_corporation_singapore">Sumitomo Mitsui Banking Corporation Singapore</span>,
        searchData: "Sumitomo Mitsui Banking Corporation Singapore"
      },
      {
        comp: <span className="deutsche_bank_singapore" label_id="deutsche_bank_singapore">Deutsche Bank Singapore</span>,
        searchData: "Deutsche Bank Singapore"
      }
    ]
  },
  {
    country: 'Australia',
    banks: [
      {
        comp: <span className="commonwealth_bank" label_id="commonwealth_bank">Commonwealth Bank</span>,
        searchData: "Commonwealth Bank"
      },
      {
        comp: <span className="westpac" label_id="westpac">Westpac</span>,
        searchData: "Westpac"
      },
      {
        comp: <span className="anz" label_id="anz">ANZ</span>,
        searchData: "ANZ"
      },
      {
        comp: <span className="national_australia_bank_nab" label_id="national_australia_bank_nab">National Australia Bank (NAB)</span>,
        searchData: "National Australia Bank (NAB)"
      },
      {
        comp: <span className="macquarie_bank" label_id="macquarie_bank">Macquarie Bank</span>,
        searchData: "Macquarie Bank"
      },
      {
        comp: <span className="bankwest" label_id="bankwest">Bankwest</span>,
        searchData: "Bankwest"
      },
      {
        comp: <span className="suncorp_bank" label_id="suncorp_bank">Suncorp Bank</span>,
        searchData: "Suncorp Bank"
      },
      {
        comp: <span className="bank_of_queensland" label_id="bank_of_queensland">Bank of Queensland</span>,
        searchData: "Bank of Queensland"
      },
      {
        comp: <span className="bendigo_adelaide_bank" label_id="bendigo_adelaide_bank">Bendigo & Adelaide Bank</span>,
        searchData: "Bendigo & Adelaide Bank"
      },
      {
        comp: <span className="ing_australia" label_id="ing_australia">ING Australia</span>,
        searchData: "ING Australia"
      },
      {
        comp: <span className="ubank" label_id="ubank">UBank</span>,
        searchData: "UBank"
      }
    ]
  },
  {
    country: 'South Africa',
    banks: [
      {
        comp: <span className="absa_bank" label_id="absa_bank">Absa Bank</span>,
        searchData: "Absa Bank"
      },
      {
        comp: <span className="capitec_bank" label_id="capitec_bank">Capitec Bank</span>,
        searchData: "Capitec Bank"
      },
      {
        comp: <span className="first_national_bank_fnb" label_id="first_national_bank_fnb">First National Bank (FNB)</span>,
        searchData: "First National Bank (FNB)"
      },
      {
        comp: <span className="nedbank" label_id="nedbank">Nedbank</span>,
        searchData: "Nedbank"
      },
      {
        comp: <span className="standard_bank" label_id="standard_bank">Standard Bank</span>,
        searchData: "Standard Bank"
      },
      {
        comp: <span className="tymebank" label_id="tymebank">TymeBank</span>,
        searchData: "TymeBank"
      },
      {
        comp: <span className="discovery_bank" label_id="discovery_bank">Discovery Bank</span>,
        searchData: "Discovery Bank"
      },
      {
        comp: <span className="african_bank" label_id="african_bank">African Bank</span>,
        searchData: "African Bank"
      },
      {
        comp: <span className="investec" label_id="investec">Investec</span>,
        searchData: "Investec"
      }
    ]
  },
  {
    country: 'Canada',
    banks: [
      {
        comp: <span className="royal_bank_of_canada_rbc" label_id="royal_bank_of_canada_rbc">Royal Bank of Canada (RBC)</span>,
        searchData: "Royal Bank of Canada (RBC)"
      },
      {
        comp: <span className="toronto_dominion_bank_td" label_id="toronto_dominion_bank_td">Toronto-Dominion Bank (TD)</span>,
        searchData: "Toronto-Dominion Bank (TD)"
      },
      {
        comp: <span className="bank_of_montreal_bmo" label_id="bank_of_montreal_bmo">Bank of Montreal (BMO)</span>,
        searchData: "Bank of Montreal (BMO)"
      },
      {
        comp: <span className="scotiabank" label_id="scotiabank">Scotiabank</span>,
        searchData: "Scotiabank"
      },
      {
        comp: <span className="canadian_imperial_bank_of_commerce_cibc" label_id="canadian_imperial_bank_of_commerce_cibc">Canadian Imperial Bank of Commerce (CIBC)</span>,
        searchData: "Canadian Imperial Bank of Commerce (CIBC)"
      },
      {
        comp: <span className="national_bank_of_canada" label_id="national_bank_of_canada">National Bank of Canada</span>,
        searchData: "National Bank of Canada"
      },
      {
        comp: <span className="laurentian_bank" label_id="laurentian_bank">Laurentian Bank</span>,
        searchData: "Laurentian Bank"
      },
      {
        comp: <span className="eq_bank" label_id="eq_bank">EQ Bank</span>,
        searchData: "EQ Bank"
      },
      {
        comp: <span className="simplii_financial" label_id="simplii_financial">Simplii Financial</span>,
        searchData: "Simplii Financial"
      }
    ]
  },
  {
    country: 'Malaysia',
    banks: [
      {
        comp: <span className="maybank" label_id="maybank">Maybank</span>,
        searchData: "Maybank"
      },
      {
        comp: <span className="cimb_bank" label_id="cimb_bank">CIMB Bank</span>,
        searchData: "CIMB Bank"
      },
      {
        comp: <span className="public_bank" label_id="public_bank">Public Bank</span>,
        searchData: "Public Bank"
      },
      {
        comp: <span className="rhb_bank" label_id="rhb_bank">RHB Bank</span>,
        searchData: "RHB Bank"
      },
      {
        comp: <span className="hong_leong_bank" label_id="hong_leong_bank">Hong Leong Bank</span>,
        searchData: "Hong Leong Bank"
      },
      {
        comp: <span className="ambank" label_id="ambank">AmBank</span>,
        searchData: "AmBank"
      },
      {
        comp: <span className="uob_malaysia" label_id="uob_malaysia">UOB Malaysia</span>,
        searchData: "UOB Malaysia"
      },
      {
        comp: <span className="ocbc_bank_malaysia" label_id="ocbc_bank_malaysia">OCBC Bank (Malaysia)</span>,
        searchData: "OCBC Bank (Malaysia)"
      },
      {
        comp: <span className="hsbc_malaysia" label_id="hsbc_malaysia">HSBC Malaysia</span>,
        searchData: "HSBC Malaysia"
      },
      {
        comp: <span className="bank_islam_malaysia" label_id="bank_islam_malaysia">Bank Islam Malaysia</span>,
        searchData: "Bank Islam Malaysia"
      }
    ]
  },
  {
    country: 'United Kingdom',
    banks: [
      {
        comp: <span className="hsbc" label_id="hsbc">HSBC</span>,
        searchData: "HSBC"
      },
      {
        comp: <span className="barclays" label_id="barclays">Barclays</span>,
        searchData: "Barclays"
      },
      {
        comp: <span className="lloyds_bank" label_id="lloyds_bank">Lloyds Bank</span>,
        searchData: "Lloyds Bank"
      },
      {
        comp: <span className="natwest" label_id="natwest">NatWest</span>,
        searchData: "NatWest"
      },
      {
        comp: <span className="royal_bank_of_scotland_rbs" label_id="royal_bank_of_scotland_rbs">Royal Bank of Scotland (RBS)</span>,
        searchData: "Royal Bank of Scotland (RBS)"
      },
      {
        comp: <span className="standard_chartered" label_id="standard_chartered">Standard Chartered</span>,
        searchData: "Standard Chartered"
      },
      {
        comp: <span className="santander_uk" label_id="santander_uk">Santander UK</span>,
        searchData: "Santander UK"
      },
      {
        comp: <span className="halifax" label_id="halifax">Halifax</span>,
        searchData: "Halifax"
      },
      {
        comp: <span className="tsb_bank" label_id="tsb_bank">TSB Bank</span>,
        searchData: "TSB Bank"
      },
      {
        comp: <span className="monzo" label_id="monzo">Monzo</span>,
        searchData: "Monzo"
      },
      {
        comp: <span className="revolut" label_id="revolut">Revolut</span>,
        searchData: "Revolut"
      },
      {
        comp: <span className="starling_bank" label_id="starling_bank">Starling Bank</span>,
        searchData: "Starling Bank"
      }
    ]
  },
  {
    country: 'United States',
    banks: [
      {
        comp: <span className="jpmorgan_chase" label_id="jpmorgan_chase">JPMorgan Chase</span>,
        searchData: "JPMorgan Chase"
      },
      {
        comp: <span className="bank_of_america" label_id="bank_of_america">Bank of America</span>,
        searchData: "Bank of America"
      },
      {
        comp: <span className="wells_fargo" label_id="wells_fargo">Wells Fargo</span>,
        searchData: "Wells Fargo"
      },
      {
        comp: <span className="citibank" label_id="citibank">Citibank</span>,
        searchData: "Citibank"
      },
      {
        comp: <span className="goldman_sachs" label_id="goldman_sachs">Goldman Sachs</span>,
        searchData: "Goldman Sachs"
      },
      {
        comp: <span className="morgan_stanley" label_id="morgan_stanley">Morgan Stanley</span>,
        searchData: "Morgan Stanley"
      },
      {
        comp: <span className="us_bank" label_id="us_bank">U.S. Bank</span>,
        searchData: "U.S. Bank"
      },
      {
        comp: <span className="pnc_bank" label_id="pnc_bank">PNC Bank</span>,
        searchData: "PNC Bank"
      },
      {
        comp: <span className="capital_one" label_id="capital_one">Capital One</span>,
        searchData: "Capital One"
      },
      {
        comp: <span className="td_bank" label_id="td_bank">TD Bank</span>,
        searchData: "TD Bank"
      },
      {
        comp: <span className="charles_schwab_bank" label_id="charles_schwab_bank">Charles Schwab Bank</span>,
        searchData: "Charles Schwab Bank"
      },
      {
        comp: <span className="ally_bank" label_id="ally_bank">Ally Bank</span>,
        searchData: "Ally Bank"
      },
      {
        comp: <span className="chime" label_id="chime">Chime</span>,
        searchData: "Chime"
      }
    ]
  },
  {
    country: 'India',
    banks: [
      {
        comp: <span className="state_bank_of_india_sbi" label_id="state_bank_of_india_sbi">State Bank of India (SBI)</span>,
        searchData: "State Bank of India (SBI)"
      },
      {
        comp: <span className="hdfc_bank" label_id="hdfc_bank">HDFC Bank</span>,
        searchData: "HDFC Bank"
      },
      {
        comp: <span className="icici_bank" label_id="icici_bank">ICICI Bank</span>,
        searchData: "ICICI Bank"
      },
      {
        comp: <span className="axis_bank" label_id="axis_bank">Axis Bank</span>,
        searchData: "Axis Bank"
      },
      {
        comp: <span className="punjab_national_bank_pnb" label_id="punjab_national_bank_pnb">Punjab National Bank (PNB)</span>,
        searchData: "Punjab National Bank (PNB)"
      },
      {
        comp: <span className="bank_of_baroda" label_id="bank_of_baroda">Bank of Baroda</span>,
        searchData: "Bank of Baroda"
      },
      {
        comp: <span className="kotak_mahindra_bank" label_id="kotak_mahindra_bank">Kotak Mahindra Bank</span>,
        searchData: "Kotak Mahindra Bank"
      },
      {
        comp: <span className="canara_bank" label_id="canara_bank">Canara Bank</span>,
        searchData: "Canara Bank"
      },
      {
        comp: <span className="union_bank_of_india" label_id="union_bank_of_india">Union Bank of India</span>,
        searchData: "Union Bank of India"
      },
      {
        comp: <span className="yes_bank" label_id="yes_bank">Yes Bank</span>,
        searchData: "Yes Bank"
      }
    ]
  },
  {
    country: 'Germany',
    banks: [
      {
        comp: <span className="deutsche_bank" label_id="deutsche_bank">Deutsche Bank</span>,
        searchData: "Deutsche Bank"
      },
      {
        comp: <span className="commerzbank" label_id="commerzbank">Commerzbank</span>,
        searchData: "Commerzbank"
      },
      {
        comp: <span className="dz_bank" label_id="dz_bank">DZ Bank</span>,
        searchData: "DZ Bank"
      },
      {
        comp: <span className="kfw_bank" label_id="kfw_bank">KfW Bank</span>,
        searchData: "KfW Bank"
      },
      {
        comp: <span className="unicredit_bank_ag_hypovereinsbank" label_id="unicredit_bank_ag_hypovereinsbank">UniCredit Bank AG (HypoVereinsbank)</span>,
        searchData: "UniCredit Bank AG (HypoVereinsbank)"
      },
      {
        comp: <span className="postbank" label_id="postbank">Postbank</span>,
        searchData: "Postbank"
      },
      {
        comp: <span className="n26" label_id="n26">N26</span>,
        searchData: "N26"
      },
      {
        comp: <span className="ing_diba" label_id="ing_diba">ING-DiBa</span>,
        searchData: "ING-DiBa"
      }
    ]
  },
  {
    country: 'Brazil',
    banks: [
      {
        comp: <span className="banco_do_brasil" label_id="banco_do_brasil">Banco do Brasil</span>,
        searchData: "Banco do Brasil"
      },
      {
        comp: <span className="bradesco" label_id="bradesco">Bradesco</span>,
        searchData: "Bradesco"
      },
      {
        comp: <span className="itau_unibanco" label_id="itau_unibanco">Itaú Unibanco</span>,
        searchData: "Itaú Unibanco"
      },
      {
        comp: <span className="caixa_economica_federal" label_id="caixa_economica_federal">Caixa Econômica Federal</span>,
        searchData: "Caixa Econômica Federal"
      },
      {
        comp: <span className="santander_brasil" label_id="santander_brasil">Santander Brasil</span>,
        searchData: "Santander Brasil"
      },
      {
        comp: <span className="banco_safra" label_id="banco_safra">Banco Safra</span>,
        searchData: "Banco Safra"
      },
      {
        comp: <span className="banco_inter" label_id="banco_inter">Banco Inter</span>,
        searchData: "Banco Inter"
      },
      {
        comp: <span className="nubank" label_id="nubank">Nubank</span>,
        searchData: "Nubank"
      }
    ]
  },
  {
    country: 'United Arab Emirates',
    banks: [
      {
        comp: <span className="first_abu_dhabi_bank_fab" label_id="first_abu_dhabi_bank_fab">First Abu Dhabi Bank (FAB)</span>,
        searchData: "First Abu Dhabi Bank (FAB)"
      },
      {
        comp: <span className="emirates_nbd" label_id="emirates_nbd">Emirates NBD</span>,
        searchData: "Emirates NBD"
      },
      {
        comp: <span className="dubai_islamic_bank" label_id="dubai_islamic_bank">Dubai Islamic Bank</span>,
        searchData: "Dubai Islamic Bank"
      },
      {
        comp: <span className="abu_dhabi_commercial_bank_adcb" label_id="abu_dhabi_commercial_bank_adcb">Abu Dhabi Commercial Bank (ADCB)</span>,
        searchData: "Abu Dhabi Commercial Bank (ADCB)"
      },
      {
        comp: <span className="mashreq_bank" label_id="mashreq_bank">Mashreq Bank</span>,
        searchData: "Mashreq Bank"
      },
      {
        comp: <span className="rakbank" label_id="rakbank">RAKBANK</span>,
        searchData: "RAKBANK"
      },
      {
        comp: <span className="noor_bank" label_id="noor_bank">Noor Bank</span>,
        searchData: "Noor Bank"
      }
    ]
  }
]

const AccountWithdrawTBucks = () =>{

  const navigate = useNavigate();

  const auth_states = useSelector(state => state.AuthReducer);

  const selectedLanguage = useRef(auth_states.SelectedLanguage ? auth_states.SelectedLanguage.id : null)  // null means main translation is used

  const inputsRef = useRef([]);

  const setDigits = useRef(["", "", "", ""]);
  const setPin = useRef("");

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [selected, setSelected] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [getAccountDetailsToTransfer, setAccountDetailsToTransfer] = useState(null);
  const [walletData, setWalletData] = useState({
    t_points: 0,
    t_bucks: 0,
    AccountTransaction:[]
  });

  const initialFormData = {
    amount: 0,
    account_number: "",
    pin: "",
    bank: "",
    branch: "",
    address: "",
    account_name: "",
    swift_code: "",
  }

  const [getFormData, setFormData] = useState(initialFormData)

  const processSequence = ['withdrawal_option', 'amount',  'account_number', 'review', 'pin']

  const [currentActiveProcess, setCurrentActiveProcess] = useState(0);
  const [getProcess, setProcess] = useState({
    withdrawal_option : true,
    amount  : false,
    account_number : false,
    review : false,
    pin : false,
  })

  const transfer = async() => {

    const params = {
      reference:{
        type: "withdraw",
        wallet_type: "t-bucks",
        amount: getFormData.amount,
        account_number: getFormData.account_number,
        account_name: getFormData.account_name,
        bank: selectedBank ? selectedBank : selected,
        branch: getFormData.branch,
        address: getFormData.address,
        swift_code: getFormData.swift_code
      }
    }

    const reqBody = {
      account_number: getFormData.account_number,
      amount: getFormData.amount,
      pin: setPin.current,
      params: params
    }

    if (
      !getFormData.account_number || 
      !getFormData.amount) {
      return;
    }

    if(getFormData.amount > walletData.t_points){
      return;
    }

    setLoadingContent(true)
    await api_account.WithdrawTBucks(auth_states.StateToken, reqBody).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        setCurrentActiveProcess(0)
        navigate('/account')
      }
      
      setLoadingContent(false)

    }).catch((err) =>{
      setLoadingContent(false)
    })
  }

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  }

  const handleNext = () => {

    setProcess((prevFormData) => ({
      ...prevFormData,
      [processSequence[currentActiveProcess]]: false
    }))

    setProcess((prevFormData) => ({
      ...prevFormData,
      [processSequence[currentActiveProcess + 1]]: true
    }))

    setCurrentActiveProcess(prev => (prev + 1))
  }

  const handlePrevious = () => {

    setProcess((prevFormData) => ({
      ...prevFormData,
      [processSequence[currentActiveProcess]]: false
    }))

    setProcess((prevFormData) => ({
      ...prevFormData,
      [processSequence[currentActiveProcess - 1]]: true
    }))

    setCurrentActiveProcess(prev => (prev - 1))
  }

  const getTBucksAndTPoints = async() =>{
    setLoadingContent(true)
    await api_account.getTBucksAndTPoints(auth_states.StateToken).then((result) =>{
      if(result.status){
        setLoadingContent(false)
        // setWalletData(result.data.data)
        Object.keys(result.data.data).map((item, key) =>{
          setWalletData((prev) => ({
            ...prev,
            [item]: result.data.data[item]
          }));
        })
      }
      
      setLoadingContent(false)

    }).catch((err) =>{
      setLoadingContent(false)
    })
  }

  const _Buttons = ({title, icon, hasBG=true, onPressAction}) =>{
    return(
      <button onClick={onPressAction} className={`${hasBG ? 'bg-white btn shadow-sm rounded-xl' : "flex flex-col items-center justify-center h-[130px] bg-transparent"} `}>
        {
          icon &&
          <div className={`bg-blue-600 p-2 flex justify-center text-xl w-[35px] h-[35px] font-bold text-white  rounded-full`}>
            {icon}
          </div>
        }
        <p className="mt-1 text-sm capitalize">{title}</p>
      </button>
    )
  }

  const _WalletCard = (title, amount, buttons = []) =>{
    return(
      <div className="w-[95%] border rounded-2xl p-5 bg-white shadow-lg space-y-3 relative z-0">
        <p className="text-[18px] md:text-[25px] uppercase font-semibold">{title}</p>
        <div>
          <p className="text-[15px] md:text-[18px] capitalize balance_label_id">balance</p>
          <p className="text-[20px] md:text-[40px] font-bold">{parseFloat(amount)}</p>
        </div>
        <div className="my-5">  
          <div className="flex items-center justify-start space-x-5">
            {
              buttons.map((item, index) => (
                <_Buttons 
                onPressAction={item.onPressAction}
                icon={item.icon} 
                title={item.title} />
              ))
            }
          </div>
        </div>
      </div>
    )
  }

  const BankSearchDropdown = () => {

    // Flatten and filter all banks
    const filteredBanks = bankData
    .flatMap(({ country, banks }) =>
      banks
        .filter((bank) =>
          bank.searchData.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((bank) => ({ country, bank }))
    )

    return (
      <div className="">
        <label className="block mb-2 text-sm font-medium text-gray-700 search_for_your_bank_label_id">
          Search for your bank
        </label>

        <div className="relative">
          <FiSearch className="absolute text-gray-400 top-3 left-3" />
          <input
            type="text"
            placeholder="Type bank name..."
            className="w-full py-2 pl-10 pr-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 type_bank_name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchTerm && (
          <ul className="mt-2 overflow-y-auto bg-white border rounded-lg shadow max-h-60">
            {filteredBanks.length === 0 ? (
              <li className="p-2 text-sm text-gray-500 no_results_found_label_id">No results found.</li>
            ) : (
              filteredBanks.map(({ country, bank }) => (
                <li
                  key={`${country}-${bank.searchData}`}
                  className="p-2 text-sm cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setSelectedBank(`${bank.searchData} (${country})`);
                    setSearchTerm('');
                  }}
                >
                  <p className="font-medium">{bank.comp}</p>
                  <span className="ml-2 text-xs text-gray-500">({country})</span>
                </li>
              ))
            )}
          </ul>
        )}

        {selectedBank && (
          <p className="mt-4 space-x-1 font-semibold text-green-600">
            <span className='selected_bank_label_id'>Selected Bank</span>
            <span>:</span>
            <span>{selectedBank}</span>
          </p>
        )}
      </div>
    )
  }

  const TopUp = () => {
    return (
      <div className="w-full font-sans">
        <div className="flex items-center mb-4 space-x-3">
          <p className="text-gray-500 balance_label_id">Balance:</p>
          <p className="text-xl font-bold">
            {
              (walletData.t_bucks - getFormData.amount)
            }
          </p>
        </div>

        <div className="mb-4 ">
          {/* <p className="my-2 text-3xl font-bold">{selectedAmount.toFixed(2)}</p> */}

          {
            getProcess.pin &&
            <div className='space-y-5'>
              <p className="font-semibold pin_label_id">PIN</p>
              {PinInput()}
            </div>
          }
          
          {
            getProcess.amount &&
            <div className='space-y-5'>
              <p className="font-semibold amount_label_id">Amount</p>
              <input
                type="number"
                placeholder="0"
                className="w-[100%] focus:outline-none focus:border-black border-b-[3px] border-gray font-bold text-[50px]"
                name='amount'
                value={getFormData.amount} 
                onChange={handleChange}
              />
            </div>
          }

          {
            getProcess.withdrawal_option &&
            <div className='space-y-5'>
              <p className="font-semibold withdrawal_option_label_id">Withdrawal Option</p>
              <div>
                <div className="grid grid-cols-2 gap-4">
                  {options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setSelected(option.id)}
                      className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center 
                        ${selected === option.id ? "border-blue-500 shadow-lg" : "border-gray-200"}`}
                    >
                      <img src={option.img} alt={option.label} />
                      <p className="text-sm">{option.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          }

          {
            getProcess.account_number &&
            <div className='space-y-5'>
              <p className="font-semibold">
                {
                  options.find(item => selected ===item.id)?.primary_label || <span className='account_details_label_id'>Account Details</span>
                }
              </p>

              {
                selected === "bank" &&
                <div className='space-y-3'>
                  {BankSearchDropdown()}
                  
                  <label className="block text-sm font-medium text-gray-700 branch_label_id">
                    Branch
                  </label>
                  <input
                    type="text"
                    className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                    name='branch'
                    value={getFormData.branch} 
                    onChange={handleChange}
                  />

                  <label className="block text-sm font-medium text-gray-700 bank_address_label_id">
                    Bank Address
                  </label>
                  <input
                    type="text"
                    className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                    name='address'
                    value={getFormData.address} 
                    onChange={handleChange}
                  />
                  
                  <label className="block text-sm font-medium text-gray-700 account_number_label_id">
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                    name='account_number'
                    value={getFormData.account_number} 
                    onChange={handleChange}
                  />

                  <label className="block text-sm font-medium text-gray-700 swift_code_label_id">
                    SWIFT Code
                  </label>
                  <input
                    type="text"
                    className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                    name='swift_code'
                    value={getFormData.swift_code} 
                    onChange={handleChange}
                  />
                </div>
              }
              
              {
                selected !== "bank" &&
                <input
                  type="text"
                  placeholder=""
                  className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                  name='account_number'
                  value={getFormData.account_number} 
                  onChange={handleChange}
                />
              }

              <label className="block text-sm font-medium text-gray-700 account_name_label_id">
                Account Name
              </label>
              <input
                type="text"
                className="w-[100%] focus:outline-none focus:border-black border-b-[1px] border-gray text-[18px]"
                name='account_name'
                value={getFormData.account_name} 
                onChange={handleChange}
              />
              
            </div>
          }

          {
            getProcess.review &&
            <div className='space-y-5'>
              <p className="font-semibold transaction_details_label_id">Transaction Details</p>
                <div className='grid grid-cols-2 gap-2'>

                  <p className='text-gray-500 capitalize transaction_type_label_id'>transaction type</p>
                  <p className='capitalize withdraw_label_id'>withdraw</p>

                  <p className='text-gray-500 capitalize wallet_type_label_id'>wallet type</p>
                  <p className='uppercase t_bucks_label_id'>t-bucks</p>

                  <p className='text-gray-500 capitalize amount_label_id'>amount</p>
                  <p className='capitalize'>{getFormData.amount}</p>

                  <p className='text-gray-500 capitalize account_number_label_id'>account number</p>
                  <p className='uppercase'>{`${getFormData.account_number}`}</p>

                  <p className='text-gray-500 capitalize account_name_label_id'>account name</p>
                  <p className='uppercase'>
                  <p className='uppercase'>{`${getFormData.account_name}`}</p>
                  </p>
                </div>

                {
                  selected == "bank" &&
                  <div className='grid grid-cols-2 gap-2'>
                    <p className='text-gray-500 capitalize bank_label_id'>bank</p>
                    <p className='uppercase'>{`${selectedBank}`}</p>
                  </div>
                }

                {
                  selected == "bank" &&
                  <div className='grid grid-cols-2 gap-2'>
                    <p className='text-gray-500 capitalize branch_label_id'>branch</p>
                    <p className='uppercase'>{`${getFormData.branch}`}</p>
                  </div>
                }

                {
                  selected == "bank" &&
                  <div className='grid grid-cols-2 gap-2'>
                    <p className='text-gray-500 capitalize address_label_id'>address</p>
                    <p className='uppercase'>{`${getFormData.address}`}</p>
                  </div>
                }

                {
                  selected == "bank" &&
                  <div className='grid grid-cols-2 gap-2'>
                    <p className='text-gray-500 capitalize swift_code_label_id'>SWIFT Code</p>
                    <p className='uppercase'>{`${getFormData.swift_code}`}</p>
                  </div>
                }
            </div>
          }
        </div>
        <div className='space-y-3'>
          {
            currentActiveProcess > 0 &&
            <button 
              onClick={() => handlePrevious()}
              className="w-full py-3 text-white bg-blue-600 rounded-xl previous_label_id">
              Previous
            </button>
          }
          {
            processSequence.length - 1 == currentActiveProcess
            ?
              <button 
                disabled={loadingContent}
                onClick={() => transfer()}
                className="w-full py-3 text-white bg-blue-600 rounded-xl">
                {
                  loadingContent
                  ? <span className='processing_label_id'>Processing</span>
                  : <span className='submit_request_label_id'>Submit Request</span>
                }
              </button>
            :
              <button 
                onClick={() => {
                  handleNext();
                }}
                className="w-full py-3 text-white bg-blue-600 rounded-xl next_label_id">
                Next
              </button>
          }
          
        </div>
      </div>
    )
  }

  const PinInput = () => {

    const handlePinInputChange = (e, index) => {
      const value = e.target.value;
      if (!/^\d?$/.test(value)) return; // only digits allowed

      const updatedDigits = [...setDigits.current];
      updatedDigits[index] = value;
      setDigits.current = updatedDigits;

      e.target.value = value;
      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }

      // Check if all inputs are filled
      if (updatedDigits.every((digit) => digit !== "")) {
        setPin.current = updatedDigits.join("");
      }
    }

    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }

    return (
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <input
            key={i}
            type="number"
            maxLength="1"
            className="w-12 h-12 text-xl text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handlePinInputChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            ref={(el) => (inputsRef.current[i] = el)}
          />
        ))}
      </div>
    )
  }

  useEffect(() =>{
    auth_states.PageLanguages.map((item, key) =>{
      const translation = item.translation
      
      if(translation.length > 0 && auth_states.SelectedLanguage){
        const filteredTranslation = translation.find(translation_item => translation_item.language_id == auth_states.SelectedLanguage.id)
        const targetElement = document.getElementsByClassName(item.page_config_id)
        if (targetElement) {
          if (targetElement.length > 0 && filteredTranslation) {
            Array.from(targetElement).forEach((el) => {
              el.textContent = filteredTranslation.page_config_title;
            });

            Array.from(targetElement).forEach((el) => {
              el.setAttribute(
                'placeholder',
                filteredTranslation?.page_config_title || item.page_config_title
              );
            });
            
          } else if (targetElement.length > 0) {
            Array.from(targetElement).forEach((el) => {
              el.textContent = item.page_config_title;
            });

            Array.from(targetElement).forEach((el) => {
              el.setAttribute(
                'placeholder',
                item.page_config_title
              );
            });
          }
        }
      }
    })
  },[auth_states, loadingContent, getAccountDetailsToTransfer, currentActiveProcess, getFormData, walletData, getProcess, searchTerm, selectedBank])

  useEffect(() =>{
    if(auth_states.SelectedLanguage){
      selectedLanguage.current = parseInt(auth_states.SelectedLanguage.id)
      // userSubscriptionCategories()
    }
  },[auth_states])
    

  useEffect(() => {
    getTBucksAndTPoints()
  },[])

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [getProcess.pin])

  useEffect(() => {
    if((walletData.t_bucks - getFormData.amount) < 0 || getFormData.amount < 0){
      setFormData((prevFormData) => ({
        ...prevFormData,
        ['amount']: 0
      }))
    }
  }, [getFormData.amount]);

  useEffect(() => {
    setFormData(initialFormData);
  }, [selected]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 mb-10 md:grid-cols-2">
        {TopUp()}

        <div className="flex items-center justify-center mb-5">
            {
            loadingContent
            ?
              <div className='w-full'>
                <div className="flex flex-col justify-center w-full gap-4 py-10">
                  <div className="w-full h-32 skeleton"></div>
                  <div className='flex items-center justify-between p-5'>
                    <div className="h-4 skeleton w-28"></div>
                    <div className="h-4 skeleton w-28"></div>
                  </div>
                </div>
              </div>
            :
              _WalletCard(
                <span className='t_bucks_label_id'>t-bucks</span>,
                walletData.t_bucks,
                [
                  {
                    onPressAction: () => navigate('/t-bucks-transfer'),
                    title: <span className='transfer_label_id'>Transfer</span>,
                    icon: <TbTransfer className="text-[20px] text-white" />
                  }
                ]
              )
          }
        </div>
      </div>
    </div>  
  ) 
}

export default AccountWithdrawTBucks
