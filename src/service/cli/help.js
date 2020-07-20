'use strict';

const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Программа запускает http-сервер и формирует файл с данными для api.

    Гайд:
      service.js <command>

    Команды:
      --version:            выводит номер версии
      --help:               печатает этот текст
      --generate <count>:   формирует файл mocks.json
      --server <port>:      запускает http-сервер
      --fill <count>:       формирует файл с запросами для начального заполнения
                            БД указанным кол-вом объявлений
    `;

    console.info(chalk.gray(text));
  },
};
