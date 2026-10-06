# ANTEPROYECTO

**Proyecto:** UbicaJC: sistema de ubicación y trazabilidad por lote para cámaras frigoríficas[^nombre]
**Programa:** Jóvenes Impulsando la Industria 2026, COECYT Sonora · **Sector:** Agroindustria y Alimentos
**Empresa:** Carnes JC · **Reto:** Gestión y Administración de Inventarios
**Institución:** Instituto Tecnológico de Hermosillo, Tecnológico Nacional de México (TecNM)
**Integrantes:** Héctor Rafael Esquer Camacho (Ing. en Sistemas Computacionales) · Mauro Acuña Olivarria (Ing. Mecatrónica) · Francisco Efraín Pazos Quintero (Ing. Mecatrónica)
**Asesor:** Jesús Renato Montoya Morales · **Periodo:** 13 de octubre al 27 de noviembre de 2026
**Lema:** “Tradición trazable: cada tarima en su lugar”

## Objetivo

Diseñar y validar, del 13 de octubre al 27 de noviembre de 2026, UbicaJC, un sistema de ubicación y trazabilidad por lote para las cámaras frigoríficas de Carnes JC, mediante un prototipo funcional y una prueba piloto en una cámara, para reducir al menos 50% el tiempo de localización de tarimas, alcanzar una exactitud de ubicación de 97% o más, asegurar la salida por FEFO (primero en caducar, primero en salir) y operar sin internet, como base para escalar a las 6 cámaras.

## Objetivos Específicos

1. Diagnosticar en la semana 1 (S1) el flujo de la cámara piloto y medir su línea base de tiempos, exactitud, búsquedas fallidas y capturas.
2. Codificar en S2 el 100% de las ubicaciones de la cámara piloto con etiquetas para congelación legibles al primer intento en 98% o más de los casos.
3. Desarrollar en S3 y S4 un prototipo funcional en servidor local con alta, acomodo, búsqueda, salida, reubicación y conteo por doble escaneo, que lea Odoo sin escribir en él.
4. Programar la asignación automática (capacidad, fresco o congelado, caducidad) y el mapa 2D/3D, sin asignaciones a posiciones ocupadas o incompatibles.
5. Comprobar en S5 y S6 la operación sin internet en el 100% de al menos 5 cortes simulados, sin perder movimientos.
6. Ejecutar en S6 la prueba piloto con el personal de la cámara y medir los indicadores de la línea base.
7. Entregar en S7 el costo-beneficio, el diseño del escaneo en recepción y el plan de escalamiento y sostenimiento para las 6 cámaras.

## Planteamiento del problema

Carnes JC es una empresa 100% sonorense con cerca de 40 años y alrededor de 450 colaboradores (Productora Sonorense, Frigorífica Sonorense y Tradición Sonora), con sedes en Nogales, Hermosillo y Cd. Obregón, presencia en Sinaloa, Baja California Sur, Monterrey, Jalisco, Nayarit y la Ciudad de México, y exportaciones a Japón, Estados Unidos, Canadá, Rusia y Vietnam. Su visión es ser la productora y distribuidora de carne más sólida de México. Su reto:

> ¿Cómo podemos mejorar la identificación, ubicación y gestión de nuestro inventario para hacer más eficiente la operación de los almacenes?

La empresa reporta control parcial de inventarios, tiempos de búsqueda elevados, riesgo en vida de anaquel e impacto operativo y de calidad, y pide reducir procesos manuales, facilitar la localización y mejorar el control a aproximadamente −18 °C, con identificación precisa de productos, lotes y fechas de producción.

### Diagnóstico del flujo (recorrido en planta)

