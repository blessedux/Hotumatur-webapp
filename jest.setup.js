// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock FormData ya que no está disponible en el entorno de Node
global.FormData = class FormData {
    append() { }
} 