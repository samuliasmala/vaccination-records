'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Vaccines',
      [
        {
          code_id: 33,
          name: 'Kolerarokote',
          abbreviation: 'Cholera',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 34,
          name: 'Haemophilus influenzae tyyppi b -rokote',
          abbreviation: 'Hib',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 38,
          name: 'Kurkkumätä-jäykkäkouristus-hinkuyskätehosterokote',
          abbreviation: 'dtap',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 42,
          name: 'Kurkkumätä-jäykkäkouristustehosterokote',
          abbreviation: 'dT',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 43,
          name: 'BCG-rokote',
          abbreviation: 'BCG',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 44,
          name: 'Lavantautirokote',
          abbreviation: 'Typ',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 46,
          name: 'Puutiaisaivotulehdusrokote (TBE)',
          abbreviation: 'TBE',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 47,
          name: 'Japanin aivotulehdusrokote',
          abbreviation: 'JEV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 48,
          name: 'Influenssarokote',
          abbreviation: 'Influ',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 49,
          name: 'Hepatiitti B -rokote',
          abbreviation: 'HBV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 50,
          name: 'Hepatiitti A -rokote',
          abbreviation: 'HAV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 51,
          name: 'Hepatiitti A- ja B -rokote',
          abbreviation: 'HABV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 52,
          name: 'Tuhkarokko-sikotauti-vihurirokkorokote (MPR)',
          abbreviation: 'MPR',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 53,
          name: 'Poliorokote',
          abbreviation: 'IPV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 54,
          name: 'Vesikauhurokote',
          abbreviation: 'Rabies',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 55,
          name: 'Rotavirusrokote',
          abbreviation: 'Rota',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 57,
          name: 'Vesirokkorokote',
          abbreviation: 'Var',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 59,
          name: 'Keltakuumerokote',
          abbreviation: 'YFV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 60,
          name: 'Ihmisen papilloomavirusrokote (HPV)',
          abbreviation: 'HPV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 62,
          name: 'Kurkkumätä-jäykkäkouristus-hinkuyskä-poliorokote',
          abbreviation: 'DTaP-IPV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 63,
          name: 'Kurkkumätä-jäykkäkour.-hinkuyskä-polio-Hib-rokote',
          abbreviation: 'DTaP-IPV-Hib',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 64,
          name: 'Kurkkum.-jäykkäk.-hinkuy.-polio-Hib-HBV-rokote',
          abbreviation: 'DTaP-IPV-Hib-HBV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 65,
          name: 'Kurkkum.-jäykkäkour.-hinkuyskä-poliotehosterokote',
          abbreviation: 'dtap-IPV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 66,
          name: 'Pandemiainfluenssarokote',
          abbreviation: 'PanInflu',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 71,
          name: 'Meningokokkirokote',
          abbreviation: 'Men',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 72,
          name: 'Pneumokokkirokote',
          abbreviation: 'Pneu',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 73,
          name: 'Kurkkumätärokote',
          abbreviation: 'Diphteria',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 74,
          name: 'Kurkkumätä-jäykkäkouristusrokote',
          abbreviation: 'DT',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 75,
          name: 'Kurkkumätä-jäykkäkouristus-hinkuyskärokote',
          abbreviation: 'DTP',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 76,
          name: 'Jäykkäkouristusrokote',
          abbreviation: 'Tetanus',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 77,
          name: 'Tuhkarokkorokote',
          abbreviation: 'Morbilli',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 78,
          name: 'Sikotautirokote',
          abbreviation: 'Parotitis',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 79,
          name: 'Vihurirokkorokote',
          abbreviation: 'Rubella',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 80,
          name: 'Isorokkorokote',
          abbreviation: 'Variola',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 81,
          name: 'Kurkkumätä-jäykkäkouristus-poliorokote',
          abbreviation: 'DT-IPV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 82,
          name: 'Ruttorokote',
          abbreviation: 'Pestis',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 83,
          name: 'Pernaruttorokote',
          abbreviation: 'Anthrax',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 84,
          name: 'Jäykkäkouristus-poliorokote',
          abbreviation: 'T-IPV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 85,
          name: 'Hinkuyskärokote',
          abbreviation: 'Pertussis',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 86,
          name: 'Kurkkumätä-jäykkäkouristus-hinkuyskä-Hib-rokote',
          abbreviation: 'DTP-Hib',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 87,
          name: 'Kurkkumätä-jäykkäkouristus-hinkuyskä-poliorokote',
          abbreviation: 'DTP-IPV',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          code_id: 88,
          name: 'Tuhkarokko-sikotauti-vihurirokko-vesirokkorokote',
          abbreviation: 'MPRV',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'Vaccines',
      { created_by_user_id: null },
      {}
    );
  }
};
