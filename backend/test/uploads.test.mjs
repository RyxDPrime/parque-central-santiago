import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  nombresReferenciados,
  rutasDeUploads,
  sobrantes,
  soloArchivos,
} from '../scripts/lib/uploads.mjs'

/** Un `Dirent` de mentira, que es lo único que el filtro mira. */
const entrada = (name, esArchivo = true) => ({ name, isFile: () => esArchivo })

describe('rutasDeUploads', () => {
  it('encuentra la ruta suelta de una columna de foto', () => {
    assert.deepEqual(rutasDeUploads('/uploads/1234-cancha.jpg'), ['/uploads/1234-cancha.jpg'])
  })

  it('encuentra varias dentro del mismo texto', () => {
    const cuerpo = 'Mira <img src="/uploads/a.jpg"> y también <img src="/uploads/b.png">'
    assert.deepEqual(rutasDeUploads(cuerpo), ['/uploads/a.jpg', '/uploads/b.png'])
  })

  it('las encuentra también en una dirección completa', () => {
    assert.deepEqual(
      rutasDeUploads('https://backend.up.railway.app/uploads/c.pdf'),
      ['/uploads/c.pdf'],
    )
  })

  it('un texto sin rutas no devuelve nada', () => {
    assert.deepEqual(rutasDeUploads('Parque Central de Santiago'), [])
    assert.deepEqual(rutasDeUploads(null), [])
  })
})

describe('nombresReferenciados', () => {
  it('se queda con el nombre del archivo y no repite', () => {
    const nombres = nombresReferenciados([
      '/uploads/a.jpg',
      'https://backend.up.railway.app/uploads/a.jpg',
      '<img src="/uploads/b.png">',
    ])
    assert.deepEqual([...nombres].sort(), ['a.jpg', 'b.png'])
  })
})

describe('soloArchivos', () => {
  // El fallo que llegó a producción: sin este filtro, lost+found salía como
  // sobrante y al intentar borrarlo el script moría a mitad de la limpieza.
  it('deja fuera los directorios del volumen', () => {
    const entradas = [entrada('a.jpg'), entrada('lost+found', false), entrada('b.png')]
    assert.deepEqual(soloArchivos(entradas), ['a.jpg', 'b.png'])
  })
})

describe('sobrantes', () => {
  it('sobra lo que no menciona ninguna fila', () => {
    const enUso = new Set(['a.jpg'])
    assert.deepEqual(sobrantes(['a.jpg', 'vieja.jpg'], enUso), ['vieja.jpg'])
  })

  it('con todo en uso no sobra nada', () => {
    assert.deepEqual(sobrantes(['a.jpg'], new Set(['a.jpg'])), [])
  })
})
