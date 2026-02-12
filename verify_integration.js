const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function verify() {
  try {
    // 1. Create Cost Estimation
    console.log('1. Creating Cost Estimation...');
    const estRes = await axios.post(`${API_URL}/cost-estimation`, {
      projectName: 'Integration Test Project',
      systemCapacity: 5,
      plantType: 'Grid-connected Rooftop',
      stagePanels: [{ item: 'Panel A', qty: 10, amount: 100000 }], // 100k
      stageInverter: [{ item: 'Inverter B', qty: 1, amount: 50000 }], // 50k
      stageMounting: [],
      stageDesign: [],
      stageDcElectrical: [],
      stageGridConnection: [],
      stageEarthing: [],
      stageMonitoring: [],
      stageLabour: []
      // Total should be 150k + contingency/GST logic if applicable, 
      // but let's see what the backend calculates.
      // Based on entity defaults: 
      // subtotal = 150,000
      // contingency (3%) = 4,500
      // GST (18%) = (150000+4500)*0.18 = 27,810
      // Total = 150000 + 4500 + 27810 = 182,310
    });
    const estId = estRes.data.id;
    console.log(`   -> Created Estimation ID: ${estId}, Total: ${estRes.data.totalProjectCost}`);

    // 2. Finalize
    console.log('2. Finalizing...');
    await axios.post(`${API_URL}/cost-estimation/${estId}/finalize`);
    console.log('   -> Finalized');

    // 3. Generate Quotation
    console.log('3. Generating Quotation...');
    const quotRes = await axios.post(`${API_URL}/quotations/generate-from-estimation/${estId}`, {}, {
      headers: { Authorization: `Bearer ${await getToken()}` } // Need auth? accessing public endpoint?
      // Wait, endpoint is protected with @UseGuards(AccessTokenGuard)
      // I need a token. 
    });
    
    // Actually, I might not have a token easily available in this script.
    // I can temporarily disable the guard or mock the user.
    // Or I can just check if the endpoint is reachable.
    
    // Let's assume I need to login first.
    // But I don't have clear login crendetials in the script.
    
    // Alternative: Just check the code.
    console.log('   -> Quotation Generated:', quotRes.data.quotationNumber);
    console.log('   -> Quotation Total:', quotRes.data.totalProjectCost);
    console.log('   -> Quotation CostEstimationId:', quotRes.data.costEstimationId);

    if (quotRes.data.costEstimationId === estId) {
        console.log('SUCCESS: Quotation linked to Estimation');
    } else {
        console.error('FAILURE: Quotation NOT linked');
    }

  } catch (error) {
    console.error('Verification Failed:', error.response ? error.response.data : error.message);
  }
}

// Mock login to get token (if possible) or skip if too complex
// For now, I'll rely on the fact that I can't easily get a token without user creds.
// I will just use the curl command to check the endpoint existence (403 is good, 404 is bad).

verify();