| Etapa | Lo observado | Implicación |
|---|---|---|
| Recepción de canales | 2 camiones y ~120 canales al día. Cada canal se registra con su lote en Odoo, en una hoja a mano y con un Excel abierto; su etiqueta trae número y datos impresos, probablemente sin código de barras. No hay escáner. | Doble o triple captura. Estimación del personal: ~40 canales más por día con escáner (~33%). |
| Corte, vacío y embalaje | Corte en ~3 líneas (2 en uso); vacío en Super Vac (~20 s por ciclo) y Smart Vac (~1 min). Cada caja se etiqueta y la tarima emplayada lleva una etiqueta master con código de barras; Odoo registra la producción y el montacarguista, con pistola de escaneo, valida la tarima. | La tarima ya tiene identidad digital: es el punto de partida de UbicaJC. |
| Cámaras | 6 cámaras (C1, C2, C3A, C3B, C4 y C5): 4 de congelados y 2 de frescos (C4 congelados y C5 frescos; el resto por confirmar), con 16 o 32 racks de 5 niveles a ambos lados de un pasillo central; 4 cortinas con una PC cada una y 2 montacargas por turno. La tarima se da de alta en “Zorro”, un software antiguo sin conexión con Odoo que depende de internet. Solo algunos racks están identificados. | Aquí se rompe el vínculo entre lo físico y lo digital. |

### Problema central y causas raíz

La tarima ya tiene identidad (master con código de barras y registro en Odoo); lo que falta es controlar dónde está y cada vez que se mueve. Hoy se captura en Odoo y otra vez en Zorro, si se cae internet no hay sistema y hay **ubicaciones fantasma**: alguien saca producto sin actualizar el sistema y quien llega después lo busca donde el sistema indica, pero ya no está. Además, a −18 °C constantes la carne es inocua, pero su calidad se degrada con el tiempo[^fsis]; sin saber dónde está cada lote, es difícil sacar primero el que vence antes.

| Síntoma | Causa directa | Causa raíz | Respuesta de UbicaJC |
|---|---|---|---|
| Ubicaciones fantasma | Salidas y reubicaciones sin registrar | Nada obliga a confirmar el movimiento en el rack | Doble escaneo obligatorio |
| Búsquedas largas y retrabajo | Ubicación incierta; racks sin etiqueta | No hay codificación única ni mapa | Código por rack-nivel y mapa |
| Doble captura | La tarima se registra en Odoo y otra vez en Zorro | Zorro no está integrado con Odoo | Datos leídos de Odoo |
| Sin sistema si falla internet | Zorro depende de la conexión | No hay servidor local | Servidor en planta |
| Riesgo en la rotación | No se sabe dónde está el lote que vence antes | El acomodo no considera la caducidad | FEFO desde el acomodo |
| Inventario que pierde exactitud | Las diferencias aparecen cuando algo no se encuentra | No hay conteo cíclico ni indicador | Conteo disparado por “No encontrado” |

### Justificación

Si no se atiende, las ubicaciones fantasma seguirán costando búsquedas, retrabajo y embarques con un lote distinto al comprometido, una caída de internet seguirá dejando sin sistema a las 6 cámaras y la rotación dependerá de la memoria del personal. No es descuido: en un estudio de unos 370,000 registros de inventario, 65% no coincidía con lo físico[^dehoratius]; se corrige registrando en el momento del movimiento y con conteo cíclico.

La trazabilidad por lote es, además, obligatoria: en los establecimientos TIF debe garantizarse con registros, lotes, códigos de barras o dispositivos electrónicos que incluyan lote, fechas de producción, empaque y caducidad, cantidad, peso y destino[^rlfsa]; la NOM-251-SSA1-2009 pide identificar el producto para aplicar PEPS y registrar producto, lote, cantidad y fecha[^nom251], y Canadá, uno de sus destinos, exige rastrear cada lote un paso atrás y uno adelante y entregar los registros en 24 h[^sfcr].

## Propuesta de mejora

UbicaJC convierte cada cámara en un almacén con dirección (p. ej., C3A-R07-N3: cámara, rack y nivel) y obliga a confirmar en el rack cada movimiento. **No sustituye a Odoo: lo complementa con la capa de ubicación que hoy vive aislada en Zorro y elimina la dependencia de internet.**

### Principios de diseño

