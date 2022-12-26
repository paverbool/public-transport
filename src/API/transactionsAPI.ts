import axios from "axios";

export type Transaction = {
    id: number
    doc_vob: string
    doc_vob_name: string
    doc_number: string
    doc_date: string
    doc_v_date: string
    trans_date: string
    amount: number
    amount_cop: number
    currency: string
    payer_edrpou: string
    payer_name: string
    payer_account: string
    payer_mfo: string
    payer_bank: string
    recipt_edrpou: string
    recipt_name: string
    recipt_account: string
    recipt_bank: string
    recipt_mfo: string
    payment_details: string
    doc_add_attr: string
    region_id: number
    payment_type: string
    payment_data: {},
    source_id: number
    source_name: string
    kekv: number
    kpk: string
    contractId: string
    contractNumber: string
    budgetCode: string
};

interface TransactionsAPIResponse {
    count: number
    page: number
    pageSize: number
    transactions: Transaction[]

}

export const transactionsAPI = async () => {

    // const startDate = `2022-09-01`; //todo
    // const endDate = `2022-10-31`; //todo
    const payer = `43927048`; //todo
    const recipt_edrpous = `01270285`; //todo
    const region = 20; // Kharkiv
    const pageSize = 100;

    const queryParams = new URLSearchParams({
        startdate: `2022-09-01`,
        enddate: `2022-10-31`,
        recipt_edrpous: `01270285`,
        region: '20',
        pageSize: '100'
    }).toString();
    console.log(queryParams);

    const {data} = await axios.get<TransactionsAPIResponse>(`http://api.spending.gov.ua/api/v2/api/transactions/page/?${queryParams}`);
    return data
}