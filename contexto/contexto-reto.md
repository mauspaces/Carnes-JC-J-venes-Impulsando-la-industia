# Contexto del reto — Carnes JC (JII Hermosillo 2026)

## Convocatoria
- Reto Carnes JC: **Gestión y Administración de Inventarios** (sector Agroindustria y Alimentos).
- Equipos de hasta 3 estudiantes + maestro tutor. Anteproyecto + cédula firmada (Enlace Institucional y Director/encargado de división).
- Fase 3: 7 semanas (13 oct – 27 nov 2026), "proyecto hasta la fase de diseño", metodología PMI.
- Evaluación: Claridad 20 · Impacto 25 · Creatividad e innovación 25 · Viabilidad 15 · Cumplimiento del plan 15.
- Premio: $50,000 MXN por reto.
- Formato de anteproyecto: Objetivo · Objetivos específicos · Planteamiento del problema · Propuesta de mejora · Metas · Cronograma (7 semanas).

## La empresa (presentación de Carnes JC en el taller)
- 100% sonorense, ~40 años, ~450 colaboradores.
- Unidades: Productora Sonorense, Frigorífica Sonorense, Tradición Sonora.
- Plantas/sedes en Sonora: Nogales, Hermosillo, Cd. Obregón.
- Presencia nacional: Sinaloa, Baja California Sur, Monterrey, Jalisco, Nayarit, CDMX.
- Exporta a: Japón, Estados Unidos, Canadá, Rusia, Vietnam.
- Pilares: alimentos cárnicos bajo estrictos estándares de inocuidad y calidad.
- Visión: ser la productora y distribuidora de carne más sólida de México.

## El reto (palabras de la empresa)
> ¿Cómo podemos mejorar la identificación, ubicación y gestión de nuestro inventario para hacer más eficiente la operación de los almacenes?

### Problemática actual
- **Control parcial de inventarios:** cajas y tarimas manejadas sin suficiente integración física y digital.
- **Tiempos de búsqueda elevados:** movimientos innecesarios y retrabajos frecuentes en pasillos.
- **Riesgo en vida de anaquel:** dificultad para mantener una adecuada rotación de lotes cárnicos.
- **Impacto operativo y de calidad:** afectaciones potenciales a la inocuidad y productividad del almacén.

### Consideraciones clave
- Objetivo central: reducir procesos manuales, facilitar localización y mejorar control.
- Ambiente congelado: operación a aprox. **-18 °C**.
- Atributos y lotes: identificación precisa de productos, lotes y fechas de producción.

### Qué esperan de los estudiantes
- **Propuesta fundamentada:** tecnologías, funcionamiento operativo, beneficios, costos y limitaciones.
- **Prueba piloto:** diseño de un esquema de validación inicial aplicable a la operación.
- **Objetivo final — Eficiencia en logística y trazabilidad:** localizar productos con mayor rapidez y precisión, optimizando la rotación del inventario cárnico en almacenes frigoríficos.

## Datos del equipo
- Héctor: software, integración Odoo, asignación automática, coordinación.
- Mauricio: levantamiento físico, reglas de ubicación, mapa 3D, medición.
- Pazos: infraestructura, cotización, pruebas, capacitación, informe.
- 6 cámaras en el almacén; piloto en 1.
- No existe prototipo previo (todo se construye en las 7 semanas).
- Supuesto de capacidad: 15 h/persona/semana.

## Pendientes por confirmar
- Detalle de las 6 cámaras (tamaño, racks/estibas, volumen de cajas).
- Proceso actual de entrada, acomodo y búsqueda.
- Uso actual de Odoo (¿registra cajas, lotes, ubicaciones?).
- Carreras del equipo y maestro tutor.

---

## Recorrido en planta (experiencia del equipo, visita a Carnes JC)

### 1. Recepción de canales
- Llegan normalmente **2 camiones al día** con un promedio de **~120 canales/día**.
- Personal: descargadores; capturistas que registran cada canal en **Odoo** y además lo anotan **a mano en una hoja** (primer registro). En la misma computadora se vio también una ventana de **Excel** (uso desconocido) → indicio de **doble o triple captura**.
- Cada canal se registra con su **lote** (tamaño variable, p. ej. ~72 canales; no hay número estándar).
- Antes de pasar a la sala de corte hay **otra computadora donde se valida** el canal.
- El canal trae una **etiqueta pegada** con un número y otros datos (trazabilidad).
- **No hay escáner en recepción**: la captura es manual. Un trabajador estimó que con escáner **podrían procesar ~40 canales más por día** (~+33%; estimación de un trabajador, por validar).
- Capacitación en recepción: de 1–2 semanas a ~1 mes.

### 2. Sala de corte
- Deshuesadores, pulperos y ayudantes de corte. ~3 líneas, 2 en uso actualmente (por confirmar).
- De cada canal salen varios cortes; cada operador sabe qué corte le corresponde.
- Capacitación de un operador de corte: ~3 meses (posiblemente la duración del contrato de prueba).

### 3. Empacado al vacío
- **Super Vac:** vacío automatizado, ciclo de ~20 s.
- **Smart Vac:** de uso manual, ciclo de ~1 min.
- Solo las bolsas de carne clasificada llevan etiqueta antes del embalaje.

