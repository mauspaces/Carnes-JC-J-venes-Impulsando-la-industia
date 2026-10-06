"""Aplica la pasada final al anteproyecto: resumen, ajustes de objetivos,
opciones de recepción, enlace y figura del prototipo.
Uso: python3 herramientas/pasada-final.py entrada.md salida.md"""
import re
import sys

entrada, salida = sys.argv[1], sys.argv[2]
s = open(entrada, encoding='utf-8').read()
pendientes = []

def reemplazar(viejo, nuevo, regex=False):
    global s
    if regex:
        s2, n = re.subn(viejo, nuevo, s, count=1, flags=re.M)
    else:
        n = s.count(viejo)
        s2 = s.replace(viejo, nuevo, 1)
    if n == 0:
        pendientes.append(viejo[:70])
    s = s2

URL = 'https://raw.githack.com/mauspaces/Carnes-JC-J-venes-Impulsando-la-industia/ccr-bc79c691-0nmbnx/prototipo/demo.html'

RESUMEN = (
    '\n> **Resumen.** La tarima de Carnes JC sale de embalaje con identidad digital (etiqueta master y registro en Odoo), '
    'pero la pierde al entrar a la cámara: se vuelve a capturar en Zorro, que no está conectado con Odoo y se queda sin sistema '
    'si cae internet, y los movimientos sin registrar generan ubicaciones fantasma. UbicaJC da a cada posición de rack una '
    'dirección escaneable, obliga a confirmar cada movimiento con doble escaneo, sugiere el acomodo por fecha de caducidad '
    '(FEFO desde la entrada) y funciona en la red local de la planta. Se validará en una cámara piloto en 7 semanas, con equipo '
    'estimado en $6,600–15,700 MXN si se usan las pistolas actuales. Metas: al menos 50% menos tiempo de localización y 97% o '
    'más de exactitud de ubicación.\n'
)
reemplazar(r'^(\*\*Lema:\*\*.*)$', lambda m: m.group(1) + '\n' + RESUMEN, regex=True)

reemplazar(r'^2\. Codificar en S2 el 100% de las ubicaciones de la cámara piloto',
           '2. Diseñar en S2 la codificación de ubicaciones y etiquetar en S3 el 100% de la cámara piloto', regex=True)
reemplazar(r'^4\. Programar la asignación', '4. Programar en S4 la asignación', regex=True)

reemplazar(
    r'^Hoy se capturan ~120 canales al día.*$',
    lambda m: (
        'Hoy se capturan ~120 canales al día en Odoo, en una hoja a mano y en Excel; el personal estima ~40 canales más por día '
        'con escáner (~33%), dato que se validará cronometrando 20 capturas en S1. Como la etiqueta del canal probablemente no '
        'trae código de barras, se evaluarán tres opciones: (1) que el proveedor imprima el número del canal en código de barras; '
        '(2) leer el número impreso con la cámara de una tablet (OCR), y (3) imprimir al recibir una etiqueta interna con código '
        'de barras. En las tres se usaría un lector USB 2D en modo teclado que escribe directo en Odoo sin programar '
        '($1,069–2,489 MXN por estación)[^hid], y se eliminarían la hoja y el Excel. En S7 se entrega el costo-beneficio de cada opción.'
    ),
    regex=True,
)

reemplazar('plan Personalizado (≈$340 contra ≈$228 MXN del Estándar, por usuario al mes) o servidor propio',
           'plan de Odoo con acceso a la API (costo por usuario a cotizar) o servidor propio')

reemplazar('el piloto cuesta menos de la cuarta parte de una terminal industrial para congelación',
           'con las pistolas actuales, el equipo del piloto cuesta menos de la cuarta parte de una sola terminal industrial para congelación')

reemplazar(
    r'^(Un prototipo navegable con datos simulados.*?)\[ENLACE AL PROTOTIPO\]\.?\s*$',
    lambda m: (
        m.group(1).rstrip(': ') + ':\n' + URL + '\n\n'
        '![Figura 1. Prototipo navegable de UbicaJC (datos simulados): ocupación y temperatura de las 6 cámaras y plano por '
        'rack y nivel con semáforo de caducidad.](../prototipo/capturas/mapa-escritorio.png)'
    ),
    regex=True,
)

open(salida, 'w', encoding='utf-8').write(s)
print('Pendientes sin aplicar:', pendientes if pendientes else 'ninguno')
