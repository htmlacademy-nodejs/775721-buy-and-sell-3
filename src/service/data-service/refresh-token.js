'use strict';

class RefreshTokenService {
  constructor(dataBase, logger) {
    this._dataBase = dataBase;
    this._models = dataBase.models;
    this._logger = logger;
  }

  async add(value) {
    const {RefreshToken} = this._models;

    try {
      RefreshToken.create({
        value,
      });
    } catch (error) {
      this._logger.error(`Can't save token. Error: ${ error }`);
    }
  }

  async findByValue(value) {
    const {RefreshToken} = this._models;

    try {
      return RefreshToken.findOne({
        where: {
          value,
        },
      });
    } catch (error) {
      this._logger.error(`Can't find refresh token. Error: ${error}`);

      return null;
    }
  }

  async delete(value) {
    const {RefreshToken} = this._models;

    try {
      return RefreshToken.destroy({
        where: {
          value,
        },
      });
    } catch (error) {
      this._logger.error(`Can't delete refresh token. Error: ${error}`);

      return null;
    }
  }
}


exports.RefreshTokenService = RefreshTokenService;
