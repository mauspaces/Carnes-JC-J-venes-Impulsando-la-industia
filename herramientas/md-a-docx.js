// Convierte el anteproyecto en Markdown a un .docx con el formato oficial de
// Jóvenes Impulsando la Industria 2026 (encabezado de logos y barra al pie).
// Uso: node herramientas/md-a-docx.js entrada.md salida.docx
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, Table, TableRow,
  TableCell, WidthType, AlignmentType, HeadingLevel, LevelFormat, BorderStyle,
  ShadingType, PageNumber, FootnoteReferenceRun, ExternalHyperlink,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType,
  VerticalAlign, TableLayoutType, LineRuleType,
} = require('docx');

const [, , entrada, salida] = process.argv;
if (!entrada || !salida) {
  console.error('Uso: node md-a-docx.js entrada.md salida.docx');
  process.exit(1);
}

const ASSETS = path.join(__dirname, '..', 'anteproyecto', 'assets');
const GUINDA = '8E1F3B';
const GUINDA_CLARO = 'F7EEF0';
const BORDE = 'D8C3C9';
const GRIS = '5A5A5A';
const SENCILLO = process.env.ESTILO === 'sencillo';
const FUENTE = 'Arial';
const FUENTE_TITULOS = 'Times New Roman';

// Carta, márgenes de 2.2 cm a los lados y espacio arriba para los logos.
const PAGINA = { ancho: 12240, alto: 15840, izq: 1247, der: 1247, arriba: 1600, abajo: 1300 };
const ANCHO_UTIL = PAGINA.ancho - PAGINA.izq - PAGINA.der;

const SECCIONES_OFICIALES = [
  'objetivo', 'objetivos especificos', 'planteamiento del problema',
  'propuesta de mejora', 'metas', 'cronograma',
];
const normalizar = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
const esSeccionOficial = (t) => SECCIONES_OFICIALES.some((s) => {
  const n = normalizar(t);
  return n === s || n.startsWith(s + ' ') || n.startsWith(s + '(');
});

// ---------- Notas al pie ----------
const lineasCrudas = fs.readFileSync(entrada, 'utf8').replace(/\r/g, '').split('\n');
const definiciones = {};
const lineas = [];
for (let i = 0; i < lineasCrudas.length; i++) {
  const m = lineasCrudas[i].match(/^\[\^([^\]]+)\]:\s*(.*)$/);
  if (m) {
    let texto = m[2];
    while (i + 1 < lineasCrudas.length && /^\s{2,}\S/.test(lineasCrudas[i + 1])) {
      texto += ' ' + lineasCrudas[++i].trim();
    }
    definiciones[m[1]] = texto;
  } else {
    lineas.push(lineasCrudas[i]);
  }
}
const numeroNota = {};
const notas = {};
let siguienteNota = 1;

// ---------- Texto en línea ----------
const PATRON = /(\*\*[^*]+?\*\*|__[^_]+?__|\*[^*\s][^*]*?\*|`[^`]+`|\[\^[^\]]+\]|\[[^\]]+\]\([^)\s]+\)|<br\s*\/?>|https?:\/\/[^\s)<>|]+)/g;

function enLinea(texto, base = {}) {
  const runs = [];
  let ultimo = 0;
  texto = texto.replace(/&nbsp;/g, ' ');
  for (const m of texto.matchAll(PATRON)) {
    if (m.index > ultimo) runs.push(new TextRun({ text: texto.slice(ultimo, m.index), ...base }));
    const t = m[0];
    if (t.startsWith('**') || t.startsWith('__')) {
      runs.push(...enLinea(t.slice(2, -2), { ...base, bold: true }));
    } else if (t.startsWith('[^')) {
      const id = t.slice(2, -1);
      if (definiciones[id] !== undefined) {
        if (!numeroNota[id]) {
          numeroNota[id] = siguienteNota++;
          notas[numeroNota[id]] = {
            children: [new Paragraph({ children: enLinea(definiciones[id], { size: 16 }) })],
          };
        }
        runs.push(new FootnoteReferenceRun(numeroNota[id]));
      } else {
        runs.push(new TextRun({ text: t, ...base }));
      }
    } else if (t.startsWith('[')) {
      const mm = t.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      runs.push(new ExternalHyperlink({
        link: mm[2],
        children: [new TextRun({ text: mm[1], ...base, color: '1F4E8C', underline: {} })],
      }));
    } else if (t.startsWith('http')) {
      const url = t.replace(/[.,;:]+$/, '');
      runs.push(new ExternalHyperlink({
        link: url,
        children: [new TextRun({ text: url, ...base, color: '1F4E8C', underline: {} })],
      }));
      if (url.length < t.length) runs.push(new TextRun({ text: t.slice(url.length), ...base }));
    } else if (t.startsWith('`')) {
      runs.push(new TextRun({ text: t.slice(1, -1), ...base, font: 'Consolas' }));
    } else if (t.startsWith('<br')) {
      runs.push(new TextRun({ text: '', break: 1, ...base }));
    } else {
      runs.push(...enLinea(t.slice(1, -1), { ...base, italics: true }));
    }
    ultimo = m.index + t.length;
  }
  if (ultimo < texto.length) runs.push(new TextRun({ text: texto.slice(ultimo), ...base }));
  return runs;
}

