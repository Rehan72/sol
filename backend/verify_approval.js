const BASE_URL = 'http://localhost:3001/api';

async function runVerification() {
    try {
        console.log('--- Starting Approval Workflow Verification ---');

        // 1. Login as SuperAdmin
        console.log('1. Logging in as SuperAdmin...');
        const superRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'superAdmin@gmail.com', password: 'SuperAdmin@123' })
        });
        if (!superRes.ok) throw new Error('SuperAdmin Login Failed');
        const superToken = (await superRes.json()).access_token;
        console.log('   SuperAdmin Logged In.');

        // 2. Create Users (PlantAdmin, RegionAdmin)
        // Helper to create user if not exists (using register/auth or seed approach? Auth register is for customers usually)
        // We'll use EmployeesController if available or direct register endpoint if it supports roles.
        // Checking AuthController... registerCustomer sets Role.CUSTOMER. 
        // SuperAdmin should be able to create employees via EmployeesController.

        // Let's assume we can create employees.
        const createEmployee = async (name, email, role, password) => {
            console.log(`   Creating ${role}: ${email}...`);
            const res = await fetch(`${BASE_URL}/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${superToken}`
                },
                body: JSON.stringify({ name, email, password, role })
            });
            if (res.status === 409) { // Conflict/Exists
                console.log(`   ${role} already exists. Logging in...`);
            } else if (!res.ok) {
                // If fail, maybe try login directly, might exist
                console.log(`   Create failed (${res.status}), trying login...`);
            }

            // Login to get token
            const loginRes = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (!loginRes.ok) throw new Error(`${role} Login Failed`);
            const data = await loginRes.json();
            return { token: data.access_token, id: JSON.parse(Buffer.from(data.access_token.split('.')[1], 'base64').toString()).sub };
        };

        const plantAdmin = await createEmployee('Plant Admin', 'plant_v2@solar.com', 'PLANT_ADMIN', 'Password@123');
        const regionAdmin = await createEmployee('Region Admin', 'region_v2@solar.com', 'REGION_ADMIN', 'Password@123');

        // 3. PlantAdmin: Create & Complete Survey
        console.log('3. PlantAdmin: Creating Survey...');
        const surveyData = {
            surveyorId: plantAdmin.id,
            customerName: 'Approval Test Customer',
            averageMonthlyUnits: 600,
            status: 'DRAFT'
        };
        const surveyRes = await fetch(`${BASE_URL}/surveys`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(surveyData)
        });
        if (!surveyRes.ok) throw new Error(`Create Survey Failed: ${surveyRes.status}`);
        const surveyId = (await surveyRes.json()).id;
        console.log(`   Survey Created: ${surveyId}`);

        console.log('   PlantAdmin: Completing Survey...');
        await fetch(`${BASE_URL}/surveys/${surveyId}/complete`, { method: 'POST' });

        // Wait for Quote
        await new Promise(r => setTimeout(r, 1000));

        // Find Quote
        const quotesRes = await fetch(`${BASE_URL}/quotations`);
        const quotes = await quotesRes.json();
        const quote = quotes.find(q => q.survey && q.survey.id === surveyId);
        if (!quote) throw new Error('Quote creation failed');
        console.log(`   Quote Created: ${quote.id} [${quote.status}]`);

        // 4. PlantAdmin: Submit Quote
        console.log('4. PlantAdmin: Submitting Quote...');
        const submitRes = await fetch(`${BASE_URL}/quotations/${quote.id}/submit`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${plantAdmin.token}` }
        });
        if (!submitRes.ok) {
            const err = await submitRes.json();
            throw new Error(`Submit Failed: ${JSON.stringify(err)}`);
        }
        const submittedQuote = await submitRes.json();
        console.log(`   Quote Submitted! Status: ${submittedQuote.status}`);

        // 5. RegionAdmin: Approve Quote
        console.log('5. RegionAdmin: Approving Quote...');
        const approveRes = await fetch(`${BASE_URL}/quotations/${quote.id}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${regionAdmin.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ remarks: 'Looks good to me.' })
        });
        if (!approveRes.ok) throw new Error(`Approve Failed: ${approveRes.status}`);
        const approvedQuote = await approveRes.json();
        console.log(`   Quote Approved! Status: ${approvedQuote.status}`);

        // 6. SuperAdmin: Final Approve
        console.log('6. SuperAdmin: Final Approving...');
        const finalRes = await fetch(`${BASE_URL}/quotations/${quote.id}/final-approve`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${superToken}` }
        });
        if (!finalRes.ok) throw new Error(`Final Approve Failed: ${finalRes.status}`);
        const finalQuote = await finalRes.json();
        console.log(`   Quote Final Approved! Status: ${finalQuote.status}`);

        // 7. Verify Audit Log
        console.log('7. Verifying Audit Logs...');
        const auditRes = await fetch(`${BASE_URL}/quotations/${quote.id}/approvals`, {
            headers: { 'Authorization': `Bearer ${superToken}` }
        });
        const audits = await auditRes.json();
        console.log(`   Found ${audits.length} audit entries.`);
        audits.forEach(a => console.log(`   - [${a.action}] by ${a.actionBy?.name || a.actionById} (${a.role}): ${a.remarks}`));

        console.log('--- Verification SUCCESS ---');

    } catch (error) {
        console.error('--- Verification FAILED ---');
        console.error(error.message);
    }
}

runVerification();
