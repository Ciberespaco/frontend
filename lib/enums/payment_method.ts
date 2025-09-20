export const PaymentMethods = [
  { id: '667c52e3-97d7-43d1-b9a3-aa0dde4e6c67', name: 'Dinheiro' },
  { id: '8da99f03-0473-47d0-bfc7-eb6d0e4d3677', name: 'Boleto' },
  { id: 'd7cce48b-c20c-4d39-828a-367c9ff2d474', name: 'Pix' },
]

export type PaymentMethod = typeof PaymentMethods[0]
