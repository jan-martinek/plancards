const dictionary = {
  lang: 'česky',
  dateFormat: 'D. M. YYYY',
  app: {
    plancards: 'Plánovací karty',
    editCard: 'upravit kartu',
    editingNow: 'úpravy karty',
    download: 'stáhnout',
    templateDownload: 'stáhnout šablonu',
    saveAndClose: 'uložit a zavřít',
  },
  home: {
    note: 'Zaznamenávejte své postupy',
    improve: 'Zlepšujte svou práci',
    share: 'Sdílejte dobrou praxi',
    tips: 'Tipy',
    purpose: 'Na této stránce můžete vyplňovat a upravovat své plánovací karty.',
    privacy: 'Všechny informace jsou uloženy ve vašem počítači a nikam se neodesílají, nezapomeňte však své karty proto ukládat.',
    shareHow: 'Vytvořené karty můžete sdílet s ostatními — pošlete je mailem, sdílejte je na internetu.',
    open: 'Otevřít kartu',
    openButton: 'Otevřít',
    opened: 'Rozpracované karty',
    noneOpened: 'Nemáte rozpracované žádné karty.',
    openFromFile: 'Nahrát ze souboru',
    openFromFileHl: 'Uložený soubor vyberte zde:',
    openFromUrl: 'Otevřít pomocí odkazu',
    basic: 'Základní šablony',
    footer: 'Vyvinuto v rámci projektu Profesionalizace <a href="http://www.ranapecezlin.cz">Střediska rané péče EDUCO Zlín z.s.</a>, který byl podpořen z Evropského sociálního fondu. Registrační číslo projektu: CZ.03.3.60/0.0/0.0/15_031/0001866.',
    partners: 'Partnery projektu jsou <a href="http://fundraising.cz">České centrum fundraisingu</a> a <a href="http://muni.cz">Masarykova univerzita</a>.',
  },
  pikadayNames: {
    previousMonth: 'Předchozí měsíc',
    nextMonth: 'Následující měsíc',
    months: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'],
    weekdays: ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'],
    weekdaysShort: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
  },
  blocks: {
    bigtext: {
      name: 'Velké textové pole',
      description: 'Popis',
    },
    countlist: {
      name: 'Položkový seznam (ks)',
      unit: 'Položka',
      count: 'Počet',
      total: 'Celkem',
    },
    dateinput: {
      name: 'Termín',
      description: 'Popis',
    },
    dateoutput: {
      name: 'Milník s úkoly',
      description: 'Popis',
    },
    doubletext: {
      name: 'Dvě textová pole',
      description: 'Popis',
    },
    final: {
      name: 'Závěrečný panel',
    },
    header: {
      name: 'Hlavička',
      short: 'Krátce popište, k čemu se tato karta hodí.',
      authorHeading: 'Autor/ka karty',
      author: 'Jméno Příjmení, jmeno.prijmeni@email.cz',
      licenseHeading: 'Licence (pravidla pro sdílení)',
      license: `Zde krátce popište, zda kartu sdílíte volně nebo zda
        žádáte o dodržení nějakých pravidel (např. ponechání kontaktu
        na původního autora atp. Můžete určit i konkrétní licenci
        (například Creative Commons).`,
      activityName: 'Název aktivity',
      goal: 'Cíl aktivity v jedné větě',
      notes: 'Poznámky',
    },
    indicator: {
      name: 'Indikátor (ano/ne)',
      isTrue: 'Text, pokud je podmínka splněna',
      isFalse: 'Text, pokud podmínka není splněna',
    },
    pricelist: {
      name: 'Položkový seznam (cena/ks)',
      item: 'Položka',
      price: 'Cena',
      count: 'Počet',
      total: 'Celkem',
    },
    note: {
      name: 'Poznámka',
      text: 'Text poznámky',
    },
    number: {
      name: 'Číselná položka',
      description: 'Popis číselné hodnoty',
    },
    separator: {
      name: 'Oddělovač',
    },
    subhead: {
      name: 'Mezititulek',
      text: 'Mezititulek',
    },
    sum: {
      name: 'Výpočet',
      description: 'Popis',
    },
  },
  fields: {
    util: {
      name: 'název',
      formula: 'vzorec',
    },
  },
  blockNav: {
    text: 'Políčka',
    list: 'Seznamy',
    context: 'Popisky',
  },
  export: {
    card: 'karta',
    template: 'šablona',
    storedCard: 'Uložená karta',
    storedCardLong: 'Uložená karta z aplikace „Plánovací karty“.',
    usage: 'Obsah karty můžete otevřít a upravovat',
    usageLoc: 'na webu Plánovacích karet',
    quickLink: 'Rychlý odkaz',
    luck: 'S trochou štěstí stačí',
    click: 'kliknout na odkaz',
    depends: 'Není nicméně funkční vždy — záleží to na prohlížeči a množství obsahu v kartě.',
  },
};

module.exports = { dictionary };