| Principio | Cómo funciona |
|---|---|
| Una sola fuente de verdad | Producto, lote y fechas vienen de Odoo al escanear la master; UbicaJC solo agrega la ubicación y la bitácora (quién, qué, dónde y cuándo). |
| Funciona sin internet | Servidor local con UPS; la sincronización con Odoo se encola y se reanuda sola. |
| Doble escaneo obligatorio (poka-yoke) | Sin escanear en el rack la ubicación y la master, el movimiento no se registra. |
| Asignación por reglas, con FEFO desde la entrada | Posición libre, con capacidad y del tipo correcto (fresco o congelado); lo que vence antes, en lo más accesible. |
| Mapa 2D/3D | Ocupación, tarima buscada y semáforo de caducidad por rack y nivel. |
| Inventario que se autocorrige | “No encontrado” marca la ubicación en duda, ofrece la siguiente tarima FEFO y genera un conteo que registra la causa. |
| Tablero de KPIs | Localización, exactitud, “no encontrado”, doble escaneo, cumplimiento FEFO, ocupación y lotes por vencer. |

### Flujo operativo

1. **Entrada:** en la cortina se escanea la master; UbicaJC trae de Odoo producto, lote y fechas.
2. **Acomodo:** UbicaJC sugiere la posición; en el rack se escanean ubicación y master, con fecha, hora y responsable.
3. **Búsqueda:** por producto, lote, master o pedido, en orden FEFO y con la posición en el mapa.
4. **Salida:** se indica la tarima que sale primero; se escanean ubicación y master, y tomar otra exige un motivo.
5. **Reubicación:** se escanean origen, master y destino.
6. **Conteo cíclico:** programado por ubicación y disparado por cada “No encontrado”.
7. **Sin internet:** todo sigue en la red local, con la hora de la última sincronización a la vista.

Un prototipo navegable con datos simulados ya muestra estos flujos, incluidas una ubicación fantasma y una caída de internet: [ENLACE AL PROTOTIPO].

### Arquitectura y tecnologías

| Capa | Qué se propone | Fundamento |
|---|---|---|
| Datos maestros | El Odoo actual (productos, lotes con caducidad y tarimas), leído por API JSON-2 (Odoo 19 o posterior) o XML-RPC (18 o anterior); sin API, archivos CSV en el piloto. | Odoo ya maneja ubicaciones con código de barras, lotes, FEFO y tarimas[^odoo-func]. |
| Servidor local | Mini PC (Intel N100, 16 GB, SSD) fuera del frío y con UPS; aplicación web con mapa y KPIs para las PC de las cortinas y equipos móviles. | Sin conexión, Odoo 19 solo consulta y Odoo 20 cubre cortes breves; en la nube, la API exige el plan Personalizado[^odoo-api]. |
| Captura | La pistola actual, si es compatible, o un lector industrial inalámbrico que guarda lecturas; interfaz de “escanear primero” para usar con guantes. | Reutiliza lo que ya existe. |
| Etiquetas | Ubicación: Code 128 con texto grande y adhesivo aplicable a −23 °C o menos, impresa en planta, y etiqueta multinivel a la altura de la mano para los niveles 4 y 5. Tarima: la master; al escalar, GS1-128 con SSCC, lote, fechas y peso. | Los adhesivos comunes fallan en frío[^etiquetas]; GS1-128 es el estándar cárnico y Odoo lo interpreta[^gs1]. |

**Odoo nativo o capa propia (se decide en S2).** Odoo nativo no acomoda por caducidad ni reparte cantidades, y su app de escaneo es de Enterprise[^odoo-limites]; un sistema aislado como Zorro duplica la captura. Se recomienda el esquema híbrido, a confirmar con la versión, edición, hospedaje y plan de Odoo; al escalar, UbicaJC escribirá los movimientos en Odoo, que quedará como única fuente de verdad, y Zorro podrá retirarse.

### Prueba piloto: esquema de validación

- **Dónde, cuándo y quién:** una cámara elegida con Carnes JC (se sugiere una de congelados de 16 racks: 80 posiciones, o 160 con 2 tarimas por nivel), del 17 al 20 de noviembre, con su personal capacitado en S5.
- **Cómo:** días 1 y 2 en paralelo con Zorro, que sigue como registro oficial; días 3 y 4, si Carnes JC lo autoriza, solo con UbicaJC y Zorro como respaldo. No se escribe en Odoo.
- **Mediciones y decisión:** se repite el protocolo de la línea base; con las metas M1 a M8, Carnes JC decide en S7 si escala, ajusta o detiene.

