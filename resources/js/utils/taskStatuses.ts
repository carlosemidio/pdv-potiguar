enum Status {
  Aberta = 0,
  Pendente = 1,
  Concluida = 2,
  AguardandoAprovacao = 3
}

const statuses = {
  [Status.Aberta]: 'Aberta',
  [Status.Pendente]: 'Pendente',
  [Status.Concluida]: 'Concluída',
  [Status.AguardandoAprovacao]: 'Aguardando Aprovação'
};

const statusesColor = {
    [Status.Aberta]: 'bg-blue-600 text-white',
    [Status.Pendente]: 'bg-orange-600 text-white',
    [Status.Concluida]: 'bg-green-500 text-white',
    [Status.AguardandoAprovacao]: 'bg-orange-400 text-white'
};

export { statuses, statusesColor };