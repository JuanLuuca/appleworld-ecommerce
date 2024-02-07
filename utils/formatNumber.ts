export const formatNumber = (digit: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: 'currency',
        currency: 'BRL'
    }).format(digit);
}