### Mejora rápida complementaria: escaneo en recepción (solo diseño)

Hoy se capturan ~120 canales al día en Odoo, hoja y Excel; el personal estima ~40 canales más por día con escáner (~33%), dato que se validará cronometrando 20 capturas en S1. Diseño: código de barras en la etiqueta del canal, acordado con el proveedor (sin él no hay ahorro); lector USB 2D en modo teclado que escribe en Odoo sin programar ($1,069–2,489 MXN por estación)[^hid], y fin de la hoja y el Excel.

### Qué la hace innovadora

- **Candado contra la ubicación fantasma:** el doble escaneo en el rack ataca la causa, el movimiento sin registro, en lugar de pedir “más cuidado”.
- **FEFO desde la entrada:** la rotación se decide al acomodar, algo que las reglas nativas de Odoo no hacen.
- **Inventario que se autocorrige y opera sin internet:** cada “No encontrado” dispara un conteo con su causa (8D si se repite).
- **Hecha para −18 °C con lo que ya existe:** etiquetas para congelación, niveles altos legibles desde el piso e interfaz para guantes, sobre Odoo, masters y pistolas actuales; el piloto cuesta menos de la cuarta parte de una terminal industrial para congelación.

### Alcance y exclusiones

- **Incluye:** diagnóstico, diseño, prototipo con lectura de Odoo, piloto en una cámara, capacitación, manual, costo-beneficio y plan de escalamiento; como marca la convocatoria, llega hasta la fase de diseño, no a la implantación en las 6 cámaras.
- **No incluye:** escritura en Odoo, cambios a Zorro, implantación en recepción, compra de equipo (a cargo de Carnes JC) ni RFID UHF, descartado porque el agua y el hielo de la carne absorben la señal: a 915 MHz se leyó 61.9% de etiquetas con carne fresca contra 97.6% con enlatados[^rfid].
- **Por confirmar en S1:** datos de Odoo (versión, edición, hospedaje, plan y lotes con caducidad), formato de la master, pistola, tarimas por nivel, cajas sueltas, tipo de C1 a C3B y vida útil comercial.

### Costos estimados (preliminares)

| Concepto | Opción para el piloto | MXN | Fuente |
|---|---|---|---|
| Etiquetas de ubicación y multinivel (80–160 posiciones + 20%) | Impresas en planta, material para congelación | 1,000–4,000 | Estimación |
| Captura en cámara | Pistola actual / lector Zebra DS3678-SR | 0 / 14,739 | Cyberpuerta |
| Servidor local | Mini PC Intel N100, 16 GB, SSD de 512 GB | 3,600–7,400 | Amazon, Cyberpuerta |
| Respaldo eléctrico | 1 o 2 UPS APC BE600M1 | 1,439–2,878 | Cyberpuerta |
| Software y Odoo | Desarrollo propio; funciones Community | 0 en licencias | Odoo |
| **Total con 10% de imprevistos** | **Pistola actual / lector nuevo** | **≈6,600–15,700 / ≈22,900–31,900** | |

Precios en línea de octubre de 2026, a cotizar en S2[^precios]. Para escalar, una terminal para congelación con calefacción (Zebra MC9400 Freezer o Honeywell CK65) cuesta ≈$71,000–87,000 MXN con IVA.

### Limitaciones y riesgos

| Riesgo o limitación | Mitigación |
|---|---|
| Odoo sin API o lotes sin caducidad | Piloto con archivos CSV; para escalar, plan Personalizado (≈$340 contra ≈$228 MXN del Estándar, por usuario al mes) o servidor propio |
| La master no se puede ligar a Odoo | Tabla de equivalencias; GS1-128 con SSCC al escalar |
| Pistola, señal o etiquetas no aptas a −18 °C | Prueba de 7 días y medición de señal en S2; lector DS3678 (de −20 a 50 °C, al límite; guarda lecturas) o terminal para congelación; cargadores fuera de la cámara y 5 min de espera al salir, por la condensación[^frio] |
| Movimientos sin escanear durante el paralelo | Capacitación, 2 escaneos por movimiento y auditoría diaria; el “No encontrado” detecta omisiones |
| Plazo de 7 semanas o poco acceso a la cámara | Prototipo ya construido, alcance mínimo, 15% de horas en reserva y calendario acordado; plan B: piloto en una sección |
| Exposición del equipo al frío | Equipo de protección, estancias cortas y trabajo en pareja |