// ---------- Tablas ----------
const dividirFila = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '')
  .split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));

function anchosColumnas(filas) {
  const n = filas[0].length;
  const largo = (s) => s.replace(/\*\*|`|<br\s*\/?>/g, ' ').length;
  const pesos = [];
  for (let c = 0; c < n; c++) {
    const celdas = filas.slice(1).map((f) => largo(f[c] || ''));
    const prom = celdas.length ? celdas.reduce((a, b) => a + b, 0) / celdas.length : 0;
    const max = celdas.length ? Math.max(...celdas) : 0;
    const enc = Math.max(...filas[0][c].split(/\s+/).map((w) => w.length), 4);
    pesos.push(Math.max(prom * 0.7 + max * 0.3, enc * 1.1, 5));
  }
  // Ancho mínimo: que la palabra más larga de la columna quepa sin partirse.
  const minimos = [];
  for (let c = 0; c < n; c++) {
    const palabras = filas.flatMap((f, r) => (f[c] || '').replace(/\*\*|`|<br\s*\/?>/g, ' ')
      .split(/[\s/]+/).map((w) => w.length * (r === 0 ? 112 : 100)));
    minimos.push(Math.max(...palabras, 400) + 220);
  }
  const total = pesos.reduce((a, b) => a + b, 0);
  let anchos = pesos.map((p, c) => Math.max(Math.round((p / total) * ANCHO_UTIL), minimos[c]));
  // Ajustar al ancho útil quitando espacio a las columnas con holgura.
  for (let vuelta = 0; vuelta < 20; vuelta++) {
    const exceso = anchos.reduce((a, b) => a + b, 0) - ANCHO_UTIL;
    if (exceso === 0) break;
    const holguras = anchos.map((a, c) => Math.max(a - minimos[c], 0));
    const totalHolgura = holguras.reduce((a, b) => a + b, 0);
    if (exceso < 0 || totalHolgura === 0) {
      const mayor = anchos.indexOf(Math.max(...anchos));
      anchos[mayor] -= exceso;
      break;
    }
    anchos = anchos.map((a, c) => a - Math.round(exceso * holguras[c] / totalHolgura));
  }
  const ajuste = anchos.reduce((a, b) => a + b, 0) - ANCHO_UTIL;
  anchos[anchos.indexOf(Math.max(...anchos))] -= ajuste;
  return anchos;
}

function tabla(filas) {
  const anchos = anchosColumnas(filas);
  const borde = { style: BorderStyle.SINGLE, size: 4, color: SENCILLO ? '8C8C8C' : BORDE };
  const bordes = { top: borde, bottom: borde, left: borde, right: borde };
  const celda = (texto, c, esEncabezado, r) => new TableCell({
    width: { size: anchos[c], type: WidthType.DXA },
    borders: bordes,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 50, bottom: 50, left: 90, right: 90 },
    shading: esEncabezado
      ? { type: ShadingType.CLEAR, color: 'auto', fill: SENCILLO ? 'E7E6E6' : GUINDA }
      : (!SENCILLO && r % 2 === 0 ? { type: ShadingType.CLEAR, color: 'auto', fill: GUINDA_CLARO } : undefined),
    children: texto.split(/<br\s*\/?>/).map((parte) => new Paragraph({
      spacing: { before: 0, after: 0, line: 240, lineRule: LineRuleType.AUTO },
      children: enLinea(parte, esEncabezado
        ? { bold: true, color: SENCILLO ? '000000' : 'FFFFFF', size: 17 }
        : { size: 17 }),
    })),
  });
  return new Table({
    width: { size: ANCHO_UTIL, type: WidthType.DXA },
    columnWidths: anchos,
    layout: TableLayoutType.FIXED,
    rows: filas.map((f, r) => new TableRow({
      tableHeader: r === 0,
      cantSplit: true,
      children: anchos.map((_, c) => celda(f[c] || '', c, r === 0, r)),
    })),
  });
}

