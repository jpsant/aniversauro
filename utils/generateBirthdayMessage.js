const generateBirthdayMessage = (contacts) => {
  const today = (new Date()).toLocaleDateString('pt-br', {day: '2-digit', month: '2-digit', year: 'numeric'});

  if (contacts.length === 1) {
    const contact = contacts[0];
    return `🎉 Hoje, ${today} ${contact.gender === 'F' ? 'a' : 'o'} aniversariante é ${contact.name} - ${contact.department} 🎉 
    Receba os votos de um feliz aniversário de toda a família KRS!
    Desejamos que você tenha um dia maravilhoso, que não faltem as homenagens e o carinho.
    Que a sua vida continue sempre em ritmo ascendente, com muito crescimento, realizações pessoais e profissionais.
    Desejamos a você muitas felicidades e mais anos de vida com saúde, paz e amor 🎊🎉🥳`;
  } else {
    return `Hoje, ${today} os aniversariantes são:${contacts.map(e => ` ${e.name}`)} 🎉 !
    Recebam os votos de um feliz aniversário de toda a família KRS!
    Desejamos que vocês tenham um dia maravilhoso, que não faltem as homenagens e o carinho.
    Que a vida de vocês continue sempre em ritmo ascendente, com muito crescimento, realizações pessoais e profissionais.
    Desejamos a vocês muitas felicidades e mais anos de vida com saúde, paz e amor 🎊🎉🥳`;
  }
};

module.exports = generateBirthdayMessage;