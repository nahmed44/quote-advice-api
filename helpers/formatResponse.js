module.exports = {
    formatErrorResponse: function(error) {
        let errorResponse = {
            error: {
                name: 'ServerError',
                message: '',
            },
            message: '',
            statusCode: 500,
            data: [],
            success: false,
        };

        switch (error.message) {
            case 'UserNotFoundError':
                errorResponse.error.name = error.message;
                errorResponse.error.message = 'User not found';
                errorResponse.statusCode = 404;
                errorResponse.message = 'Make sure you have entered a valid email and password';
                break;
            case 'IncorrectPasswordError':
                errorResponse.error.name = error.message;
                errorResponse.error.message = 'Incorrect password';
                errorResponse.statusCode = 401;
                errorResponse.message = 'Please provide a correct password';
                break;
            case 'EmailValidationError':
                errorResponse.error.name = error.message;
                errorResponse.error.message = 'Email is not valid';
                errorResponse.statusCode = 400;
                errorResponse.message = 'Please provide a valid email';
                break;
            default:
                errorResponse.error.name = error.errName || 'ServerError';
                errorResponse.error.message = error.errMessage || 'Server ran into an error! Please try again later.';
                errorResponse.message = error.message || 'Server ran into an error! Please try again later.';
                errorResponse.statusCode = error.statusCode || 500;
                break;
        }

        return errorResponse;
    },

    formatDataResponse: function(data) {
        let dataResponse = {
            count: data.count,
            success: true,
            message: '',
            statusCode: 200,
            data: [],
        };

        if (data.count > 0) {
            dataResponse.data = data.data;
            dataResponse.statusCode = data.statusCode || 200;
            dataResponse.message = data.message;
        } else {
            dataResponse.message = 'No data found';
        }

        return dataResponse;
    }
}