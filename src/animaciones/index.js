import './animaciones.css';
import { iniciarSaltos } from './saltos.js';
import { iniciarTrayecto } from './trayecto.js';
import { iniciarSecciones } from './secciones.js';

export function iniciarAnimaciones() {
  iniciarSaltos();
  iniciarTrayecto();
  iniciarSecciones();
}
