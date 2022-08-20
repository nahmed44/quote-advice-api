module.exports = {
    formatErrorResponse: function(error, res) {
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
                errorResponse.error.message = 'Server ran into an error! Please try again later.';
                errorResponse.message = 'Server ran into an error! Please try again later.';
                break;
        }

        res.status(errorResponse.statusCode).json(errorResponse);
    },

    formatDataResponse: function(data) {
        let dataResponse = {
            count: data.count,
            success: true,
            message: 'Success',
            statusCode: 200,
            data: [],
        };

        if (data.count > 0) {
            dataResponse.data = data.data;
        } else {
            dataResponse.message = 'No data found';
        }

        return dataResponse;
    }
}