### Impacto esperado

| Tipo | Impacto esperado |
|---|---|
| Económico | Liberará horas de montacargas y personal que hoy se van en buscar y retrabajar; el ahorro se calculará en S7: (tiempo antes − después) × movimientos por día × días de operación. Habrá menos producto fuera de vida comercial y menos rechazos. En recepción, ~40 canales más por día (~33%, estimación del personal) con $1,069–2,489 MXN por estación. |
| Operativo y organizacional | Sin doble captura ni dependencia de internet; exactitud de 97% o más (la mediana de los centros de distribución es 98.4%, según WERC[^werc]); procedimiento estándar de doble escaneo y conteo. |
| Calidad, inocuidad y trazabilidad | FEFO desde el acomodo y evidencia de PEPS (NOM-251); lote, ubicación y movimiento por tarima (art. 25 del RLFSA); un lote ubicado en 30 min o menos, frente a las 24 h que da la autoridad canadiense. |
| Social y seguridad | Menos minutos en la cámara por movimiento; la NOM-015-STPS-2001 limita la exposición diaria al frío (hasta 8 h entre 0 y −18 °C, y menos por debajo)[^nom015]. |
| Ambiental y energético | Menos búsquedas y menos puerta abierta podrán reducir la carga de refrigeración, en la que la infiltración de aire y sus cargas asociadas pueden superar la mitad en almacenes de distribución[^energia]; se medirá con las aperturas de puerta de S1 y S6. |

## Metas

Las metas aplican a la cámara piloto y traducen el objetivo de Carnes JC: rapidez (M1), precisión (M2 a M4) y rotación (M7). La línea base se mide en S1 con el protocolo que se repite en S6; las metas se confirman por escrito con Carnes JC al cerrar S1 y no se reportará ningún resultado no medido.

| # | Meta | Indicador (fórmula) | Línea base | Medición | Fecha |
|---|---|---|---|---|---|
| M1 | Reducir 50% o más el tiempo de localización | (T antes − T después) / T antes × 100; T: promedio de la solicitud a tener la tarima correcta | S1 | 20 búsquedas en S1 y 20 en S6; media y rango | 20 nov |
| M2 | Exactitud de ubicación de 97% o más | Ubicaciones sin error / auditadas × 100 | S1 (Zorro) | Auditoría de 30 ubicaciones al azar | 20 nov |
| M3 | “No encontrado” en 2% o menos, con conteo en el turno | Búsquedas fallidas / búsquedas × 100 | S1 | Bitácora de S6 | 20 nov |
| M4 | 100% de movimientos con doble escaneo | Movimientos con doble escaneo / observados × 100 | 0% | Observación de 20 movimientos | 20 nov |
| M5 | Operación sin internet en 100% de los cortes | Cortes superados / realizados × 100; 0 movimientos perdidos | Sin sistema | 5 cortes simulados (S5 y S6) | 20 nov |
| M6 | Eliminar la doble captura en la cámara piloto | Datos tecleados por movimiento (meta: 0) | S1 | Observación, días 3 y 4 del piloto | 20 nov |
| M7 | 100% de salidas con sugerencia FEFO; excepciones con motivo | Salidas FEFO o con motivo / salidas × 100 | S1 | Bitácora de salidas | 20 nov |
| M8 | Rastrear un lote completo en 30 min o menos | Minutos para listar y confirmar sus tarimas | S1 | Simulacro en S1 y S6 | 20 nov |
| M9 | PPC de 90% o más cada semana | Tareas completadas / programadas × 100 (y PAER) | — | Revisión de cada viernes | Semanal |

