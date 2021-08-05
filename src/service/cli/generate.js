"use strict";

const fs = require(`fs`);
const {UserCommand, ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const MAX_ONE_CHAR_NUMBER = 9;
const MAX_MOCKS_COUNT = 1000;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Продам книги Стивена Кинга`,
  `Продам новую приставку Sony Playstation 5`,
  `Продам отличную подборку фильмов на VHS`,
  `Куплю антиквариат`,
  `Куплю породистого кота`,
];

const MAX_USING_SENTENCES = 5;
const SENTENCES = [
  `Товар в отличном состоянии.`,
  `Пользовались бережно и только по большим праздникам.`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары.`,
  `Даю недельную гарантию.`,
  `Если товар не понравится — верну всё до последней копейки.`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `При покупке с меня бесплатная доставка в черте города.`,
];

const CATEGORIES = [`Книги`, `Разное`, `Посуда`, `Игры`, `Животные`, `Журналы`];

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const getPictureFileName = (number) =>
  number > MAX_ONE_CHAR_NUMBER ? number : `0${number}`;

const generateOffers = (count) =>
  Array(count)
    .fill({})
    .map(() => ({
      category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
      description: shuffle(SENTENCES).slice(1, MAX_USING_SENTENCES).join(` `),
      picture: getPictureFileName(
          getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)
      ),
      title: TITLES[getRandomInt(0, TITLES.length - 1)],
      type: OfferType[
        Object.keys(OfferType)[
          Math.floor(Math.random() * Object.keys(OfferType).length)
        ]
      ],
      sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    }));

module.exports = {
  name: UserCommand.GENERATE,
  run(args) {
    const [count] = args;
    if (count > MAX_MOCKS_COUNT) {
      console.error(`Не больше 1000 объявлений`);
      process.exit(ExitCode.ERROR);
    }
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(`Can't write data to file...`);
      }

      return console.info(`Operation success. File created.`);
    });
  },
};