// ---------- Bloques ----------
const hijos = [];
let tituloPuesto = false;
let instanciaNumerada = 0;
const espacio = () => new Paragraph({ spacing: { before: 0, after: 60 }, children: [] });

for (let i = 0; i < lineas.length; i++) {
  const l = lineas[i];
  if (!l.trim()) continue;

  const h = l.match(/^(#{1,4})\s+(.*)$/);
  if (h) {
    const nivel = h[1].length;
    const texto = h[2].trim();
    if (nivel === 1 && !tituloPuesto) {
      tituloPuesto = true;
      hijos.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 240 },
        children: [new TextRun({ text: texto.replace(/\*\*/g, ''), bold: true, size: 32, font: FUENTE_TITULOS })],
      }));
    } else if (nivel <= 2) {
      const oficial = esSeccionOficial(texto);
      hijos.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        keepNext: true,
        numbering: oficial ? { reference: 'secciones', level: 0 } : undefined,
        children: [new TextRun({ text: texto.replace(/\*\*/g, '') })],
      }));
    } else if (nivel === 3) {
      hijos.push(new Paragraph({ heading: HeadingLevel.HEADING_2, keepNext: true, children: enLinea(texto) }));
    } else {
      hijos.push(new Paragraph({ heading: HeadingLevel.HEADING_3, keepNext: true, children: enLinea(texto) }));
    }
    continue;
  }

  if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) continue;

  const img = l.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
  if (img) {
    const ruta = path.resolve(path.dirname(entrada), img[2]);
    const datos = fs.readFileSync(ruta);
    const anchoPx = datos.readUInt32BE(16);
    const altoPx = datos.readUInt32BE(20);
    const ancho = Number(process.env.ANCHO_FIG) || 600;
    hijos.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      keepNext: true,
      spacing: { before: 120, after: 60 },
      children: [new ImageRun({
        type: 'png', data: datos,
        transformation: { width: ancho, height: Math.round(ancho * altoPx / anchoPx) },
        altText: { title: img[1], description: img[1], name: path.basename(ruta) },
      })],
    }));
    if (img[1]) {
      hijos.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: enLinea(img[1], { italics: true, size: 17, color: GRIS }),
      }));
    }
    continue;
  }

  if (/^\s*```/.test(l)) {
    const codigo = [];
    while (++i < lineas.length && !/^\s*```/.test(lineas[i])) codigo.push(lineas[i]);
    for (const c of codigo) {
      hijos.push(new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: c, font: 'Consolas', size: 17 })] }));
    }
    hijos.push(espacio());
    continue;
  }

  if (l.trim().startsWith('|') && i + 1 < lineas.length && /^\s*\|?\s*:?-{2,}/.test(lineas[i + 1])) {
    const filas = [dividirFila(l)];
    i += 1;
    while (i + 1 < lineas.length && lineas[i + 1].trim().startsWith('|')) filas.push(dividirFila(lineas[++i]));
    hijos.push(tabla(filas));
    hijos.push(espacio());
    continue;
  }

  if (/^\s*>/.test(l)) {
    const partes = [l.replace(/^\s*>\s?/, '')];
    while (i + 1 < lineas.length && /^\s*>/.test(lineas[i + 1])) partes.push(lineas[++i].replace(/^\s*>\s?/, ''));
    hijos.push(new Paragraph({
      indent: { left: 360 },
      border: { left: { style: BorderStyle.SINGLE, size: 18, color: GUINDA, space: 8 } },
      spacing: { before: 60, after: 160 },
      children: enLinea(partes.join(' ').trim(), { italics: true, color: '3A3A3A' }),
    }));
    continue;
  }

  const lista = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
  if (lista.test(l)) {
    const numerada = /^\s*\d+[.)]/.test(l);
    const instancia = numerada ? ++instanciaNumerada : 0;
    while (i < lineas.length && (lista.test(lineas[i]) || (/^\s{2,}\S/.test(lineas[i]) && !lineas[i].trim().startsWith('|')))) {
      const m = lineas[i].match(lista);
      if (m) {
        const nivel = Math.min(Math.floor(m[1].replace(/\t/g, '    ').length / 2), 2);
        const esNum = /\d/.test(m[2]);
        let texto = m[3];
        while (i + 1 < lineas.length && /^\s{2,}\S/.test(lineas[i + 1]) && !lista.test(lineas[i + 1])) {
          texto += ' ' + lineas[++i].trim();
        }
        hijos.push(new Paragraph({
          numbering: esNum
            ? { reference: 'numeros', level: nivel, instance: instancia }
            : { reference: 'vinetas', level: nivel },
          spacing: { before: 0, after: 70 },
          children: enLinea(texto),
        }));
      }
      i++;
    }
    i--;
    hijos.push(espacio());
    continue;
  }

  if (/^\*\*Tabla [IVXL]+\.\*\*/.test(l.trim())) {
    hijos.push(new Paragraph({
      alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 80 },
      children: enLinea(l.trim(), { size: 18 }),
    }));
    continue;
  }

  if (/^\*\*[^*]+:\*\*/.test(l.trim()) || /^\*\*[^*]+\*\*:/.test(l.trim())) {
    hijos.push(new Paragraph({ spacing: { before: 0, after: 50 }, children: enLinea(l.trim()) }));
    continue;
  }

  const parrafo = [l.trim()];
  while (
    i + 1 < lineas.length && lineas[i + 1].trim() &&
    !/^(#{1,4}\s|\s*[-*+]\s|\s*\d+[.)]\s|\s*>|\s*\||\s*```|\s*-{3,}\s*$)/.test(lineas[i + 1])
  ) parrafo.push(lineas[++i].trim());
  hijos.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: enLinea(parrafo.join(' ')) }));
}