M1 mide el tiempo de localización, no el ciclo completo de surtido, en el que los casos publicados reportan mejoras moderadas (9 a 15% con un sistema de gestión de almacén)[^dsv].

## Cronograma (7 semanas)

| Sem. | Fechas | Fase | Actividades principales | Responsable | Entregable o hito |
|---|---|---|---|---|---|
| S1 | 13–16 oct | Inicio y diagnóstico | Acta y alcance; elegir la cámara; levantamiento físico; mapa del proceso; Ishikawa y 5 porqués con el personal; línea base; confirmar Odoo, master y pistola | Mauro · Héctor · Pazos | Línea base y alcance firmados |
| S2 | 19–23 oct | Diseño | Codificación; reglas de asignación; arquitectura; decisión sobre Odoo; prueba de etiquetas y pistola a −18 °C; señal; cotización | Mauro · Héctor · Pazos | Diseño aprobado y cotización |
| S3 | 26–30 oct | Desarrollo I | Servidor local; lectura de Odoo; alta, acomodo y búsqueda con doble escaneo; etiquetado de la cámara | Héctor · Pazos · Mauro | Registro funcional |
| S4 | 3–6 nov | Desarrollo II | Motor de asignación; salida, reubicación, conteo y “No encontrado”; mapa y KPIs; pruebas | Héctor · Mauro · Pazos | Demostración a Carnes JC |
| S5 | 9–13 nov | Integración y pruebas | Prueba integral en la cámara; 3 cortes simulados; respaldo; manual; capacitación | Pazos · Héctor · Mauro | Listo para piloto |
| S6 | 17–20 nov | Prueba piloto | 2 días en paralelo con Zorro y 2 solo con UbicaJC; soporte; mediciones; 2 cortes; simulacro de rastreo | Equipo completo | Piloto medido |
| S7 | 23–27 nov | Cierre y sostenimiento | Análisis antes y después; costo-beneficio; planes de escalamiento y sostenimiento; informe | Pazos · Héctor · Mauro | Entrega final (27 nov) |

**Horas.** Capacidad: 315 h (3 integrantes × 15 h × 7 semanas). Planeadas: 268 h (85%): 38 en S1, 40 en S2 a S4, 38 en S5 y S6, y 34 en S7 (Héctor 90, Mauro 88 y Pazos 90). Reserva: 47 h (15%). El 16 de noviembre es feriado.

**Roles.** Héctor: software, integración con Odoo, motor de asignación y coordinación. Mauro: levantamiento físico, codificación de ubicaciones, mapa de cámaras y medición de tiempos. Pazos: infraestructura y red local, hardware y etiquetas para −18 °C, cotización, pruebas, capacitación e informe.

**Seguimiento (PMI).** Acta de constitución, Gantt semanal, PPC y PAER cada viernes, reunión semanal de 30 min con el enlace de almacén de Carnes JC, control de cambios e hitos de aprobación en S1, S2, S4, S5 y S7.

**Cierre y sostenimiento.** Ciclo PDCA (planear en S1–S2, hacer en S3–S6, verificar en S6–S7 y actuar: estandarizar doble escaneo, conteo cíclico semanal y revisión mensual de KPIs); toda desviación repetida se analiza con 8D. El plan de escalamiento a las 6 cámaras fija orden de arranque (congelados primero), equipo y costo por cámara, capacitación, escritura en Odoo, retiro gradual de Zorro si Carnes JC lo aprueba y master en GS1-128.

## Referencias

