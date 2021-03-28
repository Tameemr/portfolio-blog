const mongoose = require('mongoose');
const UserSchema = require('../../../models/user');
const userData = { name: 'TesterNo.1', email: 'testerno1@test.com',  password: '123123123', date: new Date()};

describe('User Schema Test', () => {

    // Connect to the MongoDB Memory Server By using mongoose.connect
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });

    // Insert User into Database successfully. (Test Normal Use Case)
    it('create & save new user successfully', async () => {
        const validUser = new UserSchema(userData);
        const savedUser = await validUser.save();
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(userData.name);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.password).toBe(userData.password);
        expect(savedUser.date).toBe(userData.date);
    });

    // Insert User with Invalid Field. (Test on Schema)
    it('insert user successfully, but the field does not defined in schema --> should be undefined', async () => {
        const userWithInvalidField = new UserSchema({ 
            name: 'TesterNo.2', 
            email: 'testerno2@test.com', 
            password: 'newuser',
        });
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
        expect(savedUserWithInvalidField.nickkname).toBeUndefined();        
    });

    // Insert User without Required Field. (Test on Validation)
    it('create new user without filling required field --> should failed', async () => {
        const userWithoutRequiredField = new UserSchema({ 
            name: 'TesterNo.1' 
        });
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            error = savedUserWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.email).toBeDefined();
    });
})