const Person = require("../models/Person");

const contactListValidation = (list) => {
  for (let person of list) {
    const { name, birthday, department, gender } = person;

    if (!(name, birthday, department, gender)) {
      throw new Error('Um ou mais campos do seu arquivo .csv estão em um formato errado.');
    };

    const contact = new Person(name, birthday, department, gender);

    if (!(contact.birthday && contact.name && contact.department)) {
      throw new Error(`Campos CSV com o nome de: '${name}' estão inválidos.`)
    }
  };
};

module.exports = contactListValidation;