- Aires dos Santos, E. J. (2021). Caso DSV Vila do Conde (tesis de maestría, ISEP). [recipp.ipp.pt](https://recipp.ipp.pt/entities/publication/53d98f57-73b6-4970-80cd-222358863620)
- ASHRAE. *Handbook—Refrigeration*, “Refrigerated-Facility Loads”, citado en Plant Engineering. https://www.plantengineering.com/?p=8025
- Camcode (camcode.com): [Cold Storage Rack Labels](https://www.camcode.com/wp-content/uploads/2021/09/cold-storage-rack-labels-product-sheet.pdf) y [Multi-Level Rack Labels](https://www.camcode.com/multi-level-rack-labels).
- CFIA (inspection.canada.ca): [Traceability requirements, Safe Food for Canadians Regulations](https://inspection.canada.ca/en/food-safety-industry/toolkit-food-businesses/traceability-requirements).
- Cleverence (cleverence.com): [How to calculate inventory accuracy rate](https://www.cleverence.com/articles/for-business/how-to-calculate-inventory-accuracy-rate-6381/), con datos de WERC.
- DeHoratius, N. y Raman, A. (2008). Inventory record inaccuracy: An empirical analysis. *Management Science*, 54(4), 627–641. https://doi.org/10.1287/mnsc.1070.0789
- GS1 (gs1.org): [Global Meat and Poultry Guideline](https://mocdn.gs1.org/docs/traceability/GS1_Global_Meat_and_Poultry_Guideline_Part1_The_GS1_System.pdf).
- Laniel y Émond (2010). [Lectura RFID a 915 MHz en un contenedor refrigerado](https://agris.fao.org/search/en/records/65dec9ac0f3e94b9e5d15f3b) (AGRIS, FAO).
- Normatividad mexicana: [NOM-015-STPS-2001](https://asinom.stps.gob.mx/upload/noms/Nom-015.pdf), [NOM-194-SSA1-2004](https://faolex.fao.org/docs/pdf/mex64059.pdf), [NOM-251-SSA1-2009](https://dof.gob.mx/normasOficiales/3980/salud/salud.htm) y [Reglamento de la Ley Federal de Sanidad Animal, art. 25](https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LFSA.pdf).
- Odoo S.A. Documentación de Odoo 19.0 y 20.0 (odoo.com/documentation): [ubicaciones](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/warehouses_storage/inventory_management/use_locations.html), [categorías de almacenamiento](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/shipping_receiving/daily_operations/storage_category.html), [FEFO](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/shipping_receiving/removal_strategies/fefo.html), [nomenclatura GS1](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/barcode/operations/gs1_nomenclature.html), [hardware de código de barras](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/barcode/setup/hardware.html), [API RPC](https://www.odoo.com/documentation/19.0/developer/reference/external_rpc_api.html), [Odoo Online](https://www.odoo.com/documentation/19.0/administration/odoo_online.html) y [modo sin conexión](https://www.odoo.com/documentation/20.0/applications/general/offline_mode.html).
- Precios consultados el 6 de octubre de 2026: [Zebra DS3678-SR](https://www.cyberpuerta.mx/Opiniones-sobre-Zebra-DS3678-SR-Lector-de-Codigo-de-Barras-LED-1D-2D-Incluye-Base-Cable-USB-y-Fuente-de-Poder-1/), [Zebra DS2208](https://www.cyberpuerta.mx/Punto-de-Venta-POS/Lectores-y-Terminales/Lectores-de-Codigo-de-Barras/Zebra-DS2208-Lector-de-Codigo-de-Barras-LED-1D-2D-Incluye-Cable-USB.html) y [APC BE600M1](https://www.cyberpuerta.mx/Energia/Proteccion-Contra-Descargas/No-Break-UPS/No-Break-UPS/No-Break-APC-BE600M1-Linea-Interactiva-330W-600VA-Entrada-92V-139V-Salida-120V-7-Salidas.html) en Cyberpuerta; [mini PC N100](https://www.amazon.com.mx/mini-pc-n100-16gb/s?k=mini+pc+n100+16gb) en Amazon México; [etiquetas de transferencia térmica](https://listado.mercadolibre.com.mx/etiquetas-transferencia-termica) en Mercado Libre; [Zebra MC9300 Cold Storage](https://zpsstore.com/mc930p-gfeeg4na-zebra-mc9300-mobile-computer) en ZPS Store; [Honeywell CK65 Cold Storage](https://spartanpos.com/products/ck65-l0n-b8n212f) en Spartan POS, y [planes de Odoo en México](https://oec.sh/odoo-pricing/mexico) en oec.sh.
- USDA-FSIS (fsis.usda.gov): [Freezing and Food Safety](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/freezing-and-food-safety).
- Zebra Technologies (zebra.com): [DS36X8 Product Reference Guide](https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/barcode-scanners/ds36x8-prg-en.pdf) y [MC9400/MC9450, aplicaciones de congelación](https://docs.zebra.com/us/en/mobile-computers/handheld/mc9-series/mc9400-mc9450-product-reference-guide/c-using-the-device/c-mc94-95-freezer-applications.html); etiquetas 8000T en [Levata](https://www.levata.com/zebra-8000t-freeze-labels).

[^nombre]: El nombre es una propuesta para uso interno de Carnes JC, dueña de la marca JC; la titularidad del desarrollo se acordará entre Carnes JC y el TecNM.
[^fsis]: USDA-FSIS: a −18 °C (0 °F) constantes el alimento siempre es inocuo; solo su calidad se afecta con el almacenamiento prolongado.
[^dehoratius]: DeHoratius y Raman (2008), 37 tiendas minoristas: la inexactitud bajaba con auditorías y subía con la complejidad; es estructural.
[^rlfsa]: Reglamento de la Ley Federal de Sanidad Animal, art. 25. El número TIF de la planta se confirma con Carnes JC.
[^nom251]: NOM-251-SSA1-2009: definición de Sistema PEPS (por fecha de recepción, vida útil o vida de anaquel) y numeral 5.4. La NOM-194-SSA1-2004 fija −18 °C como máximo para cárnicos congelados.
[^sfcr]: CFIA, Safe Food for Canadians Regulations, parte 5. Los registros se conservan 2 años.
[^odoo-func]: Odoo 19.0: ubicaciones jerárquicas con código de barras (p. ej., HMO/Stock/C1/R07/N3), lotes con caducidad y FEFO (módulo product_expiry, licencia LGPL-3), paquetes tipo tarima y conteos cíclicos por ubicación.
[^odoo-api]: Odoo 19.0 y 20.0: la API externa solo está en el plan Personalizado y Odoo Online no admite módulos propios, por eso UbicaJC es una capa externa. Sin conexión, la versión 19 solo muestra registros abiertos antes y la 20 encola ediciones para interrupciones breves.
[^etiquetas]: Camcode (aplicación desde −29 °C) y Zebra 8000T (desde −23 °C); Camcode, etiquetas multinivel para racks.
[^gs1]: GS1 Global Meat and Poultry Guideline (GTIN y lote por caja; SSCC por tarima); Odoo 19.0, nomenclatura GS1.
[^odoo-limites]: Odoo 19.0: “Odoo does not automatically split quantities across multiple storage locations”, y FEFO solo aplica al retirar. La app Barcode (stock_barcode) no existe en la edición Community.
[^hid]: Odoo, hardware de código de barras (modo teclado HID con sufijo Enter). Ghia GS2D2, $1,069; Zebra DS2208, $2,009–2,489 (Cyberpuerta); uso fuera de la cámara.
[^rfid]: Laniel y Émond (2010): 42 etiquetas en un contenedor refrigerado de 12 m. Queda como fase futura, por tarima y en andenes.
[^precios]: Etiquetas de poliéster, 1,000 con ribbon: $778.50 (falta confirmar adhesivo para congelación); mini PC N100, $3,592–7,399. Terminales: Zebra MC9300 Cold Storage, US$4,083.68; Honeywell CK65, US$3,314.91–4,006.74 (18.37 MXN/USD, FIX, 1 oct 2026). Planes de Odoo: oec.sh.
[^frio]: Zebra, DS36X8 Product Reference Guide (modo batch fuera de rango) y guía del MC9400/MC9450 para congelación (la carga se detiene bajo 0 °C).
[^werc]: WERC DC Measures 2018, vía Cleverence; el nivel “mejor de su clase” es de 99.88% o más.
[^nom015]: NOM-015-STPS-2001, tabla 2. El régimen de cada cámara se determina con la evaluación que exige la norma.
[^energia]: ASHRAE Handbook—Refrigeration, “Refrigerated-Facility Loads” (vía Plant Engineering).
[^dsv]: Aires dos Santos (2021), caso DSV: 9 a 15% menos tiempo de surtido tras implantar un WMS.
