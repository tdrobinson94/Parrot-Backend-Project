'use strict'

const Validator = use('Validator');
const User = use('App/Model/User');

const Hash = use('Hash');

class UsersController {

    * show(request, response) {
        return response.json(request.authUser);
    }

    * store(request, response) {
        const input = request.only('firstname', 'lastname', 'username', 'email', 'password');
        input.password = yield Hash.make(input.password);

        const validation = yield Validator.validate(input, User.rules);

            if(validation.fails()) {
                response.json(validation.messages());
                console.log(validation.messages());
                return response.status(422).json(validation.messages());
            } else {
                const newUser = yield User.create(input);
                return response.status(201).json(newUser.toJSON());
            }
    }

    * login(request, response) {
        const input = request.only('username', 'password');

        try {
            const user = yield User.findBy('username', input.username)
            const verify = yield Hash.verify(input.password, user.password)

            if (!verify) {throw new Error('Password Mismatch')};
            user.access_token = yield request.auth.generate(user);
            return response.json(user.toJSON());
        } catch (e){
            return response.status(204).json({error: e.message});
        }
    }

}

module.exports = UsersController;
