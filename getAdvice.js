const fetch = require("node-fetch");

const { PrismaClient } = require('@prisma/client');
 

const prisma = new PrismaClient();

async function getAdvice() {
    let adviceCount = 0;
    let adviceDuplicate = 0;

    const { count } = await prisma.advice.deleteMany({});
    console.log(`Deleted ${count} advice`);


    for (let index = 1; index < 224; index++) {
        try {
            // Fetch advice from this url 	https://api.adviceslip.com/advice
            const response = await fetch('https://api.adviceslip.com/advice');
            const data = await response.json();
            const advice = data.slip.advice;
            
            const exit = await prisma.advice.findMany({
                where: {
                    advice: advice
                } 
            });

            if (exit.length === 0) {
                 // Create a new advice in the database
                await prisma.advice.create({
                    data: {
                        advice: advice
                    },
                });
                adviceCount++;
            } else {
                console.log(`${advice} already exists`);
                adviceDuplicate++;
            }

            // wait 3 second before fetching the next advice
            await new Promise(resolve => setTimeout(resolve, 3000));

        } catch (error) {
            console.log(error);
            process.exit(1);            
        }
    }

    console.log(`Created ${adviceCount} advice, ${adviceDuplicate} already existed`);
}

getAdvice();