### 4. Embalaje
- Las bolsas se colocan en cajas. Hay personal que embolsa, **2 etiquetadores** (uno por lado de la línea) y un montacargas.
- Cada **caja recibe etiqueta**; las cajas forman una **tarima/pallet**; al llenarse se **emplaya** y se coloca una **etiqueta master** con todo el contenido de la tarima.
- Computadora con **Odoo** (registro de producción) y otra donde el montacarguista **valida/registra la tarima** antes de llevarla a cámaras.
- El montacarguista **sí tiene pistola de escaneo**.
- Hay cámaras de **congelados y de frescos**.

### 5. Valor agregado
- Chorizo, cortes finos, etc. (no se observó a detalle).

### 6. Logística / cámaras (la parte central del reto)
- **6 cámaras:** C1, C2, C3A, C3B, C4 (congelados), C5 (frescos). En total **4 de congelados y 2 de frescos** (falta confirmar el tipo de C1, C2, C3A y C3B).
- **4 cortinas (andenes)** donde se enrampan los camiones; **una computadora por cortina**.
- Cámaras de **16 o 32 racks**, **5 niveles** (aparentemente todos). Entras a un pasillo y hay racks a la derecha y a la izquierda.
- Se almacena por **tarima con etiqueta master** (probable; por confirmar si también hay cajas sueltas).
- Software de logística llamado **"Zorro"** (por su ícono): registro, consulta de inventarios, asignación de ubicación, consulta de cajas. **Se ve antiguo y NO está conectado con Odoo.**
- El montacargas llega con la tarima y su master a estas computadoras y ahí la da de alta en Zorro.
- **Dependen de internet:** ya ha pasado que se cae y **no hay sistema**.
- En esa misma sala también hay cajas almacenadas.
- **Problema clave reportado por la empresa:** una ubicación queda registrada, alguien saca el producto sin actualizar el sistema, y quien llega después lo busca, el sistema dice que está ahí, **pero ya no está** ("ubicaciones fantasma"). Falta de control de movimientos.

## Equipo (confirmado)
- Mauro Acuña Olivarria — Ing. Mecatrónica.
- Francisco Efraín Pazos Quintero — Ing. Mecatrónica.
- Héctor Rafael Esquer Camacho — Ing. en Sistemas Computacionales.
- Asesor: Jesús Renato Montoya Morales.
- Carnes JC **sí usa Odoo**.

## Respuestas del equipo (6 oct 2026)
- El usuario que aporta las notas es **Mauro Acuña Olivarria** (Ing. Mecatrónica).
- Tercer integrante: **Héctor Rafael Esquer Camacho** — Ing. en Sistemas Computacionales.
- Etiqueta del canal en recepción: **probablemente NO trae código de barras** (solo número y datos impresos).
- Etiqueta **master de tarima: SÍ es código de barras**.
- Racks: **algunos están identificados, pero no todos**.
- **Odoo se usa desde el navegador** (Odoo siempre es web; falta confirmar si está en la nube o en servidor local).
- No se cuenta con los logos del formato oficial en archivo; se toman de la convocatoria.

## Decisiones y datos adicionales (5 oct 2026, noche)
- **Nombre del sistema: UbicaJC.** Lema: "Tradición trazable: cada tarima en su lugar". (Reemplaza a "UbicaFrío".)
- Nota legal: la marca JC es propiedad de Carnes JC; el nombre es una propuesta para uso interno de la empresa; la titularidad del desarrollo se acordará con Carnes JC y el TecNM.
- **Entrega: lunes 5 de octubre de 2026 antes de medianoche (prórroga del COECYT)** vía Google Forms (forms.gle/djWTihymZZM6cJSSA): subir "Cédula de Registro" y "Anteproyecto".
- **2 montacargas por turno** en logística.
- No se mencionaron tiempos de búsqueda, tarimas por día ni frecuencia de las ubicaciones fantasma ("solo dijeron que ha pasado") → todo eso es línea base a medir en S1.
- El asesor (Jesús Renato Montoya Morales) está de acuerdo en participar como maestro tutor.
- No se tomaron fotos en la visita.
- Carnes JC compartió un video con más información (youtube.com/watch?v=s3y63YV0OgQ); pendiente de revisar.

## Equipo final (confirmado 5 oct 2026)
| Integrante | Carrera | Rol en el proyecto |
|---|---|---|
| Héctor Rafael Esquer Camacho | Ing. en Sistemas Computacionales | Software, integración con Odoo, motor de asignación, coordinación |
| Mauro Acuña Olivarria | Ing. Mecatrónica | Levantamiento físico, codificación de ubicaciones, mapa de cámaras, medición |
| Francisco Efraín Pazos Quintero | Ing. Mecatrónica | Infraestructura y red local, hardware y etiquetas para -18 °C, pruebas, capacitación (confirmar que sigue en el equipo) |
| Jesús Renato Montoya Morales | Asesor / maestro tutor | Acompañamiento académico |

Institución: Instituto Tecnológico de Hermosillo (TecNM). Los datos de contacto (teléfonos y correos) van en la cédula y el formulario, no en el anteproyecto.
