// ==========================================
// DADOS MOCKADOS - PETCARE
// ==========================================
// Estes dados simulam as informações que,
// futuramente, serão obtidas do banco de dados.

// ------------------------------------------
// DONO
// ------------------------------------------

export const donoMock = {
  id: 1,
  nome: 'Maria Luzes de Carvalho',
  email: 'maria@gmail.com',
  telefone: '(11) 98989-4444',
};

// ------------------------------------------
// PET
// ------------------------------------------

export const petMock = {
  id: 1,
  nome: 'Luna',
  especie: 'Cachorro',
  raca: 'Sem raça',
  pelagem: 'Curta',
  sexo: 'Macho',
  idade: '4 anos',
  peso: '4 kg',
  veterinario: 'Clínica Pet Vida',

  informacoesAdicionais: {
    tipoSangue: 'DEA 1.1',
    alergias: 'Nenhuma',
    alimentacao: 'Ração Bionatural',
    observacoes: 'Muito dócil',
  },
};

// ------------------------------------------
// VACINAS
// ------------------------------------------

export const vacinasMock = [
  {
    id: 1,
    nome: 'Vacina contra Rinotraqueíte',
    dose: '1ª dose',
    data: '12/09/2026',
    proximaDose: '12/09/2026',
    veterinario: 'Matheus F.B Junior',
  },

  {
    id: 2,
    nome: 'Vacina contra Raiva',
    dose: 'Dose anual',
    data: '12/09/2026',
    proximaDose: '12/09/2027',
    veterinario: 'Matheus F.B Junior',
  },

  {
    id: 3,
    nome: 'Vacina contra Rinotraqueíte',
    dose: '2ª dose',
    data: '12/09/2026',
    proximaDose: '12/10/2026',
    veterinario: 'Matheus F.B Junior',
  },
];

// ------------------------------------------
// ESQUEMA DE VACINAÇÃO
// ------------------------------------------

export const esquemaVacinacaoMock = [
  {
    id: 1,
    categoria: 'Cães',
    doencas: [
      'Cinomose',
      'Hepatite',
      'Leptospirose',
      'Parainfluenza',
      'Parvovirose',
      'Coronavirose',
    ],
    recomendacao:
      'Vacinar aos 2, 3, 4 e 5 meses de idade',
  },

  {
    id: 2,
    categoria: 'Gatos',
    doencas: [
      'Rinotraqueíte',
      'Calicivirose',
      'Panleucopenia',
      'Clamidiose',
      'Leucemia Felina',
    ],
    recomendacao:
      'Vacinar aos 2 e 3 meses de idade',
  },

  {
    id: 3,
    categoria: 'Cães e Gatos',
    doencas: ['Raiva'],
    recomendacao:
      'Vacinar aos 4 meses de idade',
  },
];

// ------------------------------------------
// CONSULTAS
// ------------------------------------------

export const proximaConsultaMock = {
  id: 1,
  clinica: 'Clínica Pet Vida',
  tipo: 'Consulta veterinária',
  data: '12/09/2026',
  horario: '14:30',
  veterinario: 'Dr. Carlos Silva',
  motivo: 'Vacina anual',
};

export const historicoConsultasMock = [
  {
    id: 1,
    tipo: 'Consulta de rotina',
    data: '12/09/2026',
    veterinario: 'Dr. Carlos Silva',
    status: 'Concluída',
  },

  {
    id: 2,
    tipo: 'Retorno',
    data: '12/09/2026',
    veterinario: 'Dr. Carlos Silva',
    status: 'Concluída',
  },
];

// ------------------------------------------
// MEDICAMENTOS
// ------------------------------------------

export const proximoMedicamentoMock = {
  id: 1,
  nome: 'Antipulgas Simparic',
  data: 'Hoje',
  horario: '20:00',
  frequencia: 'A cada 30 dias',
};

export const medicamentosEmUsoMock = [
  {
    id: 1,
    nome: 'Amoxicilina',
    dose: '1 comprimido',
    horarios: ['08:00', '20:00'],
    periodo: 'Até 15/09/2026',
    status: 'Em uso',
  },

  {
    id: 2,
    nome: 'Ômega 3',
    dose: '1 comprimido',
    horarios: ['09:00'],
    periodo: 'Uso contínuo',
    status: 'Em uso',
  },
];

// ------------------------------------------
// HOME - PRÓXIMOS COMPROMISSOS
// ------------------------------------------

export const compromissosMock = [
  {
    id: 1,
    tipo: 'vacina',
    nome: 'Vacina V10',
    data: '12/09/2026',
  },

  {
    id: 2,
    tipo: 'consulta',
    nome: 'Consulta',
    data: '12/09/2026',
  },

  {
    id: 3,
    tipo: 'medicamento',
    nome: 'Antipulgas',
    data: '12/09/2026',
  },
];

// ------------------------------------------
// HOME - RESUMO
// ------------------------------------------

export const resumoMock = {
  vacinas: 'Vacinas em dia',
  ultimaConsulta: 'Última consulta há 2 meses',
  peso: 'Peso: 4 kg',
};