// ---------- Encabezado y pie oficiales ----------
const encabezado = fs.readFileSync(path.join(ASSETS, 'encabezado-oficial.jpg'));
const barra = fs.readFileSync(path.join(ASSETS, 'barra-pie.png'));
const ANCHO_LOGOS = 610;
const header = new Header({
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0, line: 240, lineRule: LineRuleType.AUTO },
    children: [new ImageRun({
      type: 'jpg', data: encabezado,
      transformation: { width: ANCHO_LOGOS, height: Math.round(ANCHO_LOGOS * 71 / 1304) },
    })],
  })],
});
const ALTO_BARRA_PX = 11;
const footer = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 0, after: 0, line: 240, lineRule: LineRuleType.AUTO },
    children: [
      new ImageRun({
        type: 'png', data: barra,
        transformation: { width: 816, height: ALTO_BARRA_PX },
        floating: {
          horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
          verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: 11 * 914400 - ALTO_BARRA_PX * 9525 },
          allowOverlap: true,
          wrap: { type: TextWrappingType.NONE },
        },
      }),
      new TextRun({ text: 'UbicaJC · Anteproyecto · Reto Carnes JC · JII 2026    ', size: 15, color: GRIS }),
      new TextRun({ children: ['Página ', PageNumber.CURRENT, ' de ', PageNumber.TOTAL_PAGES], size: 15, color: GRIS }),
    ],
  })],
});

const vineta = (nivel, texto) => ({
  level: nivel, format: LevelFormat.BULLET, text: texto, alignment: AlignmentType.LEFT,
  style: { paragraph: { indent: { left: 360 + nivel * 360, hanging: 260 } } },
});
const numero = (nivel, formato, texto) => ({
  level: nivel, format: formato, text: texto, alignment: AlignmentType.LEFT,
  style: { paragraph: { indent: { left: 400 + nivel * 360, hanging: 320 } } },
});

const doc = new Document({
  creator: 'Equipo UbicaJC',
  title: 'Anteproyecto UbicaJC — Reto Carnes JC',
  styles: {
    default: { document: { run: { font: FUENTE, size: 21 }, paragraph: { spacing: { after: 110, line: 264, lineRule: LineRuleType.AUTO } } } },
    paragraphStyles: [
      {
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FUENTE_TITULOS, size: 27, bold: true, color: '000000' },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FUENTE, size: 22, bold: true, color: GUINDA },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FUENTE, size: 21, bold: true, color: '333333' },
        paragraph: { spacing: { before: 140, after: 60 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'secciones',
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { font: FUENTE_TITULOS } },
        }],
      },
      { reference: 'vinetas', levels: [vineta(0, '•'), vineta(1, '–'), vineta(2, '◦')] },
      {
        reference: 'numeros',
        levels: [
          numero(0, LevelFormat.DECIMAL, '%1.'),
          numero(1, LevelFormat.LOWER_LETTER, '%2)'),
          numero(2, LevelFormat.LOWER_ROMAN, '%3.'),
        ],
      },
    ],
  },
  footnotes: notas,
  sections: [{
    properties: {
      page: {
        size: { width: PAGINA.ancho, height: PAGINA.alto },
        margin: {
          top: PAGINA.arriba, bottom: PAGINA.abajo, left: PAGINA.izq, right: PAGINA.der,
          header: 560, footer: 520,
        },
      },
    },
    headers: { default: header },
    footers: { default: footer },
    children: hijos,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(salida, buf);
  console.log(`Listo: ${salida} (${Object.keys(notas).length} notas al pie)`);
});
