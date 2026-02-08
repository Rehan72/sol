const BASE_URL = 'http://localhost:3001/api'; // Changed to port 3001 due to 3000 being busy

async function runVerification() {
    try {
        console.log('--- Starting Verification ---');

        // 0. Login to get valid User ID
        console.log('0. Logging in...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'superAdmin@gmail.com', password: 'SuperAdmin@123' })
        });

        if (!loginRes.ok) throw new Error(`Login Failed: ${loginRes.status} ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.access_token;

        // Decode JWT to get User ID (payload is the 2nd part)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const userId = payload.sub || payload.id;
        console.log(`   Logged in! User ID: ${userId}`);

        // 1. Create Survey
        console.log('1. Creating Survey...');
        const surveyData = {
            surveyorId: userId,
            customerName: 'Test Customer',
            averageMonthlyUnits: 500,
            status: 'DRAFT'
        };

        const createSurveyRes = await fetch(`${BASE_URL}/surveys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(surveyData)
        });

        if (!createSurveyRes.ok) throw new Error(`Create Survey Failed: ${createSurveyRes.status}`);
        const survey = await createSurveyRes.json();
        const surveyId = survey.id;
        console.log(`   Survey Created! ID: ${surveyId}`);

        // 2. Complete Survey (Triggers Auto-Flow)
        console.log('2. Completing Survey...');
        const completeRes = await fetch(`${BASE_URL}/surveys/${surveyId}/complete`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!completeRes.ok) throw new Error(`Complete Survey Failed: ${completeRes.status}`);
        console.log('   Survey Completed!');

        // 3. Verify Quotation Creation
        console.log('3. Checking for Quotation...');
        // Wait a bit for async processing if any (though it's awaited in controller)
        await new Promise(resolve => setTimeout(resolve, 2000));

        const quotationsRes = await fetch(`${BASE_URL}/quotations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!quotationsRes.ok) throw new Error(`Get Quotations Failed: ${quotationsRes.status}`);

        const quotations = await quotationsRes.json();
        const quotation = quotations.find(q => q.survey && q.survey.id === surveyId);

        if (quotation) {
            console.log(`   Quotation Found! ID: ${quotation.id}, Capacity: ${quotation.proposedSystemCapacity}kW, Cost: ${quotation.totalProjectCost}`);
        } else {
            console.error('   FAILED: Quotation not found for survey.');
            return;
        }

        // 4. Generate PDF
        console.log('4. Generating PDF...');
        const pdfRes = await fetch(`${BASE_URL}/quotations/${quotation.id}/pdf`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!pdfRes.ok) throw new Error(`Generate PDF Failed: ${pdfRes.status}`);

        const pdfData = await pdfRes.json();
        if (pdfData.base64) {
            console.log('   PDF Generated successfully (Base64 received).');
        } else if (pdfData.url) {
            console.log('   PDF Generated successfully (URL received).');
        } else {
            console.error('   FAILED: PDF generation returned invalid response.');
            console.log(pdfData);
        }

        console.log('--- Verification SUCCESS ---');

    } catch (error) {
        console.error('--- Verification FAILED ---');
        console.error(error.message);
    }
}

runVerification();
