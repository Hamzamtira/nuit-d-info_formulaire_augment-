const Joi = require("joi");

const submissionSchema = Joi.object({
    userInput: Joi.string().min(2).required(),
});

exports.submission = (req, res, next) => {
    const { error } = submissionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
};
