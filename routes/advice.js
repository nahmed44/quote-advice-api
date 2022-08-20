const router = require('express').Router();
const prisma = require('../prisma/prisma');
const authMiddleware = require('../middleware/auth');
const { formatErrorResponse, formatDataResponse } = require('../helpers/formatResponse');

// @desc    Get a random advice
// @route   GET /api/advice
router.get('/', async (req, res) => {

    try {
	    const randomPick = (values) => values[Math.floor(Math.random() * values.length)];
	
	    const itemCount = await prisma.advice.count(); 
	    const randomNumber = Math.floor(Math.random() * itemCount);
	    const orderBy = randomPick(['id', 'advice']);
	    const orderDirection = randomPick(['asc', 'desc']);
	
	    const randomAdvice = await prisma.advice.findFirst({
	        take: 1,
	        orderBy: { [orderBy]: orderDirection },
	        skip: randomNumber 
	    });
	
	    const jsonResponse = formatDataResponse({
	        data: [randomAdvice],
	        count: 1,
	        message: 'Random advice retrieved successfully'
	
	    });
	
	    res.json(jsonResponse);
    } catch (error) {
        const jsonErrorResponse = formatErrorResponse({ message: 'An error occurred while retrieving the random advice' });
        res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
    }

});


// @desc    Get a advice for the given ID
// @route   GET /api/advice/:id
router.get('/:id', async (req, res) => {

    try {
	    const advice = await prisma.advice.findFirst({
	        where: { id: req.params.id }
	    });
	
	    if (!advice) {
	        const jsonErrorResponse = formatErrorResponse({
                errName : 'AdviceNotFoundError',
                errMessage: `No advice found for the given id: ${req.params.id}`,
                statusCode: 404,
                message: `No advice found for the given id: ${req.params.id}` 
            });
            
            res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);

	    } else {
	        const jsonResponse = formatDataResponse({
	            data: [advice],
	            count: 1,
	            message: 'Advice retrieved successfully'
	        });
	
	        res.json(jsonResponse);
	    }
    } catch (error) {
        const jsonErrorResponse = formatErrorResponse({ message: `An error occurred while retrieving the advice for id ${req.params.id}` });
        res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
    }

});

// @desc    Create a advice
// @route   POST /api/advice
router.post('/', authMiddleware, async (req, res) => {

    try {
	    const { advice } = req.body;

        // Checking advice is not empty
	    if (!advice || advice.length === 0) {
	        const jsonErrorResponse = formatErrorResponse({ 
	            errName : 'AdviceMissingFromBodyError',
	            errMessage: 'Advice is missing from body',
	            statusCode: 400,
	            message: 'Make sure you have provided an advice in the body, for example: { advice: This is a random advice }'
	        });
	        res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
            return;
	    }

        // Checking advice type is valid (string)
        if(typeof advice !== 'string') {
            const jsonErrorResponse = formatErrorResponse({ 
                errName :   'FormatError',
	            errMessage: 'Advice must be a string',
	            statusCode: 400,
	            message: 'Please provide a valid advice'
            });
            res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
        } else {
            // Checking if advice already exists
            const adviceExists = await prisma.advice.findFirst({
                where: { 
                    advice: {
                        equals: advice
                    }
                },
            });

            if (adviceExists) {
                const jsonErrorResponse = formatErrorResponse({
                    errName : 'AdviceAlreadyExistsError',
                    errMessage: 'Advice already exists',
                    statusCode: 400,
                    message: `Advice already exists. Advice id: ${adviceExists.id}`
                });
                res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
                return;
            } 

            // Creating new advice
	        const newAdvice = await prisma.advice.create({
	            data: { advice: advice }
	        });
	
	        const jsonResponse = formatDataResponse({
	            data: [newAdvice],
	            count: 1,
	            message: 'Advice created successfully',
                statusCode: 201
	        });
	
	        res.status(jsonResponse.statusCode).json(jsonResponse);
	    }
    } catch (error) {
        const jsonErrorResponse = formatErrorResponse({ message: 'An error occurred while creating the advice' });
        res.status(jsonErrorResponse.statusCode).json(jsonErrorResponse);
    }

});

module.exports = router;