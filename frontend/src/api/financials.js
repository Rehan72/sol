import client from "./client";

export const analyzeFinancials = async (capacity, cost, tariff) => {
    const response = await client.get(`/financials/analyze`, {
        params: { capacity, cost, tariff }
    });
    return response.data;
};

export const getEnvironmentalImpact = async (capacity) => {
    const response = await client.get(`/financials/environmental-impact`, {
        params: { capacity }
    });
    return response.data;
};
