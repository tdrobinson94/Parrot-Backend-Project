'use strict'

const Lucid = use('Lucid')

const Token = use('App/Model/Token');

class User extends Lucid {

  static get hidden(){
    return ['password'];
  }

  static get rules () {
      return {
        username: 'required|unique:users',
        email: 'required|email|unique:users',
        password: 'required',
      }
  }

  apiTokens(){
    return this.hasMany(Token);
  }

}

module.exports = User
