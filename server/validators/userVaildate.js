import yup from 'yup';

export const userSchema = yup.object().shape({
    username: yup.string().trim().min(3,'user must be at least 3 characters').max(100).required(),
    email: yup.string().email('the email is not valid').required(),
    password: yup.string().min(4,'password must be at least 4 characters').required()
});

export const validateUser = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return res.status(400).json({
            success: false, 
            message: error.errors
        });
    }
}