class Person {
  constructor(name, birthday, department, gender) {
    this.name = name;
    this.gender = gender;
    this.birthday = this.birthdayValidation(birthday);
    this.department = this.departmentValidation(department);
  };

  birthdayValidation(str) {
    if (str.length > 5 || !str.includes("/")) throw new Error(`Data do contato de nome: ${this.name} está inválida.`);

    const strNumberParts = str.split("/");

    const day = Number(strNumberParts[0]);
    const month = Number(strNumberParts[1]);

    if (!day || !month || (new Date(`${month}/${day}/2001`)).toLocaleDateString('pt-br', {day: '2-digit', month: '2-digit'}) === "Invalid Date")
      throw new Error(`Data do contato de nome: ${this.name} está inválida`);

    return str;
  }
  
  departmentValidation(str) {
    if (!/^([^0-9]*)$/.test(str))
      throw new Error(`Departamento do contato de nome: ${this.name} está inválida.`);
 
    return str;
  }
}

module.exports = Person;