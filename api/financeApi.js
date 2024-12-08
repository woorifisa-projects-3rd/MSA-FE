import { nextClient } from "@/lib/nextClient";
import { PdfnextClient } from "@/lib/PdfnextClient";

export const financeApi = {
    async getTransactionChart(storeId, selectedYear, selectedMonth){
        try{
            const response = await nextClient.get('/finance/analytics/transactionchart', {
                params: { storeId, selectedYear, selectedMonth }
            });
            return {
                success: true,
                data: response.data
            };
        } catch(error){
            const errorMessage = error.response.data.error || '데이터를 불러오는데 실패했습니다.';
            return {
                success: false,
                error: errorMessage
            };
        }

    },

    async generateIncomeStatementPDF(storeId, selectedYear, selectedMonth){
        try{
            const response = await PdfnextClient.post('/finance/analytics/transactionpdf', 
                { storeId, selectedYear, selectedMonth },
                { responseType: 'arraybuffer' }
            );

            return {
                success: true,
                data: response.data
            };
        } catch(error){
            const errorMessage = error.response.data.error || '손익계산서 발급 중 오류가 발생했습니다.';
            return {
                success: false,
                error: errorMessage
            };
        }
    },

    //간편장부 발급
    async generateSimpleLedgerPDF(storeId, selectedYear, selectedMonth, type){
        try{
            const response = await PdfnextClient.post(
                '/finance/analytics/transactionsimplepdf',
                { 
                    storeId, 
                    selectedYear, 
                    selectedMonth, 
                    type 
                },
                { responseType: 'arraybuffer' }
            );

            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || '간편장부 생성 중 오류가 발생했습니다.'
            };
        }
    }
}