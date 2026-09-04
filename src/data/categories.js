export const CATEGORIES = {
  eletronicos: {
    label: 'Eletrônicos',
    icon: 'Monitor',
    color: 'blue',
    subcategories: {
      tv: { label: 'TV', usefulLife: 5, method: 'declining', residualPct: 0.10 },
      computador: { label: 'Computador/Notebook', usefulLife: 4, method: 'declining', residualPct: 0.10 },
      smartphone: { label: 'Smartphone', usefulLife: 3, method: 'declining', residualPct: 0.05 },
      tablet: { label: 'Tablet', usefulLife: 4, method: 'declining', residualPct: 0.08 },
      outro_eletronico: { label: 'Outro eletrônico', usefulLife: 4, method: 'declining', residualPct: 0.10 },
    }
  },
  eletrodomesticos_grandes: {
    label: 'Eletrodomésticos Grandes',
    icon: 'Refrigerator',
    color: 'cyan',
    subcategories: {
      geladeira: { label: 'Geladeira/Freezer', usefulLife: 15, method: 'linear', residualPct: 0.10 },
      fogao: { label: 'Fogão/Cooktop', usefulLife: 15, method: 'linear', residualPct: 0.10 },
      maquina_lavar: { label: 'Máquina de Lavar', usefulLife: 12, method: 'linear', residualPct: 0.10 },
      secadora: { label: 'Secadora', usefulLife: 12, method: 'linear', residualPct: 0.10 },
      lava_loucas: { label: 'Lava-Louças', usefulLife: 12, method: 'linear', residualPct: 0.10 },
      microondas: { label: 'Microondas/Forno Elétrico', usefulLife: 10, method: 'linear', residualPct: 0.10 },
    }
  },
  eletrodomesticos_pequenos: {
    label: 'Eletrodomésticos Pequenos',
    icon: 'Coffee',
    color: 'teal',
    subcategories: {
      cafeteira: { label: 'Cafeteira', usefulLife: 6, method: 'linear', residualPct: 0.05 },
      liquidificador: { label: 'Liquidificador/Processador', usefulLife: 7, method: 'linear', residualPct: 0.05 },
      aspirador: { label: 'Aspirador de Pó', usefulLife: 8, method: 'linear', residualPct: 0.08 },
      ferro: { label: 'Ferro de Passar', usefulLife: 6, method: 'linear', residualPct: 0.05 },
      outro_eletro_pequeno: { label: 'Outro eletrodoméstico', usefulLife: 6, method: 'linear', residualPct: 0.05 },
    }
  },
  ar_condicionado: {
    label: 'Ar Condicionado / Ventilação',
    icon: 'Wind',
    color: 'sky',
    subcategories: {
      split: { label: 'Ar Condicionado Split', usefulLife: 12, method: 'linear', residualPct: 0.10 },
      janela_ac: { label: 'Ar Condicionado Janela', usefulLife: 10, method: 'linear', residualPct: 0.10 },
      ventilador: { label: 'Ventilador', usefulLife: 8, method: 'linear', residualPct: 0.05 },
    }
  },
  moveis: {
    label: 'Móveis',
    icon: 'Sofa',
    color: 'amber',
    subcategories: {
      sofa: { label: 'Sofá/Poltrona', usefulLife: 12, method: 'linear', residualPct: 0.10 },
      cama: { label: 'Cama/Estrado', usefulLife: 15, method: 'linear', residualPct: 0.10 },
      colchao: { label: 'Colchão', usefulLife: 9, method: 'linear', residualPct: 0.05 },
      mesa: { label: 'Mesa/Cadeiras', usefulLife: 15, method: 'linear', residualPct: 0.10 },
      armario: { label: 'Armário/Guarda-roupa', usefulLife: 20, method: 'linear', residualPct: 0.10 },
      rack: { label: 'Rack/Estante', usefulLife: 15, method: 'linear', residualPct: 0.10 },
    }
  },
  estrutura: {
    label: 'Estrutura / Acabamentos',
    icon: 'Home',
    color: 'orange',
    subcategories: {
      pintura_interna: { label: 'Pintura Interna', usefulLife: 4, method: 'linear', residualPct: 0 },
      pintura_externa: { label: 'Pintura Externa', usefulLife: 6, method: 'linear', residualPct: 0 },
      piso: { label: 'Piso/Revestimento', usefulLife: 25, method: 'linear', residualPct: 0.05 },
      telhado: { label: 'Telhado', usefulLife: 25, method: 'linear', residualPct: 0.05 },
      impermeabilizacao: { label: 'Impermeabilização', usefulLife: 8, method: 'linear', residualPct: 0 },
      forro: { label: 'Forro/Gesso', usefulLife: 20, method: 'linear', residualPct: 0.05 },
    }
  },
  hidraulico_eletrico: {
    label: 'Hidráulico / Elétrico',
    icon: 'Zap',
    color: 'yellow',
    subcategories: {
      aquecedor: { label: 'Aquecedor/Boiler', usefulLife: 10, method: 'linear', residualPct: 0.05 },
      chuveiro: { label: 'Chuveiro Elétrico', usefulLife: 8, method: 'linear', residualPct: 0 },
      sistema_hidraulico: { label: 'Sistema Hidráulico', usefulLife: 25, method: 'linear', residualPct: 0.10 },
      sistema_eletrico: { label: 'Sistema Elétrico', usefulLife: 35, method: 'linear', residualPct: 0.10 },
      bomba: { label: "Bomba d'água", usefulLife: 10, method: 'linear', residualPct: 0.05 },
    }
  },
  veiculo: {
    label: 'Veículo',
    icon: 'Car',
    color: 'violet',
    subcategories: {
      carro: { label: 'Carro', usefulLife: 10, method: 'declining', residualPct: 0.10 },
      suv_caminhonete: { label: 'SUV / Caminhonete', usefulLife: 12, method: 'declining', residualPct: 0.10 },
      moto: { label: 'Moto', usefulLife: 8, method: 'declining', residualPct: 0.10 },
      van_utilitario: { label: 'Van / Utilitário', usefulLife: 12, method: 'declining', residualPct: 0.10 },
    }
  },
  esquadrias: {
    label: 'Esquadrias / Fechamentos',
    icon: 'DoorOpen',
    color: 'stone',
    subcategories: {
      portas: { label: 'Portas', usefulLife: 25, method: 'linear', residualPct: 0.10 },
      janelas: { label: 'Janelas', usefulLife: 25, method: 'linear', residualPct: 0.10 },
      portao: { label: 'Portão', usefulLife: 15, method: 'linear', residualPct: 0.10 },
      grades: { label: 'Grades/Proteções', usefulLife: 20, method: 'linear', residualPct: 0.10 },
    }
  },
}

export const getCategoryDef = (categoryKey) => CATEGORIES[categoryKey]
export const getSubcategoryDef = (categoryKey, subcategoryKey) => CATEGORIES[categoryKey]?.subcategories[subcategoryKey]
export const getAllSubcategories = () => {
  const result = []
  Object.entries(CATEGORIES).forEach(([catKey, cat]) => {
    Object.entries(cat.subcategories).forEach(([subKey, sub]) => {
      result.push({ categoryKey: catKey, subcategoryKey: subKey, ...sub, categoryLabel: cat.label })
    })
  })
  return result
}
